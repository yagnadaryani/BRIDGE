import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Cloud, 
  Server, 
  Database, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Activity, 
  DollarSign, 
  AlertTriangle, 
  RotateCcw,
  Cpu,
  Layers,
  GripVertical
} from 'lucide-react';

export const CloudLab = () => {
  const { gamification, t } = useApp();

  const [trafficRps, setTrafficRps] = useState(2500);
  const [nodes, setNodes] = useState({
    cdn: true,
    loadBalancer: true,
    web1: true,
    web2: true,
    autoScale: false,
    redisCache: false,
    primaryDb: true,
  });

  const [injectedFailure, setInjectedFailure] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);

  const nodeCount = Object.values(nodes).filter(Boolean).length;
  
  const baseCost = 
    (nodes.cdn ? 20 : 0) +
    (nodes.loadBalancer ? 35 : 0) +
    (nodes.web1 ? 40 : 0) +
    (nodes.web2 ? 40 : 0) +
    (nodes.autoScale ? 60 : 0) +
    (nodes.redisCache ? 30 : 0) +
    (nodes.primaryDb ? 80 : 0);

  const budgetCap = 250;

  let effectiveCapacity = (nodes.web1 ? 3000 : 0) + (nodes.web2 ? 3000 : 0) + (nodes.autoScale ? 15000 : 0);
  if (nodes.redisCache) effectiveCapacity += 8000;
  if (injectedFailure === 'db-crash') effectiveCapacity *= 0.2;
  if (injectedFailure === 'server-overload') effectiveCapacity *= 0.5;

  const loadPercentage = Math.min(100, Math.floor((trafficRps / Math.max(1000, effectiveCapacity)) * 100));
  
  const avgLatency = loadPercentage > 90 
    ? Math.floor(1200 + (loadPercentage - 90) * 80)
    : loadPercentage > 70 
      ? Math.floor(180 + (loadPercentage - 70) * 15)
      : Math.floor(25 + loadPercentage * 0.4);

  const errorRate = loadPercentage > 95 ? Math.floor((loadPercentage - 90) * 3) : 0;
  const isOverBudget = baseCost > budgetCap;
  const isHealthy = loadPercentage < 85 && errorRate === 0 && !isOverBudget;

  const toggleNode = (key) => {
    setNodes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, nodeKey) => {
    setDraggedNode(nodeKey);
    e.dataTransfer.setData('nodeKey', nodeKey);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedKey = e.dataTransfer.getData('nodeKey') || draggedNode;
    if (droppedKey) {
      setNodes(prev => ({ ...prev, [droppedKey]: true }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl border transition-all ${
        gamification ? 'glass-panel border-cyan-500/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <Cloud className={`w-6 h-6 ${gamification ? 'text-cyan-400' : 'text-cyan-700'}`} />
            <h1 className={`text-2xl font-extrabold tracking-tight font-['Outfit'] ${
              gamification ? 'text-gradient' : 'text-slate-900'
            }`}>
              {t.cloudHeader}
            </h1>
          </div>
          <p className={`text-sm mt-1 font-semibold ${gamification ? 'text-white' : 'text-black'}`}>
            Drag & drop cloud nodes onto the topology canvas. Balance traffic load, availability, and budget ($250/mo limit).
          </p>
        </div>

        {/* Budget Status Badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold ${
          isOverBudget
            ? 'bg-rose-500/15 border-rose-500/40 text-rose-700'
            : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700'
        }`}>
          <DollarSign className="w-4 h-4" />
          <span>Budget: ${baseCost} / ${budgetCap} mo</span>
          {isOverBudget && <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />}
        </div>
      </div>

      {/* Metrics HUD Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border space-y-1 ${gamification ? 'glass-card' : 'bg-white border-black shadow-sm'}`}>
          <span className={`text-[11px] font-extrabold uppercase ${gamification ? 'text-white' : 'text-black'}`}>Traffic Throughput</span>
          <div className="text-xl font-extrabold text-cyan-600 font-mono flex items-center justify-between">
            <span>{trafficRps.toLocaleString()} RPS</span>
            <Zap className="w-4 h-4 text-cyan-500" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border space-y-1 ${gamification ? 'glass-card' : 'bg-white border-black shadow-sm'}`}>
          <span className={`text-[11px] font-extrabold uppercase ${gamification ? 'text-white' : 'text-black'}`}>Avg Latency</span>
          <div className={`text-xl font-extrabold font-mono flex items-center justify-between ${
            avgLatency > 500 ? 'text-rose-600' : avgLatency > 150 ? 'text-amber-600' : 'text-emerald-600'
          }`}>
            <span>{avgLatency} ms</span>
            <Activity className="w-4 h-4" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border space-y-1 ${gamification ? 'glass-card' : 'bg-white border-black shadow-sm'}`}>
          <span className="text-[11px] font-bold uppercase text-slate-500">Server Capacity</span>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-300 ${
                loadPercentage > 85 ? 'bg-rose-500' : loadPercentage > 60 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${loadPercentage}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-500 block mt-1">{loadPercentage}% Load</span>
        </div>

        <div className={`p-4 rounded-xl border space-y-1 ${gamification ? 'glass-card' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="text-[11px] font-bold uppercase text-slate-500">HTTP Error Rate</span>
          <div className={`text-xl font-extrabold font-mono flex items-center justify-between ${
            errorRate > 0 ? 'text-rose-600' : 'text-emerald-600'
          }`}>
            <span>{errorRate}% 502</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Architecture Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topology Canvas Left (8 cols) */}
        <div className={`lg:col-span-8 p-5 rounded-2xl border flex flex-col justify-between min-h-[500px] ${
          gamification ? 'glass-panel border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {/* Top Slider Bar */}
          <div className={`space-y-3 pb-4 border-b ${gamification ? 'border-white/10' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <label className={`text-xs font-bold uppercase flex items-center gap-2 ${
                gamification ? 'text-slate-300' : 'text-slate-800'
              }`}>
                <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                Crank Up Traffic: {trafficRps.toLocaleString()} Req/Sec
              </label>
              <div className="flex gap-1.5">
                {[500, 5000, 25000, 50000].map(val => (
                  <button
                    key={val}
                    onClick={() => setTrafficRps(val)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${
                      trafficRps === val
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {val >= 1000 ? `${val / 1000}k` : val}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="range"
              min="100"
              max="50000"
              step="500"
              value={trafficRps}
              onChange={(e) => setTrafficRps(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Drag & Drop Canvas */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="my-auto py-6 px-4 rounded-2xl bg-[#090E1A] border-2 border-dashed border-indigo-500/40 relative min-h-[340px] flex items-center justify-between overflow-hidden shadow-inner"
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366F1_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="absolute top-3 left-4 text-[10px] uppercase font-bold font-mono text-indigo-400 tracking-wider">
              ✦ Drop Zone: Drop Infrastructure Nodes Here
            </div>

            {/* Client Users */}
            <div className="z-10 flex flex-col items-center gap-2">
              <div className="p-3.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 animate-bounce">
                <Globe className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-bold font-mono text-cyan-300">Global Users</span>
            </div>

            {/* CDN */}
            {nodes.cdn && (
              <div className="z-10 flex flex-col items-center gap-2">
                <div className="p-3.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/50 text-indigo-300">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-300">Cloudflare CDN</span>
              </div>
            )}

            {/* Load Balancer */}
            {nodes.loadBalancer && (
              <div className="z-10 flex flex-col items-center gap-2">
                <div className="p-3.5 rounded-2xl bg-purple-500/20 border border-purple-500/50 text-purple-300">
                  <Server className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-mono font-bold text-purple-300">NGINX ALB</span>
              </div>
            )}

            {/* Web Cluster */}
            <div className="z-10 space-y-3">
              {nodes.web1 && (
                <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold">Web EC2-1</span>
                </div>
              )}
              {nodes.web2 && (
                <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold">Web EC2-2</span>
                </div>
              )}
              {nodes.autoScale && (
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-bold flex items-center gap-2 shadow-lg">
                  <Cpu className="w-4 h-4" />
                  <span className="text-[10px] font-mono">ASG +3 Nodes</span>
                </div>
              )}
            </div>

            {/* Cache & DB */}
            <div className="z-10 space-y-3">
              {nodes.redisCache && (
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold">Redis Cache</span>
                </div>
              )}
              {nodes.primaryDb && (
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                  injectedFailure === 'db-crash'
                    ? 'bg-rose-500/30 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-900 border-indigo-500/40 text-indigo-300'
                }`}>
                  <Database className="w-5 h-5" />
                  <span className="text-[10px] font-mono font-bold">PostgreSQL DB</span>
                </div>
              )}
            </div>
          </div>

          <div className={`flex items-center justify-between pt-3 border-t ${
            gamification ? 'border-white/10' : 'border-slate-200'
          }`}>
            <span className="text-xs text-slate-500">
              Active Nodes: <strong className="text-slate-800">{nodeCount}</strong>
            </span>
            <button
              onClick={() => {
                setNodes({ cdn: true, loadBalancer: true, web1: true, web2: true, autoScale: false, redisCache: false, primaryDb: true });
                setInjectedFailure(null);
                setTrafficRps(2500);
              }}
              className="btn-secondary text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Topology</span>
            </button>
          </div>
        </div>

        {/* Node Palette & AI Advisor Right (4 cols) */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border flex flex-col justify-between min-h-[500px] ${
          gamification ? 'glass-panel border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="space-y-4">
            <h2 className={`font-bold text-base pb-3 border-b flex items-center justify-between ${
              gamification ? 'border-white/10 text-slate-200' : 'border-slate-200 text-slate-900'
            }`}>
              <span>Drag & Drop Node Palette</span>
              <span className="text-xs text-cyan-600 font-mono font-semibold">Drag onto Canvas</span>
            </h2>

            {/* Draggable Node Items */}
            <div className="space-y-2">
              {[
                { key: 'cdn', label: 'Cloudflare Edge CDN', cost: '$20/mo' },
                { key: 'loadBalancer', label: 'NGINX Load Balancer', cost: '$35/mo' },
                { key: 'autoScale', label: 'Auto-Scaling Group', cost: '$60/mo' },
                { key: 'redisCache', label: 'Redis In-Memory Cache', cost: '$30/mo' }
              ].map(item => (
                <div
                  key={item.key}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.key)}
                  onClick={() => toggleNode(item.key)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-grab transition-all ${
                    nodes[item.key]
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Drag onto canvas or click to toggle"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs">{item.label}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{item.cost}</span>
                </div>
              ))}
            </div>

            {/* Failure Injection */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">
                Chaos Engineering Tests
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setInjectedFailure(injectedFailure === 'db-crash' ? null : 'db-crash')}
                  className={`flex-1 py-2 px-2 rounded-xl border text-[11px] font-bold transition-all ${
                    injectedFailure === 'db-crash'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                      : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  💥 DB Crash
                </button>
                <button
                  onClick={() => setInjectedFailure(injectedFailure === 'server-overload' ? null : 'server-overload')}
                  className={`flex-1 py-2 px-2 rounded-xl border text-[11px] font-bold transition-all ${
                    injectedFailure === 'server-overload'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                      : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  ⚡ Overload
                </button>
              </div>
            </div>

            {/* AI Advisor Box */}
            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
              isHealthy
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                : 'bg-amber-50 border-amber-200 text-amber-900 font-semibold'
            }`}>
              🤖 <strong>Cloud Advisor:</strong>{' '}
              {isOverBudget
                ? 'System cost ($' + baseCost + ') exceeds budget limit ($250/mo).'
                : loadPercentage > 85
                  ? 'High traffic! Drag Auto-Scaling Group or Redis Cache onto canvas.'
                  : 'Architecture is performing optimal load distribution within budget!'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
