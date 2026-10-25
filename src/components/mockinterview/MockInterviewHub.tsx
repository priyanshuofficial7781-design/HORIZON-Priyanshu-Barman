import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { THEME_CONFIGS } from '../../utils/themeConfig';
import { LeetCodeProblem } from '../../types/leetcode';
import { ConversationalInterviewResult } from '../../types/mockInterview';
import { TimedCodingRound } from './TimedCodingRound';
import { ConversationalRound } from './ConversationalRound';
import {
  Clock,
  MessageSquare,
  Award,
  Shield,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface MockInterviewHubProps {
  problems: LeetCodeProblem[];
  onAddInterviewRecord?: (score: number, type: string) => void;
}

export const MockInterviewHub: React.FC<MockInterviewHubProps> = ({
  problems,
  onAddInterviewRecord,
}) => {
  const { mockSessions, addMockSessionRecord, currentTheme } = useHorizon();
  const theme = THEME_CONFIGS[currentTheme] || THEME_CONFIGS['electric-blue'];

  const [activeSession, setActiveSession] = useState<'none' | 'timed' | 'conversational'>('none');
  const [selectedProblem, setSelectedProblem] = useState<LeetCodeProblem>(problems[0]);

  const averageScore =
    mockSessions.length > 0
      ? Math.round(
          mockSessions.reduce((acc, curr) => acc + curr.score, 0) / mockSessions.length
        )
      : 0;

  const handleStartTimedRound = () => {
    // Pick random medium/hard problem
    const pool = problems.filter((p) => p.difficulty !== 'Easy');
    const picked = pool[Math.floor(Math.random() * pool.length)] || problems[0];
    setSelectedProblem(picked);
    setActiveSession('timed');
  };

  const handleFinishTimed = (result: {
    problemId: string;
    passed: boolean;
    score: number;
    timeSpentSeconds: number;
  }) => {
    addMockSessionRecord(
      selectedProblem.title,
      'Timed 45-Min Assessment',
      result.score,
      result.passed
    );
    if (onAddInterviewRecord) {
      onAddInterviewRecord(result.score, 'timed_coding');
    }
    setActiveSession('none');
  };

  const handleFinishConversational = (result: ConversationalInterviewResult) => {
    const avgScore = Math.round(
      (result.rubricScores.reduce((acc, curr) => acc + curr.score, 0) /
        (result.rubricScores.length * 5)) *
        100
    );

    addMockSessionRecord(
      result.topic,
      `Conversational (${result.interviewerPersona})`,
      avgScore,
      result.overallDecision === 'Hire' || result.overallDecision === 'Strong Hire'
    );
    if (onAddInterviewRecord) {
      onAddInterviewRecord(avgScore, 'conversational');
    }
    setActiveSession('none');
  };

  if (activeSession === 'timed') {
    return (
      <TimedCodingRound
        problem={selectedProblem}
        onFinishRound={handleFinishTimed}
        onCancel={() => setActiveSession('none')}
      />
    );
  }

  if (activeSession === 'conversational') {
    return (
      <ConversationalRound
        onFinish={handleFinishConversational}
        onCancel={() => setActiveSession('none')}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#050816] text-slate-100 overflow-y-auto p-6 space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-[#0d162d] via-[#091024] to-[#0d162d] border border-slate-800 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2.5 py-0.5 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} text-[10px] font-mono uppercase tracking-widest font-bold`}
              >
                FAANG Simulation Arena
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Bar Raiser & Staff Level Calibration
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Mock Interview Simulator
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Test your algorithmic speed under realistic 45-minute countdown constraints or practice verbal trade-offs with AI interviewer personas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3 shadow-inner">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">Average Score</div>
                <div className="text-sm font-bold text-white font-mono">
                  {mockSessions.length > 0 ? `${averageScore}%` : '0% (Day 0 Baseline)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Interview Modes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode 1: Timed Coding Assessment */}
        <div className="p-6 bg-[#0a0f20] border border-slate-800 hover:border-cyan-500/40 rounded-2xl transition-all space-y-4 flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1.5px] flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-[#070b16] rounded-[10px] flex items-center justify-center">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">45-Minute Timed Technical Round</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real interview conditions: randomized Blind 75/NeetCode 150 problem, strict live countdown clock, scratchpad whiteboard, and automated hidden test suites.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">•</span> Strict 45-minute countdown timer
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">•</span> Multi-language editor (Python 3, C++, Java)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">•</span> Algorithmic edge cases and runtime metrics
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleStartTimedRound}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Timed Assessment</span>
          </button>
        </div>

        {/* Mode 2: Conversational AI Interview */}
        <div className="p-6 bg-[#0a0f20] border border-slate-800 hover:border-purple-500/40 rounded-2xl transition-all space-y-4 flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-[1.5px] flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-[#070b16] rounded-[10px] flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">Conversational Technical Round</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-turn interactive AI interviewer simulating FAANG Bar Raisers. Defend your design decisions, answer follow-up edge cases, and get scored on official rubrics.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
              <li className="flex items-center gap-2">
                <span className="text-purple-400">•</span> Personas: FAANG Bar Raiser & Staff Engineer
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">•</span> Probing questions on CAP theorem & trade-offs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">•</span> Official Hire/No-Hire verdict & feedback report
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setActiveSession('conversational')}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r ${theme.gradient} hover:opacity-95 text-white font-bold text-xs shadow-lg transition-all cursor-pointer`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Conversational Interview</span>
          </button>
        </div>
      </div>

      {/* Completed Sessions Log */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Completed Interview History & Calibration ({mockSessions.length})
        </h3>
        {mockSessions.length === 0 ? (
          <div className="p-8 bg-[#090f22] border border-slate-800 rounded-xl text-center space-y-2">
            <p className="text-xs text-slate-400">
              No mock interviews completed yet (Day 0). Launch either the 45-Minute Timed Assessment or the Conversational AI round above to record your first score.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {mockSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 bg-[#090f22] border border-slate-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 ${
                      session.passed ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  />
                  <div>
                    <div className="font-semibold text-slate-200">{session.title}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{session.type}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono font-bold text-cyan-400">{session.score}% Score</div>
                    <div className="text-[10px] text-slate-500 font-mono">{session.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
