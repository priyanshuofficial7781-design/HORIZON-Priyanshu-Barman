import React from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { InAppAlert } from '../../types';
import { Bell, Clock, Calendar, X, ArrowRight, Sparkles } from 'lucide-react';

export const InAppNotificationHUD: React.FC = () => {
  const { activeAlerts, dismissAlert, setActiveTab } = useHorizon();

  if (!activeAlerts || activeAlerts.length === 0) return null;

  const handleOpenPlanner = (alertId: string) => {
    dismissAlert(alertId);
    setActiveTab('planner');
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none select-none">
      {activeAlerts.map(alert => (
        <div
          key={alert.id}
          className="pointer-events-auto relative overflow-hidden rounded-2xl bg-[#0B1228]/95 backdrop-blur-xl border border-[#35D9FF]/40 shadow-[0_0_35px_rgba(53,217,255,0.25)] p-4 text-slate-100 transition-all duration-200 animate-in slide-in-from-top-4 fade-in"
        >
          {/* Subtle glowing ambient line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF]" />

          {/* Alert Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35D9FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#35D9FF]" />
              </span>
              <span className="font-['Outfit'] font-bold text-xs uppercase tracking-wider text-[#35D9FF] font-mono">
                HORIZON STUDY ALERT
              </span>
            </div>

            <button
              type="button"
              onClick={() => dismissAlert(alert.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Alert Body */}
          <div className="py-2.5 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#8B5CFF]/25 text-[#C4B5FD] border border-[#8B5CFF]/30">
                {alert.subjectName || 'Study Block'}
              </span>
              <span className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Starts in ~{Math.max(alert.minutesLeft, 1)} min{alert.minutesLeft === 1 ? '' : 's'}</span>
              </span>
            </div>

            <h4 className="text-sm font-bold text-white leading-snug pt-0.5 line-clamp-2 font-['Outfit']">
              {alert.title}
            </h4>

            <div className="text-[11px] text-slate-400 font-mono">
              Scheduled start time: <span className="text-slate-200 font-semibold">{alert.time}</span>
            </div>
          </div>

          {/* Alert Footer Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 mt-1">
            <button
              type="button"
              onClick={() => dismissAlert(alert.id)}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Dismiss
            </button>

            <button
              type="button"
              onClick={() => handleOpenPlanner(alert.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-slate-950 font-bold text-xs shadow-md shadow-[#8B5CFF]/20 hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <span>View in Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
