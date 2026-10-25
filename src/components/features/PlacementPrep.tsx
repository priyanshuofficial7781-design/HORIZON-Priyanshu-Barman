import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { calculatePlacementReadiness } from '../../utils/plannerLogic';
import { JobApplication } from '../../types';
import {
  Briefcase,
  Code2,
  CheckCircle2,
  Circle,
  FileCheck,
  Building2,
  Users,
  Plus,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const PlacementPrep: React.FC = () => {
  const {
    placementTracker,
    updateDsaCount,
    toggleAptitudeModule,
    toggleTechnicalTopic,
    toggleResumeItem,
    addMockInterview,
    addJobApplication,
    updateJobApplicationStatus,
  } = useHorizon();

  const readiness = calculatePlacementReadiness(placementTracker);

  // Modals
  const [mockModalOpen, setMockModalOpen] = useState(false);
  const [appModalOpen, setAppModalOpen] = useState(false);

  // Mock form
  const [mockTopic, setMockTopic] = useState('');
  const [mockPlatform, setMockPlatform] = useState('Pramp Peer Mock');
  const [mockScore, setMockScore] = useState(80);
  const [mockFeedback, setMockFeedback] = useState('');

  // App form
  const [appCompany, setAppCompany] = useState('');
  const [appRole, setAppRole] = useState('Graduate Software Engineer');
  const [appPackage, setAppPackage] = useState('7.0 LPA');
  const [appNotes, setAppNotes] = useState('');

  const handleSaveMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockTopic.trim()) return;
    addMockInterview({
      date: new Date().toISOString().split('T')[0],
      topic: mockTopic.trim(),
      interviewerOrPlatform: mockPlatform,
      scorePercent: Number(mockScore),
      feedback: mockFeedback.trim() || 'Good technical articulation.',
    });
    setMockTopic('');
    setMockFeedback('');
    setMockModalOpen(false);
  };

  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appCompany.trim()) return;
    addJobApplication({
      company: appCompany.trim(),
      role: appRole.trim(),
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      packageLPA: appPackage.trim(),
      notes: appNotes.trim() || undefined,
    });
    setAppCompany('');
    setAppNotes('');
    setAppModalOpen(false);
  };

  return (
    <div className="p-5 lg:p-7 max-w-7xl mx-auto space-y-6 pb-24 lg:pb-12 animate-in fade-in duration-200 select-none">
      {/* Header matching Panel 11 in collage */}
      <div className="pb-3 border-b border-[#8B5CFF]/15">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
          Placement Preparation
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 font-mono">
          Build skills. Crack interviews. Get placed.
        </p>
      </div>

      {/* Main Placement Split matching Panel 11 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Overall Progress & Category Progress Bars (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white font-['Outfit']">Overall Progress</h2>
            <span className="text-xs text-[#35D9FF] font-mono">
              {placementTracker.dsaSolved +
                placementTracker.aptitudeModules.filter(a => a.completed).length +
                placementTracker.technicalTopics.filter(t => t.completed).length}
              /80 Tasks Completed
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Circular Readiness Gauge */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
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
                  strokeDashoffset={238.7 - (238.7 * readiness.overallPercentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold font-['Outfit'] text-white">
                  {readiness.overallPercentage}%
                </span>
              </div>
            </div>

            {/* Categories List matching Panel 11 */}
            <div className="flex-1 w-full space-y-2 text-xs font-mono">
              {[
                { name: 'DSA Practice', val: readiness.dsaScore },
                { name: 'Aptitude', val: readiness.aptitudeScore },
                { name: 'Technical Revision', val: readiness.technicalScore },
                { name: 'Communication', val: 0 },
                { name: 'Resume & Portfolio', val: readiness.resumeScore },
                { name: 'Mock Interviews', val: readiness.mockScore },
                { name: 'Internship Tracker', val: 0 },
              ].map(cat => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>{cat.name}</span>
                    <span className="text-[#35D9FF] font-bold">{cat.val}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] rounded-full transition-all duration-300"
                      style={{ width: `${cat.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mock Interview & Career Goals Cards (4 cols) matching Panel 11 */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          {/* Mock Interview Card */}
          <div className="p-5 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white font-['Outfit']">Mock Interview</h3>
            <p className="text-xs text-slate-400">Prepare for real campus & product interviews.</p>
            <button
              type="button"
              onClick={() => setMockModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CFF] to-[#3B82F6] hover:from-[#9D71FF] hover:to-[#60A5FA] text-white font-bold text-xs shadow-md shadow-[#8B5CFF]/30 transition-all cursor-pointer"
            >
              Start
            </button>
          </div>

          {/* Career Goals Card with Quote */}
          <div className="p-5 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white font-['Outfit']">Career Goals</h3>
            <div className="p-3.5 rounded-2xl bg-[#111A35]/60 border border-slate-800">
              <p className="text-xs italic text-cyan-300 leading-relaxed font-sans">
                "Discipline today, freedom tomorrow."
              </p>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Horizon Mindset
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: DSA Tracker & Technical Core */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DSA Problem Tracker */}
        <div className="p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#8B5CFF]" />
              <h2 className="text-base font-bold text-white font-['Outfit']">DSA Problem Tracker</h2>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={1000}
                value={placementTracker.dsaSolved}
                onChange={e => updateDsaCount(Number(e.target.value))}
                className="w-16 px-2 py-1 rounded bg-[#111A35] border border-slate-700 text-xs font-mono text-center text-white"
              />
              <span className="text-xs text-slate-400 font-mono">/ {placementTracker.dsaTarget} Solved</span>
            </div>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] rounded-full transition-all"
              style={{
                width: `${Math.min((placementTracker.dsaSolved / placementTracker.dsaTarget) * 100, 100)}%`,
              }}
            />
          </div>

          {/* Categories */}
          <div className="space-y-2 pt-2">
            {placementTracker.dsaCategories.map(cat => {
              const catPercent = Math.round((cat.solved / cat.total) * 100);
              return (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{cat.name}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400">
                      {cat.solved}/{cat.total}
                    </span>
                    <span className="w-10 text-right text-[#35D9FF]">{catPercent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Core CS Interview Topics */}
        <div className="p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white font-['Outfit']">
              Technical Core Revision (DBMS, OS, CN)
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {placementTracker.technicalTopics.filter(t => t.completed).length}/
              {placementTracker.technicalTopics.length} Done
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {placementTracker.technicalTopics.map(topic => (
              <div
                key={topic.id}
                onClick={() => toggleTechnicalTopic(topic.id)}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  topic.completed
                    ? 'bg-[#111A35]/30 border-slate-800 text-slate-400'
                    : 'bg-[#111A35] border-slate-700/80 hover:border-[#8B5CFF]/50 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      toggleTechnicalTopic(topic.id);
                    }}
                    className="text-slate-400 hover:text-[#35D9FF]"
                  >
                    {topic.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                  <span
                    className={`text-xs ${
                      topic.completed ? 'line-through text-slate-400' : 'text-slate-200'
                    }`}
                  >
                    {topic.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-[#050816]">
                  {topic.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Resume ATS Checklist & Mock Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume ATS Checklist */}
        <div className="p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white font-['Outfit']">
                Resume & Portfolio Checklist
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {placementTracker.resumeChecklist.filter(r => r.completed).length}/
              {placementTracker.resumeChecklist.length} Verified
            </span>
          </div>

          <div className="space-y-2.5">
            {placementTracker.resumeChecklist.map(item => (
              <div
                key={item.id}
                onClick={() => toggleResumeItem(item.id)}
                className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                  item.completed
                    ? 'bg-[#111A35]/30 border-slate-800 text-slate-400'
                    : 'bg-[#111A35] border-slate-700 hover:border-emerald-500/50 text-white'
                }`}
              >
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    toggleResumeItem(item.id);
                  }}
                  className="mt-0.5 text-slate-400 hover:text-emerald-400"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500" />
                  )}
                </button>
                <span
                  className={`text-xs ${
                    item.completed ? 'line-through text-slate-400' : 'text-slate-200'
                  }`}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Interviews Logger */}
        <div className="p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#35D9FF]" />
              <h2 className="text-base font-bold text-white font-['Outfit']">Mock Interviews</h2>
            </div>
            <button
              type="button"
              onClick={() => setMockModalOpen(true)}
              className="text-xs font-semibold text-[#35D9FF] hover:underline cursor-pointer"
            >
              + Log Mock
            </button>
          </div>

          <div className="space-y-3">
            {placementTracker.mockInterviews.map(mock => (
              <div
                key={mock.id}
                className="p-3.5 rounded-2xl bg-[#111A35] border border-slate-800 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{mock.topic}</h4>
                  <span className="text-xs font-bold font-mono text-[#35D9FF] tabular-nums">
                    {mock.scorePercent}% Score
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {mock.interviewerOrPlatform} · {mock.date}
                </div>
                <p className="text-xs text-slate-300 italic pt-1">"{mock.feedback}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Applications Tracker */}
      <div className="p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#8B5CFF]" />
            <h2 className="text-base font-bold text-white font-['Outfit']">
              Company Applications & Drives
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setAppModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B5CFF] text-white text-xs font-semibold hover:bg-[#7a48fb] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Application</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] font-mono text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Company</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Package</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Applied Date</th>
                <th className="py-2.5 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {placementTracker.jobApplications.map(app => (
                <tr key={app.id} className="hover:bg-[#111A35]/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">{app.company}</td>
                  <td className="py-3 px-3 text-slate-300">{app.role}</td>
                  <td className="py-3 px-3 font-mono text-[#10B981]">{app.packageLPA}</td>
                  <td className="py-3 px-3">
                    <select
                      value={app.status}
                      onChange={e =>
                        updateJobApplicationStatus(
                          app.id,
                          e.target.value as JobApplication['status']
                        )
                      }
                      className="px-2 py-1 rounded bg-[#111A35] border border-slate-700 text-xs text-white"
                    >
                      <option value="Wishlist">Wishlist</option>
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">{app.appliedDate}</td>
                  <td className="py-3 px-3 text-slate-400 max-w-xs truncate">{app.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Mock Interview Modal */}
      {mockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#0B1228] border border-[#35D9FF]/30 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-['Outfit']">Log Mock Interview</h3>
            <form onSubmit={handleSaveMock} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Interview Topic / Domain</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Trees, BST & Graph Algorithms"
                  value={mockTopic}
                  onChange={e => setMockTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#111A35] border border-slate-700 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Platform / Interviewer</label>
                <input
                  type="text"
                  placeholder="Pramp, Senior Mentorship, College Drive"
                  value={mockPlatform}
                  onChange={e => setMockPlatform(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#111A35] border border-slate-700 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Score Percentage (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={mockScore}
                  onChange={e => setMockScore(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-[#111A35] border border-slate-700 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Feedback & Takeaways</label>
                <textarea
                  rows={2}
                  value={mockFeedback}
                  onChange={e => setMockFeedback(e.target.value)}
                  placeholder="Key areas to improve or strengths observed..."
                  className="w-full p-2.5 rounded-xl bg-[#111A35] border border-slate-700 text-slate-200 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMockModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#35D9FF] text-slate-950 font-bold hover:bg-[#20c8f0]"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Application Modal */}
      {appModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#0B1228] border border-[#8B5CFF]/30 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-['Outfit']">Track Company Application</h3>
            <form onSubmit={handleSaveApp} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cisco, Microsoft, TCS Digital"
                  value={appCompany}
                  onChange={e => setAppCompany(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#111A35] border border-slate-700 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Role</label>
                  <input
                    type="text"
                    value={appRole}
                    onChange={e => setAppRole(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#111A35] border border-slate-700 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Package LPA</label>
                  <input
                    type="text"
                    value={appPackage}
                    onChange={e => setAppPackage(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#111A35] border border-slate-700 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Application Notes</label>
                <textarea
                  rows={2}
                  value={appNotes}
                  onChange={e => setAppNotes(e.target.value)}
                  placeholder="Online test link, referral contact, or stage details..."
                  className="w-full p-2.5 rounded-xl bg-[#111A35] border border-slate-700 text-slate-200 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAppModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8B5CFF] text-white font-bold hover:bg-[#7a48fb]"
                >
                  Track Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
