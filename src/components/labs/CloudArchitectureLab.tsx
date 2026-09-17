'use client';

import React, { useState } from 'react';
import { Cloud, Server, Database, Activity, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function CloudArchitectureLab() {
  const [trafficRps, setTrafficRps] = useState<number>(1000);
  const [activeNodes, setActiveNodes] = useState<number>(2);
  const [serverState, setServerState] = useState<'HEALTHY' | 'SURGED' | 'CRASHED'>('HEALTHY');
  const [cacheEnabled, setCacheEnabled] = useState<boolean>(true);
  const [simLog, setSimLog] = useState<string[]>([
    'System Initialized: 2 Web Instances behind Application Load Balancer.',
  ]);

  const handleSimulateSpike = () => {
    setTrafficRps(100000);
    if (!cacheEnabled && activeNodes < 4) {
      setServerState('CRASHED');
      setSimLog((prev) => [
        'CRITICAL ALERT: DB Connection Pool Exhausted! 100K RPS overwhelmed web instances without Cache layer.',
        ...prev,
      ]);
    } else {
      setServerState('SURGED');
      setActiveNodes(5);
      setSimLog((prev) => [
        'Autoscaler Triggered: Scaled from 2 to 5 instances. Redis cache hit ratio: 87%. Traffic absorbed successfully!',
        ...prev,
      ]);
    }
  };

  const handleResetSim = () => {
    setTrafficRps(1000);
    setActiveNodes(2);
    setServerState('HEALTHY');
    setSimLog(['System Reset: Baseline 1,000 RPS traffic load.']);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface border border-subtleBorder p-4 rounded-card shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <Cloud className="w-5 h-5 text-cyanAccent" />
            <h2 className="text-base font-bold text-textMain">Cloud Architecture Lab: Resilience & Autoscaling</h2>
            <Badge variant="info">Multi-Tier Microservices</Badge>
          </div>
          <p className="text-xs text-textSecondary mt-1">
            Build resilient cloud topologies with Load Balancers, Redis Cache, and Autoscaling groups. Simulate traffic spikes.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={handleResetSim} className="text-xs">
            Reset Baseline (1K RPS)
          </Button>
          <Button
            size="sm"
            onClick={handleSimulateSpike}
            className="text-xs space-x-1.5 bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-sm"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Traffic Spike (100K RPS)</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Cloud Topology Visual Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-surface border border-subtleBorder rounded-card p-5 space-y-6 shadow-card">
          <div className="flex items-center justify-between border-b border-subtleBorder pb-2">
            <h3 className="text-xs font-bold text-textMain">Interactive Visual Architecture Topology</h3>
            <Badge variant={serverState === 'CRASHED' ? 'destructive' : serverState === 'SURGED' ? 'warning' : 'success'}>
              {serverState}
            </Badge>
          </div>

          <div className="flex flex-col items-center space-y-5 py-3">

            {/* Traffic Source */}
            <div className="p-3 bg-secondaryBg border border-subtleBorder rounded-xl flex items-center space-x-3 shadow-sm">
              <Activity className="w-5 h-5 text-cyanAccent animate-pulse" />
              <div>
                <span className="text-xs font-bold text-textMain">Global Client Traffic</span>
                <span className="text-[10px] text-cyanAccent font-mono font-bold block">{trafficRps.toLocaleString()} RPS</span>
              </div>
            </div>

            <div className="w-0.5 h-5 bg-subtleBorder" />

            {/* Load Balancer */}
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-center min-w-[200px] shadow-sm">
              <span className="text-xs font-bold text-primary block">Application Load Balancer</span>
              <span className="text-[10px] text-indigo-700 font-mono">Algorithm: Round Robin</span>
            </div>

            <div className="w-0.5 h-5 bg-subtleBorder" />

            {/* Web App Cluster */}
            <div className="w-full p-4 bg-secondaryBg border border-subtleBorder rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-textMain">Web App Server Cluster</span>
                <span className="text-[11px] text-textSecondary font-mono">{activeNodes} Active Instances</span>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-1">
                {Array.from({ length: activeNodes }).map((_, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg border text-center font-mono text-[10px] font-bold ${
                      serverState === 'CRASHED'
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    }`}
                  >
                    Node-{i + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-0.5 h-5 bg-subtleBorder" />

            {/* Data Layer */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center">
                <Database className="w-4 h-4 text-purpleAccent mx-auto mb-1" />
                <span className="text-xs font-bold text-purple-900 block">Primary Database</span>
                <span className="text-[10px] text-purple-700 font-mono">PostgreSQL</span>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <Server className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-amber-900 block">Redis In-Memory Cache</span>
                <span className="text-[10px] text-amber-800 font-mono">{cacheEnabled ? 'ENABLED' : 'DISABLED'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Controls & Architectural Logs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="p-3 mb-2">
              <CardTitle className="text-xs font-bold text-textMain">Architecture Components Toggle</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-secondaryBg border border-subtleBorder rounded-xl">
                <span className="text-xs text-textMain font-semibold">Redis In-Memory Caching</span>
                <button
                  onClick={() => setCacheEnabled(!cacheEnabled)}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    cacheEnabled ? 'bg-emerald-600 text-white' : 'bg-subtleBorder text-textMuted'
                  }`}
                >
                  {cacheEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Simulation Log */}
          <div className="p-3 bg-secondaryBg border border-subtleBorder rounded-card space-y-1 font-mono text-[11px] min-h-[160px] max-h-[220px] overflow-y-auto">
            <div className="text-textMuted font-bold mb-1">Architecture Consequence Log:</div>
            {simLog.map((log, idx) => (
              <div key={idx} className="text-textMain leading-relaxed">• {log}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
