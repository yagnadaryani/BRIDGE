import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useGamification } from '../../../context/GamificationContext';
import { storageService } from '../../../services/storage';
import { Play, RotateCcw, ArrowRight, Binary, Cpu } from 'lucide-react';

interface ProcessorState {
  A: number; // Accumulator
  B: number;
  C: number;
  D: number;
  E: number;
  H: number;
  L: number;
  PC: number;
  SP: number;
  flags: {
    S: boolean;
    Z: boolean;
    AC: boolean;
    P: boolean;
    CY: boolean;
  };
}

const INITIAL_STATE: ProcessorState = {
  A: 0x00,
  B: 0x00,
  C: 0x00,
  D: 0x00,
  E: 0x00,
  H: 0x00,
  L: 0x00,
  PC: 0x2000,
  SP: 0xFFFF,
  flags: { S: false, Z: true, AC: false, P: true, CY: false }
};

const SAMPLE_PROGRAM = [
  { addr: 0x2000, opcode: 'MVI A, 05H', desc: 'Load immediate value 5 into Accumulator' },
  { addr: 0x2002, opcode: 'MOV B, A', desc: 'Copy value of A into Register B' },
  { addr: 0x2003, opcode: 'INR A', desc: 'Increment Accumulator by 1 (A = 6)' },
  { addr: 0x2004, opcode: 'ADD B', desc: 'Add B (5) to A (6) -> Result 11 (0BH)' },
  { addr: 0x2005, opcode: 'HLT', desc: 'Halt microprocessor execution' }
];

export const ProcessorStudio: React.FC = () => {
  const { currentUser } = useAuth();
  const { awardXP } = useGamification();

  const [state, setState] = useState<ProcessorState>(INITIAL_STATE);
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [log, setLog] = useState<string[]>(['8085 CPU Initialized. PC at 2000H.']);

  const stepInstruction = () => {
    if (currentLine >= SAMPLE_PROGRAM.length - 1) return;

    const instr = SAMPLE_PROGRAM[currentLine];
    const nextState = { ...state, flags: { ...state.flags } };
    let logMsg = '';

    if (currentLine === 0) {
      nextState.A = 0x05;
      nextState.PC = 0x2002;
      logMsg = 'Executed MVI A, 05H: Accumulator set to 05H (Flags unchanged)';
    } else if (currentLine === 1) {
      nextState.B = nextState.A;
      nextState.PC = 0x2003;
      logMsg = 'Executed MOV B, A: Reg B set to 05H (Data transfer flags unchanged)';
    } else if (currentLine === 2) {
      nextState.A += 1;
      nextState.flags.Z = nextState.A === 0;
      nextState.PC = 0x2004;
      logMsg = 'Executed INR A: Accumulator incremented to 06H. Zero flag = 0';
    } else if (currentLine === 3) {
      const sum = nextState.A + nextState.B;
      nextState.A = sum & 0xFF;
      nextState.flags.CY = sum > 0xFF;
      nextState.flags.Z = nextState.A === 0;
      nextState.PC = 0x2005;
      logMsg = 'Executed ADD B: 06H + 05H = 0BH (11 decimal) in Accumulator';
      awardXP(70, 'labXP', 'Executed 8085 ALU Instruction Sequence');
    }

    setState(nextState);
    setCurrentLine(prev => prev + 1);
    setLog(prev => [logMsg, ...prev]);
  };

  const resetCPU = () => {
    setState(INITIAL_STATE);
    setCurrentLine(0);
    setLog(['CPU Reset. PC at 2000H.']);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              EC404 • Microprocessor 8085
            </span>
            <span className="text-xs text-slate-400 font-semibold">Cycle Simulator & Flag Watcher</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading mt-0.5">
            Instruction Cycle & Register Simulation
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetCPU}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset CPU</span>
          </button>
          <button
            type="button"
            onClick={stepInstruction}
            disabled={currentLine >= SAMPLE_PROGRAM.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Step Cycle</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Assembly Instruction Listing */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">8085 Assembly Program</h3>
          <div className="space-y-1.5 font-mono text-xs">
            {SAMPLE_PROGRAM.map((inst, idx) => {
              const isCurrent = idx === currentLine;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">{inst.addr.toString(16).toUpperCase()}H</span>
                    <span className="text-indigo-600">{inst.opcode}</span>
                    {isCurrent && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">NEXT</span>}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-sans">{inst.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Registers & Status Flags */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">8085 Register Array</h3>
            <div className="grid grid-cols-4 gap-2 font-mono text-xs text-center">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300">
                <span className="text-slate-400 text-[10px]">ACCUMULATOR (A)</span>
                <div className="text-xl font-bold text-amber-700 mt-0.5">0x{state.A.toString(16).padStart(2, '0').toUpperCase()}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px]">REG B</span>
                <div className="text-xl font-bold text-slate-800 mt-0.5">0x{state.B.toString(16).padStart(2, '0').toUpperCase()}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px]">REG C</span>
                <div className="text-xl font-bold text-slate-800 mt-0.5">0x{state.C.toString(16).padStart(2, '0').toUpperCase()}</div>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <span className="text-slate-400 text-[10px]">PC (16-bit)</span>
                <div className="text-base font-bold text-indigo-700 mt-1.5">{state.PC.toString(16).toUpperCase()}H</div>
              </div>
            </div>
          </div>

          {/* Status Flags */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">PSW Flag Register</h3>
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
              {Object.entries(state.flags).map(([flag, val]) => (
                <div key={flag} className={`p-2 rounded-lg border ${val ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  <div>{flag}</div>
                  <div className="text-sm mt-0.5">{val ? '1' : '0'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Log */}
          <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] h-28 overflow-y-auto">
            {log.map((entry, idx) => (
              <div key={idx} className="leading-relaxed text-slate-300">&gt; {entry}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
