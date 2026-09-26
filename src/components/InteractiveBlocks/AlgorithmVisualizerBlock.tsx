import React, { useState, useEffect } from 'react';
import {
  Code,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Zap,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface VisualStep {
  array: number[];
  activeIndices: number[];
  comparingIndices: number[];
  foundIndex?: number;
  description: string;
  operations: number;
}

const ALGORITHMS = [
  {
    id: 'two_pointer',
    name: 'Two-Pointer Target Sum',
    complexity: 'O(n) Time · O(1) Space',
    target: 14,
    initialArray: [2, 3, 5, 7, 9, 11, 15, 18],
    generateSteps: (): VisualStep[] => {
      const arr = [2, 3, 5, 7, 9, 11, 15, 18];
      const target = 14;
      const steps: VisualStep[] = [];
      let left = 0;
      let right = arr.length - 1;
      let ops = 0;

      steps.push({
        array: [...arr],
        activeIndices: [left, right],
        comparingIndices: [],
        description: `Initialize left pointer at index 0 (val: ${arr[left]}) and right pointer at index ${right} (val: ${arr[right]}).`,
        operations: ops
      });

      while (left < right) {
        ops++;
        const sum = arr[left] + arr[right];
        if (sum === target) {
          steps.push({
            array: [...arr],
            activeIndices: [left, right],
            comparingIndices: [left, right],
            foundIndex: left,
            description: `Match found! ${arr[left]} + ${arr[right]} = ${target}. Target achieved in ${ops} comparisons!`,
            operations: ops
          });
          break;
        } else if (sum < target) {
          steps.push({
            array: [...arr],
            activeIndices: [left, right],
            comparingIndices: [left, right],
            description: `${arr[left]} + ${arr[right]} = ${sum} < ${target}. Move left pointer to right to increase sum.`,
            operations: ops
          });
          left++;
        } else {
          steps.push({
            array: [...arr],
            activeIndices: [left, right],
            comparingIndices: [left, right],
            description: `${arr[left]} + ${arr[right]} = ${sum} > ${target}. Move right pointer to left to decrease sum.`,
            operations: ops
          });
          right--;
        }
      }
      return steps;
    }
  },
  {
    id: 'binary_search',
    name: 'Binary Search (Logarithmic)',
    complexity: 'O(log n) Time · O(1) Space',
    target: 27,
    initialArray: [4, 9, 12, 17, 23, 27, 34, 45, 56],
    generateSteps: (): VisualStep[] => {
      const arr = [4, 9, 12, 17, 23, 27, 34, 45, 56];
      const target = 27;
      const steps: VisualStep[] = [];
      let low = 0;
      let high = arr.length - 1;
      let ops = 0;

      steps.push({
        array: [...arr],
        activeIndices: [low, high],
        comparingIndices: [],
        description: `Search space initialized from index ${low} to ${high}. Target: ${target}`,
        operations: ops
      });

      while (low <= high) {
        ops++;
        const mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) {
          steps.push({
            array: [...arr],
            activeIndices: [mid],
            comparingIndices: [mid],
            foundIndex: mid,
            description: `Target ${target} located at mid index ${mid} in just ${ops} iterations!`,
            operations: ops
          });
          break;
        } else if (arr[mid] < target) {
          steps.push({
            array: [...arr],
            activeIndices: [low, high],
            comparingIndices: [mid],
            description: `Mid element arr[${mid}] = ${arr[mid]} < ${target}. Discard left half, search right: [${mid + 1}..${high}]`,
            operations: ops
          });
          low = mid + 1;
        } else {
          steps.push({
            array: [...arr],
            activeIndices: [low, high],
            comparingIndices: [mid],
            description: `Mid element arr[${mid}] = ${arr[mid]} > ${target}. Discard right half, search left: [${low}..${mid - 1}]`,
            operations: ops
          });
          high = mid - 1;
        }
      }
      return steps;
    }
  }
];

