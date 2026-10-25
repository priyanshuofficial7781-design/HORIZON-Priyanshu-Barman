import React, { useState } from 'react';
import { CodeEvaluationResult } from '../../types/leetcode';
import { CheckCircle2, XCircle, AlertTriangle, Zap, Cpu, Terminal, Check, X } from 'lucide-react';

interface TestResultsPanelProps {
  result: CodeEvaluationResult | null;
  isRunning: boolean;
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({ result, isRunning }) => {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  if (isRunning) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-[#090d1a] border border-slate-800 rounded-xl p-6 text-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
        <div className="text-sm font-medium text-slate-300">Evaluating Test Suite...</div>
        <div className="text-xs text-slate-500 mt-1">Compiling against edge cases and runtime limits</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-44 bg-[#090d1a] border border-slate-800/80 rounded-xl p-4 text-center text-slate-500 text-xs">
        <Terminal className="w-6 h-6 mb-2 text-slate-600" />
        <div>Run code or submit to inspect test suite evaluation, metrics, and runtime memory.</div>
      </div>
    );
  }

  const isAccepted = result.status === 'Accepted';
  const activeCase = result.testCaseResults[selectedCaseIdx] || result.testCaseResults[0];

  return (
    <div className="flex flex-col bg-[#090d1a] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Top Header Result Bar */}
      <div
        className={`px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b ${
          isAccepted
            ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
            : result.status === 'Compilation Error'
            ? 'bg-amber-950/30 border-amber-800/40 text-amber-300'
            : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {isAccepted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : result.status === 'Compilation Error' ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="font-semibold text-base tracking-wide">{result.status}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-black/40 font-mono text-slate-300">
            {result.passedTests} / {result.totalTests} Test Cases Passed
          </span>
        </div>

        {isAccepted && (
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-cyan-300">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{result.runtimeMs} ms</span>
              <span className="text-slate-400">({result.runtimeBeatsPercent}% beats)</span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-300">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>{result.memoryMb} MB</span>
              <span className="text-slate-400">({result.memoryBeatsPercent}% beats)</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Message if any */}
      {result.errorMessage && (
        <div className="p-3 bg-rose-950/20 border-b border-rose-900/30 text-rose-200 text-xs font-mono whitespace-pre-wrap">
          {result.errorMessage}
        </div>
      )}

      {/* Test Case Selector Tabs */}
      {result.testCaseResults.length > 0 && (
        <div className="flex items-center gap-2 px-3 pt-2 pb-1 border-b border-slate-800/60 overflow-x-auto bg-[#070b16]">
          {result.testCaseResults.map((tc, idx) => (
            <button
              key={tc.index}
              type="button"
              onClick={() => setSelectedCaseIdx(idx)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-colors shrink-0 ${
                selectedCaseIdx === idx
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tc.passed ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <X className="w-3 h-3 text-rose-400" />
              )}
              <span>Case {tc.index}</span>
            </button>
          ))}
        </div>
      )}

      {/* Active Test Case Detail */}
      {activeCase && (
        <div className="p-4 space-y-3 font-mono text-xs">
          <div>
            <div className="text-slate-500 text-[11px] uppercase tracking-wider mb-1 font-sans">
              Input
            </div>
            <div className="p-2.5 bg-black/50 border border-slate-800 rounded-lg text-slate-200 whitespace-pre-wrap">
              {activeCase.input}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-slate-500 text-[11px] uppercase tracking-wider mb-1 font-sans">
                Expected Output
              </div>
              <div className="p-2.5 bg-black/50 border border-slate-800 rounded-lg text-emerald-300 whitespace-pre-wrap">
                {activeCase.expected}
              </div>
            </div>

            <div>
              <div className="text-slate-500 text-[11px] uppercase tracking-wider mb-1 font-sans">
                Actual Output
              </div>
              <div
                className={`p-2.5 bg-black/50 border rounded-lg whitespace-pre-wrap ${
                  activeCase.passed
                    ? 'border-emerald-800/40 text-emerald-300'
                    : 'border-rose-800/40 text-rose-300'
                }`}
              >
                {activeCase.actual}
              </div>
            </div>
          </div>

          {activeCase.stdout && (
            <div>
              <div className="text-slate-500 text-[11px] uppercase tracking-wider mb-1 font-sans">
                Stdout
              </div>
              <div className="p-2 bg-slate-900/60 border border-slate-800/60 rounded text-slate-400 text-[11px]">
                {activeCase.stdout}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
