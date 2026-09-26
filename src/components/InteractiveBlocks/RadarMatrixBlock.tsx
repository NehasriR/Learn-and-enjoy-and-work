import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  SlidersHorizontal,
  RotateCcw,
  Target,
  Zap,
  Info
} from 'lucide-react';

interface RadarAxis {
  key: string;
  label: string;
  value: number;
  benchmark: number;
  color: string;
}

const INITIAL_AXES: RadarAxis[] = [
  { key: 'dsa', label: 'DSA & Algorithms', value: 68, benchmark: 85, color: '#6366f1' },
  { key: 'sys', label: 'System Design', value: 54, benchmark: 80, color: '#a855f7' },
  { key: 'core', label: 'Core CS (OS/DBMS)', value: 75, benchmark: 80, color: '#06b6d4' },
  { key: 'speed', label: 'Speed & Problem Solving', value: 62, benchmark: 85, color: '#f59e0b' },
  { key: 'comm', label: 'Interview Fluency', value: 70, benchmark: 80, color: '#10b981' },
  { key: 'proj', label: 'Projects & Stack', value: 78, benchmark: 85, color: '#ec4899' },
];

export const RadarMatrixBlock: React.FC = () => {
  const [axes, setAxes] = useState<RadarAxis[]>(INITIAL_AXES);
  const [showSimSliders, setShowSimSliders] = useState(false);

  // SVG calculations for 6-axis polygon
  const size = 300;
  const center = size / 2;
  const radius = 105;
  const totalAxes = axes.length;

  const getCoordinates = (value: number, index: number, maxVal = 100) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / maxVal) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Student Polygon Path
  const studentPoints = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(axis.value, i);
      return `${x},${y}`;
    })
    .join(' ');

  // Target Benchmark Polygon Path
  const benchmarkPoints = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(axis.benchmark, i);
      return `${x},${y}`;
    })
    .join(' ');

  const currentAvg = Math.round(axes.reduce((a, c) => a + c.value, 0) / axes.length);
  const targetAvg = Math.round(axes.reduce((a, c) => a + c.benchmark, 0) / axes.length);

  const handleUpdateAxis = (index: number, newVal: number) => {
    const updated = [...axes];
    updated[index].value = newVal;
    setAxes(updated);
  };

  const handleResetSimulation = () => {
    setAxes(INITIAL_AXES);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <span>Neural Readiness Polygon</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                6-Dimensional
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Multi-axial hiring readiness benchmark vs production hiring bar.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSimSliders(!showSimSliders)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              showSimSliders
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showSimSliders ? 'Hide Simulator' : 'Simulate Growth'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: SVG Radar + Telemetry Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Radar SVG Visualizer (6 cols) */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative">
          
          <svg width={size} height={size} className="overflow-visible select-none">
            {/* Concentric Grid Rings */}
            {[0.25, 0.5, 0.75, 1].map((scale, idx) => (
              <circle
                key={idx}
                cx={center}
                cy={center}
                r={radius * scale}
                fill="none"
                stroke="#1e293b"
                strokeDasharray={scale === 1 ? 'none' : '3 3'}
                strokeWidth="1"
              />
            ))}

            {/* Radial Axis Lines */}
            {axes.map((_, i) => {
              const { x, y } = getCoordinates(100, i);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1"
                />
              );
            })}

            {/* Benchmark Polygon (Emerald Dotted) */}
            <polygon
              points={benchmarkPoints}
              fill="rgba(16, 185, 129, 0.08)"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Student Skill Polygon (Indigo Solid with Gradient Glow) */}
            <polygon
              points={studentPoints}
              fill="rgba(99, 102, 241, 0.25)"
              stroke="#6366f1"
              strokeWidth="2.5"
              className="transition-all duration-300 ease-out"
            />

            {/* Axis Data Points */}
            {axes.map((axis, i) => {
              const { x, y } = getCoordinates(axis.value, i);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#ffffff"
                  stroke="#6366f1"
                  strokeWidth="2"
                  className="transition-all duration-300 ease-out"
                />
              );
            })}

            {/* Labels on Periphery */}
            {axes.map((axis, i) => {
              const { x, y } = getCoordinates(125, i);
              const isLeft = x < center - 10;
              const isRight = x > center + 10;
              const anchor = isLeft ? 'end' : isRight ? 'start' : 'middle';
              return (
                <text
                  key={i}
                  x={x}
                  y={y + 4}
                  textAnchor={anchor}
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  {axis.label.split(' ')[0]} ({axis.value}%)
                </text>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex items-center space-x-4 pt-2 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-1 bg-indigo-500 rounded-full" />
              <span className="text-slate-300 font-medium">Your Score ({currentAvg}%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-1 border border-emerald-400 border-dashed rounded-full" />
              <span className="text-emerald-400 font-medium">Target Benchmark ({targetAvg}%)</span>
            </div>
          </div>
        </div>

        {/* Right Details & Breakdown (6 cols) */}
        <div className="md:col-span-6 space-y-3">
          
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Simulated Readiness Index</span>
              <span className="font-mono font-bold text-white text-sm">{currentAvg}% / 100%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${currentAvg}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              {currentAvg >= 80 ? (
                <span className="text-emerald-400 font-semibold">Tier-1 Company Placement Ready! High probability of clearing technical screens.</span>
              ) : (
                <span>Close the <strong className="text-white">+{targetAvg - currentAvg}% gap</strong> to meet Tier-1 standard eligibility.</span>
              )}
            </p>
          </div>

          {/* Skill List with Progress Gauges */}
          <div className="space-y-2">
            {axes.map((axis, idx) => (
              <div
                key={axis.key}
                className="p-2.5 rounded-xl bg-slate-850/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-semibold text-slate-200 truncate">{axis.label}</span>
                    <span className="font-mono text-slate-400">{axis.value}% vs {axis.benchmark}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div
                      className="h-1 rounded-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${axis.value}%` }}
                    />
                  </div>
                </div>

                {showSimSliders && (
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={axis.value}
                    onChange={(e) => handleUpdateAxis(idx, Number(e.target.value))}
                    className="w-20 accent-indigo-500 cursor-pointer h-1"
                  />
                )}
              </div>
            ))}
          </div>

          {showSimSliders && (
            <div className="flex justify-end pt-1">
              <button
                onClick={handleResetSimulation}
                className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Baseline</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
