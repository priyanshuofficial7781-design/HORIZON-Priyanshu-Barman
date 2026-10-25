import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { THEME_CONFIGS } from '../../utils/themeConfig';
import { askDualAiAssistant, AiProvider } from '../../lib/aiService';
import {
  Bot,
  Sparkles,
  Send,
  X,
  ChevronRight,
  Code2,
  Layers,
  HelpCircle,
  Lightbulb,
  Maximize2,
  Minimize2,
  Trash2,
} from 'lucide-react';

export const AiTutorDrawer: React.FC = () => {
  const { aiCopilotOpen, setAiCopilotOpen, currentTheme, activeTab } = useHorizon();
  const theme = THEME_CONFIGS[currentTheme] || THEME_CONFIGS['electric-blue'];

  const [provider, setProvider] = useState<AiProvider>('gemini');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ sender: 'ai' | 'user'; text: string; provider?: AiProvider }>
  >([
    {
      sender: 'ai',
      text: `Hello! I am your FAANG AI Tutor & Socratic Copilot. Toggle between Google Gemini 3.8 Flash and ChatGPT 4o above. Ask me for hints on algorithms, architectural reviews, or behavioral critiques!`,
      provider: 'gemini',
    },
  ]);

  if (!aiCopilotOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    const res = await askDualAiAssistant(userText, {
      provider,
      systemInstruction:
        'You are an elite Senior Staff Engineer at Google and Meta. Act as a Socratic interview coach who provides crisp, insightful answers with time/space complexity analysis.',
    });

    setIsLoading(false);
    setMessages((prev) => [
      ...prev,
      { sender: 'ai', text: res.text, provider: res.provider },
    ]);
  };

  const clearChat = () => {
    setMessages([
      {
        sender: 'ai',
        text: 'Session reset. What algorithmic or system design question would you like to explore next?',
        provider,
      },
    ]);
  };

  return (
    <aside
      className="fixed top-0 right-0 h-screen w-full sm:w-[420px] md:w-[460px] bg-[#080e22] border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200 select-text"
      aria-label="AI Tutor Side Drawer"
    >
      {/* Drawer Header */}
      <div className="px-5 py-4 bg-[#0a122a] border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${theme.gradient} p-[1.5px] flex items-center justify-center shadow-md`}
          >
            <div className="w-full h-full bg-[#080e22] rounded-[10px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-white">AI Tutor Copilot</h2>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${theme.badgeBg} ${theme.badgeBorder} border ${theme.badgeText}`}
              >
                Docked
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Workspace Context: {activeTab.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearChat}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Clear conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAiCopilotOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Model Toggle Switcher */}
      <div className="px-4 py-2.5 bg-[#060a16] border-b border-slate-800 flex items-center justify-between shrink-0">
        <span className="text-[11px] text-slate-400 font-mono">AI Engine:</span>
        <div className="flex bg-[#0b1228] p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setProvider('gemini')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              provider === 'gemini'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gemini 3.8 Flash
          </button>
          <button
            type="button"
            onClick={() => setProvider('chatgpt')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              provider === 'chatgpt'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ChatGPT 4o
          </button>
        </div>
      </div>

      {/* Quick Context-Aware Suggestion Chips */}
      <div className="px-4 py-2 bg-[#070c1c] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0">
        <span className="text-slate-500 font-mono shrink-0">Quick:</span>
        {[
          'Give Socratic hint',
          'Optimize O(N^2) to O(N log N)',
          'Explain Redis cache stampede',
          'Review STAR story impact',
        ].map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setInputMessage(prompt)}
            className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 whitespace-nowrap transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap shadow-sm ${
                m.sender === 'user'
                  ? `bg-gradient-to-r ${theme.gradient} text-white rounded-br-none`
                  : 'bg-[#0f1733] text-slate-200 border border-slate-800 rounded-bl-none'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
              {m.sender === 'user'
                ? 'You'
                : m.provider === 'gemini'
                ? 'Google Gemini 3.8 Flash'
                : 'ChatGPT 4o'}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2 bg-[#0a1126] p-3 rounded-xl border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>
              {provider === 'gemini' ? 'Gemini 3.8 Flash' : 'ChatGPT 4o'} reasoning through
              trade-offs...
            </span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="p-3 bg-[#0a122a] border-t border-slate-800 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask AI tutor (code, architecture, interviews)..."
            className="w-full bg-[#060a16] border border-slate-800 rounded-xl pl-4 pr-12 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500/60"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className={`absolute right-1.5 p-2 bg-gradient-to-r ${theme.gradient} hover:opacity-90 disabled:opacity-40 text-white rounded-lg transition-all cursor-pointer`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </aside>
  );
};
