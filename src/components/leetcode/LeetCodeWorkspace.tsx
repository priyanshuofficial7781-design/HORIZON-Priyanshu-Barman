import React, { useState, useEffect } from 'react';
import { LeetCodeProblem, ProgrammingLanguage, CodeEvaluationResult } from '../../types/leetcode';
import { CodeEditor } from './CodeEditor';
import { TestResultsPanel } from './TestResultsPanel';
import { SocraticTutorDrawer } from './SocraticTutorDrawer';
import { evaluateCodeSubmission } from '../../lib/testRunner';
import {
  ArrowLeft,
  Play,
  Send,
  Sparkles,
  RotateCcw,
  BookOpen,
  Terminal,
  Cpu,
  Zap,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface LeetCodeWorkspaceProps {
  problem: LeetCodeProblem;
  allProblems: LeetCodeProblem[];
  onBackToCatalog: () => void;
  onProblemSolved: (problemId: string) => void;
  isSolved: boolean;
}

export const LeetCodeWorkspace: React.FC<LeetCodeWorkspaceProps> = ({
  problem,
  allProblems,
  onBackToCatalog,
  onProblemSolved,
  isSolved,
}) => {
  const [language, setLanguage] = useState<ProgrammingLanguage>('python');
  const [code, setCode] = useState<string>(problem.starterCode[language] || '');
  const [evaluation, setEvaluation] = useState<CodeEvaluationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [socraticOpen, setSocraticOpen] = useState(false);

  // When problem or language changes, load appropriate boilerplate
  useEffect(() => {
    setCode(problem.starterCode[language] || '');
    setEvaluation(null);
  }, [problem.id, language]);

  const handleLanguageChange = (newLang: ProgrammingLanguage) => {
    setLanguage(newLang);
    setCode(problem.starterCode[newLang] || '');
  };

  const handleResetCode = () => {
    setCode(problem.starterCode[language] || '');
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = evaluateCodeSubmission(problem, language, code);
      setEvaluation(res);
      setIsRunning(false);
    }, 450);
  };

  const handleSubmit = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = evaluateCodeSubmission(problem, language, code);
      setEvaluation(res);
      setIsRunning(false);
      if (res.status === 'Accepted') {
        onProblemSolved(problem.id);
      }
    }, 600);
  };

  // Find next/prev problem for easy carousel navigation
  const currentIndex = allProblems.findIndex((p) => p.id === problem.id);
  const prevProblem = currentIndex > 0 ? allProblems[currentIndex - 1] : null;
  const nextProblem = currentIndex < allProblems.length - 1 ? allProblems[currentIndex + 1] : null;

  return (
    <div className="flex flex-col h-full bg-[#050816] text-slate-100 overflow-hidden font-sans">
      {/* Socratic AI Tutor Drawer */}
      <SocraticTutorDrawer
        isOpen={socraticOpen}
        onClose={() => setSocraticOpen(false)}
        problem={problem}
        userCode={code}
        language={language}
      />

      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#090f20] border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Problem List</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800" />

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400">#{problem.number}</span>
            <span className="font-semibold text-sm text-slate-200">{problem.title}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                  : 'bg-rose-950 text-rose-400 border border-rose-800/40'
              }`}
            >
              {problem.difficulty}
            </span>
            {isSolved && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Solved
              </span>
            )}
          </div>
        </div>

        {/* Center/Right Action Bar */}
        <div className="flex items-center gap-2.5">
          {/* Socratic AI Tutor Trigger */}
          <button
            type="button"
            onClick={() => setSocraticOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-medium transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Socratic AI Coach</span>
          </button>

          {/* Language Switcher */}
          <div className="flex bg-[#070b16] p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
            {(['python', 'cpp', 'java'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => handleLanguageChange(l)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === l
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {l === 'python' ? 'Python 3' : l === 'cpp' ? 'C++' : 'Java'}
              </button>
            ))}
          </div>

          {/* Run Code */}
          <button
            type="button"
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Code</span>
          </button>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split View */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* LEFT COLUMN: Problem Description, Examples & Constraints */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-800/80 bg-[#070b18] overflow-y-auto p-6 space-y-6">
          {/* Header metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {problem.sheets.map((sheet) => (
                <span
                  key={sheet}
                  className="px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-[10px] font-mono"
                >
                  {sheet}
                </span>
              ))}
              {problem.companyTags.map((co) => (
                <span
                  key={co}
                  className="px-2 py-0.5 rounded-full bg-slate-800/60 border border-slate-700 text-slate-300 text-[10px] font-mono"
                >
                  {co}
                </span>
              ))}
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">{problem.title}</h2>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 font-mono">
              <span>Category: {problem.category}</span>
              <span>•</span>
              <span>Optimal Time: {problem.timeComplexityOptimal}</span>
              <span>•</span>
              <span>Optimal Space: {problem.spaceComplexityOptimal}</span>
            </div>
          </div>

          {/* Description Text */}
          <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-3 font-sans">
            {problem.description}
          </div>

          {/* Examples */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Examples
            </h4>
            {problem.examples.map((ex, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#090f22] border border-slate-800/80 rounded-xl space-y-2 text-xs font-mono"
              >
                <div className="text-slate-400 font-sans font-semibold">Example {idx + 1}:</div>
                <div>
                  <span className="text-slate-500">Input: </span>
                  <span className="text-slate-200">{ex.input}</span>
                </div>
                <div>
                  <span className="text-slate-500">Output: </span>
                  <span className="text-emerald-300">{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div>
                    <span className="text-slate-500">Explanation: </span>
                    <span className="text-slate-400">{ex.explanation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Constraints
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 font-mono bg-[#090f22] p-3.5 border border-slate-800/80 rounded-xl">
              {problem.constraints.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Code Editor + Test Results Panel */}
        <div className="w-full lg:w-1/2 flex flex-col bg-[#050816] min-h-0 overflow-hidden">
          {/* Editor Container (Upper half) */}
          <div className="flex-1 min-h-[350px] p-4 pb-2">
            <CodeEditor
              language={language}
              code={code}
              onChange={setCode}
              onReset={handleResetCode}
            />
          </div>

          {/* Test Results Container (Lower half) */}
          <div className="p-4 pt-2 shrink-0 max-h-[300px] overflow-y-auto">
            <TestResultsPanel result={evaluation} isRunning={isRunning} />
          </div>
        </div>
      </div>
    </div>
  );
};