export const AlgorithmVisualizerBlock: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState(ALGORITHMS[0]);
  const [steps, setSteps] = useState<VisualStep[]>(() => selectedAlgo.generateSteps());
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(1200);

  // Re-generate steps on algo change
  useEffect(() => {
    const newSteps = selectedAlgo.generateSteps();
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [selectedAlgo]);

  // Auto-play timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speedMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, speedMs]);

  const currentStep = steps[currentStepIdx] || steps[0];

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
            <Code className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <span>Interactive Algorithm Engine</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold font-mono">
                {selectedAlgo.complexity}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live moving blocks simulating pointer manipulation and runtime telemetry.
            </p>
          </div>
        </div>

        {/* Algorithm Dropdown */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedAlgo.id}
            onChange={(e) => {
              const found = ALGORITHMS.find((a) => a.id === e.target.value);
              if (found) setSelectedAlgo(found);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {ALGORITHMS.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Moving Array Visualizer Stage */}
      <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col items-center justify-center space-y-4 min-h-[170px]">
        
        {/* Memory Array Blocks with Dynamic Highlight */}
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto py-2 px-1 max-w-full">
          {currentStep.array.map((val, idx) => {
            const isComparing = currentStep.comparingIndices.includes(idx);
            const isActive = currentStep.activeIndices.includes(idx);
            const isFound = currentStep.foundIndex === idx;

            return (
              <div
                key={idx}
                className="flex flex-col items-center space-y-1.5 flex-shrink-0 transition-all duration-300 transform"
              >
                {/* Pointer indicator */}
                <div className="h-4 text-[10px] font-mono font-bold">
                  {isFound ? (
                    <span className="text-emerald-400">FOUND</span>
                  ) : isComparing ? (
                    <span className="text-amber-400 animate-bounce">CMP</span>
                  ) : isActive ? (
                    <span className="text-indigo-400">PTR</span>
                  ) : null}
                </div>

                {/* Animated Block Cell */}
                <div
                  className={`w-11 h-13 sm:w-13 sm:h-15 rounded-xl flex items-center justify-center font-mono font-bold text-base transition-all duration-300 select-none shadow-md ${
                    isFound
                      ? 'bg-emerald-600 text-white scale-110 shadow-emerald-500/40 border-2 border-emerald-300'
                      : isComparing
                      ? 'bg-amber-500 text-slate-950 scale-105 shadow-amber-500/40 border-2 border-amber-300'
                      : isActive
                      ? 'bg-indigo-600 text-white scale-105 shadow-indigo-500/30 border border-indigo-400'
                      : 'bg-slate-850 text-slate-300 border border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  {val}
                </div>

                {/* Index Label */}
                <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
              </div>
            );
          })}
        </div>

        {/* Narrative Description Line */}
        <div className="w-full text-center px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
          <span className="text-indigo-400 font-bold">Step {currentStepIdx + 1}/{steps.length}: </span>
          <span>{currentStep.description}</span>
        </div>

      </div>

      {/* Execution Controls & Telemetry Meters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        
        {/* Playback Button Group */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            onClick={handleStepForward}
            disabled={currentStepIdx >= steps.length - 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Step Forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-1 pl-2 text-xs text-slate-400">
            <span>Speed:</span>
            <button
              onClick={() => setSpeedMs(1500)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono ${speedMs === 1500 ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
            >
              1x
            </button>
            <button
              onClick={() => setSpeedMs(800)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono ${speedMs === 800 ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
            >
              2x
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <span className="text-slate-500">Comparisons:</span>
            <span className="font-bold text-amber-400">{currentStep.operations}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-300">
            <span className="text-slate-500">Status:</span>
            <span className={currentStep.foundIndex !== undefined ? 'text-emerald-400 font-bold' : 'text-indigo-400'}>
              {currentStep.foundIndex !== undefined ? 'Solved ✓' : 'Traversing...'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
