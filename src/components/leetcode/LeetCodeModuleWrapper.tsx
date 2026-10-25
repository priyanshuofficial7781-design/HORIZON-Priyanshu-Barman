import React, { useState } from 'react';
import { LeetCodeProblem } from '../../types/leetcode';
import { INITIAL_LEETCODE_PROBLEMS } from '../../data/problemsData';
import { getProblemById } from '../../data/questionBankEngine';
import { ProblemCatalog } from './ProblemCatalog';
import { LeetCodeWorkspace } from './LeetCodeWorkspace';
import { AiProblemGeneratorModal } from './AiProblemGeneratorModal';
import { useHorizon } from '../../context/HorizonContext';

export const LeetCodeModuleWrapper: React.FC = () => {
  const { solvedLeetCodeIds, markLeetCodeSolved, selectedLeetCodeProblemId, setSelectedLeetCodeProblemId } =
    useHorizon();

  const [problems, setProblems] = useState<LeetCodeProblem[]>(INITIAL_LEETCODE_PROBLEMS);
  const [generatorOpen, setGeneratorOpen] = useState(false);

  // Look up problem across 20k+ bank or local AI generated problems
  const currentProblem = selectedLeetCodeProblemId
    ? getProblemById(selectedLeetCodeProblemId) ||
      problems.find((p) => p.id === selectedLeetCodeProblemId) ||
      null
    : null;

  const handleSelectProblem = (problem: LeetCodeProblem) => {
    setSelectedLeetCodeProblemId(problem.id);
  };

  const handleBackToCatalog = () => {
    setSelectedLeetCodeProblemId(null);
  };

  const handleProblemGenerated = (newProb: LeetCodeProblem) => {
    setProblems((prev) => [newProb, ...prev]);
    setSelectedLeetCodeProblemId(newProb.id);
  };

  return (
    <div className="h-full w-full overflow-hidden bg-[#050816]">
      {/* AI Problem Generator Modal */}
      <AiProblemGeneratorModal
        isOpen={generatorOpen}
        onClose={() => setGeneratorOpen(false)}
        onProblemGenerated={handleProblemGenerated}
      />

      {currentProblem ? (
        <LeetCodeWorkspace
          problem={currentProblem}
          allProblems={problems}
          onBackToCatalog={handleBackToCatalog}
          onProblemSolved={markLeetCodeSolved}
          isSolved={solvedLeetCodeIds.includes(currentProblem.id)}
        />
      ) : (
        <ProblemCatalog
          problems={problems}
          solvedIds={solvedLeetCodeIds}
          onSelectProblem={handleSelectProblem}
          onOpenAiGenerator={() => setGeneratorOpen(true)}
        />
      )}
    </div>
  );
};
