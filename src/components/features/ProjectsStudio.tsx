import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { ProjectItem, ProjectStatus } from '../../types';
import {
  FolderGit2,
  Plus,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Github,
} from 'lucide-react';

export const ProjectsStudio: React.FC = () => {
  const { projects, addProject } = useHorizon();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTech, setFormTech] = useState('');
  const [formDueDate, setFormDueDate] = useState('2026-06-30');

  // Baseline 4 project cards matching Panel 10 of collage
  const defaultCollageProjects: ProjectItem[] = [
    {
      id: 'proj-1',
      title: 'BCA Career Planner',
      description: 'A futuristic command-center dashboard for scheduling, DSA roadmap tracking, safe cybersecurity labs, and placement preparation.',
      techStack: ['Web App', 'React', 'TypeScript'],
      status: 'In Progress',
      category: 'web',
      progress: 50,
      tasks: [
        { id: 't1', title: 'Cosmic Splash Screen', completed: true },
        { id: 't2', title: 'Guided Onboarding', completed: true },
        { id: 't3', title: 'Study Planner Sprints', completed: true },
        { id: 't4', title: 'Browser Alert Engine', completed: false },
        { id: 't5', title: 'Placement Analytics', completed: false },
        { id: 't6', title: 'Safe Cybersecurity Labs', completed: false },
      ],
      startDate: '2026-04-01',
      dueDate: '20 May 2026',
    },
    {
      id: 'proj-2',
      title: 'Python Automation Tool',
      description: 'Automated script suite for scraping college attendance, organizing study notes, and batch-renaming lab code files.',
      techStack: ['Python', 'Pandas', 'Scripts'],
      status: 'Planned',
      category: 'automation',
      progress: 0,
      tasks: [
        { id: 't7', title: 'Scraper module', completed: false },
        { id: 't8', title: 'File organizer', completed: false },
        { id: 't9', title: 'CLI interface', completed: false },
      ],
      startDate: '2026-05-01',
      dueDate: '10 Jun 2026',
    },
    {
      id: 'proj-3',
      title: 'Data Analysis Project',
      description: 'Exploratory data analysis and predictive modeling on university grade distributions using NumPy and Seaborn.',
      techStack: ['Python', 'Pandas', 'Matplotlib'],
      status: 'Planned',
      category: 'aiml',
      progress: 0,
      tasks: [
        { id: 't10', title: 'Data Cleaning', completed: false },
        { id: 't11', title: 'Statistical Summary', completed: false },
        { id: 't12', title: 'Visual Distributions', completed: false },
      ],
      startDate: '2026-05-15',
      dueDate: '20 Jun 2026',
    },
    {
      id: 'proj-4',
      title: 'Student Productivity Dashboard',
      description: 'Minimalist desktop widget for tracking Pomodoro focus intervals, daily habits, and quick notes.',
      techStack: ['React', 'Electron'],
      status: 'Planned',
      category: 'web',
      progress: 0,
      tasks: [
        { id: 't13', title: 'Timer Engine', completed: false },
        { id: 't14', title: 'Local Storage State', completed: false },
      ],
      startDate: '2026-06-01',
      dueDate: '30 Jun 2026',
    },
  ];

  const displayedProjects = projects.length >= 4 ? projects : defaultCollageProjects;

  const filteredProjects = displayedProjects.filter(p => {
    if (activeFilter === 'All') return true;
    return p.status === activeFilter;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    addProject({
      title: formTitle.trim(),
      description: formDesc.trim() || 'A new portfolio project in active development.',
      category: 'web',
      techStack: formTech.split(',').map(s => s.trim()).filter(Boolean),
      status: 'Planned',
      progress: 0,
      tasks: [],
      startDate: new Date().toISOString().split('T')[0],
      dueDate: formDueDate,
    });
    setFormTitle('');
    setFormDesc('');
    setFormTech('');
    setModalOpen(false);
  };

  const filterTabs = ['All', 'Planned', 'In Progress', 'Completed', 'Archived'];

  return (
    <div className="p-5 lg:p-7 max-w-7xl mx-auto space-y-6 pb-24 lg:pb-12 animate-in fade-in duration-200 select-none">
      {/* Header matching Panel 10 in collage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#8B5CFF]/15">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
            Projects
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Build production-grade applications for your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-slate-950 font-bold text-xs shadow-md shadow-[#8B5CFF]/25 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter Tabs matching collage: All, Planned, In Progress, Completed, Archived */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {filterTabs.map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === tab
                ? 'bg-[#35D9FF] text-slate-950 font-bold shadow-md shadow-[#35D9FF]/20'
                : 'bg-[#111A35]/60 hover:bg-[#111A35] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of Projects matching Panel 10 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProjects.map(proj => {
          const completedTasks = proj.tasks.filter(t => t.completed).length;
          const totalTasks = proj.tasks.length;
          return (
            <div
              key={proj.id}
              className="group flex flex-col justify-between p-5 rounded-3xl bg-[#0B1228] border border-slate-800 hover:border-[#8B5CFF]/50 transition-all shadow-xl hover:shadow-[#8B5CFF]/15"
            >
              <div>
                {/* Tech tag & Status */}
                <div className="flex items-center justify-between mb-3 text-[10px] font-mono">
                  <span className="text-slate-400 truncate max-w-[130px]">
                    {proj.techStack.join(' · ')}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md ${
                      proj.status === 'In Progress'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-[#111A35] text-slate-400 border border-slate-700'
                    }`}
                  >
                    {proj.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white font-['Outfit'] mb-2 group-hover:text-[#35D9FF] transition-colors">
                  {proj.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {proj.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                {/* Task progress & Percentage */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    {completedTasks}/{totalTasks} tasks
                  </span>
                  <span className="text-[#35D9FF] font-bold">{proj.progress}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] rounded-full transition-all duration-300"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 pt-1">
                  <Calendar className="w-3 h-3 text-[#35D9FF]" />
                  <span>Due: {proj.dueDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#0B1228] border border-[#8B5CFF]/30 rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-['Outfit']">Add New Project</h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Distributed Cache in C++"
                  className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="Brief description..."
                  className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={formTech}
                  onChange={e => setFormTech(e.target.value)}
                  placeholder="React, TypeScript, Tailwind"
                  className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formDueDate}
                  onChange={e => setFormDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-slate-950 font-bold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
