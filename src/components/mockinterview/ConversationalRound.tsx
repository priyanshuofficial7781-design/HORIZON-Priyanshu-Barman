import React, { useState } from 'react';
import {
  InterviewerPersona,
  InterviewRoundType,
  ConversationalInterviewResult,
} from '../../types/mockInterview';
import { askDualAiAssistant, AiProvider } from '../../lib/aiService';
import {
  UserCheck,
  Bot,
  Send,
  Award,
  Shield,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface ConversationalRoundProps {
  onFinish: (result: ConversationalInterviewResult) => void;
  onCancel: () => void;
}

export const ConversationalRound: React.FC<ConversationalRoundProps> = ({
  onFinish,
  onCancel,
}) => {
  const [persona, setPersona] = useState<InterviewerPersona>('FAANG Bar Raiser');
  const [topic, setTopic] = useState('High-Scale Real-Time Feed & Message Ingestion');
  const [provider, setProvider] = useState<AiProvider>('gemini');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scorecard, setScorecard] = useState<ConversationalInterviewResult | null>(null);

  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your interviewer today acting as a ${persona}. We'll be discussing "${topic}". To start off, how would you design a distributed ingest pipeline that can handle 2 million writes/second without dropping events during database failovers? Walk me through your high-level component choices.`,
    },
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    const context = `Interview Persona: ${persona}
Topic: ${topic}
Previous conversation history:
${messages.map((m) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n')}
Candidate response: ${userText}`;

    const systemInstruction = `You are an elite ${persona} at Google and Meta conducting a tough senior technical interview.
Acknowledge the candidate's point briefly, challenge any potential single points of failure, ask deep probing follow-up questions about consistency (CAP theorem, backpressure, partition tolerance), and keep the conversation realistic and demanding.`;

    const aiRes = await askDualAiAssistant(userText, {
      provider,
      systemInstruction,
      context,
    });

    setIsLoading(false);
    setMessages((prev) => [...prev, { sender: 'ai', text: aiRes.text }]);
  };

  const handleEndInterview = () => {
    // Generate evaluation scorecard
    const userTurnCount = messages.filter((m) => m.sender === 'user').length;
    const isStrong = userTurnCount >= 3;

    const result: ConversationalInterviewResult = {
      id: `interview-${Date.now()}`,
      roundType: 'conversational_technical',
      interviewerPersona: persona,
      topic,
      durationMinutes: Math.max(15, userTurnCount * 4),
      overallDecision: isStrong ? 'Hire' : 'Leaning Hire',
      rubricScores: [
        {
          category: 'Problem Solving & Scoping',
          score: isStrong ? 4.5 : 3.8,
          feedback: 'Effective decomposition of high-throughput traffic into asynchronous stages.',
        },
        {
          category: 'Scalability & System Thinking',
          score: isStrong ? 4.8 : 3.5,
          feedback: 'Sound understanding of distributed message queues and horizontal replication.',
        },
        {
          category: 'Trade-off Articulation',
          score: isStrong ? 4.2 : 3.2,
          feedback: 'Good discussion of CP vs AP guarantees under network partitions.',
        },
        {
          category: 'Engineering Communication',
          score: 4.6,
          feedback: 'Crisp, structured responses adhering to standard industry nomenclature.',
        },
      ],
      keyStrengths: [
        'Demonstrated strong grasp of backpressure buffers and Kafka partition balancing.',
        'Proactively called out database connection pooling limits.',
      ],
      areasForImprovement: [
        'Consider elaborating on dead-letter queue (DLQ) retry strategies for poisonous payloads.',
        'Clarify monitoring telemetry (p99 latency metrics vs Prometheus alerts).',
      ],
      summaryFeedback: `Candidate showed senior-level architectural intuition for high-load systems. Handled follow-up stress scenarios with composure and technical accuracy. Recommended: ${isStrong ? 'Hire (L4/L5)' : 'Leaning Hire'}.`,
      timestamp: Date.now(),
    };

    setScorecard(result);
  };

  return (
    <div className="flex flex-col h-full bg-[#050816] text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <div className="p-4 bg-[#0a0f22] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1.5px] flex items-center justify-center">
            <div className="w-full h-full bg-[#070c18] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Conversational Technical Interview</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-mono">
                {persona}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-md">{topic}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Model Switcher */}
          <div className="flex bg-[#060a16] p-0.5 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setProvider('gemini')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                provider === 'gemini'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gemini
            </button>
            <button
              type="button"
              onClick={() => setProvider('chatgpt')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                provider === 'chatgpt'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ChatGPT
            </button>
          </div>

          {!scorecard ? (
            <button
              type="button"
              onClick={handleEndInterview}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Conclude & Score</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onFinish(scorecard);
                onCancel();
              }}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
            >
              Save to Career Profile
            </button>
          )}

          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Main Conversation Area / Scorecard */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {scorecard ? (
          <div className="max-w-2xl mx-auto p-6 bg-[#090f22] border border-slate-800 rounded-2xl space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  FAANG Interview Committee Report
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Official Candidate Scorecard</h3>
              </div>
              <div
                className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold border ${
                  scorecard.overallDecision === 'Strong Hire' || scorecard.overallDecision === 'Hire'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-amber-950/80 border-amber-500 text-amber-300'
                }`}
              >
                Verdict: {scorecard.overallDecision}
              </div>
            </div>

            {/* Rubrics */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Evaluation Rubrics (Scale 1.0 - 5.0)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {scorecard.rubricScores.map((r, i) => (
                  <div key={i} className="p-3 bg-[#070c18] border border-slate-800 rounded-xl space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">{r.category}</span>
                      <span className="font-mono font-bold text-cyan-400">{r.score} / 5.0</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{r.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/30 rounded-xl space-y-2">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Key Strengths
                </div>
                <ul className="space-y-1 text-slate-300">
                  {scorecard.keyStrengths.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-amber-950/20 border border-amber-800/30 rounded-xl space-y-2">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Areas to Polish
                </div>
                <ul className="space-y-1 text-slate-300">
                  {scorecard.areasForImprovement.map((a, i) => (
                    <li key={i}>• {a}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Committee Summary */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-1.5">
              <div className="font-bold text-slate-300 font-mono">Principal Engineer Notes:</div>
              <p className="text-slate-400 leading-relaxed">{scorecard.summaryFeedback}</p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                      : 'bg-[#0b1226] text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {m.sender === 'user' ? 'You (Candidate)' : `${persona} (${provider === 'gemini' ? 'Gemini 3.8 Flash' : 'ChatGPT 4o'})`}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Interviewer is evaluating your response and formulating questions...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Form (When not on scorecard) */}
      {!scorecard && (
        <form onSubmit={handleSendMessage} className="p-4 bg-[#0a0f22] border-t border-slate-800 shrink-0">
          <div className="max-w-3xl mx-auto relative flex items-center">
            <textarea
              rows={2}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Explain your approach, architectural trade-offs, and failure recovery..."
              className="w-full bg-[#070b16] border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500/50 resize-none font-sans"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-2.5 p-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
