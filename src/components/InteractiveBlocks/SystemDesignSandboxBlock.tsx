import React, { useState, useEffect } from 'react';
import {
  Layers,
  Server,
  Database,
  Cpu,
  Zap,
  AlertTriangle,
  RefreshCw,
  Activity,
  SlidersHorizontal,
  ShieldCheck,
  Radio
} from 'lucide-react';

interface ServiceNode {
  id: string;
  name: string;
  type: 'gateway' | 'app' | 'cache' | 'db' | 'queue';
  status: 'healthy' | 'degraded' | 'offline';
  qps: number;
  cpu: number;
}

export const SystemDesignSandboxBlock: React.FC = () => {
  const [trafficQps, setTrafficQps] = useState<number>(25000);
  const [node1Status, setNode1Status] = useState<'healthy' | 'offline'>('healthy');
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [packetTick, setPacketTick] = useState(0);

  // Packet animation ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketTick((p) => (p + 1) % 100);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Compute live telemetry
  const isOverloaded = trafficQps > 100000;
  const cacheHitRate = cacheEnabled ? 88 : 0;
  const dbLoad = Math.min(100, Math.round((trafficQps * (1 - cacheHitRate / 100)) / 600));
  const avgLatencyMs = Math.round(
    14 + (trafficQps / 8000) * (node1Status === 'offline' ? 2.2 : 1) + (!cacheEnabled ? 45 : 0)
  );

  const toggleNodeCrash = () => {
    setNode1Status((prev) => (prev === 'healthy' ? 'offline' : 'healthy'));
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <span>System Architecture Sandbox</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold font-mono">
                Live Simulation
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive high-concurrency topology with real-time packet propagation.
            </p>
          </div>
        </div>

        {/* Chaos Engineering Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleNodeCrash}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              node1Status === 'offline'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>{node1Status === 'offline' ? 'Recover Node 1' : 'Trigger Node Crash'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Topology Canvas with Moving Packet Pulses */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 relative overflow-hidden space-y-6">
        
        {/* Animated Background Flow Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Nodes Layer */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
          
          {/* Node 1: Client Gateway / Load Balancer */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>API Gateway</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">NGINX</span>
            </div>
            <p className="text-[11px] text-slate-400">Round-Robin TLS Proxy</p>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between font-mono">
              <span>Ingress:</span>
              <span className="text-cyan-400 font-bold">{trafficQps.toLocaleString()} QPS</span>
            </div>
          </div>

          {/* Node 2: App Cluster Nodes */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Server className="w-3.5 h-3.5 text-indigo-400" />
                <span>App Workers</span>
              </span>
              <span className="text-[10px] text-indigo-400 font-mono">3x Node</span>
            </div>
            
            {/* Status pills for worker pods */}
            <div className="space-y-1 py-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Pod-01</span>
                <span className={node1Status === 'offline' ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {node1Status === 'offline' ? 'CRASHED' : 'HEALTHY'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Pod-02</span>
                <span className="text-emerald-400">HEALTHY</span>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between font-mono">
              <span>Cluster CPU:</span>
              <span className="text-indigo-400 font-bold">{Math.round((trafficQps / 1200) * (node1Status === 'offline' ? 1.5 : 1))}%</span>
            </div>
          </div>

          {/* Node 3: Distributed Cache */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Redis Cache</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono">In-Memory</span>
            </div>
            <p className="text-[11px] text-slate-400">LRU Eviction Layer</p>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between font-mono">
              <span>Hit Rate:</span>
              <span className="text-amber-400 font-bold">{cacheHitRate}%</span>
            </div>
          </div>

          {/* Node 4: Sharded Database */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5 text-purple-400" />
                <span>Primary DB</span>
              </span>
              <span className="text-[10px] text-purple-400 font-mono">PostgreSQL</span>
            </div>
            <p className="text-[11px] text-slate-400">ACID Replication Read Replicas</p>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between font-mono">
              <span>IOPS Load:</span>
              <span className={`font-bold ${dbLoad > 85 ? 'text-rose-400' : 'text-purple-400'}`}>{dbLoad}%</span>
            </div>
          </div>

        </div>

        {/* Live Packet Flow Ticker Indicator */}
        <div className="flex items-center justify-between text-xs pt-1 px-1">
          <div className="flex items-center space-x-2 text-slate-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Telemetry: {avgLatencyMs}ms avg latency</span>
            <span>·</span>
            <span>Packet drop rate: {node1Status === 'offline' ? '0.4%' : '0.00%'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={cacheEnabled}
                onChange={(e) => setCacheEnabled(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span>Enable Redis Layer</span>
            </label>
          </div>
        </div>

      </div>

      {/* Traffic QPS Slider & Telemetry Gauges */}
      <div className="space-y-2 p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate Traffic Concurrency:</span>
          </span>
          <span className="font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
            {trafficQps.toLocaleString()} Requests / Sec
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="150000"
          step="5000"
          value={trafficQps}
          onChange={(e) => setTrafficQps(Number(e.target.value))}
          className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>1K QPS (Off-Peak)</span>
          <span>50K QPS (Average)</span>
          <span>100K QPS (Flash Sale)</span>
          <span>150K QPS (Spike Stress)</span>
        </div>
      </div>

    </div>
  );
};
