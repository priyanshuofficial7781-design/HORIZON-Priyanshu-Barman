import React, { useState } from 'react';
import { askDualAiAssistant, AiProvider } from '../../lib/aiService';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Maximize2,
  Minimize2,
  Code2,
  Layers,
  HelpCircle,
  Cpu,
} from 'lucide-react';

interface DualAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DualAssistantModal: React.FC<DualAssistantModalProps> = ({ isOpen, onClose }) => {
  const [provider, setProvider] = useState<AiProvider>('gemini');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; provider?: AiProvider }>>([
    {
      sender: 'ai',
      text: `Hello! I am your FAANG AI Copilot. You can switch between Google Gemini and ChatGPT anytime using the toggle above. Ask me about LeetCode algorithmic patterns, system design architectures, time complexities, or behavioral interview strategies!`,
      provider: 'gemini',
    },
  ]);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    const res = await askDualAiAssistant(userText, {
      provider,
      systemInstruction: 'You are an elite Senior Staff Engineer at Google and Meta assisting a student to become job-ready for high-package software engineering roles.',
    });

    setIsLoading(false);
    setMessages((prev) => [
      ...prev,
      { sender: 'ai', text: res.text, provider: res.provider },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl h-[620px] bg-[#090f20] border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-[#0b1226] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1.5px] flex items-center justify-center">
              <div className="w-full h-full bg-[#090f20] rounded-[7px] flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Dual AI Career Copilot</h3>
                <span className="text-[10px] px-2 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  {provider === 'gemini' ? 'Gemini 3.8 Flash' : 'ChatGPT 4o'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">FAANG DSA, Architecture & Interview Help</p>
            </div>
          </div>

          {/* Model Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex bg-[#060a16] p-0.5 rounded-lg border border-slate-800 text-xs font-medium">
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`px-3 py-1 rounded-md transition-all ${
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
                className={`px-3 py-1 rounded-md transition-all ${
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

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-[#070b18] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 font-mono shrink-0">Prompts:</span>
          {[
            'Explain Dijkstra vs Bellman-Ford',
            'How to design a Distributed Rate Limiter?',
            'What is the difference between Google L4 and L5?',
            'How to answer "Tell me about a time you failed"?',
          ].map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInputMessage(prompt)}
              className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-none'
                    : 'bg-[#0f1730] text-slate-200 border border-slate-800 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
                {m.sender === 'user'
                  ? 'You'
                  : m.provider === 'gemini'
                  ? 'Gemini 3.8 Flash'
                  : 'ChatGPT 4o'}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>
                {provider === 'gemini' ? 'Gemini 3.8 Flash' : 'ChatGPT 4o'} is formulating
                response...
              </span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-[#0b1226] border-t border-slate-800">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about coding, system design, or FAANG interviews..."
              className="w-full bg-[#070b16] border border-slate-800 rounded-xl pl-4 pr-12 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500/50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-1.5 p-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
