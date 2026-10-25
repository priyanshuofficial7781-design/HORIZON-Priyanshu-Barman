import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { PriorityLevel, ProjectCategory } from '../../types';
import { X, Calendar, FolderGit2, Check, Clock, Tag } from 'lucide-react';

export const QuickAddModal: React.FC = () => {
  const { quickAddOpen, setQuickAddOpen, addTask, addProject, subjects } = useHorizon();
  const [activeType, setActiveType] = useState<'task' | 'project'>('task');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState(subjects[0]?.id || 'cpp-dsa');
  const [taskDate, setTaskDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [taskTime, setTaskTime] = useState('18:30');
  const [taskDuration, setTaskDuration] = useState(120);
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>('medium');
  const [taskNotes, setTaskNotes] = useState('');

  // Project form state
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projCategory, setProjCategory] = useState<ProjectCategory>('web');
  const [projTech, setProjTech] = useState('React, TypeScript');
  const [projDueDate, setProjDueDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  });

  if (!quickAddOpen) return null;

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle.trim(),
      subjectId: taskSubject,
      date: taskDate,
      time: taskTime,
      durationMinutes: Number(taskDuration),
      priority: taskPriority,
      completed: false,
      notes: taskNotes.trim() || undefined,
      isRecurringClass: false,
    });

    setTaskTitle('');
    setTaskNotes('');
    setQuickAddOpen(false);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;

    const techArray = projTech.split(',').map(t => t.trim()).filter(Boolean);

    addProject({
      title: projTitle.trim(),
      description: projDesc.trim(),
      category: projCategory,
      techStack: techArray.length ? techArray : ['TypeScript'],
      status: 'Planned',
      progress: 0,
      tasks: [
        { id: `t-init-${Date.now()}`, title: 'Initial architecture & setup', completed: false },
      ],
      startDate: new Date().toISOString().split('T')[0],
      dueDate: projDueDate,
    });

    setProjTitle('');
    setProjDesc('');
    setQuickAddOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-[#0B1228] border border-[#8B5CFF]/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#8B5CFF]/20 bg-[#111A35]/60">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveType('task')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeType === 'task'
                  ? 'bg-[#8B5CFF] text-white shadow-md shadow-[#8B5CFF]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Add Study Task</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveType('project')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeType === 'project'
                  ? 'bg-[#35D9FF] text-slate-950 shadow-md shadow-[#35D9FF]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>New Portfolio Project</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setQuickAddOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {activeType === 'task' ? (
          <form onSubmit={handleSaveTask} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Subject / Domain</label>
              <select
                value={taskSubject}
                onChange={e => setTaskSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-[#8B5CFF]"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Task Title</label>
              <input
                type="text"
                required
                placeholder="e.g., LeetCode 33: Search in Rotated Sorted Array"
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#8B5CFF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  value={taskDate}
                  onChange={e => setTaskDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-[#8B5CFF]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Time</label>
                <input
                  type="time"
                  value={taskTime}
                  onChange={e => setTaskTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-[#8B5CFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Duration</label>
                <select
                  value={taskDuration}
                  onChange={e => setTaskDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-[#8B5CFF]"
                >
                  <option value={45}>45 mins</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours (Standard block)</option>
                  <option value={180}>3 hours (Deep work)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                <select
                  value={taskPriority}
                  onChange={e => setTaskPriority(e.target.value as PriorityLevel)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-[#8B5CFF]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Study Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="Key concepts to review or problem links..."
                value={taskNotes}
                onChange={e => setTaskNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#8B5CFF] resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setQuickAddOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#8B5CFF] text-white text-xs font-bold shadow-lg shadow-[#8B5CFF]/30 hover:bg-[#7a48fb] transition-all cursor-pointer"
              >
                Schedule Task
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSaveProject} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Project Title</label>
              <input
                type="text"
                required
                placeholder="e.g., Real-time Threat Intelligence Dashboard"
                value={projTitle}
                onChange={e => setProjTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#35D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={projCategory}
                onChange={e => setProjCategory(e.target.value as ProjectCategory)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-[#35D9FF]"
              >
                <option value="web">Full-Stack Web App</option>
                <option value="cybersecurity">Cybersecurity & SecOps</option>
                <option value="aiml">AI / ML & Data Science</option>
                <option value="automation">Automation & CLI Tools</option>
                <option value="systems">Low-level / Systems (C++/Java)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tech Stack (comma separated)</label>
              <input
                type="text"
                placeholder="React, TypeScript, Express, PostgreSQL"
                value={projTech}
                onChange={e => setProjTech(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#35D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Due Date</label>
              <input
                type="date"
                value={projDueDate}
                onChange={e => setProjDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-[#35D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Project Description</label>
              <textarea
                rows={2}
                placeholder="Briefly describe what problem this project solves..."
                value={projDesc}
                onChange={e => setProjDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#35D9FF] resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setQuickAddOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#35D9FF] text-slate-950 text-xs font-bold shadow-lg shadow-[#35D9FF]/30 hover:bg-[#20c8f0] transition-all cursor-pointer"
              >
                Create Project
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
