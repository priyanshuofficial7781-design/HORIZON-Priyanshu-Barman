import React from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { THEME_CONFIGS } from '../../utils/themeConfig';
import { DayZeroMissions } from '../dashboard/DayZeroMissions';
import {
  Flame,
  Award,
  Trophy,
  Target,
  Zap,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

interface ReadinessDashboardProps {
  streakDays: number;
  solvedCount: number;
  totalProblems: number;
  mockInterviewCount: number;
  systemDesignsCount: number;
  onNavigateTab: (tabId: string) => void;
}

export const ReadinessDashboard: React.FC<ReadinessDashboardProps> = ({
  streakDays,
  solvedCount,
  totalProblems,
  mockInterviewCount,
  systemDesignsCount,
  onNavigateTab,
}) => {
  const { currentTheme, starStories } = useHorizon();
  const theme = THEME_CONFIGS[currentTheme] || THEME_CONFIGS['electric-blue'];

  // STRICT 0-START MATH:
  // When all metrics are 0, readinessScore MUST be exactly 0%
  const dsaScore = Math.min(40, (solvedCount / Math.max(totalProblems, 1)) * 40);
  const mockScore = Math.min(30, mockInterviewCount * 10);
  const sysDesignScore = Math.min(20, systemDesignsCount * 5);
  const streakScore = Math.min(10, streakDays * 1);

  const readinessScore = Math.min(
    100,
    Math.round(dsaScore + mockScore + sysDesignScore + streakScore)
  );

  // Dynamic user rating based on actual progress (starts at 1200 Initiate when 0 metrics)
  const userRating = 1200 + solvedCount * 25 + mockInterviewCount * 40 + streakDays * 10;
  const userTier =
    userRating >= 2100
      ? 'Grandmaster'
      : userRating >= 1900
      ? 'Master'
      : userRating >= 1600
      ? 'Expert'
      : userRating >= 1400
      ? 'Specialist'
      : 'Initiate (Day 0)';

  const userRank = solvedCount > 20 ? 1 : solvedCount > 10 ? 3 : solvedCount > 0 ? 14 : 48;

  const leaderboard = [
    {
      rank: userRank,
      name: 'Priyanshu B. (You)',
      handle: '@priyanshu_coder',
      solved: solvedCount,
      rating: userRating,
      tier: userTier,
      isCurrentUser: true,
    },
    { rank: 1, name: 'Aditya Sharma', handle: '@aditya_algo', solved: 48, rating: 2090, tier: 'Master', isCurrentUser: false },
    { rank: 2, name: 'Sneha Patel', handle: '@sneha_swe', solved: 45, rating: 2015, tier: 'Master', isCurrentUser: false },
    { rank: 3, name: 'Rahul Varma', handle: '@rahul_dev', solved: 42, rating: 1980, tier: 'Expert', isCurrentUser: false },
    { rank: 4, name: 'Ananya Gupta', handle: '@ananya_code', solved: 39, rating: 1940, tier: 'Expert', isCurrentUser: false },
    { rank: 5, name: 'Vikram Singh', handle: '@vikram_sde', solved: 36, rating: 1890, tier: 'Specialist', isCurrentUser: false },
  ].sort((a, b) => a.rank - b.rank);

  return (
    <div className="flex flex-col h-full bg-[#050816] text-slate-100 overflow-y-auto p-6 space-y-6 font-sans">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-[#0d162d] via-[#091024] to-[#0d162d] border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2.5 py-0.5 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} text-[10px] font-mono uppercase tracking-widest font-bold`}
            >
              High-Package Career Calibration
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Tier-1 SWE Standard (Starts at 0%)
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Readiness & Contest Leaderboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live job-readiness gauge, algorithmic contest ranking, and multi-pillar interview tracking.
          </p>
        </div>

        {/* Big Streak Flame Box */}
        <div className="px-5 py-3 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/40 flex items-center gap-4 shadow-lg shadow-amber-500/10 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-md">
            <Flame className={`w-7 h-7 fill-current ${streakDays > 0 ? 'animate-bounce' : 'opacity-70'}`} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold">
              Current Streak
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {streakDays} <span className="text-sm font-normal text-slate-400">Days Active</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {streakDays === 0 ? 'Solve 1st problem to ignite' : 'Consistency multiplier active'}
            </div>
          </div>
        </div>
      </div>

      {/* Day 0 Quickstart Missions */}
      <DayZeroMissions onNavigateTab={onNavigateTab} />

      {/* Readiness Gauge & 4 Pillars Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Big Circular Readiness Gauge */}
        <div className="p-6 bg-[#090f22] border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#readinessGrad)"
                strokeWidth="8"
                strokeDasharray={`${(readinessScore / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="readinessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={theme.primaryColor} />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black font-mono text-white">{readinessScore}%</span>
              <span
                className={`text-[10px] uppercase tracking-wider font-mono font-bold ${
                  readinessScore >= 80
                    ? 'text-emerald-400'
                    : readinessScore >= 40
                    ? 'text-cyan-400'
                    : 'text-slate-400'
                }`}
              >
                {readinessScore >= 80 ? 'FAANG Ready' : readinessScore > 0 ? 'Calibrating' : 'Day 0 Baseline'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white">Tier-1 SWE Readiness Score</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Algorithmic mastery (40%), Mock interviews (30%), System design (20%), and Day streak (10%).
            </p>
          </div>
        </div>

        {/* 4 Pillars Progress Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pillar 1: DSA Practice */}
          <div className="p-4 bg-[#090f22] border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
                  <Target className="w-4 h-4 text-cyan-400" />
                  LeetCode & Blind 75
                </span>
                <span className="text-cyan-400 font-bold">
                  {solvedCount} / {totalProblems} Solved
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Weight: 40% of readiness score.
              </p>
            </div>
            <div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (solvedCount / Math.max(totalProblems, 1)) * 100)}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('leetcode')}
                className="text-[11px] text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-mono cursor-pointer"
              >
                <span>Practice Problems in Arena →</span>
              </button>
            </div>
          </div>

          {/* Pillar 2: System Design */}
          <div className="p-4 bg-[#090f22] border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
                  <Layers className="w-4 h-4 text-purple-400" />
                  System Design Blueprints
                </span>
                <span className="text-purple-400 font-bold">
                  {systemDesignsCount} / 4 Mastered
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Weight: 20% of readiness score.
              </p>
            </div>
            <div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                <div
                  className="h-full bg-purple-400 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (systemDesignsCount / 4) * 100)}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('systemdesign')}
                className="text-[11px] text-purple-300 hover:text-purple-200 flex items-center gap-1 font-mono cursor-pointer"
              >
                <span>Open Architecture Studio →</span>
              </button>
            </div>
          </div>

          {/* Pillar 3: Mock Interviews */}
          <div className="p-4 bg-[#090f22] border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
                  <Award className="w-4 h-4 text-amber-400" />
                  Mock Technical Rounds
                </span>
                <span className="text-amber-400 font-bold">
                  {mockInterviewCount} / 5 Completed
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Weight: 30% of readiness score.
              </p>
            </div>
            <div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (mockInterviewCount / 5) * 100)}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('mockinterview')}
                className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-mono cursor-pointer"
              >
                <span>Launch Mock Interview →</span>
              </button>
            </div>
          </div>

          {/* Pillar 4: STAR Stories & Offers */}
          <div className="p-4 bg-[#090f22] border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  STAR Story Bank
                </span>
                <span className="text-emerald-400 font-bold">
                  {starStories.length} Stories Saved
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Amazon Principles, Googliness & Meta rubric stories.
              </p>
            </div>
            <div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (starStories.length / 5) * 100)}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('starstories')}
                className="text-[11px] text-emerald-300 hover:text-emerald-200 flex items-center gap-1 font-mono cursor-pointer"
              >
                <span>Draft STAR Stories →</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Algorithmic Contest Leaderboard */}
      <div className="p-6 bg-[#090f22] border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Global Tier-1 Student Contest Leaderboard</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time Ranking Based on Solved DSA & Ranks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Solved</th>
                <th className="py-2.5 px-3">Contest Rating</th>
                <th className="py-2.5 px-3">Division Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {leaderboard.map((row) => (
                <tr
                  key={row.handle}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    row.isCurrentUser
                      ? 'bg-blue-950/30 text-blue-300 font-semibold border-l-2 border-blue-500'
                      : 'text-slate-300'
                  }`}
                >
                  <td className="py-3 px-3">
                    {row.rank === 1 ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500 text-amber-300 font-bold">
                        #1
                      </span>
                    ) : (
                      `#${row.rank}`
                    )}
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <div className="font-semibold text-slate-200 flex items-center gap-2">
                      <span>{row.name}</span>
                      {row.isCurrentUser && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">{row.handle}</div>
                  </td>
                  <td className="py-3 px-3">{row.solved} Problems</td>
                  <td className="py-3 px-3 text-cyan-400 font-bold">{row.rating}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300">
                      {row.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
