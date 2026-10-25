import React, { useState, useEffect } from 'react';
import { LeetCodeProblem, ProgrammingLanguage, CodeEvaluationResult } from '../../types/leetcode';
import { CodeEditor } from '../leetcode/CodeEditor';
import { evaluateCodeSubmission } from '../../lib/testRunner';
import {
  Clock,
  Play,
  Send,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Shield,
  Zap,
} from 'lucide-react';

interface TimedCodingRoundProps {
  problem: LeetCodeProblem;
  onFinishRound: (result: {
    problemId: string;
    passed: boolean;
    score: number;
    timeSpentSeconds: number;
    evaluation: CodeEvaluationResult;
  }) => void;
  onCancel: () => void;
}

export const TimedCodingRound: React.FC<TimedCodingRoundProps> = ({
  problem,
  onFinishRound,
  onCancel,
}) => {
  const TOTAL_TIME = 45 * 60; // 45 minutes
  const [secondsRemaining, setSecondsRemaining] = useState(TOTAL_TIME);
  const [language, setLanguage] = useState<ProgrammingLanguage>('python');
  const [code, setCode] = useState<string>(problem.starterCode[language] || '');
  const [scratchpad, setScratchpad] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'code' | 'scratchpad'>('code');
  const [evaluation, setEvaluation] = useState<CodeEvaluationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (newLang: ProgrammingLanguage) => {
    setLanguage(newLang);
    setCode(problem.starterCode[newLang] || '');
  };

  const handleSubmitAssessment = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const evalResult = evaluateCodeSubmission(problem, language, code);
      setEvaluation(evalResult);
      setIsSubmitting(false);

      const passed = evalResult.status === 'Accepted';
      const timeSpent = TOTAL_TIME - secondsRemaining;
      const score = passed ? Math.max(70, Math.round(100 - (timeSpent / TOTAL_TIME) * 30)) : 30;

      onFinishRound({
        problemId: problem.id,
        passed,
        score,
        timeSpentSeconds: timeSpent,
        evaluation: evalResult,
      });
    }, 700);
  };

  return (
    <div className="flex flex-col h-full bg-[#050816] text-slate-100 overflow-hidden font-sans">
      {/* Top Countdown Bar */}
      <div className="px-6 py-3 bg-[#0a0f22] border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-400 text-xs font-mono font-bold animate-pulse">
            LIVE ASSESSMENT
          </span>
          <span className="text-sm font-semibold text-slate-200">
            {problem.title} ({problem.difficulty})
          </span>
        </div>

        {/* Big Timer */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border font-mono text-sm font-bold ${
              secondsRemaining < 300
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-900 border-slate-700 text-cyan-300'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={handleSubmitAssessment}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish & Submit</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Exit Round
          </button>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left: Problem & Constraints */}
        <div className="w-full lg:w-5/12 p-6 bg-[#070b18] border-r border-slate-800/80 overflow-y-auto space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">{problem.title}</h2>
            <div className="text-xs text-slate-400 font-mono">
              Target Complexity: {problem.timeComplexityOptimal} | Space: {problem.spaceComplexityOptimal}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
              {problem.description}
            </p>
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Examples
            </h4>
            {problem.examples.map((ex, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#0a0f22] border border-slate-800 rounded-lg text-xs font-mono space-y-1"
              >
                <div>Input: {ex.input}</div>
                <div className="text-emerald-400">Output: {ex.output}</div>
              </div>
            ))}
          </div>

          {/* Interviewer Note */}
          <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-lg text-xs text-indigo-300 space-y-1 font-sans">
            <div className="font-semibold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Assessment Guidance:</span>
            </div>
            <p className="text-slate-400">
              Communicate your approach, check for empty inputs or edge cases, and keep an eye on optimal Big-O complexity.
            </p>
          </div>
        </div>

        {/* Right: Code & Scratchpad */}
        <div className="w-full lg:w-7/12 flex flex-col bg-[#050816] min-h-0">
          <div className="px-4 py-2 bg-[#090f22] border-b border-slate-800 flex items-center justify-between text-xs">
            {/* Tab switch */}
            <div className="flex items-center gap-1 bg-[#060a16] p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'code' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                Code Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('scratchpad')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'scratchpad'
                    ? 'bg-purple-500/20 text-purple-300 font-bold'
                    : 'text-slate-400'
                }`}
              >
                Scratchpad Notes
              </button>
            </div>

            {/* Language toggle */}
            <div className="flex bg-[#060a16] p-0.5 rounded-lg border border-slate-800 font-mono text-xs">
              {(['python', 'cpp', 'java'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => handleLanguageChange(l)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    language === l ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500'
                  }`}
                >
                  {l === 'python' ? 'Python' : l === 'cpp' ? 'C++' : 'Java'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-4 min-h-0">
            {activeTab === 'code' ? (
              <CodeEditor
                language={language}
                code={code}
                onChange={setCode}
                onReset={() => setCode(problem.starterCode[language] || '')}
              />
            ) : (
              <textarea
                value={scratchpad}
                onChange={(e) => setScratchpad(e.target.value)}
                placeholder="// Brainstorm algorithmic invariants, dry run states, and edge cases here..."
                className="w-full h-full p-4 bg-[#080d1a] border border-slate-800 rounded-xl text-slate-200 font-mono text-xs outline-none resize-none"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
