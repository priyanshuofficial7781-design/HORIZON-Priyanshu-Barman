import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { ChevronRight } from 'lucide-react';

export const RoadmapTimeline: React.FC = () => {
  const { profile } = useHorizon();
  const [selectedYear, setSelectedYear] = useState<number>(Math.ceil(profile.semester / 2));
  const [modalOpen, setModalOpen] = useState(false);
  const [modalYear, setModalYear] = useState<number>(1);

  const yearsData = [
    {
      year: 1,
      badge: 'Year 1 Foundation',
      badgeColor: 'text-cyan-400 border-cyan-400/30 bg-cyan-950/30',
      semesters: 'Sem 1 & Sem 2',
      metrics: [
        { label: 'Core Subjects', ratio: '8/10' },
        { label: 'DSA Basics', ratio: '6/10' },
        { label: 'Web Dev', ratio: '4/10' },
        { label: 'Projects', ratio: '2/5' },
      ],
      description: 'Master programming syntax, memory management, pointers, and fundamental data structures.',
    },
    {
      year: 2,
      badge: 'Year 2 Specialization',
      badgeColor: 'text-emerald-400 border-emerald-400/30 bg-emerald-950/30',
      semesters: 'Sem 3 & Sem 4',
      metrics: [
        { label: 'Core Subjects', ratio: '6/10' },
        { label: 'DSA & Algo', ratio: '5/10' },
        { label: 'Cybersecurity', ratio: '4/10' },
        { label: 'Projects', ratio: '2/4' },
      ],
      description: 'Intermediate DSA (Trees & Graphs), cybersecurity defensive operations, AI/ML foundations, and full-stack software development.',
    },
    {
      year: 3,
      badge: 'Year 3 Career Ready',
      badgeColor: 'text-amber-400 border-amber-400/30 bg-amber-950/30',
      semesters: 'Sem 5 & Sem 6',
      metrics: [
        { label: 'Core Subjects', ratio: '4/10' },
        { label: 'Advanced DSA', ratio: '3/6' },
        { label: 'AI/ML', ratio: '2/4' },
        { label: 'Internship', ratio: '1/2' },
        { label: 'Placement Prep', ratio: '0/4' },
      ],
      description: 'Advanced LeetCode interview patterns, mock interviews, system design fundamentals, ATS resume polish, and campus placement drives.',
    },
  ];

  const handleOpenDetails = (yearNum: number) => {
    setModalYear(yearNum);
    setModalOpen(true);
  };

  const activeModalData = yearsData.find(y => y.year === modalYear) || yearsData[0];

  return (
    <div className="p-5 lg:p-7 max-w-7xl mx-auto space-y-6 pb-24 lg:pb-12 animate-in fade-in duration-200 select-none">
      {/* Header matching Panel 8 in collage */}
      <div className="pb-3 border-b border-[#8B5CFF]/15">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
          3-Year BCA Roadmap
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 font-mono">
          Your journey. Structured.
        </p>
      </div>

      {/* 3 Columns for Year 1, 2, 3 matching Panel 8 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {yearsData.map(col => {
          const isCurrentYear = Math.ceil(profile.semester / 2) === col.year;
          return (
            <div
              key={col.year}
              className={`flex flex-col justify-between p-5 rounded-3xl bg-[#0B1228] border transition-all duration-200 shadow-xl ${
                isCurrentYear
                  ? 'border-[#35D9FF]/60 shadow-[#35D9FF]/10'
                  : 'border-slate-800/80 hover:border-[#8B5CFF]/40'
              }`}
            >
              <div>
                {/* Year Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${col.badgeColor}`}
                  >
                    {col.badge}
                  </span>
                  {isCurrentYear && (
                    <span className="text-[10px] font-mono text-[#35D9FF] font-semibold">
                      Current Year
                    </span>
                  )}
                </div>

                {/* Semesters Subtitle */}
                <h3 className="text-sm font-bold text-slate-200 font-['Outfit'] mb-3">
                  {col.semesters}
                </h3>

                {/* Metrics List */}
                <div className="space-y-2.5 py-2">
                  {col.metrics.map(m => (
                    <div
                      key={m.label}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#111A35]/60 border border-slate-800/80 text-xs"
                    >
                      <span className="text-slate-300 font-medium">{m.label}</span>
                      <span className="font-mono text-[#35D9FF] font-bold">{m.ratio}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Details Button */}
              <button
                type="button"
                onClick={() => handleOpenDetails(col.year)}
                className="w-full mt-4 py-2 px-3 rounded-xl bg-[#111A35] hover:bg-[#172346] border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Mountain Timeline with Y1, Y2, Y3 points matching Panel 8 */}
      <div className="relative rounded-3xl overflow-hidden border border-[#8B5CFF]/25 shadow-2xl bg-[#050816]">
        <img
          src="/assets/horizon/roadmap_mountains.png"
          alt="Roadmap Mountain Horizon"
          className="w-full h-auto max-h-40 object-cover object-bottom"
        />
        <div className="absolute top-3 left-6 text-xs font-mono text-slate-400">
          MILESTONE ARCHITECTURE · Y1 FOUNDATIONS → Y2 SPECIALIZATION → Y3 PLACEMENT VICTORY
        </div>
      </div>

      {/* Detail Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-[#0B1228] border border-[#8B5CFF]/40 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${activeModalData.badgeColor}`}>
                  {activeModalData.badge}
                </span>
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  {activeModalData.semesters}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 rounded bg-[#111A35]"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeModalData.description}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                Target Competencies
              </span>
              <div className="grid grid-cols-2 gap-2">
                {activeModalData.metrics.map(m => (
                  <div key={m.label} className="p-2.5 rounded-xl bg-[#111A35] border border-slate-800 text-xs">
                    <div className="text-slate-400 text-[11px]">{m.label}</div>
                    <div className="text-white font-bold font-mono mt-0.5">{m.ratio} Completed</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-slate-950 font-bold text-xs"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
