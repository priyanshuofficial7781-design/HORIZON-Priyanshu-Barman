import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { calculateSubjectProgress } from '../../utils/plannerLogic';
import { Subject3DIcon } from '../common/GraphicAssets';
import { SubjectDetailCockpit } from './SubjectDetailCockpit';
import { Search, ChevronRight } from 'lucide-react';

export const LearningHub: React.FC = () => {
  const { subjects, selectedSubjectId, setSelectedSubjectId } = useHorizon();
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // If a subject is selected, render the dedicated Subject Detail Cockpit
  if (selectedSubjectId) {
    return (
      <SubjectDetailCockpit
        subjectId={selectedSubjectId}
        onBack={() => setSelectedSubjectId(null)}
      />
    );
  }

  const filteredSubjects = subjects.filter(s => {
    const progress = calculateSubjectProgress(s);
    if (activeFilter === 'in_progress' && (progress === 0 || progress === 100)) {
      if (progress === 100) return false;
    }
    if (activeFilter === 'completed' && progress < 100) return false;
    if (
      searchFilter.trim() &&
      !s.name.toLowerCase().includes(searchFilter.toLowerCase()) &&
      !s.description.toLowerCase().includes(searchFilter.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-5 lg:p-7 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 select-none">
      {/* Header matching Panel 7 in collage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#8B5CFF]/15">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
            Learning Hub
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured modules, practice problems, and revision checklists across 8 BCA domains.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative w-48 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#35D9FF]"
            />
          </div>

          {/* Filter Pills matching collage (All, In Progress, Completed) */}
          <div className="flex items-center p-1 rounded-xl bg-[#111A35] border border-slate-800">
            {(['all', 'in_progress', 'completed'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  activeFilter === tab
                    ? 'bg-[#35D9FF] text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'all' ? 'All' : tab === 'in_progress' ? 'In Progress' : 'Completed'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2 Rows x 4 Columns Subject Cards matching Panel 7 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredSubjects.map(sub => {
          const progress = calculateSubjectProgress(sub);
          return (
            <div
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className="group relative flex flex-col justify-between p-5 rounded-3xl bg-[#0B1228] border border-slate-800 hover:border-[#8B5CFF]/60 hover:shadow-2xl hover:shadow-[#8B5CFF]/15 transition-all duration-200 cursor-pointer overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                {/* 3D Glowing Asset Icon */}
                <div className="w-16 h-16 mb-3 flex items-center justify-center">
                  <Subject3DIcon type={sub.id} className="w-14 h-14" />
                </div>

                {/* Subject Title */}
                <h3 className="text-base font-bold text-white font-['Outfit'] group-hover:text-[#35D9FF] transition-colors">
                  {sub.name}
                </h3>

                {/* Circular Progress Gauge */}
                <div className="flex items-center gap-3 my-4">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        className="stroke-slate-800"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        className="stroke-[#35D9FF]"
                        strokeWidth="8"
                        strokeDasharray={238.7}
                        strokeDashoffset={238.7 - (238.7 * progress) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-bold font-mono text-white">
                      {progress}%
                    </span>
                  </div>

                  <div className="text-left font-mono">
                    <span className="text-xs text-slate-300 font-bold block">
                      {sub.completedLessons} / {sub.totalLessons}
                    </span>
                    <span className="text-[10px] text-slate-400">Lessons</span>
                  </div>
                </div>
              </div>

              {/* Continue Button matching collage */}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setSelectedSubjectId(sub.id);
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#8B5CFF] to-[#3B82F6] hover:from-[#9D71FF] hover:to-[#60A5FA] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#8B5CFF]/20 group-hover:shadow-[#35D9FF]/30 cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
