import React, { useState } from 'react';
import { LeetCodeProblem, ProgrammingLanguage } from '../../types/leetcode';
import { askDualAiAssistant, getSocraticHint, AiProvider } from '../../lib/aiService';
import { Bot, Sparkles, Send, Lightbulb, X, HelpCircle, ArrowRight, BrainCircuit } from 'lucide-react';

interface SocraticTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  problem: LeetCodeProblem;
  userCode: string;
  language: ProgrammingLanguage;
}

export const SocraticTutorDrawer: React.FC<SocraticTutorDrawerProps> = ({
  isOpen,
  onClose,
  problem,
  userCode,
  language,
}) => {
  const [provider, setProvider] = useState<AiProvider>('gemini');
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your Socratic AI Coach for "${problem.title}". I won't give away the code, but I'll guide you to uncover the optimal algorithm yourself. Where are you currently feeling stuck?`,
    },
  ]);

  if (!isOpen) return null;

  const handleUnlockNextHint = async () => {
    if (hintLevel < problem.socraticHints.length) {
      const nextHint = problem.socraticHints[hintLevel];
      setHintLevel((prev) => prev + 1);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `💡 **Socratic Invariant (${hintLevel + 1}/${problem.socraticHints.length})**:\n${nextHint}`,
        },
      ]);
    } else {
      // Dynamic AI hint
      setIsLoading(true);
      const dynamicHint = await getSocraticHint(problem.title, userCode, language);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `🧠 **Deep Dive Question**:\n${dynamicHint}\n\n*Target Complexity for this problem:* **${problem.timeComplexityOptimal}** time, **${problem.spaceComplexityOptimal}** space.`,
        },
      ]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userText = chatInput.trim();
    setChatInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    const context = `Problem: ${problem.title} (${problem.difficulty})
Category: ${problem.category}
Language: ${language}
Optimal Time: ${problem.timeComplexityOptimal}
Student's Current Code:
${userCode}

Remember: Be a pure Socratic tutor. Never output the full code solution. Ask probing questions, point out loop boundaries, or suggest invariant checks.`;

    const aiResponse = await askDualAiAssistant(userText, {
      provider,
      systemInstruction: 'You are an elite Staff Engineer conducting a FAANG algorithmic round. Guide with Socratic questions without spoiling.',
      context,
    });

    setIsLoading(false);
    setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse.text }]);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0a0f1e] border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 bg-[#0d152a] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 p-[1.5px] flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0f1e] rounded-[7px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Socratic AI Tutor
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                No Spoilers
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{problem.title}</p>
          </div>
        </div>

        {/* AI Provider Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#070b16] p-0.5 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setProvider('gemini')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                provider === 'gemini'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gemini
            </button>
            <button
              type="button"
              onClick={() => setProvider('chatgpt')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                provider === 'chatgpt'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ChatGPT
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progressive Hint Bar */}
      <div className="p-3 bg-indigo-950/20 border-b border-indigo-900/30 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-indigo-300">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {hintLevel === 0
              ? 'Get a gentle hint without giving away the answer'
              : `Unlocked ${hintLevel} of ${problem.socraticHints.length} Hints`}
          </span>
        </div>

        <button
          type="button"
          onClick={handleUnlockNextHint}
          disabled={isLoading}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition-colors shrink-0 disabled:opacity-50"
        >
          <span>{hintLevel >= problem.socraticHints.length ? 'Ask Probing AI' : 'Next Hint'}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                  : 'bg-[#121a30] text-slate-200 border border-slate-800 rounded-bl-none'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">
              {m.sender === 'user' ? 'You' : provider === 'gemini' ? 'Gemini 3.8 Flash' : 'ChatGPT 4o'}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Formulating Socratic question...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="p-3 bg-[#0d152a] border-t border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask a question (e.g. Why is my solution O(N^2)?)..."
            className="w-full bg-[#080d1a] border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500/50"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isLoading}
            className="absolute right-1.5 p-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 rounded-lg transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
