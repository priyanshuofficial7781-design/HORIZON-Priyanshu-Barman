import React, { useRef } from 'react';
import { ProgrammingLanguage } from '../../types/leetcode';
import { RotateCcw, Copy, Check, Terminal, Code2 } from 'lucide-react';

interface CodeEditorProps {
  language: ProgrammingLanguage;
  code: string;
  onChange: (val: string) => void;
  onReset: () => void;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  code,
  onChange,
  onReset,
  readOnly = false,
}) => {
  const [copied, setCopied] = React.useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lineCount = Math.max(code.split('\n').length, 18);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const languageLabels: Record<ProgrammingLanguage, string> = {
    python: 'Python 3',
    cpp: 'C++ 20',
    java: 'Java 17',
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f1d] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e1629] border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300">
            {languageLabels[language]}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-300 font-mono">
            UTF-8
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors"
            title="Reset to starter boilerplate"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors"
            title="Copy Code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Main Canvas with Line Numbers */}
      <div className="relative flex-1 flex overflow-hidden font-mono text-sm leading-relaxed">
        {/* Line Numbers */}
        <div className="select-none py-3 px-3 text-right bg-[#080c18] border-r border-slate-800/60 text-slate-600 font-mono text-xs w-12 shrink-0 overflow-hidden">
          {lineNumbers.map((num) => (
            <div key={num} className="h-6">
              {num}
            </div>
          ))}
        </div>

        {/* Code Input Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-slate-100 resize-none outline-none font-mono text-[13px] leading-6 selection:bg-cyan-500/25 tab-size-4 overflow-auto whitespace-pre"
          placeholder="// Write your solution here..."
        />
      </div>

      {/* Editor Status Footer */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#070b14] border-t border-slate-800/70 text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Sandbox Ready
          </span>
          <span>Tab: 4 spaces</span>
        </div>
        <div>Lines: {code.split('\n').length} | Chars: {code.length}</div>
      </div>
    </div>
  );
};
