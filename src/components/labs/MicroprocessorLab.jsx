import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Binary, 
  Play, 
  RotateCcw, 
  SkipForward, 
  Cpu, 
  HardDrive, 
  Lightbulb,
  CheckCircle2,
  Code2
} from 'lucide-react';

export const MicroprocessorLab = () => {
  const { gamification, t } = useApp();

  const [activeProgram, setActiveProgram] = useState('led-output');
  const [stepIndex, setStepIndex] = useState(0);

  // CPU Registers
  const [registers, setRegisters] = useState({
    A: '00H',
    B: '00H',
    C: '00H',
    D: '00H',
    E: '00H',
    H: '20H',
    L: '00H',
    PC: '2000H',
    SP: 'FFFFH'
  });

  // Status Flags
  const [flags, setFlags] = useState({ Z: 0, CY: 0, S: 0, P: 0, AC: 0 });

  // 8-Bit Output Port LEDs (Port 01H)
  const [portLeds, setPortLeds] = useState([0, 0, 0, 0, 0, 0, 0, 0]);

  // RAM Memory Inspector
  const [ram, setRam] = useState({
    '2000H': '3E', '2001H': 'AA', '2002H': 'D3', '2003H': '01',
    '2004H': '76', '2005H': '00', '2006H': '00', '2007H': '00'
  });

  const programs = {
    'led-output': {
      title: 'LED Pattern Output to Port 01H',
      code: `MVI A, AAH   ; Load bit pattern 10101010 into Accumulator A
OUT 01H      ; Output accumulator contents to LED Port 01H
HLT          ; Halt execution`,
      steps: [
        { pc: '2000H', inst: 'MVI A, AAH', desc: 'Loaded hex value AAH (binary 10101010) into Accumulator A', reg: { A: 'AAH', PC: '2002H' }, flags: { Z: 0, CY: 0 }, leds: [0,0,0,0,0,0,0,0] },
        { pc: '2002H', inst: 'OUT 01H', desc: 'Sent AAH to Port 01H. LEDs 7,5,3,1 light up!', reg: { A: 'AAH', PC: '2004H' }, flags: { Z: 0, CY: 0 }, leds: [1,0,1,0,1,0,1,0] },
        { pc: '2004H', inst: 'HLT', desc: 'Program Halted cleanly.', reg: { A: 'AAH', PC: '2005H' }, flags: { Z: 0, CY: 0 }, leds: [1,0,1,0,1,0,1,0] }
      ]
    },
    'add-two': {
      title: 'Add Two 8-bit Numbers (5 + 3 = 8)',
      code: `MVI A, 05H   ; Load 05H into Accumulator A
MVI B, 03H   ; Load 03H into Register B
ADD B        ; Add B to A (A = A + B)
OUT 01H      ; Output result to Port 01H
HLT          ; Halt execution`,
      steps: [
        { pc: '2000H', inst: 'MVI A, 05H', desc: 'Loaded 05H into Accumulator A', reg: { A: '05H', B: '00H', PC: '2002H' }, flags: { Z: 0, CY: 0 }, leds: [0,0,0,0,0,0,0,0] },
        { pc: '2002H', inst: 'MVI B, 03H', desc: 'Loaded 03H into Register B', reg: { A: '05H', B: '03H', PC: '2004H' }, flags: { Z: 0, CY: 0 }, leds: [0,0,0,0,0,0,0,0] },
        { pc: '2004H', inst: 'ADD B', desc: 'Calculated 05H + 03H = 08H (Binary 00001000)', reg: { A: '08H', B: '03H', PC: '2005H' }, flags: { Z: 0, CY: 0 }, leds: [0,0,0,0,0,0,0,0] },
        { pc: '2005H', inst: 'OUT 01H', desc: 'Output 08H to Port 01H. LED 3 lights up!', reg: { A: '08H', B: '03H', PC: '2007H' }, flags: { Z: 0, CY: 0 }, leds: [0,0,0,0,1,0,0,0] },
        { pc: '2007H', inst: 'HLT', desc: 'Execution Halted.', reg: { A: '08H', B: '03H', PC: '2008H' }, flags: { Z: 0, CY: 0 }, leds: [0,0,0,0,1,0,0,0] }
      ]
    }
  };

  const activeProg = programs[activeProgram] || programs['led-output'];

  const handleStep = () => {
    if (stepIndex >= activeProg.steps.length - 1) return;
    const nextIdx = stepIndex + 1;
    setStepIndex(nextIdx);
    const st = activeProg.steps[nextIdx];
    setRegisters(prev => ({ ...prev, ...st.reg }));
    setFlags(prev => ({ ...prev, ...st.flags }));
    setPortLeds(st.leds);
  };

  const handleReset = () => {
    setStepIndex(0);
    setRegisters({ A: '00H', B: '00H', C: '00H', D: '00H', E: '00H', H: '20H', L: '00H', PC: '2000H', SP: 'FFFFH' });
    setFlags({ Z: 0, CY: 0, S: 0, P: 0, AC: 0 });
    setPortLeds([0, 0, 0, 0, 0, 0, 0, 0]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-6">
        <div>
          <div className="flex items-center gap-2">
            <Binary className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-gradient font-['Outfit']">
              {t.microHeader}
            </h1>
          </div>
          <p className={`text-sm mt-1 font-semibold ${gamification ? 'text-white' : 'text-black'}`}>
            {t.microSub}
          </p>
        </div>

        {/* Program Preset Selector */}
        <div className="flex items-center gap-3">
          <select
            value={activeProgram}
            onChange={(e) => {
              setActiveProgram(e.target.value);
              handleReset();
            }}
            className={`rounded-xl px-4 py-2 text-xs font-mono font-bold focus:outline-none ${
              gamification
                ? 'bg-slate-900 border border-white/10 text-white focus:border-cyan-500'
                : 'bg-white border border-black text-black focus:border-cyan-700'
            }`}
          >
            <option value="led-output">📜 Program 1: LED Output Port (AAH)</option>
            <option value="add-two">📜 Program 2: Add 2 Numbers (05H + 03H)</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Assembly Code Left (6 cols), Registers & LEDs Right (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assembly Editor & Execution Control */}
        <div className="lg:col-span-6 glass-panel p-5 flex flex-col justify-between min-h-[500px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="font-bold text-slate-200 text-base flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                8085 Assembly Code Editor
              </h2>
              <span className="text-xs font-mono text-cyan-400">
                PC: {registers.PC}
              </span>
            </div>

            {/* Code Workspace with Step Highlight */}
            <div className="font-mono text-xs p-4 rounded-xl bg-slate-950 border border-white/10 space-y-1.5 shadow-inner">
              {activeProg.code.split('\n').map((line, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg flex items-center justify-between ${
                    stepIndex === idx
                      ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/50 text-cyan-300 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  <span>{line}</span>
                  {stepIndex === idx && (
                    <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      Executing
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Instruction Explanation Note */}
            <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
              🔍 <strong>Step Explanation:</strong> {activeProg.steps[stepIndex]?.desc}
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={handleReset}
              className="btn-secondary text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset CPU</span>
            </button>

            <button
              onClick={handleStep}
              disabled={stepIndex >= activeProg.steps.length - 1}
              className="btn-primary text-xs"
            >
              <SkipForward className="w-4 h-4" />
              <span>Step Instruction</span>
            </button>
          </div>
        </div>

        {/* Registers, Flags, & Digital LED Port Output Panel */}
        <div className="lg:col-span-6 space-y-6">
          {/* Registers Display */}
          <div className="glass-panel p-5 space-y-3">
            <h2 className="font-bold text-slate-200 text-sm pb-2 border-b border-white/10 flex items-center justify-between">
              <span>{t.registers}</span>
              <span className="text-xs text-slate-400 font-mono">Hex Format</span>
            </h2>

            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              {Object.entries(registers).map(([reg, val]) => (
                <div key={reg} className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                  <div className="text-[10px] font-bold text-slate-400">{reg}</div>
                  <div className="text-sm font-extrabold text-cyan-300 mt-0.5">{val}</div>
                </div>
              ))}
            </div>

            {/* Status Flags */}
            <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-white/10">
              <span className="text-slate-400 font-bold">Flags:</span>
              <div className="flex gap-2">
                {Object.entries(flags).map(([flag, val]) => (
                  <span
                    key={flag}
                    className={`px-2 py-0.5 rounded font-bold ${
                      val === 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {flag}:{val}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Digital 8-Bit LED Output Port (Port 01H) */}
          <div className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h2 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Digital I/O LED Matrix (Port 01H)
              </h2>
              <span className="text-xs font-mono text-cyan-400">
                Binary: {portLeds.join('')}
              </span>
            </div>

            {/* 8 LED Matrix Bulbs */}
            <div className="grid grid-cols-8 gap-2 py-3 bg-slate-950 p-4 rounded-xl border border-white/10">
              {portLeds.map((state, bitIdx) => (
                <div key={bitIdx} className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] font-mono text-slate-500">D{7 - bitIdx}</span>
                  <div
                    className={`w-7 h-7 rounded-full transition-all duration-300 ${
                      state === 1
                        ? 'bg-amber-400 shadow-lg shadow-amber-400/80 ring-4 ring-amber-400/30'
                        : 'bg-slate-900 border border-slate-700'
                    }`}
                  />
                  <span className={`text-[9px] font-mono font-bold ${state === 1 ? 'text-amber-400' : 'text-slate-600'}`}>
                    {state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
