import React, { useState } from 'react';
import { COMPANY_TRACKS } from '../../data/companyTracksData';
import { CompanyTrack } from '../../types/career';
import { LeetCodeProblem } from '../../types/leetcode';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Code2,
  Workflow,
  Sparkles,
  Shield,
  Layers,
  Flame,
} from 'lucide-react';

import { useHorizon } from '../../context/HorizonContext';
import { THEME_CONFIGS } from '../../utils/themeConfig';

interface CompanyTracksProps {
  onOpenProblem: (problemId: string) => void;
}

export const CompanyTracks: React.FC<CompanyTracksProps> = ({ onOpenProblem }) => {
  const { solvedLeetCodeIds, currentTheme } = useHorizon();
  const theme = THEME_CONFIGS[currentTheme] || THEME_CONFIGS['electric-blue'];
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(COMPANY_TRACKS[0].id);

  const activeTrack =
    COMPANY_TRACKS.find((t) => t.id === selectedCompanyId) || COMPANY_TRACKS[0];

  const solvedInActive = activeTrack.coreProblems.filter((p) =>
    solvedLeetCodeIds.includes(p)
  ).length;
  const activePercent = Math.round(
    (solvedInActive / Math.max(activeTrack.coreProblems.length, 1)) * 100
  );

  return (
    <div className="flex flex-col h-full bg-[#050816] text-slate-100 overflow-y-auto p-6 space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-[#0d162d] via-[#091024] to-[#0d162d] border border-slate-800 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-[10px] font-mono text-cyan-300 uppercase tracking-widest font-bold">
                Targeted Company Playbooks
              </span>
              <span className="text-xs text-slate-400 font-mono">FAANG & Tier-1 Hiring Bars</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Company Preparation Tracks
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Curated roadmaps tailored to Google, Meta, Amazon, Microsoft, and Uber's exact interview patterns.
            </p>
          </div>
        </div>

        {/* Company Tabs */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {COMPANY_TRACKS.map((track) => {
            const trackSolved = track.coreProblems.filter((p) =>
              solvedLeetCodeIds.includes(p)
            ).length;
            const pct = Math.round((trackSolved / Math.max(track.coreProblems.length, 1)) * 100);
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => setSelectedCompanyId(track.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                  selectedCompanyId === track.id
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-sm'
                    : 'bg-[#080d1a] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: track.logoColor }}
                />
                <span>{track.company}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-slate-400 border border-slate-800">
                  {pct}% (Unlocked)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Track Detail Container */}
      <div className="space-y-6">
        {/* Track Title and Tagline */}
        <div className="p-5 bg-[#090f22] border border-slate-800 rounded-2xl space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{activeTrack.company} Specialization</h2>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono">
                {activePercent}% Mastered ({solvedInActive}/{activeTrack.coreProblems.length} Solved)
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono">
                Bar Difficulty: {activeTrack.difficultyRating}
              </span>
            </div>
          </div>
          <p className="text-xs text-cyan-300 font-mono italic">{activeTrack.focusTagline}</p>
        </div>

        {/* Two Columns: Algorithmic Focus + Interview Rounds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Algorithmic Patterns */}
          <div className="p-5 bg-[#090f22] border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <Code2 className="w-4 h-4" />
              <h3>Must-Master Algorithmic Pillars</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {activeTrack.keyAlgorithmicFocus.map((focus, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{focus}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Typical Rounds Sequence */}
          <div className="p-5 bg-[#090f22] border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <Workflow className="w-4 h-4" />
              <h3>Official Onsite Interview Stages</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              {activeTrack.interviewFormat.map((round, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-[#070c18] border border-slate-800/80 rounded-xl flex items-center gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span>{round}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Problems to Practice Directly */}
        <div className="p-5 bg-[#090f22] border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Flame className="w-4 h-4" />
              <h3>Essential Tagged Problems for {activeTrack.company}</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Click to solve immediately in the LeetCode editor
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {activeTrack.coreProblems.map((probId) => {
              const isSolved = solvedLeetCodeIds.includes(probId);
              return (
                <button
                  key={probId}
                  type="button"
                  onClick={() => onOpenProblem(probId)}
                  className={`p-3 bg-[#070c18] border rounded-xl text-left transition-all group flex items-center justify-between cursor-pointer ${
                    isSolved
                      ? 'border-emerald-500/50 bg-emerald-950/10'
                      : 'border-slate-800 hover:border-cyan-500/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      <span className={`font-semibold text-xs transition-colors ${
                        isSolved ? 'text-emerald-300' : 'text-slate-200 group-hover:text-cyan-300'
                      }`}>
                        {probId.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {isSolved ? 'Solved ✓' : 'Solve in Editor →'}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>

        {/* System Design & Cultural Expectation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-[#090f22] border border-slate-800 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <Layers className="w-4 h-4" />
              <h4>System Design Expectations</h4>
            </div>
            <p className="text-slate-300 leading-relaxed">{activeTrack.systemDesignExpectations}</p>
          </div>

          <div className="p-5 bg-[#090f22] border border-slate-800 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <Shield className="w-4 h-4" />
              <h4>Behavioral & Cultural Rubric</h4>
            </div>
            <p className="text-slate-300 leading-relaxed">{activeTrack.behavioralStyle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
