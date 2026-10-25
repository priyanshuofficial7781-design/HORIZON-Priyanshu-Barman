import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { Task, PriorityLevel } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Bell,
  Trash2,
} from 'lucide-react';

export const StudyPlanner: React.FC = () => {
  const {
    tasks,
    addTask,
    deleteTask,
    toggleTaskCompleted,
    subjects,
    notificationSettings,
    triggerTestNotification,
  } = useHorizon();

  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Embedded side panel state
  const [formSubject, setFormSubject] = useState(subjects[0]?.id || 'cpp-dsa');
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(selectedDate);
  const [formTime, setFormTime] = useState('18:30');
  const [formDuration, setFormDuration] = useState('1 hour');
  const [formPriority, setFormPriority] = useState<PriorityLevel>('medium');
  const [formNotes, setFormNotes] = useState('');
  const [sidePanelOpen, setSidePanelOpen] = useState(true);

  // Weekly Date Strip generation
  const activeDateObj = new Date(selectedDate);
  const weekStart = new Date(activeDateObj);
  const dayOffset = (activeDateObj.getDay() + 6) % 7; // Monday as 0
  weekStart.setDate(activeDateObj.getDate() - dayOffset);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      dayNum: d.getDate(),
      fullDate: d,
    };
  });

  const selectedDateTasks = tasks.filter(t => t.date === selectedDate);

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    let durationMins = 60;
    if (formDuration.includes('30')) durationMins = 30;
    else if (formDuration.includes('1.5') || formDuration.includes('90')) durationMins = 90;
    else if (formDuration.includes('2')) durationMins = 120;

    addTask({
      title: formTitle.trim(),
      subjectId: formSubject,
      date: formDate,
      time: formTime,
      durationMinutes: durationMins,
      priority: formPriority,
      completed: false,
      notes: formNotes.trim() || undefined,
    });

    setFormTitle('');
    setFormNotes('');
  };

  const handleShiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    const newDateStr = d.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
    setFormDate(newDateStr);
  };

  const formattedSelectedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(selectedDate));

  return (
    <div className="p-5 lg:p-7 max-w-7xl mx-auto space-y-6 pb-24 lg:pb-12 animate-in fade-in duration-200 select-none">
      {/* Header matching Panel 6 in collage */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#8B5CFF]/15">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
            Study Planner
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Plan · Organize · Achieve
          </p>
        </div>

        {/* View Switcher, Date Navigator, & Add Task Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Notification Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111A35]/80 border border-[#8B5CFF]/30 text-xs">
            <Bell className="w-3.5 h-3.5 text-[#35D9FF]" />
            <span className="text-slate-300 font-mono text-[11px]">
              {notificationSettings.leadTimeMinutes}m Alerts Active
            </span>
            <button
              type="button"
              onClick={triggerTestNotification}
              className="ml-1 text-[10px] text-[#35D9FF] hover:underline font-mono cursor-pointer"
            >
              Test
            </button>
          </div>

          {/* Day / Week / Month Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#111A35] border border-slate-800">
            {(['day', 'week', 'month'] as const).map(view => (
              <button
                key={view}
                type="button"
                onClick={() => setCurrentView(view)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  currentView === view
                    ? 'bg-[#35D9FF] text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          {/* Date Navigator */}
          <div className="flex items-center gap-1 bg-[#111A35] border border-slate-800 rounded-xl px-2 py-1 text-xs font-mono text-slate-200">
            <button
              type="button"
              onClick={() => handleShiftDate(-1)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2">{formattedSelectedDate}</span>
            <button
              type="button"
              onClick={() => handleShiftDate(1)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Week Date Strip matching Panel 6 */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#0B1228] border border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => handleShiftDate(-7)}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-[#111A35]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1">
          {weekDays.map(item => {
            const isSelected = item.dateStr === selectedDate;
            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => {
                  setSelectedDate(item.dateStr);
                  setFormDate(item.dateStr);
                }}
                className={`flex flex-col items-center justify-center min-w-[50px] sm:min-w-[65px] py-2 px-3 rounded-2xl font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#35D9FF] text-slate-950 shadow-md shadow-[#35D9FF]/30 font-bold scale-105'
                    : 'bg-[#111A35]/60 hover:bg-[#111A35] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span className="text-[10px] uppercase font-semibold">{item.dayName}</span>
                <span className="text-sm font-extrabold mt-0.5">{item.dayNum}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => handleShiftDate(7)}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-[#111A35]"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Split Layout: Left Today's Tasks | Right Embedded Add New Task Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Today's Tasks (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white font-['Outfit']">Today's Tasks</h2>
            <button
              type="button"
              onClick={() => setSidePanelOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-slate-950 font-bold text-xs shadow-md shadow-[#8B5CFF]/25 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="space-y-3">
            {selectedDateTasks.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No tasks scheduled for {formattedSelectedDate}. Add a new sprint using the panel on the right.
              </div>
            ) : (
              selectedDateTasks.map(task => {
                const subject = subjects.find(s => s.id === task.subjectId);
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#111A35]/60 hover:bg-[#111A35] border border-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleTaskCompleted(task.id)}
                        className="text-slate-400 hover:text-[#35D9FF] shrink-0 cursor-pointer"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div
                          className={`text-xs font-semibold truncate ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-100'
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {task.time} · {task.durationMinutes} mins · {subject?.name || 'General'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-opacity cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Embedded "Add New Task" Side Panel Drawer (5 cols) matching Panel 6 */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0B1228] border border-[#8B5CFF]/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white font-['Outfit']">Add New Task</h2>
            <span className="text-[10px] text-[#35D9FF] font-mono">Quick Form</span>
          </div>

          <form onSubmit={handleSaveTask} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-mono text-[11px]">Subject</label>
              <select
                value={formSubject}
                onChange={e => setFormSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-white focus:outline-none focus:border-[#35D9FF]"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono text-[11px]">Title</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="e.g. DSA - Arrays (Lecture 12)"
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#35D9FF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-mono text-[11px]">Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={e => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-white focus:outline-none focus:border-[#35D9FF]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono text-[11px]">Time</label>
                <input
                  type="time"
                  value={formTime}
                  onChange={e => setFormTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-white focus:outline-none focus:border-[#35D9FF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-mono text-[11px]">Duration</label>
                <select
                  value={formDuration}
                  onChange={e => setFormDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-white focus:outline-none focus:border-[#35D9FF]"
                >
                  <option value="30 mins">30 mins</option>
                  <option value="1 hour">1 hour</option>
                  <option value="1.5 hours">1.5 hours</option>
                  <option value="2 hours">2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono text-[11px]">Priority</label>
                <select
                  value={formPriority}
                  onChange={e => setFormPriority(e.target.value as PriorityLevel)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-white focus:outline-none focus:border-[#35D9FF]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono text-[11px]">Notes</label>
              <textarea
                rows={2}
                value={formNotes}
                onChange={e => setFormNotes(e.target.value)}
                placeholder="Add notes..."
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#35D9FF]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFormTitle('');
                  setFormNotes('');
                }}
                className="px-4 py-2 rounded-xl bg-[#111A35] hover:bg-slate-800 text-slate-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#8B5CFF] to-[#3B82F6] text-white font-bold shadow-md shadow-[#8B5CFF]/30 cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
