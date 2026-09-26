import React, { useState, useEffect } from 'react';
import {
  Coffee,
  X,
  Droplets,
  Eye,
  Heart,
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface BreakReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BreakReminderModal: React.FC<BreakReminderModalProps> = ({ isOpen, onClose }) => {
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [counter, setCounter] = useState(4);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          setBreathPhase((current) => {
            if (current === 'Inhale') return 'Hold';
            if (current === 'Hold') return 'Exhale';
            return 'Inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, breathPhase]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl border border-emerald-500/30">
            <Coffee className="w-7 h-7" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Time for a 5-Minute Recharge!
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
            Continuous intense focus peaks after 50 minutes. Stepping away protects cognitive clarity and cements long-term memory.
          </p>
        </div>

        {/* Guided Breathing Bubble Animation */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            4-4-4 Box Breathing Exercise
          </span>

          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 transition-all duration-1000 ease-in-out ${
                breathPhase === 'Inhale'
                  ? 'scale-110 shadow-lg shadow-emerald-500/30'
                  : breathPhase === 'Hold'
                  ? 'scale-110 opacity-80'
                  : 'scale-75 opacity-40'
              }`}
            />
            <div className="relative z-10 text-center">
              <span className="text-sm font-bold text-white block">{breathPhase}</span>
              <span className="text-xs font-mono text-emerald-300 font-bold">{counter}s</span>
            </div>
          </div>
        </div>

        {/* Wellness Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left text-xs">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
            <div className="flex items-center space-x-1.5 text-blue-400 font-semibold">
              <Droplets className="w-3.5 h-3.5" />
              <span>Hydrate</span>
            </div>
            <p className="text-[11px] text-slate-300">Drink a full glass of cold water.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
              <Eye className="w-3.5 h-3.5" />
              <span>20-20-20 Rule</span>
            </div>
            <p className="text-[11px] text-slate-300">Look 20 feet away for 20 seconds.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
            <div className="flex items-center space-x-1.5 text-purple-400 font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>Stretch</span>
            </div>
            <p className="text-[11px] text-slate-300">Roll shoulders and stand up.</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          I'm Refreshed & Ready to Continue 🚀
        </button>

      </div>
    </div>
  );
};
