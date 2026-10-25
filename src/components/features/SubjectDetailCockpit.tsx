import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { calculateSubjectProgress } from '../../utils/plannerLogic';
import { Subject3DIcon } from '../common/GraphicAssets';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Code2,
  CheckSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';

export const SubjectDetailCockpit: React.FC<{ subjectId: string; onBack: () => void }> = ({
  subjectId,
  onBack,
}) => {
  const {
    subjects,
    toggleLessonCompleted,
    togglePracticeCompleted,
    toggleRevisionChecklist,
  } = useHorizon();

  const subject = subjects.find(s => s.id === subjectId) || subjects[0];
  const progressPercent = calculateSubjectProgress(subject);

  // Active module expansion state (default expand module 0)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [subject.modules[0]?.id || '']: true,
  });

  const [activeTab, setActiveTab] = useState<'modules' | 'practice' | 'revision'>('modules');

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-7 animate-in fade-in duration-200">
      {/* Back button and breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111A35] hover:bg-[#172346] border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Hub</span>
        </button>
        <span className="text-xs text-slate-500 font-mono">/</span>
        <span className="text-xs text-[#35D9FF] font-mono uppercase">{subject.category}</span>
        <span className="text-xs text-slate-500 font-mono">/</span>
        <span className="text-xs text-slate-300 font-medium">{subject.name}</span>
      </div>

      {/* Header Cockpit Banner */}
      <div
        className="relative overflow-hidden rounded-3xl p-7 lg:p-8 border shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{
          backgroundColor: '#0B1228',
          borderColor: `${subject.color}40`,
        }}
      >
        <div className="flex items-start gap-4">
          <Subject3DIcon
            type={subject.iconName}
            color={subject.color}
            className="w-16 h-16 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${subject.color}25`,
                  color: subject.color,
                }}
              >
                SEMESTER CURRICULUM
              </span>
              {subject.lastStudied && (
                <span className="text-[11px] text-slate-400 font-mono">
                  · Last Studied: {subject.lastStudied}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold font-['Outfit'] text-white">{subject.name}</h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              {subject.description}
            </p>
          </div>
        </div>

        {/* Progress Circular Badge */}
        <div className="flex items-center gap-4 bg-[#050816]/70 p-4 rounded-2xl border border-slate-800 shrink-0">
          <div className="text-right font-mono">
            <div className="text-2xl font-extrabold text-white tabular-nums">{progressPercent}%</div>
            <div className="text-[10px] text-slate-400">
              {subject.completedLessons} of {subject.totalLessons} Lessons
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
            <svg className="w-full h-full -rotate-90 absolute" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="transparent"
                stroke={subject.color}
                strokeWidth="4"
                strokeDasharray={100}
                strokeDashoffset={100 - progressPercent}
                strokeLinecap="round"
              />
            </svg>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Tabs: Syllabus Modules, Practice Tasks, Revision Checklist */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'modules'
              ? 'bg-[#8B5CFF] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Modules & Lessons ({subject.modules.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('practice')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'practice'
              ? 'bg-[#8B5CFF] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Practice Tasks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('revision')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'revision'
              ? 'bg-[#8B5CFF] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Revision Checklist</span>
        </button>
      </div>

      {/* CONTENT TAB 1: MODULES & LESSONS */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          {subject.modules.map((mod, idx) => {
            const isExpanded = !!expandedModules[mod.id];
            const completedLessonsInMod = mod.lessons.filter(l => l.completed).length;

            return (
              <div
                key={mod.id}
                className="rounded-3xl bg-[#0B1228] border border-slate-800 overflow-hidden shadow-lg transition-all"
              >
                {/* Module Header Bar */}
                <div
                  onClick={() => toggleModule(mod.id)}
                  className="flex items-center justify-between p-5 bg-[#111A35]/60 hover:bg-[#111A35] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#8B5CFF]/20 text-[#35D9FF] font-mono text-xs font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-['Outfit']">{mod.title}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {completedLessonsInMod}/{mod.lessons.length} Lessons Finished
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Progress bar */}
                    <div className="hidden sm:block w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] rounded-full"
                        style={{
                          width: `${
                            mod.lessons.length > 0
                              ? (completedLessonsInMod / mod.lessons.length) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Lesson List */}
                {isExpanded && (
                  <div className="p-4 space-y-2 border-t border-slate-800/80 bg-[#0B1228]">
                    {mod.lessons.map(lesson => (
                      <div
                        key={lesson.id}
                        onClick={() => toggleLessonCompleted(subject.id, mod.id, lesson.id)}
                        className={`flex items-start justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          lesson.completed
                            ? 'bg-[#111A35]/30 border-slate-800 text-slate-400'
                            : 'bg-[#111A35] border-slate-700/80 hover:border-[#8B5CFF]/50 text-white'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              toggleLessonCompleted(subject.id, mod.id, lesson.id);
                            }}
                            className="mt-0.5 text-slate-400 hover:text-[#35D9FF] transition-colors cursor-pointer shrink-0"
                          >
                            {lesson.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-500" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div
                              className={`text-xs font-semibold ${
                                lesson.completed ? 'line-through text-slate-400' : 'text-slate-100'
                              }`}
                            >
                              {lesson.title}
                            </div>
                            {lesson.notes && (
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                                <FileText className="w-3.5 h-3.5 text-[#35D9FF] shrink-0" />
                                <span className="line-clamp-1">{lesson.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono shrink-0 ml-4">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{lesson.durationMinutes}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CONTENT TAB 2: PRACTICE TASKS */}
      {activeTab === 'practice' && (
        <div className="p-6 rounded-3xl bg-[#0B1228] border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white font-['Outfit']">
            Coding & Problem-Solving Labs
          </h2>
          <div className="space-y-2.5">
            {subject.modules.flatMap(m => m.practiceTasks).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No active practice tasks defined yet for this subject.
              </div>
            ) : (
              subject.modules.map(mod => (
                <div key={mod.id} className="space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {mod.title}
                  </div>
                  {mod.practiceTasks.map(pt => (
                    <div
                      key={pt.id}
                      onClick={() => togglePracticeCompleted(subject.id, mod.id, pt.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        pt.completed
                          ? 'bg-[#111A35]/30 border-slate-800 text-slate-400'
                          : 'bg-[#111A35] border-slate-700 hover:border-[#8B5CFF]/50 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            togglePracticeCompleted(subject.id, mod.id, pt.id);
                          }}
                          className="text-slate-400 hover:text-[#35D9FF] cursor-pointer"
                        >
                          {pt.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500" />
                          )}
                        </button>
                        <span
                          className={`text-xs font-semibold ${
                            pt.completed ? 'line-through text-slate-400' : 'text-slate-200'
                          }`}
                        >
                          {pt.title}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          pt.difficulty === 'Easy'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : pt.difficulty === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {pt.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CONTENT TAB 3: REVISION CHECKLIST */}
      {activeTab === 'revision' && (
        <div className="p-6 rounded-3xl bg-[#0B1228] border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white font-['Outfit']">
            Exam & Interview Revision Checklist
          </h2>
          <div className="space-y-2.5">
            {subject.modules.flatMap(m => m.revisionChecklist).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No revision checklist items defined for this subject yet.
              </div>
            ) : (
              subject.modules.map(mod => (
                <div key={mod.id} className="space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {mod.title}
                  </div>
                  {mod.revisionChecklist.map(rc => (
                    <div
                      key={rc.id}
                      onClick={() => toggleRevisionChecklist(subject.id, mod.id, rc.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        rc.checked
                          ? 'bg-[#111A35]/30 border-slate-800 text-slate-400'
                          : 'bg-[#111A35] border-slate-700 hover:border-[#8B5CFF]/50 text-white'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          toggleRevisionChecklist(subject.id, mod.id, rc.id);
                        }}
                        className="text-slate-400 hover:text-[#35D9FF] cursor-pointer"
                      >
                        {rc.checked ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500" />
                        )}
                      </button>
                      <span
                        className={`text-xs ${
                          rc.checked ? 'line-through text-slate-400' : 'text-slate-200'
                        }`}
                      >
                        {rc.text}
                      </span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
