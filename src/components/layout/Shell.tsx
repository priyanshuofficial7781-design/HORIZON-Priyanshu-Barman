import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { THEME_CONFIGS } from '../../utils/themeConfig';
import { ThemeId } from '../../types';
import { QuickAddModal } from '../modals/QuickAddModal';
import { SearchModal } from '../modals/SearchModal';
import { InAppNotificationHUD } from '../notifications/InAppNotificationHUD';
import { AuthModal } from '../auth/AuthModal';
import { DualAssistantModal } from '../ai/DualAssistantModal';
import { AiTutorDrawer } from '../ai/AiTutorDrawer';
import {
  Compass,
  Home,
  Layers,
  Flame,
  Youtube,
  Calendar,
  Map,
  ShieldAlert,
  Brain,
  FolderGit2,
  Briefcase,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Plus,
  Clock,
  CheckCircle2,
  LogIn,
  Shield,
  User,
  Cloud,
  CloudOff,
  RefreshCw,
  Code2,
  UserCheck,
  DollarSign,
  TrendingUp,
  Sparkles,
  Trophy,
  Award,
  Building2,
  Bot,
  Palette,
  ChevronDown,
} from 'lucide-react';

interface NavSection {
  title: string;
  badge?: string;
  items: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    setQuickAddOpen,
    authModalOpen,
    setAuthModalOpen,
    user,
    profile,
    tasks,
    notificationSettings,
    requestNotificationPermission,
    triggerTestNotification,
    syncStatus,
    lastSyncedAt,
    syncNow,
    aiCopilotOpen,
    setAiCopilotOpen,
    currentTheme,
    setCurrentTheme,
  } = useHorizon();

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const theme = THEME_CONFIGS[currentTheme] || THEME_CONFIGS['electric-blue'];
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  const navSections: NavSection[] = [
    {
      title: 'HIGH-PACKAGE CAREER',
      badge: 'Tier-1 Prep',
      items: [
        { id: 'home', label: 'Home Command', icon: Home },
        { id: 'leetcode', label: 'LeetCode & SDE', icon: Code2 },
        { id: 'systemdesign', label: 'System Design Studio', icon: Layers },
        { id: 'mockinterview', label: 'Mock Interview Arena', icon: UserCheck },
        { id: 'compensation', label: 'FAANG Salary Explorer', icon: DollarSign },
        { id: 'companytracks', label: 'Company Tracks', icon: Building2 },
        { id: 'starstories', label: 'STAR Story Bank', icon: Award },
        { id: 'readiness', label: 'Readiness & Streak', icon: Trophy },
      ],
    },
    {
      title: 'CORE CURRICULUM',
      badge: 'Academic CS',
      items: [
        { id: 'planner', label: 'Study Planner', icon: Calendar },
        { id: 'roadmap', label: 'Three-Year Roadmap', icon: Map },
        { id: 'cybersecurity', label: 'Cybersecurity', icon: ShieldAlert },
        { id: 'aiml', label: 'AI / ML Laboratory', icon: Brain },
        { id: 'projects', label: 'Projects Studio', icon: FolderGit2 },
      ],
    },
    {
      title: 'DEEP WORK & MEDIA',
      items: [
        { id: 'focus', label: '120-Min Focus Arena', icon: Flame },
        { id: 'youtube', label: 'YouTube Cinema', icon: Youtube },
        { id: 'trackers', label: '3D Trackers Arena', icon: Layers },
        { id: 'progress', label: 'Progress & Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const currentDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  const themeOptions: ThemeId[] = [
    'electric-blue',
    'cyber-cyan',
    'emerald',
    'purple',
    'amber',
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#050816] text-slate-100 font-sans">
      {/* Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* Quick Add Modal */}
      <QuickAddModal />

      {/* Auth Modal */}
      <AuthModal />

      {/* In-App Notification HUD */}
      <InAppNotificationHUD />

      {/* Global AI Copilot Slide-Over Drawer */}
      <AiTutorDrawer />

      {/* LEFT SIDEBAR */}
      <aside
        className={`relative z-20 flex flex-col justify-between border-r border-slate-800/80 bg-[#070d1e] transition-all duration-200 select-none ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand & Navigation Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Brand Area */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800/80 shrink-0">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-left overflow-hidden cursor-pointer"
            >
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${theme.gradient} p-[1.5px] shadow-lg shrink-0`}
              >
                <div className="w-full h-full bg-[#050816] rounded-[10px] flex items-center justify-center">
                  <Compass className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <span className="font-['Outfit'] font-bold text-base tracking-wider text-white block">
                    HORIZON
                  </span>
                  <span className="text-[9px] tracking-widest uppercase font-mono block text-cyan-400">
                    BCA COMMAND
                  </span>
                </div>
              )}
            </button>

            {/* Toggle Collapse */}
            <button
              type="button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links Grouped by Categories */}
          <nav className="p-2 space-y-4 overflow-y-auto flex-1">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {!sidebarCollapsed && (
                  <div className="px-3 pt-2 pb-1 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    <span>{section.title}</span>
                    {section.badge && (
                      <span className="px-1.5 py-0.2 rounded bg-slate-800/70 text-slate-400 text-[9px]">
                        {section.badge}
                      </span>
                    )}
                  </div>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
                        isActive
                          ? `bg-gradient-to-r ${theme.gradient} text-white font-bold shadow-md shadow-slate-900/40`
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 font-medium'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      {!sidebarCollapsed && item.id === 'planner' && pendingTasksCount > 0 && (
                        <span className="ml-auto px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-900 text-cyan-300 border border-slate-700">
                          {pendingTasksCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer User Badge */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/30 shrink-0">
          <div
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/70 transition-colors cursor-pointer"
          >
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-tr ${theme.gradient} flex items-center justify-center text-slate-950 font-bold text-xs shrink-0 shadow-md`}
            >
              {user ? (
                user.displayName ? (
                  user.displayName[0].toUpperCase()
                ) : (
                  'S'
                )
              ) : profile.name ? (
                profile.name[0].toUpperCase()
              ) : (
                <User className="w-4 h-4 text-slate-900" />
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="truncate flex-1">
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {user?.displayName || profile.name || 'Scholar Account'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  {user ? (user.isAnonymous ? 'Guest Sync' : 'Cloud Sync') : 'Sign In Required'}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 px-6 border-b border-slate-800/80 bg-[#080d1e]/90 backdrop-blur-md flex items-center justify-between gap-4 shrink-0 z-10">
          {/* Left: Global Search */}
          <div className="flex-1 max-w-md">
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-300 transition-all cursor-pointer shadow-inner"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span className="truncate">Search Horizon (DSA, architecture, labs)...</span>
              </div>
              <span className="hidden sm:inline font-mono text-[10px] bg-black/40 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400">
                ⌘K
              </span>
            </button>
          </div>

          {/* Right: Theme Switcher, AI Copilot, Date, Notifications, Quick Add, Auth Button */}
          <div className="flex items-center gap-3">
            {/* Theme Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setThemeDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Switch Theme Palette"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <span className="hidden lg:inline text-[11px] font-mono">{theme.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#090f22] border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase font-bold border-b border-slate-800/80 mb-1">
                    Select Theme Palette
                  </div>
                  <div className="space-y-1">
                    {themeOptions.map((tId) => {
                      const opt = THEME_CONFIGS[tId];
                      const isSelected = currentTheme === tId;
                      return (
                        <button
                          key={tId}
                          type="button"
                          onClick={() => {
                            setCurrentTheme(tId);
                            setThemeDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-800 text-white font-bold'
                              : 'text-slate-300 hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: opt.primaryColor }}
                            />
                            <span>{opt.name}</span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Current Date */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentDateFormatted}</span>
            </div>

            {/* Slide-over AI Copilot Trigger */}
            <button
              type="button"
              onClick={() => setAiCopilotOpen(!aiCopilotOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer border ${
                aiCopilotOpen
                  ? `bg-gradient-to-r ${theme.gradient} text-white border-transparent`
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-cyan-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">AI Tutor</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-cyan-300 font-mono">
                Dual
              </span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/70 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {pendingTasksCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-[#090f22] border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Alert Center
                      </span>
                      <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {notificationSettings.leadTimeMinutes}m buffer
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {pendingTasksCount} pending
                    </span>
                  </div>

                  <div className="my-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">Browser Alerts</span>
                      {typeof Notification !== 'undefined' &&
                      Notification.permission === 'granted' ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => requestNotificationPermission()}
                          className="text-[10px] text-cyan-400 underline hover:text-cyan-300 font-semibold cursor-pointer"
                        >
                          Enable Notifications
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="py-1 space-y-2 max-h-56 overflow-y-auto">
                    {tasks.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-3">
                        No tasks scheduled today
                      </p>
                    ) : (
                      tasks.slice(0, 4).map((t) => (
                        <div
                          key={t.id}
                          className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5"
                        >
                          <CheckCircle2
                            className={`w-4 h-4 mt-0.5 shrink-0 ${
                              t.completed ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-200 font-medium truncate">{t.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {t.time} · {t.durationMinutes}m
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cloud Sync Status */}
            <button
              type="button"
              onClick={() => {
                if (!user || user.isAnonymous) {
                  setAuthModalOpen(true);
                } else {
                  syncNow();
                }
              }}
              title={
                user && !user.isAnonymous
                  ? `Firestore Sync (${syncStatus.toUpperCase()}) · Click to sync now`
                  : 'Click to Sign In'
              }
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                syncStatus === 'syncing'
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                  : syncStatus === 'synced'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {syncStatus === 'syncing' ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              ) : syncStatus === 'synced' ? (
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <CloudOff className="w-3.5 h-3.5" />
              )}
              <span className="text-[10px]">
                {syncStatus === 'syncing' ? 'Syncing' : syncStatus === 'synced' ? 'Synced' : 'Local'}
              </span>
            </button>

            {/* Quick Add Button */}
            <button
              type="button"
              onClick={() => setQuickAddOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-bold text-xs shadow-md hover:opacity-95 transition-all cursor-pointer`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Quick Add</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#050816] cosmic-grid relative min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
};
