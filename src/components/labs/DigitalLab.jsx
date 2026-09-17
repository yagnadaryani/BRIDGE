import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Cpu, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  Zap, 
  Lightbulb, 
  Activity,
  Layers,
  GripVertical,
  Plus,
  Trash2,
  Table,
  Check
} from 'lucide-react';

export const DigitalLab = () => {
  const { gamification, t } = useApp();

  // Dynamic Inputs State (Supports A, B, C, D)
  const [inputs, setInputs] = useState([
    { id: 'inA', label: 'Input A', state: 1 },
    { id: 'inB', label: 'Input B', state: 1 }
  ]);

  // Selected Gate Component
  const [activeGate, setActiveGate] = useState('AND');

  const [expStep, setExpStep] = useState(1);
  const [aiFeedback, setAiFeedback] = useState('Step 1 Active: Drag components or add inputs to test dynamic logic propagation.');
  const [draggedItem, setDraggedItem] = useState(null);

  // Available gate options
  const gateOptions = ['AND', 'OR', 'XOR', 'NAND', 'NOR', 'NOT', 'JK-FF'];

  // Calculate logic gate output for any given inputs array and gate type
  const calculateOutput = (inputVals, gateType) => {
    if (inputVals.length === 0) return 0;
    const a = inputVals[0] ?? 0;
    const b = inputVals[1] ?? 0;
    const c = inputVals[2] ?? 0;
    const d = inputVals[3] ?? 0;

    switch (gateType) {
      case 'AND':
        return inputVals.every(val => val === 1) ? 1 : 0;
      case 'OR':
        return inputVals.some(val => val === 1) ? 1 : 0;
      case 'XOR':
        return inputVals.reduce((acc, val) => acc ^ val, 0);
      case 'NAND':
        return inputVals.every(val => val === 1) ? 0 : 1;
      case 'NOR':
        return inputVals.some(val => val === 1) ? 0 : 1;
      case 'NOT':
        return a === 1 ? 0 : 1;
      case 'JK-FF':
        // JK Flip Flop logic (A = J, B = K)
        if (a === 1 && b === 0) return 1; // Set
        if (a === 0 && b === 1) return 0; // Reset
        if (a === 1 && b === 1) return 1; // Toggle state simulation
        return 0; // No change / Hold
      default:
        return 0;
    }
  };

  // Current Breadboard Output State
  const currentOutput = calculateOutput(inputs.map(i => i.state), activeGate);

  // Toggle individual input switch
  const toggleInput = (id) => {
    setInputs(prev => prev.map(inp => inp.id === id ? { ...inp, state: inp.state === 1 ? 0 : 1 } : inp));
  };

  // Add new input switch (Up to 4 inputs: A, B, C, D)
  const addInputSwitch = () => {
    if (inputs.length >= 4) {
      setAiFeedback('Maximum 4 inputs (A, B, C, D) supported for breadboard evaluation.');
      return;
    }
    const labels = ['Input A', 'Input B', 'Input C', 'Input D'];
    const ids = ['inA', 'inB', 'inC', 'inD'];
    const newIdx = inputs.length;
    const newInp = { id: ids[newIdx], label: labels[newIdx], state: 0 };
    setInputs(prev => [...prev, newInp]);
    setAiFeedback(`Added ${labels[newIdx]} to breadboard! Truth table expanded to ${Math.pow(2, newIdx + 1)} combinations.`);
  };

  // Remove last input switch (Minimum 2 inputs)
  const removeInputSwitch = () => {
    if (inputs.length <= 2) {
      setAiFeedback('Minimum 2 inputs required for gate evaluation.');
      return;
    }
    const removedLabel = inputs[inputs.length - 1].label;
    setInputs(prev => prev.slice(0, prev.length - 1));
    setAiFeedback(`Removed ${removedLabel}. Truth table recalculated.`);
  };

  // Drag & Drop Handlers
  const handleDragStart = (e, itemType, itemCategory = 'GATE') => {
    setDraggedItem({ type: itemType, category: itemCategory });
    e.dataTransfer.setData('gateType', itemType);
    e.dataTransfer.setData('category', itemCategory);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedType = e.dataTransfer.getData('gateType') || draggedItem?.type;
    const category = e.dataTransfer.getData('category') || draggedItem?.category;

    if (category === 'INPUT_ADD') {
      addInputSwitch();
    } else if (droppedType && gateOptions.includes(droppedType)) {
      setActiveGate(droppedType);
      setAiFeedback(`Placed ${droppedType} Gate onto breadboard! Circuit signal wires updated.`);
    }
  };

  // Generate Truth Table Rows (2^n combinations)
  const generateTruthTable = () => {
    const n = inputs.length;
    const rowsCount = Math.pow(2, n);
    const tableRows = [];

    for (let i = 0; i < rowsCount; i++) {
      const combination = [];
      for (let j = n - 1; j >= 0; j--) {
        combination.push((i >> j) & 1);
      }
      const outputVal = calculateOutput(combination, activeGate);

      // Check if this row matches current switch states
      const isCurrentState = combination.every((val, idx) => val === inputs[idx]?.state);

      tableRows.push({
        id: i,
        combination,
        outputVal,
        isCurrentState
      });
    }
    return tableRows;
  };

  const truthTable = generateTruthTable();

  // Apply truth table row states to physical switches
  const applyTruthTableRow = (rowCombo) => {
    setInputs(prev => prev.map((inp, idx) => ({ ...inp, state: rowCombo[idx] ?? 0 })));
    setAiFeedback(`Simulating Truth Table row [${rowCombo.join(', ')}] on physical breadboard.`);
  };

  const nextStep = () => {
    if (expStep === 1) {
      setExpStep(2);
      setAiFeedback('Step 2: Add or drag dynamic Input Switches (A, B, C, D) onto breadboard.');
    } else if (expStep === 2) {
      setExpStep(3);
      setAiFeedback('Step 3: Compare breadboard LED state with the live Truth Table on the side.');
    } else if (expStep === 3) {
      setExpStep(4);
      setAiFeedback('Step 4 Complete! Experiment with 3-Input and 4-Input gates.');
    } else {
      setExpStep(1);
      setAiFeedback('Experiment restarted.');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-cyan-500/30 bg-slate-950/90 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold tracking-tight font-['Outfit'] text-gradient">
              {t.digitalHeader} — Dynamic Inputs & Live Truth Table
            </h1>
          </div>
          <p className="text-sm mt-1 text-slate-300">
            Drag & drop logic gates or input switches onto the breadboard. View real-time Truth Table evaluation on the side panel.
          </p>
        </div>

        {/* Experiment Step Badges */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                expStep === stepNum
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400'
                  : stepNum < expStep
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border border-white/10'
              }`}
            >
              Step {stepNum}
            </div>
          ))}
        </div>
      </div>

      {/* Main Workspace Layout (8-col Breadboard + 4-col Live Truth Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Breadboard & Palette (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl border border-white/10 bg-slate-950/90 space-y-4 shadow-2xl flex flex-col justify-between min-h-[560px]">
          {/* Component Drag Palette */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 overflow-x-auto gap-3">
            <span className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5 shrink-0 font-mono">
              <Layers className="w-4 h-4 text-cyan-400" />
              Drag Component to Breadboard:
            </span>

            <div className="flex items-center gap-2">
              {/* Gate Drag Options */}
              {gateOptions.map((gate) => (
                <div
                  key={gate}
                  draggable
                  onDragStart={(e) => handleDragStart(e, gate, 'GATE')}
                  onClick={() => setActiveGate(gate)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-grab transition-all flex items-center gap-1 shadow-sm ${
                    activeGate === gate
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/30'
                      : 'bg-slate-900 border border-white/10 text-slate-300 hover:border-cyan-500/50 hover:text-white'
                  }`}
                  title={`Drag ${gate} gate or click to set`}
                >
                  <GripVertical className="w-3 h-3 text-slate-400" />
                  <span>{gate}</span>
                </div>
              ))}

              {/* Add Input Switch Drag item */}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'ADD_INPUT', 'INPUT_ADD')}
                onClick={addInputSwitch}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-grab bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 flex items-center gap-1 shadow-sm"
                title="Drag or click to add Input Switch"
              >
                <Plus className="w-3.5 h-3.5 text-purple-400" />
                <span>+ Input Switch</span>
              </div>
            </div>
          </div>

          {/* Breadboard Surface */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="my-auto py-8 px-4 rounded-2xl bg-[#070B14] border-2 border-dashed border-cyan-500/50 relative min-h-[360px] flex items-center justify-around shadow-inner overflow-hidden"
          >
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Drop Notice */}
            <div className="absolute top-3 left-4 text-[10px] uppercase font-bold font-mono text-cyan-400 tracking-wider flex items-center gap-1">
              ✦ Drop Zone: Drag & Drop Logic ICs or Input Switches Here
            </div>

            {/* Input Controls Bar (+/- buttons) */}
            <div className="absolute top-3 right-4 flex items-center gap-2">
              <button
                onClick={addInputSwitch}
                disabled={inputs.length >= 4}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 disabled:opacity-40 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Input ({inputs.length}/4)</span>
              </button>
              {inputs.length > 2 && (
                <button
                  onClick={removeInputSwitch}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Physical Breadboard Input Switches */}
            <div className="space-y-6 z-10 my-4">
              {inputs.map((sw) => (
                <div key={sw.id} className="flex flex-col items-center gap-1.5">
                  <span className="text-xs font-bold font-mono text-cyan-300">{sw.label}</span>
                  <button
                    onClick={() => toggleInput(sw.id)}
                    className={`w-12 h-12 rounded-xl font-mono font-extrabold text-base flex items-center justify-center transition-all duration-300 shadow-lg ${
                      sw.state === 1
                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/50 ring-4 ring-emerald-500/30 scale-105'
                        : 'bg-slate-900 text-slate-500 border border-white/10 hover:border-slate-500'
                    }`}
                  >
                    {sw.state}
                  </button>
                </div>
              ))}
            </div>

            {/* Signal Wire SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {inputs.map((inp, idx) => {
                const total = inputs.length;
                const yPos = 80 + idx * (200 / Math.max(1, total - 1));
                const isHigh = inp.state === 1;
                return (
                  <line
                    key={inp.id}
                    x1={110}
                    y1={yPos}
                    x2={280}
                    y2={160}
                    stroke={isHigh ? '#10B981' : '#334155'}
                    strokeWidth={isHigh ? '3.5' : '2'}
                    strokeDasharray={isHigh ? 'none' : '4 4'}
                    className={isHigh ? 'animate-pulse' : ''}
                  />
                );
              })}
              {/* Output Wire */}
              <line
                x1={390}
                y1={160}
                x2={490}
                y2={160}
                stroke={currentOutput === 1 ? '#10B981' : '#334155'}
                strokeWidth={currentOutput === 1 ? '4' : '2'}
                className={currentOutput === 1 ? 'animate-pulse' : ''}
              />
            </svg>

            {/* Logic Gate IC Chip */}
            <div className="z-10 flex flex-col items-center gap-2">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-indigo-950 via-slate-900 to-purple-950 border-2 border-cyan-500/60 shadow-2xl shadow-cyan-500/20 flex flex-col items-center justify-center p-3 text-center">
                <Cpu className="w-8 h-8 text-cyan-400 mb-1 animate-pulse" />
                <span className="font-mono font-extrabold text-base text-cyan-300">
                  {activeGate}
                </span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 font-mono">
                  {inputs.length}-Input IC 74xx
                </span>
              </div>
            </div>

            {/* Output LED */}
            <div className="z-10 flex flex-col items-center gap-2">
              <span className="text-xs font-bold font-mono text-slate-300">Output LED</span>
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                  currentOutput === 1
                    ? 'bg-emerald-500 text-slate-950 shadow-2xl shadow-emerald-500/90 ring-8 ring-emerald-500/30 scale-110'
                    : 'bg-slate-900 border border-slate-700 text-slate-600'
                }`}
              >
                <Lightbulb className={`w-7 h-7 ${currentOutput === 1 ? 'text-white fill-white animate-pulse' : 'text-slate-600'}`} />
              </div>
              <span className={`text-xs font-mono font-extrabold px-2.5 py-0.5 rounded ${
                currentOutput === 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-900 text-slate-500'
              }`}>
                Y = {currentOutput}
              </span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-xs flex items-center gap-1.5 text-emerald-400 font-mono font-semibold">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              Dynamic Signal Routing Active ({inputs.length} Inputs ➔ {activeGate} Gate ➔ Output Y={currentOutput})
            </span>
            <button
              onClick={() => setInputs(prev => prev.map(c => ({ ...c, state: 0 })))}
              className="btn-secondary text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Switches to 0</span>
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Live Truth Table Panel (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl border border-cyan-500/40 bg-slate-950/90 space-y-4 shadow-2xl flex flex-col justify-between min-h-[560px]">
          <div className="space-y-4">
            {/* Truth Table Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Table className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className="font-extrabold text-base text-slate-100 font-['Outfit']">
                    Live Circuit Truth Table
                  </h2>
                  <span className="text-[10px] text-cyan-400 font-mono block">
                    Evaluating {activeGate} with {inputs.length} Inputs ({truthTable.length} Rows)
                  </span>
                </div>
              </div>
            </div>

            {/* AI Assistant Insight */}
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-semibold leading-relaxed space-y-1">
              💡 <strong>AI Assistant:</strong> {aiFeedback}
            </div>

            {/* Dynamic Truth Table Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase font-mono px-2">
                <span>Click Row to Simulate Combination</span>
                <span className="text-cyan-400">Y Output</span>
              </div>

              <div className="max-h-[320px] overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
                {truthTable.map((row) => (
                  <div
                    key={row.id}
                    onClick={() => applyTruthTableRow(row.combination)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      row.isCurrentState
                        ? 'bg-cyan-500/25 border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                        : 'bg-slate-900 border-white/10 hover:border-cyan-500/40 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {row.isCurrentState ? (
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-bounce" />
                      ) : (
                        <span className="w-3.5 text-[10px] text-slate-500 font-mono">#{row.id + 1}</span>
                      )}

                      <div className="flex items-center gap-1.5">
                        {row.combination.map((val, idx) => (
                          <span
                            key={idx}
                            className={`px-1.5 py-0.5 rounded text-[11px] font-extrabold ${
                              val === 1 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {inputs[idx]?.label.replace('Input ', '')}: {val}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded font-extrabold text-xs ${
                      row.outputVal === 1 ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {row.outputVal}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={nextStep}
            className="w-full btn-primary justify-center text-xs py-2.5 mt-2 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{expStep < 4 ? `Proceed to Step ${expStep + 1}` : 'Restart Experiment Wizard'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
