import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import {
  calculateOverallProgress,
  calculateStudyHoursFromTasks,
  calculateWeeklyActivityBreakdown,
  calculateSubjectProgress,
} from '../../utils/plannerLogic';
import {
  Clock,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const ProgressAnalytics: React.FC = () => {
  const { subjects, tasks, profile } = useHorizon();
  const [viewScope, setViewScope] = useState<'weekly' | 'monthly'>('weekly');

  const taskHours = calculateStudyHoursFromTasks(tasks);
  const weeklyData = calculateWeeklyActivityBreakdown(tasks);
  const totalWeeklyHours = weeklyData.reduce((acc, d) => acc + d.hours, 0);

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasksCount = Math.max(tasks.length, 30);

  // Top 5 subjects matching collage (C++/DSA, Cybersecurity, Python, Math, Aptitude)
  const prioritySubjectsList = [
    { id: 'cpp-dsa', name: 'C++ / DSA', color: '#8B5CFF' },
    { id: 'cybersecurity', name: 'Cybersecurity', color: '#10B981' },
    { id: 'python', name: 'Python', color: '#06B6D4' },
    { id: 'mathematics', name: 'Mathematics', color: '#3B82F6' },
    { id: 'aptitude', name: 'Aptitude', color: '#F59E0B' },
  ];

  return (
    <div className="p-5 lg:p-7 max-w-7xl mx-auto space-y-6 pb-24 lg:pb-12 animate-in fade-in duration-200 select-none">
      {/* Header matching Panel 12 in collage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#8B5CFF]/15">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
            Progress & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Weekly velocity & curriculum mastery telemetry.
          </p>
        </div>

        {/* Weekly / Monthly Toggle matching collage */}
        <div className="flex items-center p-1 rounded-xl bg-[#111A35] border border-slate-800">
          {(['weekly', 'monthly'] as const).map(scope => (
            <button
              key={scope}
              type="button"
              onClick={() => setViewScope(scope)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                viewScope === scope
                  ? 'bg-[#35D9FF] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {scope === 'weekly' ? 'Weekly' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      {/* Top 2 Metric Cards: Study Hours & Tasks Completed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-5 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Study Hours
            </span>
            <div className="text-2xl font-extrabold text-white font-['Outfit'] tabular-nums flex items-baseline gap-2">
              <span>{viewScope === 'weekly' ? totalWeeklyHours.toFixed(1) : taskHours.completedHours.toFixed(1)}h</span>
              <span className="text-xs font-semibold text-emerald-400 font-mono">+12%</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Target: {profile.dailyStudyHours}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#35D9FF]/10 border border-[#35D9FF]/20 flex items-center justify-center text-[#35D9FF]">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Tasks Completed
            </span>
            <div className="text-2xl font-extrabold text-white font-['Outfit'] tabular-nums flex items-baseline gap-2">
              <span>{completedTasksCount} / {totalTasksCount}</span>
              <span className="text-xs font-semibold text-emerald-400 font-mono">+20%</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Sprints Logged
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#8B5CFF]/15 border border-[#8B5CFF]/25 flex items-center justify-center text-[#8B5CFF]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Subject-Wise Progress & Weekly Activity Curved Chart matching Panel 12 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Subject-wise Progress (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white font-['Outfit']">Subject-wise Progress</h2>
            <span className="text-xs text-slate-400 font-mono">Curriculum</span>
          </div>

          <div className="space-y-3 pt-1">
            {prioritySubjectsList.map(item => {
              const subObj = subjects.find(s => s.id === item.id);
              const progressVal = subObj ? calculateSubjectProgress(subObj) : 0;
              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.name}</span>
                    <span className="text-[#35D9FF] font-mono font-bold">{progressVal}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${progressVal}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Weekly Activity Curved Area Wave Chart (6 cols) matching Panel 12 */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white font-['Outfit']">Weekly Activity</h2>
            <span className="text-xs text-slate-400 font-mono">Consistent Wave</span>
          </div>

          {/* SVG Smooth Curved Area Chart matching Panel 12 */}
          <div className="relative h-44 w-full my-auto flex flex-col justify-end">
            <svg
              className="w-full h-32 overflow-visible"
              viewBox="0 0 500 120"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#35D9FF" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#8B5CFF" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0B1228" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <path
                d="M 0 110 Q 70 80 140 100 T 280 40 T 420 70 T 500 20 L 500 120 L 0 120 Z"
                fill="url(#wave-gradient)"
              />

              {/* Stroke line with cyan glow */}
              <path
                d="M 0 110 Q 70 80 140 100 T 280 40 T 420 70 T 500 20"
                fill="none"
                stroke="#35D9FF"
                strokeWidth="3"
                className="drop-shadow-[0_0_8px_#35D9FF]"
              />

              {/* Pulsing points */}
              <circle cx="280" cy="40" r="4" fill="#35D9FF" className="animate-pulse" />
              <circle cx="500" cy="20" r="4" fill="#35D9FF" />
            </svg>

            {/* Days labels */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 px-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
