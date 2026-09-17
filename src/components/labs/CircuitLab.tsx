'use client';

import React, { useState } from 'react';
import { Zap, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR';

export function CircuitLab() {
  const [selectedGate, setSelectedGate] = useState<GateType>('XOR');
  const [inputA, setInputA] = useState<number>(1);
  const [inputB, setInputB] = useState<number>(0);
  const [faultMode, setFaultMode] = useState<boolean>(false);

  const calculateOutput = (a: number, b: number, gate: GateType, isFault: boolean) => {
    const effectiveA = isFault ? 0 : a;
    switch (gate) {
      case 'AND': return effectiveA & b;
      case 'OR': return effectiveA | b;
      case 'NOT': return effectiveA === 0 ? 1 : 0;
      case 'XOR': return effectiveA ^ b;
      case 'NAND': return (effectiveA & b) === 0 ? 1 : 0;
      case 'NOR': return (effectiveA | b) === 0 ? 1 : 0;
    }
  };

  const output = calculateOutput(inputA, inputB, selectedGate, faultMode);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface border border-subtleBorder p-4 rounded-card shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-textMain">Digital Circuit Lab: Logic Gates & Fault Diagnosis</h2>
            <Badge variant="warning">Combinational Logic</Badge>
          </div>
          <p className="text-xs text-textSecondary mt-1">
            Construct digital logic circuits, simulate inputs, test truth tables, and diagnose Stuck-at faults.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant={faultMode ? 'destructive' : 'outline'}
            onClick={() => setFaultMode(!faultMode)}
            className="text-xs"
          >
            {faultMode ? 'Fault Active (Stuck-at-0)' : 'Inject Fault Challenge'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Gate Selection & Switch Board (6 cols) */}
        <div className="lg:col-span-6 space-y-4">

          <Card>
            <CardHeader className="p-3 mb-2">
              <CardTitle className="text-xs font-bold text-textMain">1. Select Logic Gate Type</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 grid grid-cols-3 gap-2">
              {(['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR'] as GateType[]).map((gate) => (
                <button
                  key={gate}
                  onClick={() => setSelectedGate(gate)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedGate === gate
                      ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-sm'
                      : 'bg-surface border-subtleBorder text-textSecondary hover:bg-secondaryBg'
                  }`}
                >
                  {gate} Gate
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 mb-2">
              <CardTitle className="text-xs font-bold text-textMain">2. Input Switches</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 flex space-x-4">
              <div className="flex-1 p-3 bg-secondaryBg border border-subtleBorder rounded-xl flex items-center justify-between">
                <span className="text-xs text-textMain font-semibold">Switch A</span>
                <button
                  onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    inputA === 1 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-subtleBorder text-textMuted'
                  }`}
                >
                  {inputA === 1 ? 'HIGH (1)' : 'LOW (0)'}
                </button>
              </div>

              {selectedGate !== 'NOT' && (
                <div className="flex-1 p-3 bg-secondaryBg border border-subtleBorder rounded-xl flex items-center justify-between">
                  <span className="text-xs text-textMain font-semibold">Switch B</span>
                  <button
                    onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      inputB === 1 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-subtleBorder text-textMuted'
                    }`}
                  >
                    {inputB === 1 ? 'HIGH (1)' : 'LOW (0)'}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Live Simulation Canvas & Output (6 cols) */}
        <div className="lg:col-span-6 space-y-4">

          <Card className="bg-surface border-subtleBorder flex flex-col items-center justify-center p-6 text-center shadow-card">
            <h3 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-4">
              Circuit Signal Propagation Canvas
            </h3>

            {/* Simulated Logic Canvas Representation */}
            <div className="flex items-center space-x-6 py-4">
              <div className="flex flex-col space-y-3 text-xs font-mono">
                <span className={`px-2.5 py-1 rounded-lg border ${inputA ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' : 'bg-secondaryBg text-textMuted border-subtleBorder'}`}>
                  Input A: {inputA} {faultMode && '(STUCK AT 0)'}
                </span>
                {selectedGate !== 'NOT' && (
                  <span className={`px-2.5 py-1 rounded-lg border ${inputB ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' : 'bg-secondaryBg text-textMuted border-subtleBorder'}`}>
                    Input B: {inputB}
                  </span>
                )}
              </div>

              <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-400 flex items-center justify-center text-amber-800 font-bold text-sm shadow-md">
                {selectedGate}
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold text-base transition-all duration-300 ${
                  output === 1
                    ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-md shadow-amber-400/40 animate-pulse'
                    : 'bg-secondaryBg border-subtleBorder text-textMuted'
                }`}>
                  {output}
                </div>
                <span className="text-[10px] text-textSecondary mt-1 font-semibold">
                  LED {output === 1 ? 'ON (1)' : 'OFF (0)'}
                </span>
              </div>
            </div>

            {faultMode && (
              <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1.5 text-rose-600 flex-shrink-0" />
                Fault Detected: Input wire A is physically grounded (Stuck-at-0). Output remains 0 despite Switch A set to HIGH!
              </div>
            )}
          </Card>

        </div>

      </div>
    </div>
  );
}
