'use client';

import React, { useState } from 'react';
import { Cpu, Play, StepForward, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SAMPLE_PROGRAM = `; 8086 Assembly Program Example
MOV AX, 0005H
MOV BX, 0003H
ADD AX, BX
SUB AX, 0002H
MOV CX, AX
`;

export function ProcessorStudio() {
  const [code, setCode] = useState(SAMPLE_PROGRAM);
  const [registers, setRegisters] = useState({
    AX: '0000',
    BX: '0000',
    CX: '0000',
    DX: '0000',
    IP: '0100',
    SP: 'FFFE',
  });
  const [flags, setFlags] = useState({ ZF: 0, CF: 0, SF: 0 });
  const [currentLine, setCurrentLine] = useState(0);
  const [executionLog, setExecutionLog] = useState<string[]>(['Processor Reset (CS=2000H, IP=0100H)']);

  const lines = code.split('\n').filter((l) => l.trim() && !l.trim().startsWith(';'));

  const handleStep = () => {
    if (currentLine >= lines.length) {
      setExecutionLog((prev) => [...prev, 'End of execution sequence reached.']);
      return;
    }

    const instr = lines[currentLine].trim().toUpperCase();
    const newRegs = { ...registers };
    const newFlags = { ...flags };
    let logMsg = `[IP:${newRegs.IP}] Executed: ${instr}`;

    if (instr.startsWith('MOV AX,')) {
      const val = instr.split(',')[1].trim().replace('H', '');
      newRegs.AX = val.padStart(4, '0');
    } else if (instr.startsWith('MOV BX,')) {
      const val = instr.split(',')[1].trim().replace('H', '');
      newRegs.BX = val.padStart(4, '0');
    } else if (instr.startsWith('ADD AX, BX')) {
      const numA = parseInt(newRegs.AX, 16);
      const numB = parseInt(newRegs.BX, 16);
      const sum = (numA + numB) & 0xffff;
      newRegs.AX = sum.toString(16).toUpperCase().padStart(4, '0');
      newFlags.ZF = sum === 0 ? 1 : 0;
    } else if (instr.startsWith('SUB AX,')) {
      const valHex = instr.split(',')[1].trim().replace('H', '');
      const numA = parseInt(newRegs.AX, 16);
      const numB = parseInt(valHex, 16);
      const diff = (numA - numB) & 0xffff;
      newRegs.AX = diff.toString(16).toUpperCase().padStart(4, '0');
      newFlags.ZF = diff === 0 ? 1 : 0;
    } else if (instr.startsWith('MOV CX, AX')) {
      newRegs.CX = newRegs.AX;
    }

    const nextIP = (parseInt(newRegs.IP, 16) + 2).toString(16).toUpperCase().padStart(4, '0');
    newRegs.IP = nextIP;

    setRegisters(newRegs);
    setFlags(newFlags);
    setCurrentLine((prev) => prev + 1);
    setExecutionLog((prev) => [logMsg, ...prev]);
  };

  const handleReset = () => {
    setRegisters({ AX: '0000', BX: '0000', CX: '0000', DX: '0000', IP: '0100', SP: 'FFFE' });
    setFlags({ ZF: 0, CF: 0, SF: 0 });
    setCurrentLine(0);
    setExecutionLog(['Processor Reset (CS=2000H, IP=0100H)']);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface border border-subtleBorder p-4 rounded-card shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-textMain">Processor Studio: 8086 Microprocessor</h2>
            <Badge variant="purple">16-Bit Architecture</Badge>
          </div>
          <p className="text-xs text-textSecondary mt-1">
            Step-by-step assembly instruction execution, register state changes, and flag inspection.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={handleReset} className="text-xs">
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
          <Button size="sm" onClick={handleStep} className="text-xs space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
            <StepForward className="w-3.5 h-3.5" />
            <span>Step Instruction</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Assembly Code Editor (6 cols) */}
        <div className="lg:col-span-6 bg-surface border border-subtleBorder rounded-card p-4 space-y-3 shadow-card">
          <div className="flex items-center justify-between text-xs text-textSecondary font-semibold">
            <span className="font-bold text-textMain">8086 Assembly Instructions</span>
            <span>Physical Address: 20100H</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 font-mono text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 shadow-inner"
          />

          <div className="text-[11px] text-textSecondary">
            Current Line to Execute: <span className="font-mono text-emerald-600 font-bold">{lines[currentLine] || 'Execution Finished'}</span>
          </div>
        </div>

        {/* Registers & Flags View (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card>
            <CardHeader className="p-3 mb-2">
              <CardTitle className="text-xs font-bold text-textMain">Register State (Hexadecimal)</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 grid grid-cols-3 gap-2">
              {Object.entries(registers).map(([reg, val]) => (
                <div key={reg} className="p-2.5 bg-secondaryBg rounded-xl border border-subtleBorder flex flex-col items-center">
                  <span className="text-[10px] font-bold text-textMuted">{reg}</span>
                  <span className="font-mono text-sm font-bold text-emerald-700">{val}H</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 mb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-textMain">Status Flags</CardTitle>
              <Badge variant="info">Flag Register</Badge>
            </CardHeader>
            <CardContent className="p-3 pt-0 flex space-x-3">
              <div className="flex-1 p-2 bg-secondaryBg rounded-xl border border-subtleBorder text-center">
                <span className="text-[10px] text-textMuted block">Zero Flag (ZF)</span>
                <span className="font-mono font-bold text-primary text-sm">{flags.ZF}</span>
              </div>
              <div className="flex-1 p-2 bg-secondaryBg rounded-xl border border-subtleBorder text-center">
                <span className="text-[10px] text-textMuted block">Carry Flag (CF)</span>
                <span className="font-mono font-bold text-primary text-sm">{flags.CF}</span>
              </div>
              <div className="flex-1 p-2 bg-secondaryBg rounded-xl border border-subtleBorder text-center">
                <span className="text-[10px] text-textMuted block">Sign Flag (SF)</span>
                <span className="font-mono font-bold text-primary text-sm">{flags.SF}</span>
              </div>
            </CardContent>
          </Card>

          {/* Execution Log */}
          <div className="p-3 bg-secondaryBg border border-subtleBorder rounded-card space-y-1 font-mono text-[11px] max-h-36 overflow-y-auto">
            <div className="text-textMuted font-bold mb-1">Execution Trace Log:</div>
            {executionLog.map((log, idx) => (
              <div key={idx} className="text-emerald-700 leading-relaxed">• {log}</div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
