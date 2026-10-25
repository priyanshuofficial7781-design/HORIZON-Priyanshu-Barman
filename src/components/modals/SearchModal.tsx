import React from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { searchWorkspace } from '../../utils/plannerLogic';
import { Search, X, BookOpen, Calendar, FolderGit2, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { searchQuery, setSearchQuery, subjects, tasks, projects, setActiveTab, setSelectedSubjectId } =
    useHorizon();

  if (!isOpen) return null;

  const results = searchWorkspace(searchQuery, subjects, tasks, projects);
  const totalResults = results.subjects.length + results.tasks.length + results.projects.length;

  const handleSelectSubject = (id: string) => {
    setSelectedSubjectId(id);
    setActiveTab('learn');
    onClose();
  };

  const handleSelectTask = () => {
    setActiveTab('planner');
    onClose();
  };

  const handleSelectProject = () => {
    setActiveTab('projects');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-[#050816]/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl bg-[#0B1228] border border-[#8B5CFF]/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#8B5CFF]/20 bg-[#111A35]/60">
          <Search className="w-5 h-5 text-[#35D9FF] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search subjects, tasks, algorithms, projects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!searchQuery.trim() ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type to quickly locate courses, scheduled DSA sessions, or active portfolio builds.
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching subjects, tasks, or projects found for "{searchQuery}".
            </div>
          ) : (
            <>
              {/* Subjects */}
              {results.subjects.length > 0 && (
                <div>
                  <div className="text-[11px] font-mono uppercase text-[#35D9FF] tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Learning Courses ({results.subjects.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.subjects.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelectSubject(s.id)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#111A35]/40 hover:bg-[#111A35] border border-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">{s.name}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{s.description}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {results.tasks.length > 0 && (
                <div>
                  <div className="text-[11px] font-mono uppercase text-[#8B5CFF] tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Scheduled Tasks ({results.tasks.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.tasks.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={handleSelectTask}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#111A35]/40 hover:bg-[#111A35] border border-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">{t.title}</div>
                          <div className="text-[11px] text-slate-400">
                            {t.date} · {t.time} · {t.durationMinutes} mins
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            t.completed
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {t.completed ? 'Done' : 'Pending'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {results.projects.length > 0 && (
                <div>
                  <div className="text-[11px] font-mono uppercase text-[#10B981] tracking-wider mb-2 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Portfolio Projects ({results.projects.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.projects.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={handleSelectProject}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#111A35]/40 hover:bg-[#111A35] border border-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">{p.title}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{p.description}</div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                          {p.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
