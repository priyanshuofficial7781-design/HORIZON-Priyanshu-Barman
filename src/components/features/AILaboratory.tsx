import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import {
  Brain,
  Cpu,
  Binary,
  GitBranch,
  CheckCircle2,
  Circle,
  Lightbulb,
  Sparkles,
  BarChart,
  Layers,
} from 'lucide-react';

export const AILaboratory: React.FC = () => {
  const { aiModules, toggleAILabCompleted } = useHorizon();
  const [activeModuleId, setActiveModuleId] = useState<string>(aiModules[0]?.id || 'ai-mod-1');

  const activeModule = aiModules.find(m => m.id === activeModuleId) || aiModules[0];

  const totalLabs = aiModules.flatMap(m => m.labs).length;
  const completedLabs = aiModules.flatMap(m => m.labs).filter(l => l.completed).length;
  const progressPercent = totalLabs > 0 ? Math.round((completedLabs / totalLabs) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-7 animate-in fade-in duration-200">
      {/* Header Banner - Intelligence Laboratory Theme */}
      <div className="relative overflow-hidden rounded-3xl p-7 lg:p-8 bg-[#0B1228] border border-[#EC4899]/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EC4899]/10 border border-[#EC4899]/30 flex items-center justify-center text-[#EC4899] shadow-lg shadow-[#EC4899]/15 shrink-0">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-[#EC4899]/20 text-[#F472B6]">
                INTELLIGENCE LABORATORY
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                · Mathematical & Algorithmic ML
              </span>
            </div>
            <h1 className="text-3xl font-extrabold font-['Outfit'] text-white">AI / Machine Learning</h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Explore mathematical foundations, optimization techniques, classical machine learning algorithms, and neural network foundations.
            </p>
          </div>
        </div>

        {/* Intelligence Quotient Gauge */}
        <div className="p-4 rounded-2xl bg-[#050816]/80 border border-[#EC4899]/20 shrink-0 flex items-center gap-4">
          <div className="text-right font-mono">
            <div className="text-2xl font-extrabold text-[#EC4899] tabular-nums">
              {progressPercent}%
            </div>
            <div className="text-[10px] text-slate-400">
              {completedLabs}/{totalLabs} Practical Labs
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#EC4899]/20 border border-[#EC4899]/40 flex items-center justify-center text-[#EC4899]">
            <Cpu className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Module Sidebar */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-[#EC4899] font-bold px-1">
            Research Modules ({aiModules.length})
          </div>

          {aiModules.map((mod, idx) => {
            const isSelected = mod.id === activeModuleId;
            const completedCount = mod.labs.filter(l => l.completed).length;

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActiveModuleId(mod.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#831843]/40 to-[#111A35] border-[#EC4899] text-white shadow-lg shadow-[#EC4899]/15'
                    : 'bg-[#0B1228] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#EC4899] text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold truncate text-slate-200">{mod.title}</h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      {completedCount}/{mod.labs.length} Labs
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-semibold shrink-0 ${
                    mod.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : mod.status === 'in_progress'
                      ? 'bg-[#8B5CFF]/20 text-[#C4B5FD]'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {mod.status.replace('_', ' ')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Module Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white font-['Outfit']">{activeModule.title}</h2>
              <span className="text-xs font-mono text-[#EC4899]">Stage 0{activeModule.order}</span>
            </div>

            {/* Key Concepts Grid */}
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
                <Binary className="w-3.5 h-3.5 text-[#35D9FF]" />
                <span>Core Theoretical Constructs</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeModule.keyConcepts.map(kc => (
                  <span
                    key={kc}
                    className="px-3 py-1 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-slate-300 font-mono"
                  >
                    {kc}
                  </span>
                ))}
              </div>
            </div>

            {/* Objectives */}
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
                <GitBranch className="w-3.5 h-3.5 text-[#8B5CFF]" />
                <span>Learning Objectives</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeModule.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#EC4899] font-mono">▸</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Project Idea Spotlight */}
            {activeModule.projectIdea && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#111A35] to-[#1E1B4B] border border-[#8B5CFF]/30 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Suggested Capstone Project Idea</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{activeModule.projectIdea}</p>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Experiments / Labs */}
          <div className="p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Hands-On Code Experiments
            </h3>

            <div className="space-y-2.5">
              {activeModule.labs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Experiments for this stage unlock as prerequisites are satisfied.
                </div>
              ) : (
                activeModule.labs.map(lab => (
                  <div
                    key={lab.id}
                    onClick={() => toggleAILabCompleted(activeModule.id, lab.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      lab.completed
                        ? 'bg-[#111A35]/30 border-slate-800 text-slate-400'
                        : 'bg-[#111A35] border-slate-700 hover:border-[#EC4899]/50 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          toggleAILabCompleted(activeModule.id, lab.id);
                        }}
                        className="text-slate-400 hover:text-[#EC4899] cursor-pointer"
                      >
                        {lab.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500" />
                        )}
                      </button>
                      <span
                        className={`text-xs font-semibold ${
                          lab.completed ? 'line-through text-slate-400' : 'text-slate-200'
                        }`}
                      >
                        {lab.title}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                        lab.completed
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-[#EC4899]/20 text-[#F472B6]'
                      }`}
                    >
                      {lab.completed ? 'Validated' : 'Pending'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
