import React from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { THEME_CONFIGS } from '../../utils/themeConfig';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Code2,
  Layers,
  UserCheck,
  Award,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface DayZeroMissionsProps {
  onNavigateTab?: (tabId: string) => void;
}

export const DayZeroMissions: React.FC<DayZeroMissionsProps> = ({ onNavigateTab }) => {
  const {
    solvedLeetCodeIds,
    mockSessions,
    completedSystemDesignIds,
    starStories,
    setActiveTab,
    currentTheme,
  } = useHorizon();

  const handleNav = (tabId: string) => {
    if (onNavigateTab) {
      onNavigateTab(tabId);
    } else {
      setActiveTab(tabId);
    }
  };

  const theme = THEME_CONFIGS[currentTheme] || THEME_CONFIGS['electric-blue'];

  const missions = [
    {
      id: 'm1',
      title: 'Solve Your 1st Algorithmic Problem',
      desc: 'Tackle Two Sum or any Blind 75 / NeetCode 150 problem in the LeetCode Arena with the Socratic AI tutor.',
      tab: 'leetcode',
      completed: solvedLeetCodeIds.length > 0,
      icon: Code2,
      metricLabel: `${solvedLeetCodeIds.length}/1 Solved`,
    },
    {
      id: 'm2',
      title: 'Conduct Your 1st Mock Interview',
      desc: 'Calibrate under timed 45-minute countdown conditions or conversational AI Bar Raiser voice simulation.',
      tab: 'mockinterview',
      completed: mockSessions.length > 0,
      icon: UserCheck,
      metricLabel: `${mockSessions.length}/1 Completed`,
    },
    {
      id: 'm3',
      title: 'Inspect 1st System Architecture Blueprint',
      desc: 'Explore engineering blueprints with glowing connectors, capacity estimations, and distributed trade-offs.',
      tab: 'systemdesign',
      completed: completedSystemDesignIds.length > 0,
      icon: Layers,
      metricLabel: `${completedSystemDesignIds.length}/1 Mastered`,
    },
    {
      id: 'm4',
      title: 'Draft Your 1st STAR Behavioral Story',
      desc: 'Structure personal technical impact under Amazon, Google, or Meta principles with instant AI feedback.',
      tab: 'starstories',
      completed: starStories.length > 0,
      icon: Award,
      metricLabel: `${starStories.length}/1 Documented`,
    },
  ];

  const completedCount = missions.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / missions.length) * 100);

  return (
    <div className="p-6 bg-gradient-to-br from-[#0c142c] via-[#091024] to-[#070b18] border border-slate-800 rounded-2xl shadow-xl space-y-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2.5 py-0.5 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5`}
            >
              <Zap className="w-3 h-3" />
              Day 0 Baseline Quickstart
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {completedCount === 0 ? 'Initiate Level (0 Solved)' : `${completedCount}/4 Completed`}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Placement Readiness Onboarding Missions
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Every career metric starts at 0. Complete these 4 foundational milestones to calibrate your readiness gauge and unlock top-tier candidate status.
          </p>
        </div>

        {/* Circular / pill status badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Overall Progress
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {progressPercent}%
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-1">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="transition-all duration-700 ease-out"
                stroke={theme.primaryColor}
                strokeWidth="3.5"
                strokeDasharray={`${progressPercent}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${theme.gradient} transition-all duration-500 rounded-full`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 4 Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((mission, idx) => {
          const Icon = mission.icon;
          return (
            <div
              key={mission.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                mission.completed
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-[#080d1e] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      mission.completed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        Mission #{idx + 1}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          mission.completed
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {mission.metricLabel}
                      </span>
                    </div>
                    <h3 className="font-semibold text-xs text-slate-100 mt-0.5">
                      {mission.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {mission.desc}
                    </p>
                  </div>
                </div>

                {mission.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                )}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => handleNav(mission.tab)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                    mission.completed
                      ? 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                      : `bg-gradient-to-r ${theme.gradient} text-white shadow-sm hover:opacity-95`
                  }`}
                >
                  <span>{mission.completed ? 'Review in Studio →' : 'Start Mission →'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
