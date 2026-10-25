import React, { useState, useMemo } from 'react';
import { LeetCodeProblem, SheetType, ProblemDifficulty } from '../../types/leetcode';
import {
  queryQuestions,
  TOTAL_QUESTIONS_COUNT,
  DOMAIN_RANGES,
  getQuestionBankSummary,
} from '../../data/questionBankEngine';
import {
  Search,
  Sparkles,
  CheckCircle2,
  Filter,
  Flame,
  Building2,
  Code2,
  Layers,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Database,
  Cpu,
  Binary,
  Compass,
  BookOpen,
} from 'lucide-react';

interface ProblemCatalogProps {
  problems: LeetCodeProblem[];
  solvedIds: string[];
  onSelectProblem: (problem: LeetCodeProblem) => void;
  onOpenAiGenerator: () => void;
}

export const ProblemCatalog: React.FC<ProblemCatalogProps> = ({
  problems: _initialProblems,
  solvedIds,
  onSelectProblem,
  onOpenAiGenerator,
}) => {
  const summary = useMemo(() => getQuestionBankSummary(), []);

  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedSheet, setSelectedSheet] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  const domains = [
    { id: 'All', name: 'All Domains', count: TOTAL_QUESTIONS_COUNT, icon: Layers },
    { id: 'DSA & Algorithms', name: 'DSA & Algorithms', count: summary.dsaCount, icon: Binary },
    { id: 'System Design', name: 'System Design', count: summary.systemDesignCount, icon: Database },
    { id: 'Core Computer Science', name: 'Core Computer Science', count: summary.coreCsCount, icon: Cpu },
    { id: 'Aptitude & Logic', name: 'Aptitude & Logic', count: summary.aptitudeCount, icon: Compass },
  ];

  const sheets: string[] = [
    'All',
    'Blind 75',
    'NeetCode 150',
    'Striver SDE',
    'FAANG Tags',
    'Core CS Master',
    'System Design 100',
    'Aptitude 500',
  ];

  // Dynamic subtopics based on selected domain
  const availableSubtopics = useMemo(() => {
    if (selectedDomain === 'DSA & Algorithms') return ['All', ...summary.dsaTopics];
    if (selectedDomain === 'System Design') return ['All', ...summary.systemDesignTopics];
    if (selectedDomain === 'Core Computer Science') return ['All', ...summary.coreCsTopics];
    if (selectedDomain === 'Aptitude & Logic') return ['All', ...summary.aptitudeTopics];
    return ['All'];
  }, [selectedDomain, summary]);

  // Query question bank engine with instant slicing
  const queryResult = useMemo(() => {
    return queryQuestions({
      domain: selectedDomain,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      difficulty: selectedDifficulty !== 'All' ? (selectedDifficulty as ProblemDifficulty) : undefined,
      companyTag: selectedCompany !== 'All' ? selectedCompany : undefined,
      sheet: selectedSheet !== 'All' ? selectedSheet : undefined,
      search: searchQuery,
      page: currentPage,
      pageSize,
    });
  }, [
    selectedDomain,
    selectedCategory,
    selectedDifficulty,
    selectedCompany,
    selectedSheet,
    searchQuery,
    currentPage,
    pageSize,
  ]);

  const handleDomainChange = (domainId: string) => {
    setSelectedDomain(domainId);
    setSelectedCategory('All');
    setCurrentPage(1);
  };

  const handlePageJump = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpPageInput, 10);
    if (!isNaN(target) && target >= 1 && target <= queryResult.totalPages) {
      setCurrentPage(target);
      setJumpPageInput('');
    }
  };

  const solvedCount = solvedIds.length;
  const progressPercent = Math.round((solvedCount / Math.max(TOTAL_QUESTIONS_COUNT, 1)) * 100);

  return (
    <div className="flex flex-col h-full bg-[#050816] text-slate-100 overflow-hidden">
      {/* Top Hero Banner */}
      <div className="p-6 bg-gradient-to-r from-[#0d162d] via-[#091024] to-[#0d162d] border-b border-slate-800 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-[10px] font-mono text-cyan-300 uppercase tracking-widest font-bold">
                Tier-1 Practice Arena
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                20,000+ Multi-Category Question Bank
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Horizon Engineering & Technical Suite
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic question library covering DSA, High-Scale System Design, Core CS (OS, DBMS, Networks), and Quantitative Aptitude.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Solved Progress Box (Starts at 0) */}
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Solved</div>
                <div className="text-base font-bold text-emerald-400 font-mono">
                  {solvedCount}{' '}
                  <span className="text-xs text-slate-500 font-normal">/ {TOTAL_QUESTIONS_COUNT.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-slate-700 flex items-center justify-center font-mono text-[11px] font-bold text-emerald-400">
                {progressPercent}%
              </div>
            </div>

            {/* AI Generator Button */}
            <button
              type="button"
              onClick={onOpenAiGenerator}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Problem</span>
            </button>
          </div>
        </div>

        {/* DOMAIN TABS */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none">
          {domains.map((dom) => {
            const Icon = dom.icon;
            const isSelected = selectedDomain === dom.id;
            return (
              <button
                key={dom.id}
                type="button"
                onClick={() => handleDomainChange(dom.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-white shadow-md shadow-[#8B5CFF]/20'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{dom.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-400'
                }`}>
                  {dom.count.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="p-4 bg-[#080d1e] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Instant Search Bar */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title, topic, company, or #number (e.g. 1045)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Subtopic Filter (if domain selected) */}
          {availableSubtopics.length > 1 && (
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer max-w-[180px] truncate"
            >
              {availableSubtopics.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Subtopics' : cat}
                </option>
              ))}
            </select>
          )}

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Company Filter */}
          <select
            value={selectedCompany}
            onChange={(e) => {
              setSelectedCompany(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="All">All Companies</option>
            {summary.companies.map((co) => (
              <option key={co} value={co}>
                {co}
              </option>
            ))}
          </select>

          {/* Curated Sheet Filter */}
          <select
            value={selectedSheet}
            onChange={(e) => {
              setSelectedSheet(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {sheets.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Sheets' : s}
              </option>
            ))}
          </select>
        </div>

        {/* Total Matched Badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Found</span>
          <span className="font-bold text-cyan-400">{queryResult.totalCount.toLocaleString()}</span>
          <span>matching problems</span>
        </div>
      </div>

      {/* PROBLEMS LIST / TABLE */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#070c1a] border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider z-10">
            <tr>
              <th className="py-3 px-4 w-12 text-center">Status</th>
              <th className="py-3 px-4 w-16">#</th>
              <th className="py-3 px-4">Problem Title & Domain</th>
              <th className="py-3 px-4 w-36">Subtopic</th>
              <th className="py-3 px-4 w-24">Difficulty</th>
              <th className="py-3 px-4 w-28">Acceptance</th>
              <th className="py-3 px-4 hidden md:table-cell">Target Companies</th>
              <th className="py-3 px-4 w-28 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 text-xs">
            {queryResult.problems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <Filter className="w-8 h-8 text-slate-600 mb-2" />
                    <p className="text-sm font-semibold text-slate-400">No questions match your filter parameters</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try clearing the company or sheet filters or searching for another keyword.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              queryResult.problems.map((problem) => {
                const isSolved = solvedIds.includes(problem.id);
                return (
                  <tr
                    key={problem.id}
                    onClick={() => onSelectProblem(problem)}
                    className="hover:bg-cyan-950/20 transition-colors cursor-pointer group"
                  >
                    {/* Solved checkmark */}
                    <td className="py-3.5 px-4 text-center">
                      {isSolved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-700 mx-auto group-hover:border-slate-500" />
                      )}
                    </td>

                    {/* Problem Number */}
                    <td className="py-3.5 px-4 font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                      #{problem.number}
                    </td>

                    {/* Title & Domain tags */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {problem.title}
                        </span>
                        {problem.isAiGenerated && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-[10px] font-mono text-indigo-300">
                            AI
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {problem.sheets.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] truncate max-w-[150px]">
                      {problem.category}
                    </td>

                    {/* Difficulty */}
                    <td className="py-3.5 px-4 font-mono font-medium">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] ${
                          problem.difficulty === 'Easy'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : problem.difficulty === 'Medium'
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>

                    {/* Acceptance */}
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {problem.acceptanceRate}
                    </td>

                    {/* Companies */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {problem.companyTags.slice(0, 3).map((c) => (
                          <span
                            key={c}
                            className="px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-400"
                          >
                            {c}
                          </span>
                        ))}
                        {problem.companyTags.length > 3 && (
                          <span className="text-[10px] font-mono text-slate-600">
                            +{problem.companyTags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Open Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProblem(problem);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 group-hover:bg-cyan-600 text-slate-300 group-hover:text-white text-xs font-medium transition-all"
                      >
                        <span>Solve</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION TOOLBAR */}
      <div className="p-3 bg-[#070c1a] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 font-mono">
        {/* Info */}
        <div className="text-slate-400">
          Showing <span className="text-white font-bold">{((queryResult.currentPage - 1) * queryResult.pageSize) + 1}</span> to{' '}
          <span className="text-white font-bold">
            {Math.min(queryResult.currentPage * queryResult.pageSize, queryResult.totalCount)}
          </span> of <span className="text-cyan-400 font-bold">{queryResult.totalCount.toLocaleString()}</span> items
        </div>

        {/* Page navigation controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={queryResult.currentPage <= 1}
            onClick={() => setCurrentPage(1)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={queryResult.currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-200">
            Page <strong className="text-cyan-400">{queryResult.currentPage}</strong> of{' '}
            <strong className="text-slate-400">{queryResult.totalPages}</strong>
          </span>

          <button
            type="button"
            disabled={queryResult.currentPage >= queryResult.totalPages}
            onClick={() => setCurrentPage((p) => Math.min(queryResult.totalPages, p + 1))}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={queryResult.currentPage >= queryResult.totalPages}
            onClick={() => setCurrentPage(queryResult.totalPages)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>

        {/* Jump to page & page size selector */}
        <div className="flex items-center gap-3">
          <form onSubmit={handlePageJump} className="flex items-center gap-1.5">
            <span className="text-slate-500">Jump:</span>
            <input
              type="number"
              min={1}
              max={queryResult.totalPages}
              value={jumpPageInput}
              onChange={(e) => setJumpPageInput(e.target.value)}
              placeholder="Page#"
              className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-500 text-center"
            />
          </form>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
