import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { SemesterNumber } from '../../types';
import {
  Settings,
  User,
  Calendar,
  Download,
  RotateCcw,
  Check,
  AlertTriangle,
  Clock,
  Sparkles,
  Bell,
  Volume2,
  VolumeX,
  Play,
  ShieldCheck,
  Cloud,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

export const SettingsControlRoom: React.FC = () => {
  const {
    profile,
    updateProfile,
    resetAllData,
    exportDataJson,
    notificationSettings,
    updateNotificationSettings,
    requestNotificationPermission,
    triggerTestNotification,
    user,
    syncStatus,
    lastSyncedAt,
    syncNow,
    setAuthModalOpen,
  } = useHorizon();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [semester, setSemester] = useState<SemesterNumber>(profile.semester);
  const [dailyHours, setDailyHours] = useState(profile.dailyStudyHours);
  const [collegeHours, setCollegeHours] = useState(profile.collegeHours);
  const [dinnerHours, setDinnerHours] = useState(profile.dinnerHours);
  const [wakeWeekday, setWakeWeekday] = useState(profile.wakeUpWeekday);
  const [wakeWeekend, setWakeWeekend] = useState(profile.wakeUpWeekend);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [manualSyncLoading, setManualSyncLoading] = useState(false);
  const [manualSyncSuccess, setManualSyncSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      semester,
      dailyStudyHours: dailyHours,
      collegeHours,
      dinnerHours,
      wakeUpWeekday: wakeWeekday,
      wakeUpWeekend: wakeWeekend,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleConfirmReset = () => {
    resetAllData();
    setConfirmResetOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-7 pb-24 lg:pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#8B5CFF]/15">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-['Outfit'] text-xs font-bold tracking-widest text-[#35D9FF] uppercase font-mono">
              COMMAND CONFIGURATION
            </span>
          </div>
          <h1 className="text-3xl font-extrabold font-['Outfit'] text-white">Settings & Control Room</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure your student identity, academic schedule parameters, JSON data backups, and environment preferences.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Preferences Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Identity Card */}
        <div className="p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold font-['Outfit']">
            <User className="w-4 h-4 text-[#8B5CFF]" />
            <span>Student Identity & Academic Year</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#8B5CFF]"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Academic Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#8B5CFF]"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Current Semester</label>
              <select
                value={semester}
                onChange={e => setSemester(Number(e.target.value) as SemesterNumber)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#8B5CFF]"
              >
                {[1, 2, 3, 4, 5, 6].map(sem => (
                  <option key={sem} value={sem}>
                    Semester {sem} (Year {Math.ceil(sem / 2)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Schedule & Routine Timers */}
        <div className="p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold font-['Outfit']">
            <Clock className="w-4 h-4 text-[#35D9FF]" />
            <span>Daily Routine & Study Windows</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Daily Study Target</label>
              <select
                value={dailyHours}
                onChange={e => setDailyHours(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-white"
              >
                <option value="3-4 hrs">3-4 hours</option>
                <option value="4-6 hrs">4-6 hours (Recommended)</option>
                <option value="6-8 hrs">6-8 hours</option>
                <option value="8-10 hrs">8-10 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">College Hours (Mon-Fri)</label>
              <input
                type="text"
                value={collegeHours}
                onChange={e => setCollegeHours(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Dinner & Rest Block</label>
              <input
                type="text"
                value={dinnerHours}
                onChange={e => setDinnerHours(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Weekday Wake-up Time</label>
              <input
                type="time"
                value={wakeWeekday}
                onChange={e => setWakeWeekday(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Weekend Wake-up Time</label>
              <input
                type="time"
                value={wakeWeekend}
                onChange={e => setWakeWeekend(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111A35] border border-slate-700 text-xs text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-slate-950 font-bold text-xs shadow-md shadow-[#8B5CFF]/30 hover:scale-[1.02] transition-all cursor-pointer"
          >
            Save All Preferences
          </button>
        </div>
      </form>

      {/* Study Notifications & Schedule Alerts Card */}
      <div className="p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold font-['Outfit']">
            <Bell className="w-4 h-4 text-[#35D9FF]" />
            <span>Study Notifications & 10-Minute Schedule Alerts</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#8B5CFF]/20 text-[#C4B5FD] border border-[#8B5CFF]/30">
            Real-time Polling Engine
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Horizon automatically monitors your scheduled study blocks and classes in the Study Planner. When a scheduled task approaches, Horizon plays a synthesized dual-tone harmonic audio chime and triggers both a browser OS alert and a sci-fi HUD banner so you never miss your learning window.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {/* Main Toggle */}
          <div className="p-4 rounded-2xl bg-[#111A35]/60 border border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="block text-xs font-semibold text-white">Task Reminders</span>
              <span className="text-[11px] text-slate-400">Enable automated scheduling alerts</span>
            </div>
            <button
              type="button"
              onClick={() =>
                updateNotificationSettings({ enabled: !notificationSettings.enabled })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                notificationSettings.enabled ? 'bg-[#35D9FF]' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-[#050816] transition-transform ${
                  notificationSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Lead Time Selector */}
          <div className="p-4 rounded-2xl bg-[#111A35]/60 border border-slate-700/60 space-y-1.5">
            <label className="block text-xs font-semibold text-white">Alert Lead Time</label>
            <select
              value={notificationSettings.leadTimeMinutes}
              onChange={e =>
                updateNotificationSettings({ leadTimeMinutes: Number(e.target.value) })
              }
              className="w-full px-3 py-1.5 rounded-xl bg-[#0B1228] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#35D9FF]"
            >
              <option value={5}>5 minutes before start</option>
              <option value={10}>10 minutes before start (Default)</option>
              <option value={15}>15 minutes before start</option>
              <option value={30}>30 minutes before start</option>
            </select>
          </div>

          {/* Audio Chime Toggle */}
          <div className="p-4 rounded-2xl bg-[#111A35]/60 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {notificationSettings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#35D9FF] shrink-0" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <div>
                <span className="block text-xs font-semibold text-white">Harmonic Chime</span>
                <span className="text-[11px] text-slate-400">Synthesized 880Hz audio tone</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                updateNotificationSettings({ soundEnabled: !notificationSettings.soundEnabled })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                notificationSettings.soundEnabled ? 'bg-[#8B5CFF]' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Browser Permission Status & Test Trigger */}
        <div className="p-4 rounded-2xl bg-[#111A35]/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#35D9FF]/10 border border-[#35D9FF]/20 flex items-center justify-center text-[#35D9FF]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-200 flex items-center gap-2">
                <span>Browser Push Status:</span>
                {typeof Notification === 'undefined' ? (
                  <span className="text-slate-400 font-mono text-[11px]">Unsupported</span>
                ) : Notification.permission === 'granted' ? (
                  <span className="text-emerald-400 font-mono text-[11px] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Granted & Active
                  </span>
                ) : Notification.permission === 'denied' ? (
                  <span className="text-rose-400 font-mono text-[11px]">Blocked in Browser</span>
                ) : (
                  <span className="text-amber-400 font-mono text-[11px]">Permission Needed</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Allows system notification banners outside the browser tab.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {typeof Notification !== 'undefined' && Notification.permission !== 'granted' && (
              <button
                type="button"
                onClick={() => requestNotificationPermission()}
                className="px-3.5 py-1.5 rounded-xl bg-[#35D9FF]/20 hover:bg-[#35D9FF]/30 border border-[#35D9FF]/40 text-[#35D9FF] text-xs font-semibold transition-colors cursor-pointer"
              >
                Request Permission
              </button>
            )}

            <button
              type="button"
              onClick={triggerTestNotification}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8B5CFF]/20 to-[#35D9FF]/20 hover:from-[#8B5CFF]/30 hover:to-[#35D9FF]/30 border border-[#8B5CFF]/40 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-[#35D9FF] text-[#35D9FF]" />
              <span>Trigger Test Alert Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Firestore Real-time Cloud Synchronization Card */}
      <div className="p-6 rounded-3xl bg-[#0B1228] border border-[#35D9FF]/20 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-white font-bold font-['Outfit']">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B5CFF]/20 to-[#35D9FF]/20 border border-[#35D9FF]/30 flex items-center justify-center text-[#35D9FF]">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>Firestore Cloud Synchronization</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live onSnapshot
                </span>
              </div>
              <p className="text-[11px] font-normal text-slate-400">
                Bidirectional real-time persistence across all your connected devices & browsers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {syncStatus === 'synced' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cloud Synced</span>
              </span>
            )}
            {syncStatus === 'syncing' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35D9FF]/15 border border-[#35D9FF]/30 text-[#35D9FF] text-xs font-semibold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Pushing to Cloud...</span>
              </span>
            )}
            {syncStatus === 'offline' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-semibold">
                <span>Offline (Local Cache)</span>
              </span>
            )}
            {syncStatus === 'local_only' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <span>Local Only</span>
              </span>
            )}
            {syncStatus === 'error' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                <span>Sync Retrying</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-2xl bg-[#111A35]/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Target Firestore Database</span>
            <span className="text-xs font-mono text-[#35D9FF] font-medium break-all">
              ai-studio-horizonpremiumfu...
            </span>
            <span className="block text-[10px] text-slate-500 mt-1 font-mono">
              /users/{user ? user.uid.substring(0, 8) + '...' : '{uid}'}/app_state/current
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111A35]/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Account & Storage Scope</span>
            {user ? (
              <div>
                <span className="text-xs text-white font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {user.email || user.displayName || 'Authenticated Student'}
                </span>
                <span className="block text-[10px] text-[#C4B5FD] mt-1 font-mono">
                  {user.isAnonymous ? 'Guest Identity (Auto-persisted)' : 'Firebase Account'}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-xs text-amber-300 font-semibold">Browser Local Only</span>
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="block text-[10px] text-[#35D9FF] hover:underline mt-1 font-semibold"
                >
                  Sign in with Google / Email to sync
                </button>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111A35]/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Last Cloud State Push</span>
            <span className="text-xs font-medium text-white">
              {lastSyncedAt ? new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Pending initial push'}
            </span>
            <span className="block text-[10px] text-slate-500 mt-1 font-mono">
              Debounce interval: 1200ms
            </span>
          </div>
        </div>

        {/* Synced collections breakdown */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Synchronized State Entities
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              'Planner Tasks & Slots',
              'Focus Timer (120m Arena)',
              'Curriculum Milestones',
              'Cyber Security Roadmap',
              'Project Repositories',
              'Placement Readiness',
              'YouTube Lecture Library',
              'Routine & Identity Settings',
            ].map(entity => (
              <span
                key={entity}
                className="px-2.5 py-1 rounded-lg bg-[#111A35] border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#35D9FF]" />
                {entity}
              </span>
            ))}
          </div>
        </div>

        {/* Sync Action CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <p className="text-xs text-slate-400">
            Auto-sync runs in background whenever you add tasks, finish 120m focus sessions, or bookmark YouTube lectures.
          </p>

          <div className="flex items-center gap-2">
            {manualSyncSuccess && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> Pushed Successfully!
              </span>
            )}
            {user ? (
              <button
                type="button"
                disabled={manualSyncLoading}
                onClick={async () => {
                  setManualSyncLoading(true);
                  try {
                    await syncNow();
                    setManualSyncSuccess(true);
                    setTimeout(() => setManualSyncSuccess(false), 2500);
                  } finally {
                    setManualSyncLoading(false);
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CFF]/30 to-[#35D9FF]/30 hover:from-[#8B5CFF]/45 hover:to-[#35D9FF]/45 border border-[#35D9FF]/50 text-white text-xs font-bold transition-all shadow-md shadow-[#35D9FF]/10 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#35D9FF] ${manualSyncLoading ? 'animate-spin' : ''}`} />
                <span>{manualSyncLoading ? 'Pushing State...' : 'Sync to Cloud Now'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer hover:opacity-95"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Sign In to Enable Cloud Sync</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold font-['Outfit']">
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Data Backup & State Recovery</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          All your scheduled tasks, roadmap progress, project repositories, and placement tracking are stored locally in your browser storage. You can export a snapshot backup at any time.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={exportDataJson}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111A35] hover:bg-[#172346] border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#35D9FF]" />
            <span>Export Roadmap & Data Backup (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Reset to Initial Curriculum Defaults</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#0B1228] border border-rose-500/40 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Reset All Local Storage Data?
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will restore the original sample BCA roadmap, scheduled tasks, and placement checklist. Any custom entries you created will be reset.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
