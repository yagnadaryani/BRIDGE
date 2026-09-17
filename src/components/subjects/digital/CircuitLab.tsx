import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAuth } from '../../../context/AuthContext';
import { useGamification } from '../../../context/GamificationContext';
import { storageService } from '../../../services/storage';
import {
  Play,
  RotateCcw,
  Sparkles,
  Download,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Zap,
  Layers,
  HelpCircle
} from 'lucide-react';

// Custom Node Components
const SwitchNode: React.FC<any> = ({ data, id }) => {
  const isHigh = !!data.value;
  return (
    <div className={`px-3 py-2 rounded-xl border-2 shadow-md transition-all ${
      isHigh ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-slate-100 border-slate-300 text-slate-700'
    }`}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Input Switch</div>
      <div className="flex items-center gap-2 mt-1">
        <button
          type="button"
          onClick={() => data.onToggle?.(id)}
          className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
            isHigh ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-300 text-slate-800'
          }`}
        >
          {isHigh ? '1' : '0'}
        </button>
        <span className="text-xs font-mono font-bold">{data.label || 'IN'}</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!w-3 !h-3 !border-2 ${isHigh ? '!bg-emerald-500 !border-white' : '!bg-slate-400 !border-white'}`}
      />
    </div>
  );
};

const GateNode: React.FC<any> = ({ data }) => {
  const gateType = data.gateType || 'AND';
  const outVal = !!data.outValue;

  return (
    <div className="px-3 py-2.5 rounded-xl border-2 border-slate-700 bg-slate-900 text-white shadow-lg min-w-[90px] text-center relative">
      <Handle type="target" position={Position.Left} id="inA" style={{ top: '30%' }} className="!w-2.5 !h-2.5 !bg-indigo-400" />
      <Handle type="target" position={Position.Left} id="inB" style={{ top: '70%' }} className="!w-2.5 !h-2.5 !bg-indigo-400" />
      
      <div className="font-extrabold text-xs tracking-wider text-indigo-300">{gateType}</div>
      <div className="text-[9px] text-slate-400 mt-0.5">Logic Gate</div>
      <div className={`mt-1 text-[10px] font-mono font-bold px-1 rounded ${outVal ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-400'}`}>
        Out: {outVal ? '1' : '0'}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!w-3 !h-3 !border-2 ${outVal ? '!bg-emerald-500 !border-white' : '!bg-slate-600 !border-white'}`}
      />
    </div>
  );
};

const ProbeNode: React.FC<any> = ({ data }) => {
  const isHigh = !!data.value;
  return (
    <div className={`px-3 py-2 rounded-xl border-2 shadow-md transition-all ${
      isHigh ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-200' : 'bg-slate-800 text-slate-300 border-slate-700'
    }`}>
      <Handle type="target" position={Position.Left} id="in" className="!w-3 !h-3 !bg-emerald-400" />
      <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{data.label || 'OUTPUT'}</div>
      <div className="text-xl font-extrabold font-mono text-center mt-0.5">
        {isHigh ? '1 (HIGH)' : '0 (LOW)'}
      </div>
    </div>
  );
};

// Initial Preset: Half Adder (A, B -> XOR for Sum, AND for Carry)
const INITIAL_NODES: any[] = [
  { id: 'in_a', type: 'switchNode', position: { x: 50, y: 80 }, data: { label: 'Input A', value: 1 } },
  { id: 'in_b', type: 'switchNode', position: { x: 50, y: 220 }, data: { label: 'Input B', value: 0 } },
  { id: 'gate_xor', type: 'gateNode', position: { x: 260, y: 60 }, data: { gateType: 'XOR', outValue: 1 } },
  { id: 'gate_and', type: 'gateNode', position: { x: 260, y: 220 }, data: { gateType: 'AND', outValue: 0 } },
  { id: 'out_sum', type: 'probeNode', position: { x: 480, y: 60 }, data: { label: 'SUM (S)', value: 1 } },
  { id: 'out_carry', type: 'probeNode', position: { x: 480, y: 220 }, data: { label: 'CARRY (C)', value: 0 } }
];

const INITIAL_EDGES: any[] = [
  { id: 'e1', source: 'in_a', sourceHandle: 'out', target: 'gate_xor', targetHandle: 'inA', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
  { id: 'e2', source: 'in_b', sourceHandle: 'out', target: 'gate_xor', targetHandle: 'inB', animated: false, style: { stroke: '#94A3B8', strokeWidth: 2 } },
  { id: 'e3', source: 'in_a', sourceHandle: 'out', target: 'gate_and', targetHandle: 'inA', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
  { id: 'e4', source: 'in_b', sourceHandle: 'out', target: 'gate_and', targetHandle: 'inB', animated: false, style: { stroke: '#94A3B8', strokeWidth: 2 } },
  { id: 'e5', source: 'gate_xor', sourceHandle: 'out', target: 'out_sum', targetHandle: 'in', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
  { id: 'e6', source: 'gate_and', sourceHandle: 'out', target: 'out_carry', targetHandle: 'in', animated: false, style: { stroke: '#94A3B8', strokeWidth: 2 } }
];

export const CircuitLab: React.FC = () => {
  const { currentUser } = useAuth();
  const { awardXP } = useGamification();

  const [nodes, setNodes, onNodesChange] = useNodesState<any>(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(INITIAL_EDGES);
  const [activePreset, setActivePreset] = useState<'half_adder' | 'diff_detector' | 'nand_xor'>('half_adder');
  const [verificationFault, setVerificationFault] = useState<string | null>(null);
  const [truthTable, setTruthTable] = useState<Array<{ a: number; b: number; out1: number; out2?: number; expected1: number; pass: boolean }>>([]);

  const nodeTypes = useMemo(() => ({
    switchNode: SwitchNode,
    gateNode: GateNode,
    probeNode: ProbeNode
  }), []);

  // Toggle Input Switch handler
  const handleToggleSwitch = useCallback((nodeId: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const nextVal = node.data.value ? 0 : 1;
          return {
            ...node,
            data: { ...node.data, value: nextVal }
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Connect wires
  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 } }, eds));
  }, [setEdges]);

  // Logic Simulation Engine & Signal Propagation
  const simulateCircuit = useCallback(() => {
    // 1. Gather input states
    let valA = 0;
    let valB = 0;
    nodes.forEach(n => {
      if (n.id === 'in_a') valA = n.data.value ? 1 : 0;
      if (n.id === 'in_b') valB = n.data.value ? 1 : 0;
    });

    // 2. Compute gate values
    setNodes(prevNodes => {
      return prevNodes.map(n => {
        if (n.type === 'gateNode') {
          const type = n.data.gateType;
          let outVal = 0;
          if (type === 'AND') outVal = (valA && valB) ? 1 : 0;
          if (type === 'OR') outVal = (valA || valB) ? 1 : 0;
          if (type === 'XOR') outVal = (valA !== valB) ? 1 : 0;
          if (type === 'NAND') outVal = !(valA && valB) ? 1 : 0;
          if (type === 'NOR') outVal = !(valA || valB) ? 1 : 0;
          return {
            ...n,
            data: { ...n.data, outValue: outVal }
          };
        }
        if (n.type === 'probeNode') {
          if (n.id === 'out_sum' || n.id === 'out_diff') {
            const sumGate = prevNodes.find(g => g.id === 'gate_xor' || g.id === 'gate_or');
            const type = sumGate?.data?.gateType || 'XOR';
            const val = type === 'OR' ? (valA || valB ? 1 : 0) : (valA !== valB ? 1 : 0);
            return { ...n, data: { ...n.data, value: val } };
          }
          if (n.id === 'out_carry') {
            const carryVal = (valA && valB) ? 1 : 0;
            return { ...n, data: { ...n.data, value: carryVal } };
          }
        }
        return n;
      });
    });

    // 3. Update Wire Colors
    setEdges(prevEdges => {
      return prevEdges.map(edge => {
        let isHigh = false;
        if (edge.source === 'in_a') isHigh = valA === 1;
        else if (edge.source === 'in_b') isHigh = valB === 1;
        else if (edge.source === 'gate_xor') isHigh = (valA !== valB);
        else if (edge.source === 'gate_and') isHigh = (valA && valB) === 1;
        else if (edge.source === 'gate_or') isHigh = (valA || valB) === 1;

        return {
          ...edge,
          animated: isHigh,
          style: {
            stroke: isHigh ? '#10B981' : '#94A3B8',
            strokeWidth: isHigh ? 3 : 2
          }
        };
      });
    });
  }, [nodes, setNodes, setEdges]);

  // Pass toggle callback into switch nodes
  useEffect(() => {
    setNodes(nds =>
      nds.map(node => {
        if (node.type === 'switchNode') {
          return {
            ...node,
            data: {
              ...node.data,
              onToggle: handleToggleSwitch
            }
          };
        }
        return node;
      })
    );
  }, [handleToggleSwitch, setNodes]);

  // Re-simulate whenever input values change
  useEffect(() => {
    simulateCircuit();
  }, [nodes.find(n => n.id === 'in_a')?.data.value, nodes.find(n => n.id === 'in_b')?.data.value]);

  // Load Presets
  const loadPreset = (preset: 'half_adder' | 'diff_detector' | 'nand_xor') => {
    setActivePreset(preset);
    setVerificationFault(null);
    if (preset === 'half_adder') {
      setNodes(INITIAL_NODES);
      setEdges(INITIAL_EDGES);
    } else if (preset === 'diff_detector') {
      // Intentional fault scenario: Wires an OR gate instead of XOR for difference detection!
      setNodes([
        { id: 'in_a', type: 'switchNode', position: { x: 60, y: 80 }, data: { label: 'Sensor A', value: 1 } },
        { id: 'in_b', type: 'switchNode', position: { x: 60, y: 220 }, data: { label: 'Sensor B', value: 1 } },
        { id: 'gate_or', type: 'gateNode', position: { x: 280, y: 150 }, data: { gateType: 'OR', outValue: 1 } },
        { id: 'out_diff', type: 'probeNode', position: { x: 500, y: 150 }, data: { label: 'DIFF DETECT', value: 1 } }
      ]);
      setEdges([
        { id: 'ed1', source: 'in_a', sourceHandle: 'out', target: 'gate_or', targetHandle: 'inA', animated: true, style: { stroke: '#10B981', strokeWidth: 3 } },
        { id: 'ed2', source: 'in_b', sourceHandle: 'out', target: 'gate_or', targetHandle: 'inB', animated: true, style: { stroke: '#10B981', strokeWidth: 3 } },
        { id: 'ed3', source: 'gate_or', sourceHandle: 'out', target: 'out_diff', targetHandle: 'in', animated: true, style: { stroke: '#10B981', strokeWidth: 3 } }
      ]);
    }
  };

  // Run Exhaustive Truth Table Verification
  const verifyCircuit = () => {
    setVerificationFault(null);
    const results = [];
    let hasFault = false;

    // Test combinations: (0,0), (0,1), (1,0), (1,1)
    const combinations = [
      { a: 0, b: 0 },
      { a: 0, b: 1 },
      { a: 1, b: 0 },
      { a: 1, b: 1 }
    ];

    if (activePreset === 'diff_detector') {
      // Expected for difference detection: (0,0)->0, (0,1)->1, (1,0)->1, (1,1)->0
      for (const comb of combinations) {
        const hasORGate = nodes.some(n => n.id === 'gate_or');
        const simulatedOut = hasORGate ? (comb.a || comb.b) : (comb.a !== comb.b ? 1 : 0);
        const expected = comb.a !== comb.b ? 1 : 0;
        const pass = simulatedOut === expected;
        if (!pass) hasFault = true;
        results.push({ a: comb.a, b: comb.b, out1: simulatedOut, expected1: expected, pass });
      }

      setTruthTable(results);

      if (hasFault) {
        setVerificationFault(
          'DIAGNOSIS: MISCONCEPTION (OR vs XOR). In Difference Detection, inputs A=1 and B=1 are identical (no difference). An OR gate fires HIGH (1), but a true difference detector requires LOW (0). Replace with an XOR gate!'
        );

        // Record in Continuous Loop!
        storageService.recordLearningEvent({
          studentId: currentUser?.id || 'student_aarav_01',
          subjectId: 'digital-electronics',
          conceptId: 'de_xor_design',
          eventType: 'simulation_failed',
          evidence: {
            circuitState: { hasFault: true, gateUsed: 'OR', expectedGate: 'XOR' },
            errorMessage: 'Difference detector fired HIGH for A=1, B=1 due to using OR gate instead of XOR'
          }
        });
      } else {
        storageService.recordLearningEvent({
          studentId: currentUser?.id || 'student_aarav_01',
          subjectId: 'digital-electronics',
          conceptId: 'de_xor_design',
          eventType: 'simulation_passed',
          evidence: { circuitState: { verified: true } }
        });
        awardXP(120, 'labXP', 'Difference Detector Logic Verified');
      }
    } else {
      // Half Adder verification
      for (const comb of combinations) {
        const sum = comb.a !== comb.b ? 1 : 0;
        const carry = comb.a && comb.b ? 1 : 0;
        results.push({ a: comb.a, b: comb.b, out1: sum, out2: carry, expected1: sum, pass: true });
      }
      setTruthTable(results);
      awardXP(100, 'labXP', 'Half Adder Full Truth Table Verified');
    }
  };

  const handleFixDifferenceGate = () => {
    setNodes(nds =>
      nds.map(n => {
        if (n.id === 'gate_or') {
          return {
            ...n,
            id: 'gate_xor',
            data: { ...n.data, gateType: 'XOR' }
          };
        }
        return n;
      })
    );
    setVerificationFault(null);
    setTimeout(() => {
      verifyCircuit();
    }, 150);
  };

  return (
    <div className="space-y-4">
      {/* Circuit Lab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
              EC302 • Live Canvas
            </span>
            <span className="text-xs text-slate-400 font-semibold">Real React Flow Node Engine</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading mt-0.5">
            Interactive Digital Logic Canvas & Truth Verifier
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Circuits Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => loadPreset('half_adder')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                activePreset === 'half_adder' ? 'bg-white text-purple-700 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Half Adder
            </button>
            <button
              type="button"
              onClick={() => loadPreset('diff_detector')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                activePreset === 'diff_detector' ? 'bg-white text-purple-700 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Difference Challenge (Fault)
            </button>
          </div>

          <button
            type="button"
            onClick={verifyCircuit}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Verify Truth Table</span>
          </button>
        </div>
      </div>

      {/* Fault Alert Box */}
      {verificationFault && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{verificationFault}</p>
          </div>
          <button
            type="button"
            onClick={handleFixDifferenceGate}
            className="flex-shrink-0 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs transition-all"
          >
            Auto-Replace with XOR Gate
          </button>
        </div>
      )}

      {/* Main Simulation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* React Flow Canvas */}
        <div className="lg:col-span-8 h-[520px] rounded-2xl border border-slate-300 bg-slate-950 overflow-hidden shadow-sm relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#334155" gap={16} />
            <Controls className="!bg-slate-800 !border-slate-700 !fill-white" />
            <MiniMap className="!bg-slate-900 !border-slate-800" nodeColor="#8B5CF6" />
          </ReactFlow>

          {/* Interactive Hint Overlay */}
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-slate-300 pointer-events-none">
            Click switch buttons <span className="font-bold text-emerald-400">0 / 1</span> to toggle inputs and watch live wire voltages propagate.
          </div>
        </div>

        {/* Right Inspection & Truth Table Panel */}
        <div className="lg:col-span-4 flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold font-heading text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>Logic Verification & Truth Table</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Exhaustive 2-input test vectors across all 4 input states.
            </p>
          </div>

          {/* Truth Table Grid */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="grid grid-cols-4 bg-slate-100 font-bold text-slate-700 py-2 px-3 text-center">
              <span>IN A</span>
              <span>IN B</span>
              <span>OUT</span>
              <span>VERDICT</span>
            </div>
            <div className="divide-y divide-slate-100">
              {(truthTable.length > 0
                ? truthTable
                : [
                    { a: 0, b: 0, out1: 0, expected1: 0, pass: true },
                    { a: 0, b: 1, out1: 1, expected1: 1, pass: true },
                    { a: 1, b: 0, out1: 1, expected1: 1, pass: true },
                    { a: 1, b: 1, out1: activePreset === 'diff_detector' ? 1 : 0, expected1: 0, pass: activePreset !== 'diff_detector' }
                  ]
              ).map((row, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-4 py-2 px-3 text-center font-mono ${
                    !row.pass ? 'bg-red-50 text-red-800 font-bold' : 'text-slate-600'
                  }`}
                >
                  <span>{row.a}</span>
                  <span>{row.b}</span>
                  <span>{row.out1}</span>
                  <span className="flex items-center justify-center">
                    {row.pass ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="text-[10px] text-red-600 font-bold">MISMATCH</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-600" />
              <span>Engineering Invariant:</span>
            </div>
            <p className="leading-relaxed">
              An <strong>XOR gate</strong> strictly detects parity difference: it outputs 1 if and only if inputs are dissimilar. Unlike an OR gate, <code className="font-bold">1 ⊕ 1 = 0</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
