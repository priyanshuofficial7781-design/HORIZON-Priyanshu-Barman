import React from 'react';
import { useHorizon } from '../../context/HorizonContext';
import {
  calculateWeeklyActivityBreakdown,
  calculateStudyStreak,
} from '../../utils/plannerLogic';
import {
  CheckCircle2,
  Circle,
  Flame,
  ChevronRight,
  Layers,
  Youtube,
  Clock,
  Sparkles,
  ShieldCheck,
  Award,
  Play,
  Target,
} from 'lucide-react';
import { DayZeroMissions } from '../dashboard/DayZeroMissions';

export const HomeDashboard: React.FC = () => {
  const {
    profile,
    tasks,
    toggleTaskCompleted,
    setActiveTab,
    milestones,
    focusSessions,
    placementTracker,
    cyberModules,
    projects,
  } = useHorizon();

  const weeklyActivity = calculateWeeklyActivityBreakdown(tasks);
  const currentStreak = calculateStudyStreak(tasks);

  // Today's tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter((t) => t.date === todayStr);

  // Next milestone
  const nextMilestone = milestones.find((m) => m.status === 'in_progress') || milestones[0];

  const { solvedLeetCodeIds } = useHorizon();

  const totalFocusHours =
    Math.round(
      (focusSessions.reduce((acc, s) => acc + (s.completed ? s.durationMinutes : 0), 0) / 60) * 10
    ) / 10;
  const dsaSolved = Math.max(placementTracker.dsaSolved || 0, solvedLeetCodeIds.length);
  const dsaTarget = placementTracker.dsaTarget || 200;
  const completedLabs = cyberModules.reduce(
    (acc, m) => acc + m.labs.filter((l) => l.completed).length,
    0
  );
  const totalLabs = cyberModules.reduce((acc, m) => acc + m.labs.length, 0) || 18;

  const maxWeeklyHours = Math.max(...weeklyActivity.map((w) => w.hours), 4);

  return (
    <div className="p-5 lg:p-7 max-w-7xl mx-auto space-y-6 pb-24 lg:pb-12 animate-in fade-in duration-200">
      {/* 1. HERO BANNER WITH MOUNTAIN ARTWORK */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B1228] via-[#111A35] to-[#161F3F] border border-[#8B5CFF]/20 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#8B5CFF]/20 text-[#35D9FF] border border-[#8B5CFF]/30">
              Semester {profile.semester} · Deep Work Station
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-['Outfit'] text-white tracking-tight flex items-center gap-2">
            <span>Welcome, {profile.name}</span>
            <span className="text-2xl">👑</span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-300">
            Uninterrupted focus and algorithmic mastery. Your telemetry is online.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('focus')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-white text-xs font-bold shadow-lg shadow-[#8B5CFF]/30 hover:opacity-95 transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Enter 120-Min Focus Arena</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('trackers')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#35D9FF]" />
              <span>Inspect 3D Trackers</span>
            </button>
          </div>
        </div>

        {/* Embedded Sunset Planet Mountain Artwork */}
        <div className="relative w-full md:w-72 h-32 rounded-2xl overflow-hidden border border-[#8B5CFF]/25 shadow-lg shrink-0">
          <img
            src="/assets/horizon/dashboard_landscape.png"
            alt="Cosmic Sunset Mountains"
            className="w-full h-full object-cover filter brightness-[0.95]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1228]/80 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* 2. CORE TELEMETRY STRIP (3D METRIC CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Focus Hours */}
        <div
          onClick={() => setActiveTab('trackers')}
          className="p-4 rounded-2xl bg-[#0B1228] border border-[#8B5CFF]/20 hover:border-[#8B5CFF]/40 transition-all cursor-pointer shadow-md flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Focus Invested
            </span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              {totalFocusHours}h
            </div>
            <span className="text-[10px] text-amber-400 font-mono">Binaural Logged</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5 fill-current" />
          </div>
        </div>

        {/* DSA Mastery */}
        <div
          onClick={() => setActiveTab('placement')}
          className="p-4 rounded-2xl bg-[#0B1228] border border-[#8B5CFF]/20 hover:border-[#8B5CFF]/40 transition-all cursor-pointer shadow-md flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              DSA Solved
            </span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              {dsaSolved} / {dsaTarget}
            </div>
            <span className="text-[10px] text-[#8B5CFF] font-mono">LeetCode & Striver</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#8B5CFF]/10 border border-[#8B5CFF]/20 flex items-center justify-center text-[#8B5CFF]">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Cybersecurity Labs */}
        <div
          onClick={() => setActiveTab('cybersecurity')}
          className="p-4 rounded-2xl bg-[#0B1228] border border-[#8B5CFF]/20 hover:border-[#8B5CFF]/40 transition-all cursor-pointer shadow-md flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Cybersecurity
            </span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              {completedLabs} / {totalLabs}
            </div>
            <span className="text-[10px] text-[#35D9FF] font-mono">Terminal Labs</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#35D9FF]/10 border border-[#35D9FF]/20 flex items-center justify-center text-[#35D9FF]">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Active Projects */}
        <div
          onClick={() => setActiveTab('projects')}
          className="p-4 rounded-2xl bg-[#0B1228] border border-[#8B5CFF]/20 hover:border-[#8B5CFF]/40 transition-all cursor-pointer shadow-md flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Projects Active
            </span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              {projects.length} Repos
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Full Stack & AI</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2.5 DAY 0 ONBOARDING QUICKSTART MISSIONS */}
      <DayZeroMissions onNavigateTab={setActiveTab} />

      {/* 3. CORE 3-PANEL ROW: FOCUS ARENA HIGHLIGHT | YOUTUBE CINEMA | TODAY'S SCHEDULE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: 120-Minute Focus Arena Launcher */}
        <div className="p-6 rounded-3xl bg-[#0B1228] border border-[#8B5CFF]/20 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CFF]/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white font-['Outfit']">120-Min Focus Arena</h2>
              </div>
              <span className="text-[10px] font-mono text-[#35D9FF] bg-[#35D9FF]/10 px-2 py-0.5 rounded border border-[#35D9FF]/20">
                Scientific Deep Work
              </span>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                2-hour uninterrupted block calibrated for complex algorithm proofs, system programming, and university lecture absorption.
              </p>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Audio Mode:</span>
                <span className="text-[#35D9FF]">Binaural Theta (6Hz)</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('focus')}
            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-white text-xs font-bold text-center hover:opacity-95 transition-opacity cursor-pointer shadow-md"
          >
            Start 120-Min Block Now →
          </button>
        </div>

        {/* Panel 2: YouTube Lecture Cinema Card */}
        <div className="p-6 rounded-3xl bg-[#0B1228] border border-[#8B5CFF]/20 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-400" />
                <h2 className="text-sm font-bold text-white font-['Outfit']">YouTube Cinema</h2>
              </div>
              <span className="text-[10px] font-mono text-red-300 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                Ad-Minimized
              </span>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                Paste any YouTube URL or browse curated Striver, CS50, and freeCodeCamp computer science masterclasses with persistent notes.
              </p>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">URL Input Bar:</span>
                <span className="text-emerald-400">Direct Paste Ready</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className="w-full mt-2 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold text-center transition-colors cursor-pointer"
          >
            Open Lecture Cinema →
          </button>
        </div>

        {/* Panel 3: Today's Tasks & Notification Buffer */}
        <div className="p-6 rounded-3xl bg-[#0B1228] border border-[#8B5CFF]/20 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white font-['Outfit']">Today's Study Plan</h2>
              <button
                type="button"
                onClick={() => setActiveTab('planner')}
                className="text-[11px] text-[#35D9FF] hover:underline cursor-pointer font-mono"
              >
                Schedule ({todaysTasks.length})
              </button>
            </div>

            <div className="py-2 space-y-2">
              {todaysTasks.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  No sessions scheduled for today
                </p>
              ) : (
                todaysTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTaskCompleted(task.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskCompleted(task.id);
                        }}
                        className="shrink-0 text-slate-400 hover:text-[#35D9FF]"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-semibold truncate ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-200'
                          }`}
                        >
                          {task.title}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {task.durationMinutes}m · {task.time} (10m pre-alert active)
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('planner')}
            className="w-full mt-2 py-2.5 rounded-xl bg-[#111A35] hover:bg-[#152040] border border-slate-700 text-[11px] font-semibold text-slate-300 text-center transition-colors cursor-pointer"
          >
            Manage Timetable & Alerts
          </button>
        </div>
      </div>

      {/* 4. WEEKLY ACTIVITY GRAPH & MILESTONE BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <div className="p-6 rounded-3xl bg-[#0B1228] border border-[#8B5CFF]/20 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white font-['Outfit']">Weekly Focus Hours</h2>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{currentStreak} Day Momentum</span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-2 h-28 my-auto pt-4 px-2">
            {weeklyActivity.map((day, idx) => {
              const heightPercent = Math.max((day.hours / maxWeeklyHours) * 100, 12);
              const isToday = idx === weeklyActivity.length - 1;
              return (
                <div
                  key={day.dateStr}
                  className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                >
                  <div
                    className="w-full rounded-t-md transition-all duration-300"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: isToday ? '#35D9FF' : '#8B5CFF',
                      opacity: isToday ? 1 : 0.6,
                    }}
                  />
                  <span className="text-[9px] font-mono text-slate-400">{day.dayName}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/80">
            <span>Daily Goal: 4-6 hrs</span>
            <span className="text-[#35D9FF]">Consistent</span>
          </div>
        </div>

        {/* Current Roadmap Target */}
        <div className="p-6 rounded-3xl bg-[#0B1228] border border-[#8B5CFF]/20 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white font-['Outfit']">Active Milestone Target</h2>
              <span className="text-[10px] font-mono text-[#35D9FF]">Three-Year Plan</span>
            </div>

            <div className="py-4 space-y-2">
              <div className="text-base font-bold text-white">
                {nextMilestone?.title || 'Advanced Data Structures & Algorithms'}
              </div>
              <p className="text-xs text-slate-400">
                Category: {nextMilestone?.category || 'Algorithms'} · Semester {profile.semester}
              </p>

              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-3">
                <div
                  className="h-full bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] rounded-full"
                  style={{ width: `${nextMilestone?.progress || 35}%` }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer text-center"
          >
            Explore 3-Year Curriculum Roadmap →
          </button>
        </div>
      </div>
    </div>
  );
};
