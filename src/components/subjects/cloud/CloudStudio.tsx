import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useGamification } from '../../../context/GamificationContext';
import { storageService } from '../../../services/storage';
import { Cloud, Server, Database, ShieldCheck, Activity, RefreshCw } from 'lucide-react';

export const CloudStudio: React.FC = () => {
  const { currentUser } = useAuth();
  const { awardXP } = useGamification();

  const [trafficRps, setTrafficRps] = useState<number>(450);
  const [databaseFailover, setDatabaseFailover] = useState<boolean>(false);

  // Autoscaling logic: 1 instance per 200 RPS
  const instanceCount = Math.min(8, Math.max(2, Math.ceil(trafficRps / 200)));
  const cpuUtilization = Math.round((trafficRps / (instanceCount * 250)) * 100);

  const triggerFailoverTest = () => {
    setDatabaseFailover(true);
    setTimeout(() => {
      storageService.recordLearningEvent({
        studentId: currentUser?.id || 'student_aarav_01',
        subjectId: 'cloud',
        conceptId: 'cloud_redundancy',
        eventType: 'simulation_passed',
        evidence: { failoverTimeMs: 140, dataLoss: 0 }
      });
      awardXP(90, 'labXP', 'Zero-Downtime Database Failover Verified');
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">
              IT405 • Cloud Architecture
            </span>
            <span className="text-xs text-slate-400 font-semibold">Elastic Autoscaling & High Availability</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading mt-0.5">
            Distributed Tier Topology & Traffic Elasticity
          </h2>
        </div>

        <button
          type="button"
          onClick={triggerFailoverTest}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Test DB Primary Failover</span>
        </button>
      </div>

      {/* Traffic Slider Control */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-700">Incoming Traffic Load (Requests / sec):</span>
          <span className="font-mono text-sm font-bold text-cyan-600">{trafficRps} RPS</span>
        </div>
        <input
          type="range"
          min="50"
          max="1600"
          step="50"
          value={trafficRps}
          onChange={(e) => setTrafficRps(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>Low Traffic (50 RPS)</span>
          <span>Normal (400 RPS)</span>
          <span>Peak Spike (1600 RPS)</span>
        </div>
      </div>

      {/* Architecture Topology Diagram */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* User Tier */}
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center min-w-[140px]">
            <Activity className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
            <div className="text-xs font-bold">Client Traffic</div>
            <div className="text-[11px] text-slate-400">{trafficRps} req/s</div>
          </div>

          <div className="text-slate-500 font-mono text-xs">── HTTPS ──▶</div>

          {/* Load Balancer */}
          <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-600/60 text-center min-w-[160px]">
            <Cloud className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
            <div className="text-xs font-bold">Application LB</div>
            <div className="text-[11px] text-indigo-300">Layer 7 Round Robin</div>
          </div>

          <div className="text-slate-500 font-mono text-xs">── Internal ──▶</div>

          {/* Autoscaled Web Instances */}
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold">Elastic Compute Instances</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold">
                {instanceCount} active nodes
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: instanceCount }).map((_, i) => (
                <div key={i} className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-mono flex items-center gap-1.5">
                  <Server className="w-3 h-3 text-emerald-400" />
                  <span>Node-{i + 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-slate-400">
              Avg CPU Load: <span className="text-emerald-400 font-bold">{cpuUtilization}%</span>
            </div>
          </div>

          <div className="text-slate-500 font-mono text-xs">── VPC ──▶</div>

          {/* Database HA Tier */}
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center min-w-[150px]">
            <Database className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <div className="text-xs font-bold">Database Cluster</div>
            <div className="text-[10px] text-slate-400 mt-1">
              {databaseFailover ? (
                <span className="text-emerald-400 font-bold">Replica Promoted (HA active)</span>
              ) : (
                <span className="text-amber-300">Primary + Standby</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
