import React, { useState } from 'react';
import { SYSTEM_DESIGN_BLUEPRINTS } from '../../data/systemDesignBlueprints';
import { SystemDesignBlueprint } from '../../types/systemDesign';
import { ArchitectureCanvas } from './ArchitectureCanvas';
import { CapacityEstimator } from './CapacityEstimator';
import {
  Layers,
  Calculator,
  Building2,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useHorizon } from '../../context/HorizonContext';
import { THEME_CONFIGS } from '../../utils/themeConfig';

export const SystemDesignStudio: React.FC = () => {
  const { completedSystemDesignIds, markSystemDesignCompleted, currentTheme } = useHorizon();
  const theme = THEME_CONFIGS[currentTheme] || THEME_CONFIGS['electric-blue'];
  const [activeTab, setActiveTab] = useState<'canvas' | 'estimator'>('canvas');
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>(
    SYSTEM_DESIGN_BLUEPRINTS[0].id
  );

  const activeBlueprint =
    SYSTEM_DESIGN_BLUEPRINTS.find((b) => b.id === selectedBlueprintId) ||
    SYSTEM_DESIGN_BLUEPRINTS[0];

  return (
    <div className="flex flex-col h-full bg-[#050816] text-slate-100 overflow-hidden font-sans">
      {/* Top Header Bar */}
      <div className="p-6 bg-gradient-to-r from-[#0d162d] via-[#091024] to-[#0d162d] border-b border-slate-800 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-[10px] font-mono text-purple-300 uppercase tracking-widest font-bold">
                High-Level System Design
              </span>
              <span className="text-xs text-slate-400 font-mono">
                FAANG & Tier-1 Software Engineering Standards
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              System Design Studio & Canvas
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Interactive architecture diagrams, distributed systems trade-offs, and back-of-the-envelope capacity estimations.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#070b16] p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('canvas')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'canvas'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Architecture Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('estimator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'estimator'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Capacity Estimator</span>
            </button>
          </div>
        </div>

        {/* Blueprint Selector (Only in Canvas Mode) */}
        {activeTab === 'canvas' && (
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-mono text-[11px] shrink-0 mr-1">
              FAANG Blueprints:
            </span>
            {SYSTEM_DESIGN_BLUEPRINTS.map((bp) => {
              const isMastered = completedSystemDesignIds.includes(bp.id);
              return (
                <button
                  key={bp.id}
                  type="button"
                  onClick={() => setSelectedBlueprintId(bp.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                      selectedBlueprintId === bp.id
                        ? 'bg-purple-500/20 border-purple-500 text-purple-200 font-bold shadow-sm'
                        : 'bg-[#080d1a] border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {isMastered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    <span>{bp.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-slate-400 border border-slate-800">
                      {bp.targetCompany}
                    </span>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* Main Studio Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'estimator' ? (
          <CapacityEstimator />
        ) : (
          <div className="space-y-6">
            {/* Blueprint Overview Bar */}
            <div className="p-4 bg-[#090f22] border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{activeBlueprint.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800 text-indigo-300 font-mono">
                    Target: {activeBlueprint.targetCompany}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 font-mono">
                    {activeBlueprint.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{activeBlueprint.description}</p>
                <div className="text-[11px] font-mono text-cyan-400 mt-1.5">
                  Traffic Scale: {activeBlueprint.trafficScale}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {completedSystemDesignIds.includes(activeBlueprint.id) ? (
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mastered (Blueprint Logged)</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => markSystemDesignCompleted(activeBlueprint.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-bold text-xs shadow-md transition-all cursor-pointer hover:opacity-95`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Mastered (+5% Readiness)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Architecture Canvas */}
            <ArchitectureCanvas
              nodes={activeBlueprint.nodes}
              connections={activeBlueprint.connections}
            />

            {/* Requirements & Trade-offs Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Functional Requirements */}
              <div className="p-5 bg-[#090f22] border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <h4>Key System Requirements & SLAs</h4>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {activeBlueprint.keyRequirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-mono mt-0.5">[{idx + 1}]</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottlenecks & Trade-offs */}
              <div className="p-5 bg-[#090f22] border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <h4>Architectural Bottlenecks & Trade-offs</h4>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {activeBlueprint.bottlenecksAndTradeoffs.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-mono mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Deep Dive Topics */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Staff Engineer Deep Dive Topics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeBlueprint.deepDiveTopics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#090f22] border border-slate-800 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center gap-2 font-semibold text-slate-200">
                      <Lightbulb className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{topic.title}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed font-sans">{topic.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
