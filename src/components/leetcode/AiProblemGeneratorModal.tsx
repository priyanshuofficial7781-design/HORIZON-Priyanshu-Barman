import React, { useState } from 'react';
import { generateCustomAiProblem } from '../../lib/aiService';
import { LeetCodeProblem } from '../../types/leetcode';
import { Sparkles, X, Brain, Check, Flame } from 'lucide-react';

interface AiProblemGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProblemGenerated: (problem: LeetCodeProblem) => void;
}

export const AiProblemGeneratorModal: React.FC<AiProblemGeneratorModalProps> = ({
  isOpen,
  onClose,
  onProblemGenerated,
}) => {
  const [topic, setTopic] = useState('Dynamic Programming');
  const [company, setCompany] = useState('Google');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const topics = [
    'Dynamic Programming',
    'Graphs & BFS/DFS',
    'Sliding Window & Two Pointers',
    'Binary Search on Answer',
    'Monotonic Stack & Heaps',
    'Tree Traversals & LCA',
    'Trie & Prefix Matching',
  ];

  const companies = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Uber', 'Apple', 'Netflix'];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateCustomAiProblem(topic, difficulty, company);
      const newProblem: LeetCodeProblem = {
        id: `ai-${Date.now()}`,
        number: Math.floor(Math.random() * 800 + 2000),
        title: generated.title || `${company} ${topic} Challenge`,
        difficulty,
        category: topic,
        acceptanceRate: generated.acceptanceRate || '42.5%',
        sheets: ['AI Generated', 'FAANG Tags'],
        companyTags: [company],
        description: generated.description,
        examples: generated.examples || [],
        constraints: generated.constraints || ['1 <= nums.length <= 10^5'],
        starterCode: generated.starterCode,
        testCases: generated.testCases || [],
        socraticHints: generated.socraticHints || ['Consider breaking the problem into subproblems.'],
        timeComplexityOptimal: generated.timeComplexityOptimal || 'O(N)',
        spaceComplexityOptimal: generated.spaceComplexityOptimal || 'O(1)',
        isAiGenerated: true,
      };

      onProblemGenerated(newProblem);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#0c1224] border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 p-[1.5px]">
              <div className="w-full h-full bg-[#0c1224] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">AI Problem Generator</h3>
              <p className="text-xs text-slate-400">Generate tailor-made FAANG interview coding questions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {/* Topic Select */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Algorithmic Topic</label>
            <div className="flex flex-wrap gap-1.5">
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                    topic === t
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Company Target */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Target Tech Company</label>
            <div className="flex flex-wrap gap-1.5">
              {companies.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCompany(c)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                    company === c
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Difficulty Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
                    difficulty === diff
                      ? diff === 'Easy'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                        : diff === 'Medium'
                        ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                        : 'bg-rose-950/40 border-rose-500 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing Problem...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Problem</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
