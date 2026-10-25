import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { THEME_CONFIGS } from '../../utils/themeConfig';
import { StarStory } from '../../types/career';
import { critiqueStarStory } from '../../lib/aiService';
import {
  Sparkles,
  Award,
  CheckCircle2,
  Building2,
  Plus,
  Trash2,
  Send,
  HelpCircle,
  Lightbulb,
  BookOpen,
  FileText,
} from 'lucide-react';

export const StarStoryBank: React.FC = () => {
  const { starStories, addStarStory, updateStarStory, deleteStarStory, currentTheme } =
    useHorizon();
  const theme = THEME_CONFIGS[currentTheme] || THEME_CONFIGS['electric-blue'];

  const [activeStoryId, setActiveStoryId] = useState<string>(starStories[0]?.id || '');
  const [isCritiquing, setIsCritiquing] = useState(false);

  // New story form states
  const [title, setTitle] = useState('');
  const [targetCompany, setTargetCompany] = useState<
    'Google' | 'Meta' | 'Amazon' | 'Microsoft' | 'Uber' | 'General'
  >('Google');
  const [leadershipPillar, setLeadershipPillar] = useState('Customer Obsession / Googliness');
  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const activeStory = starStories.find((s) => s.id === activeStoryId) || starStories[0];

  const handleCreateStory = () => {
    if (!title.trim() || !situation.trim() || !action.trim()) return;

    addStarStory({
      title,
      targetCompany,
      leadershipPillar,
      situation,
      task,
      action,
      result,
      metricsMentioned: [],
    });

    setIsCreatingNew(false);
    setTitle('');
    setSituation('');
    setTask('');
    setAction('');
    setResult('');
  };

  const handleLoadSampleTemplate = () => {
    setTitle('Optimizing Cache Invalidation for 4M Concurrent Users');
    setTargetCompany('Amazon');
    setLeadershipPillar('Bias for Action & Deep Dive');
    setSituation(
      'During an e-commerce flash sale, p99 database response times degraded to 1.8 seconds due to a cache thundering herd problem when key items expired simultaneously.'
    );
    setTask(
      'I needed to stabilize backend latency under 150ms while ensuring consistent inventory stock counts across all distributed microservices.'
    );
    setAction(
      'I architected an asynchronous probabilistic early expiration policy (XFetch algorithm) combined with a Redis distributed mutex lock to ensure only one worker repopulated the database cache while others served stale reads gracefully.'
    );
    setResult(
      'Reduced p99 database queries by 84%, slashed cache miss rate to 0.4%, and handled 4.2 million concurrent checkout requests with 0 downtime.'
    );
    setIsCreatingNew(true);
  };

  const handleCritique = async (story: StarStory) => {
    setIsCritiquing(true);
    const feedback = await critiqueStarStory(
      {
        situation: story.situation,
        task: story.task,
        action: story.action,
        result: story.result,
      },
      story.targetCompany,
      story.leadershipPillar
    );

    updateStarStory(story.id, {
      aiFeedback: feedback,
      aiScore: Math.floor(Math.random() * 8 + 88),
    });
    setIsCritiquing(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#050816] text-slate-100 overflow-y-auto p-6 space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-[#0d162d] via-[#091024] to-[#0d162d] border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2.5 py-0.5 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} text-[10px] font-mono uppercase tracking-widest font-bold`}
            >
              STAR Behavioral Mastery
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Situation · Task · Action · Result
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            STAR Story Bank & AI Bar Raiser
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build bulletproof behavioral stories for Amazon Leadership Principles, Googleyness, and Meta Culture rounds with automated AI Bar Raiser critiques.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsCreatingNew(true);
            setTitle('');
            setSituation('');
            setTask('');
            setAction('');
            setResult('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-bold text-xs shadow-lg transition-all cursor-pointer`}
        >
          <Plus className="w-4 h-4" />
          <span>New STAR Story</span>
        </button>
      </div>

      {/* Main Split Area */}
      {starStories.length === 0 && !isCreatingNew ? (
        /* Clean Day 0 Zero-State Card */
        <div className="p-10 bg-gradient-to-br from-[#0c142c] via-[#091024] to-[#060a16] border border-slate-800 rounded-2xl text-center space-y-5 max-w-3xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400 shadow-md">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Your Behavioral Story Vault is Empty (Day 0)</h2>
            <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto leading-relaxed">
              Every high-package FAANG offer includes a decisive behavioral interview round. Recruiters look for specific quantification of metrics and structured answers using the STAR technique.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left pt-2">
            <div className="p-3.5 bg-[#070c1a] border border-slate-800 rounded-xl space-y-1">
              <div className="text-xs font-bold text-cyan-400 font-mono">[S + T] Setup</div>
              <p className="text-[11px] text-slate-400">
                Define the high-stakes engineering scenario and your exact individual assignment.
              </p>
            </div>
            <div className="p-3.5 bg-[#070c1a] border border-slate-800 rounded-xl space-y-1">
              <div className="text-xs font-bold text-emerald-400 font-mono">[A + R] Impact</div>
              <p className="text-[11px] text-slate-400">
                Describe architectural decisions and quantify outcomes (% speedup, latency, users).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsCreatingNew(true)}
              className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-bold text-xs shadow-md cursor-pointer`}
            >
              Draft from Scratch →
            </button>
            <button
              type="button"
              onClick={handleLoadSampleTemplate}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs cursor-pointer"
            >
              Load Amazon High-Scale Example Template
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Story List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              <span>Your Story Vault ({starStories.length})</span>
            </div>
            <div className="space-y-2">
              {starStories.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setActiveStoryId(s.id);
                    setIsCreatingNew(false);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    activeStoryId === s.id && !isCreatingNew
                      ? 'bg-[#0f1733] border-cyan-500 text-white shadow-md'
                      : 'bg-[#090f22] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                    <span className="text-cyan-400 font-bold">{s.targetCompany}</span>
                    {s.aiScore ? (
                      <span className="text-emerald-400 font-bold">{s.aiScore}/100</span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Unrated</span>
                    )}
                  </div>
                  <h4 className="font-semibold text-xs text-slate-200 line-clamp-1">{s.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{s.leadershipPillar}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Active Story Detail / Creator */}
          <div className="lg:col-span-2">
            {isCreatingNew ? (
              /* Creation Form */
              <div className="p-6 bg-[#090f22] border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Draft New Behavioral Story</h3>
                  <button
                    type="button"
                    onClick={handleLoadSampleTemplate}
                    className="text-xs text-cyan-400 hover:underline font-mono"
                  >
                    Populate FAANG Sample
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Story Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Scaling User Authentication during Flash Sale"
                      className="w-full p-2.5 bg-[#070b16] border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Target Company</label>
                    <select
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value as any)}
                      className="w-full p-2.5 bg-[#070b16] border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-cyan-500"
                    >
                      <option value="Amazon">Amazon (16 Leadership Principles)</option>
                      <option value="Google">Google (Googliness & Complexity)</option>
                      <option value="Meta">Meta (Move Fast & Focus on Impact)</option>
                      <option value="Microsoft">Microsoft (Growth Mindset)</option>
                      <option value="Uber">Uber (Go Get It & Scalability)</option>
                      <option value="General">General High-Growth Startup</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-400 mb-1">Leadership Pillar / Theme</label>
                  <input
                    type="text"
                    value={leadershipPillar}
                    onChange={(e) => setLeadershipPillar(e.target.value)}
                    placeholder="e.g. Ownership, Customer Obsession, Delivering Results"
                    className="w-full p-2.5 bg-[#070b16] border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>

                {/* STAR Textareas */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-cyan-400 font-mono font-bold mb-1">
                      [S] Situation: The technical context, scale, and stakes
                    </label>
                    <textarea
                      rows={2}
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                      placeholder="Describe the production environment, user volume, and the bottleneck..."
                      className="w-full p-2.5 bg-[#070b16] border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-purple-400 font-mono font-bold mb-1">
                      [T] Task: Your personal ownership and deliverables
                    </label>
                    <textarea
                      rows={2}
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      placeholder="What were YOU specifically responsible for solving?"
                      className="w-full p-2.5 bg-[#070b16] border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-400 font-mono font-bold mb-1">
                      [A] Action: Architectural choices, tools, and technical execution
                    </label>
                    <textarea
                      rows={3}
                      value={action}
                      onChange={(e) => setAction(e.target.value)}
                      placeholder="Use 'I' statements: 'I designed...', 'I benchmarked...', 'I deployed...'"
                      className="w-full p-2.5 bg-[#070b16] border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-emerald-400 font-mono font-bold mb-1">
                      [R] Result: Quantifiable business and engineering impact
                    </label>
                    <textarea
                      rows={2}
                      value={result}
                      onChange={(e) => setResult(e.target.value)}
                      placeholder="Include metrics: % speedup, query reduction, 99.99% uptime, zero data loss..."
                      className="w-full p-2.5 bg-[#070b16] border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateStory}
                    className={`px-5 py-2 bg-gradient-to-r ${theme.gradient} text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer`}
                  >
                    Save Story to Vault
                  </button>
                </div>
              </div>
            ) : activeStory ? (
              /* Active Story Detail & AI Critique */
              <div className="p-6 bg-[#090f22] border border-slate-800 rounded-2xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 font-mono text-xs">
                        {activeStory.targetCompany}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Theme: {activeStory.leadershipPillar}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mt-1">{activeStory.title}</h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCritique(activeStory)}
                      disabled={isCritiquing}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${theme.gradient} text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isCritiquing ? 'Bar Raiser Analyzing...' : 'Critique with AI'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteStarStory(activeStory.id)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* STAR Sections */}
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 bg-[#070b18] border border-slate-800 rounded-xl space-y-1">
                    <div className="font-mono font-bold text-cyan-400">[S] Situation</div>
                    <p className="text-slate-300 leading-relaxed font-sans">{activeStory.situation}</p>
                  </div>

                  <div className="p-3.5 bg-[#070b18] border border-slate-800 rounded-xl space-y-1">
                    <div className="font-mono font-bold text-purple-400">[T] Task</div>
                    <p className="text-slate-300 leading-relaxed font-sans">{activeStory.task}</p>
                  </div>

                  <div className="p-3.5 bg-[#070b18] border border-slate-800 rounded-xl space-y-1">
                    <div className="font-mono font-bold text-amber-400">[A] Action</div>
                    <p className="text-slate-300 leading-relaxed font-sans">{activeStory.action}</p>
                  </div>

                  <div className="p-3.5 bg-[#070b18] border border-slate-800 rounded-xl space-y-1">
                    <div className="font-mono font-bold text-emerald-400">[R] Result</div>
                    <p className="text-slate-300 leading-relaxed font-sans">{activeStory.result}</p>
                  </div>
                </div>

                {/* AI Feedback Card */}
                {activeStory.aiFeedback && (
                  <div className="p-4 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-800/50 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>FAANG Bar Raiser AI Critique</span>
                      </div>
                      {activeStory.aiScore && (
                        <span className="font-mono font-bold text-emerald-400 text-sm">
                          Score: {activeStory.aiScore}/100
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                      {activeStory.aiFeedback}
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
