import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  UserProfile,
  SubjectCourse,
  Task,
  RoadmapMilestone,
  CybersecurityModule,
  AIModule,
  ProjectItem,
  PlacementTracker,
  NotificationSettings,
  InAppAlert,
  AuthUser,
  FocusSession,
  YouTubeLecture,
  YouTubePlaylist,
  YouTubePlaylistItem,
  ThemeId,
} from '../types';
import { StarStory } from '../types/career';
import {
  initialUserProfile,
  initialSubjects,
  initialTasks,
  initialRoadmapMilestones,
  initialCybersecurityModules,
  initialAIModules,
  initialProjects,
  initialPlacementTracker,
  initialNotificationSettings,
  initialYouTubeLectures,
  initialYouTubePlaylists,
  initialFocusSessions,
} from '../utils/initialData';
import { shouldTriggerTaskAlert, playNotificationChime } from '../utils/plannerLogic';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
  testFirestoreConnection,
} from '../lib/firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { syncService, SyncStatus, SyncedAppState } from '../services/syncService';

interface HorizonContextType {
  // Navigation & Startup flow states
  splashActive: boolean;
  setSplashActive: (active: boolean) => void;
  onboardingActive: boolean;
  setOnboardingActive: (active: boolean) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;

  // Global search & quick add & auth modals
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  quickAddOpen: boolean;
  setQuickAddOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;

  // Authentication State
  user: AuthUser | null;
  authLoading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;

  // Data states
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  subjects: SubjectCourse[];
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updated: Partial<Task>) => void;
  toggleTaskCompleted: (id: string) => void;
  deleteTask: (id: string) => void;

  // Subject / Lesson actions
  toggleLessonCompleted: (subjectId: string, moduleId: string, lessonId: string) => void;
  togglePracticeCompleted: (subjectId: string, moduleId: string, taskId: string) => void;
  toggleRevisionChecklist: (subjectId: string, moduleId: string, checkId: string) => void;

  // Focus Arena & Sessions
  focusSessions: FocusSession[];
  addFocusSession: (session: Omit<FocusSession, 'id' | 'timestamp'>) => void;

  // YouTube Cinema, Playlists & Queue
  youtubeLectures: YouTubeLecture[];
  selectedLecture: YouTubeLecture;
  setSelectedLecture: (lecture: YouTubeLecture) => void;
  addCustomYouTubeLecture: (urlOrId: string, customTitle?: string) => YouTubeLecture | null;
  updateLectureNotes: (id: string, notes: string) => void;
  savedPlaylists: YouTubePlaylist[];
  activePlaylist: YouTubePlaylist | null;
  activePlaylistVideoIndex: number;
  autoPlayNext: boolean;
  setAutoPlayNext: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  setActivePlaylistById: (playlistId: string | null) => void;
  setActivePlaylistVideoIndex: (idx: number) => void;
  addCustomYouTubePlaylist: (urlOrId: string, customTitle?: string, category?: string) => Promise<YouTubePlaylist | null>;
  toggleVideoCompletedInPlaylist: (playlistId: string, videoId: string) => void;
  markPlaylistUpToEpisodeWatched: (playlistId: string, episodeIndex: number) => void;
  playNextInPlaylist: () => void;
  playPrevInPlaylist: () => void;
  refreshPlaylist: (playlistId: string) => Promise<boolean>;
  isFetchingPlaylist: boolean;
  lastWatchedVideoByPlaylist: Record<string, number>;

  // Roadmap actions
  milestones: RoadmapMilestone[];
  toggleMilestoneStatus: (id: string) => void;

  // Cybersecurity path
  cyberModules: CybersecurityModule[];
  toggleCyberLabCompleted: (moduleId: string, labId: string) => void;

  // AI / ML laboratory
  aiModules: AIModule[];
  toggleAILabCompleted: (moduleId: string, labId: string) => void;

  // Projects
  projects: ProjectItem[];
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, updated: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  toggleProjectTask: (projectId: string, taskId: string) => void;

  // Placement Tracker
  placementTracker: PlacementTracker;
  updateDsaCount: (solved: number) => void;
  toggleAptitudeModule: (id: string) => void;
  toggleTechnicalTopic: (id: string) => void;
  toggleResumeItem: (id: string) => void;
  addMockInterview: (mock: Omit<PlacementTracker['mockInterviews'][0], 'id'>) => void;
  addJobApplication: (app: Omit<PlacementTracker['jobApplications'][0], 'id'>) => void;
  updateJobApplicationStatus: (id: string, status: PlacementTracker['jobApplications'][0]['status']) => void;

  // Notification Engine
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (updated: Partial<NotificationSettings>) => void;
  requestNotificationPermission: () => Promise<'default' | 'granted' | 'denied'>;
  activeAlerts: InAppAlert[];
  dismissAlert: (id: string) => void;
  triggerTestNotification: () => void;

  // Real-time Firestore Cloud Synchronization
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  syncNow: () => Promise<boolean>;

  // Theme Management
  currentTheme: ThemeId;
  setCurrentTheme: (theme: ThemeId) => void;

  // LeetCode & High-Package Career Platform
  solvedLeetCodeIds: string[];
  markLeetCodeSolved: (id: string) => void;
  streakDays: number;
  setStreakDays: (days: number | ((prev: number) => number)) => void;
  aiCopilotOpen: boolean;
  setAiCopilotOpen: (open: boolean) => void;
  selectedLeetCodeProblemId: string | null;
  setSelectedLeetCodeProblemId: (id: string | null) => void;

  // System Design Blueprint tracking
  completedSystemDesignIds: string[];
  markSystemDesignCompleted: (id: string) => void;

  // STAR Story Bank
  starStories: StarStory[];
  addStarStory: (story: Omit<StarStory, 'id' | 'updatedAt'>) => void;
  updateStarStory: (id: string, updated: Partial<StarStory>) => void;
  deleteStarStory: (id: string) => void;

  // Mock Interview Sessions
  mockSessions: Array<{ id: string; title: string; type: string; score: number; passed: boolean; date: string }>;
  addMockSessionRecord: (title: string, type: string, score: number, passed: boolean) => void;

  // Global utilities
  resetAllData: () => void;
  exportDataJson: () => void;
}

const HorizonContext = createContext<HorizonContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'horizon_profile_v3',
  SUBJECTS: 'horizon_subjects_v3',
  TASKS: 'horizon_tasks_v3',
  ROADMAP: 'horizon_roadmap_v3',
  CYBER: 'horizon_cyber_v3',
  AIML: 'horizon_aiml_v3',
  PROJECTS: 'horizon_projects_v3',
  PLACEMENT: 'horizon_placement_v3',
  NOTIFICATIONS: 'horizon_notifications_v3',
  FOCUS_SESSIONS: 'horizon_focus_sessions_v3',
  YOUTUBE_LECTURES: 'horizon_youtube_lectures_v3',
  YOUTUBE_PLAYLISTS: 'horizon_youtube_playlists_v3',
};

// Helper to extract YouTube playlist ID from any playlist or watch link
export function extractYouTubePlaylistId(input: string): string | null {
  const trimmed = input.trim();
  if (/^(?:PL|UU|LL|FL|RD|OLAK)[a-zA-Z0-9_-]{10,}$/i.test(trimmed)) {
    return trimmed;
  }
  const listParamMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/i);
  if (listParamMatch && listParamMatch[1]) {
    return listParamMatch[1];
  }
  const embedMatch = trimmed.match(/videoseries\?list=([a-zA-Z0-9_-]+)/i);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }
  return null;
}

// Helper to extract YouTube video ID from various link formats
export function extractYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regex);
  return match ? match[1] : null;
}

export const HorizonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAutostart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [splashActive, setSplashActive] = useState(!isAutostart);
  const [onboardingActive, setOnboardingActive] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Search & quick add & auth modals
  const [searchQuery, setSearchQuery] = useState('');
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Authentication State
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Core Data States
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : initialUserProfile;
    } catch {
      return initialUserProfile;
    }
  });

  const [subjects, setSubjects] = useState<SubjectCourse[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return saved ? JSON.parse(saved) : initialSubjects;
    } catch {
      return initialSubjects;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOCUS_SESSIONS);
      return saved ? JSON.parse(saved) : initialFocusSessions;
    } catch {
      return initialFocusSessions;
    }
  });

  const [youtubeLectures, setYoutubeLectures] = useState<YouTubeLecture[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.YOUTUBE_LECTURES);
      return saved ? JSON.parse(saved) : initialYouTubeLectures;
    } catch {
      return initialYouTubeLectures;
    }
  });

  const [selectedLecture, setSelectedLecture] = useState<YouTubeLecture>(
    () => youtubeLectures[0] || initialYouTubeLectures[0]
  );

  // YouTube Playlist Queue & Saved Playlists
  const [savedPlaylists, setSavedPlaylists] = useState<YouTubePlaylist[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.YOUTUBE_PLAYLISTS);
      return saved ? JSON.parse(saved) : initialYouTubePlaylists;
    } catch {
      return initialYouTubePlaylists;
    }
  });

  const [activePlaylist, setActivePlaylist] = useState<YouTubePlaylist | null>(
    () => savedPlaylists[0] || initialYouTubePlaylists[0] || null
  );

  const [activePlaylistVideoIndex, setActivePlaylistVideoIndex] = useState<number>(0);
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(true);
  const [isFetchingPlaylist, setIsFetchingPlaylist] = useState<boolean>(false);
  const [lastWatchedVideoByPlaylist, setLastWatchedVideoByPlaylist] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('horizon_yt_last_watched_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [milestones, setMilestones] = useState<RoadmapMilestone[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROADMAP);
      return saved ? JSON.parse(saved) : initialRoadmapMilestones;
    } catch {
      return initialRoadmapMilestones;
    }
  });

  const [cyberModules, setCyberModules] = useState<CybersecurityModule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CYBER);
      return saved ? JSON.parse(saved) : initialCybersecurityModules;
    } catch {
      return initialCybersecurityModules;
    }
  });

  const [aiModules, setAiModules] = useState<AIModule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AIML);
      return saved ? JSON.parse(saved) : initialAIModules;
    } catch {
      return initialAIModules;
    }
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  const [placementTracker, setPlacementTracker] = useState<PlacementTracker>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLACEMENT);
      return saved ? JSON.parse(saved) : initialPlacementTracker;
    } catch {
      return initialPlacementTracker;
    }
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const parsed = saved ? JSON.parse(saved) : initialNotificationSettings;
      if (typeof window !== 'undefined' && 'Notification' in window) {
        parsed.permissionState = Notification.permission as 'default' | 'granted' | 'denied';
      }
      return parsed;
    } catch {
      return initialNotificationSettings;
    }
  });

  const [activeAlerts, setActiveAlerts] = useState<InAppAlert[]>([]);
  const alertedTasksTodayRef = useRef<Set<string>>(new Set());

  // Real-time Firestore Cloud Synchronization State
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local_only');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Theme state
  const [currentTheme, setCurrentThemeState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem('horizon_theme_v1') as ThemeId;
      if (saved && ['electric-blue', 'cyber-cyan', 'emerald', 'purple', 'amber'].includes(saved)) {
        return saved;
      }
      return 'electric-blue';
    } catch {
      return 'electric-blue';
    }
  });

  const setCurrentTheme = (theme: ThemeId) => {
    setCurrentThemeState(theme);
    try {
      localStorage.setItem('horizon_theme_v1', theme);
    } catch (e) {
      console.warn(e);
    }
  };

  // LeetCode & High-Package Platform State (strictly starting from 0)
  const [solvedLeetCodeIds, setSolvedLeetCodeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('horizon_solved_leetcode_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);
  const [selectedLeetCodeProblemId, setSelectedLeetCodeProblemId] = useState<string | null>(null);
  
  // Streak strictly starting at 0
  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('horizon_streak_days_v1');
      return saved ? JSON.parse(saved) : 0;
    } catch {
      return 0;
    }
  });

  const markLeetCodeSolved = (id: string) => {
    setSolvedLeetCodeIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem('horizon_solved_leetcode_v1', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
    // Advance streak if 0
    setStreakDays((prev) => {
      const next = prev === 0 ? 1 : prev;
      try {
        localStorage.setItem('horizon_streak_days_v1', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  // System Design Blueprints completed (starting at 0)
  const [completedSystemDesignIds, setCompletedSystemDesignIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('horizon_sys_design_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const markSystemDesignCompleted = (id: string) => {
    setCompletedSystemDesignIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem('horizon_sys_design_v1', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  // STAR Stories (strictly starting at 0)
  const [starStories, setStarStories] = useState<StarStory[]>(() => {
    try {
      const saved = localStorage.getItem('horizon_star_stories_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addStarStory = (story: Omit<StarStory, 'id' | 'updatedAt'>) => {
    const newStory: StarStory = {
      ...story,
      id: `story-${Date.now()}`,
      updatedAt: Date.now(),
    };
    setStarStories((prev) => {
      const next = [newStory, ...prev];
      try {
        localStorage.setItem('horizon_star_stories_v1', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const updateStarStory = (id: string, updated: Partial<StarStory>) => {
    setStarStories((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updated, updatedAt: Date.now() } : s));
      try {
        localStorage.setItem('horizon_star_stories_v1', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const deleteStarStory = (id: string) => {
    setStarStories((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem('horizon_star_stories_v1', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  // Mock Interview sessions history (strictly starting at 0)
  const [mockSessions, setMockSessions] = useState<
    Array<{ id: string; title: string; type: string; score: number; passed: boolean; date: string }>
  >(() => {
    try {
      const saved = localStorage.getItem('horizon_mock_sessions_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addMockSessionRecord = (title: string, type: string, score: number, passed: boolean) => {
    const newSession = {
      id: `mock-sess-${Date.now()}`,
      title,
      type,
      score,
      passed,
      date: 'Today',
    };
    setMockSessions((prev) => {
      const next = [newSession, ...prev];
      try {
        localStorage.setItem('horizon_mock_sessions_v1', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  useEffect(() => {
    const unsub = syncService.subscribeStatus((status, time) => {
      setSyncStatus(status);
      if (time) setLastSyncedAt(time);
    });
    return () => unsub();
  }, []);

  // Listen to Firebase auth state & manage remote Firestore sync
  useEffect(() => {
    testFirestoreConnection();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const mappedUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || profile.name || 'Scholar',
          isAnonymous: firebaseUser.isAnonymous,
          photoURL: firebaseUser.photoURL,
        };
        setUser(mappedUser);
        if (firebaseUser.displayName && !profile.name) {
          setProfile((prev) => ({ ...prev, name: firebaseUser.displayName || prev.name }));
        }
        if (firebaseUser.email) {
          setProfile((prev) => ({ ...prev, email: firebaseUser.email || prev.email }));
        }

        // Pull initial remote state from Firestore if not guest
        if (!firebaseUser.isAnonymous) {
          const remoteData = await syncService.pullInitialRemoteState(firebaseUser.uid);
          if (remoteData) {
            if (remoteData.profile) setProfile(remoteData.profile);
            if (remoteData.tasks) setTasks(remoteData.tasks);
            if (remoteData.focusSessions) setFocusSessions(remoteData.focusSessions);
            if (remoteData.youtubeLectures) setYoutubeLectures(remoteData.youtubeLectures);
            if (remoteData.milestones) setMilestones(remoteData.milestones);
            if (remoteData.cyberModules) setCyberModules(remoteData.cyberModules);
            if (remoteData.projects) setProjects(remoteData.projects);
            if (remoteData.placementTracker) setPlacementTracker(remoteData.placementTracker);
          }
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time listener for multi-device sync
  useEffect(() => {
    if (!user || user.isAnonymous) return;

    const unsubscribeRemote = syncService.listenRemoteState(user.uid, (remoteData) => {
      if (!remoteData) return;
      if (remoteData.profile) setProfile(remoteData.profile);
      if (remoteData.tasks) setTasks(remoteData.tasks);
      if (remoteData.focusSessions) setFocusSessions(remoteData.focusSessions);
      if (remoteData.youtubeLectures) setYoutubeLectures(remoteData.youtubeLectures);
      if (remoteData.milestones) setMilestones(remoteData.milestones);
      if (remoteData.cyberModules) setCyberModules(remoteData.cyberModules);
      if (remoteData.projects) setProjects(remoteData.projects);
      if (remoteData.placementTracker) setPlacementTracker(remoteData.placementTracker);
    });

    return () => {
      unsubscribeRemote();
    };
  }, [user]);

  // Real-time automatic push: debounced synchronization to Firestore on state mutations
  useEffect(() => {
    if (!user || user.isAnonymous) return;

    syncService.pushStateDebounced(user.uid, {
      profile,
      tasks,
      focusSessions,
      youtubeLectures,
      milestones,
      cyberModules,
      projects,
      placementTracker,
    });
  }, [
    user,
    profile,
    tasks,
    focusSessions,
    youtubeLectures,
    milestones,
    cyberModules,
    projects,
    placementTracker,
  ]);

  const syncNow = async (): Promise<boolean> => {
    if (!user || user.isAnonymous) return false;
    return await syncService.pushStateImmediately(user.uid, {
      profile,
      tasks,
      focusSessions,
      youtubeLectures,
      milestones,
      cyberModules,
      projects,
      placementTracker,
    });
  };

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, JSON.stringify(focusSessions));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [focusSessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.YOUTUBE_LECTURES, JSON.stringify(youtubeLectures));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [youtubeLectures]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(milestones));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [milestones]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CYBER, JSON.stringify(cyberModules));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [cyberModules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AIML, JSON.stringify(aiModules));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [aiModules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLACEMENT, JSON.stringify(placementTracker));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [placementTracker]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notificationSettings));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [notificationSettings]);

  // Auth Methods
  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setAuthModalOpen(false);
    } catch (error: any) {
      console.error('Google Sign-in failed:', error);
      setAuthError(error.message || 'Google sign-in was cancelled or encountered an error.');
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setAuthModalOpen(false);
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      setAuthError(error.message || 'Invalid credentials or user does not exist.');
      throw error;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name?: string) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name) {
        setProfile((prev) => ({ ...prev, name, email }));
      }
      setAuthModalOpen(false);
    } catch (error: any) {
      console.error('Registration error:', error);
      setAuthError(error.message || 'Registration failed.');
      throw error;
    }
  };

  const loginAsGuest = async () => {
    setAuthError(null);
    try {
      await signInAnonymously(auth);
      setAuthModalOpen(false);
    } catch (error: any) {
      console.error('Guest sign-in error:', error);
      // Fallback local guest
      setUser({
        uid: 'guest-' + Date.now(),
        email: 'scholar@horizon.guest',
        displayName: 'Guest Scholar',
        isAnonymous: true,
      });
      setAuthModalOpen(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  // Notification Engine Check
  useEffect(() => {
    const checkUpcomingClassesAndTasks = () => {
      if (!notificationSettings.enabled) return;
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayDateStr = now.toISOString().split('T')[0];

      tasks.forEach((task) => {
        if (task.completed) return;
        const alertTrigger = shouldTriggerTaskAlert(
          task.date,
          task.time,
          now,
          notificationSettings.leadTimeMinutes
        );

        if (alertTrigger.shouldAlert) {
          const alertKey = `${task.id}_${todayDateStr}_${task.time}`;
          if (alertedTasksTodayRef.current.has(alertKey)) return;
          alertedTasksTodayRef.current.add(alertKey);

          const subject = subjects.find((s) => s.id === task.subjectId);
          const subjectName = subject ? subject.name : 'Horizon Session';

          const newAlert: InAppAlert = {
            id: 'alert_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            taskId: task.id,
            title: task.title,
            subjectName,
            time: task.time,
            minutesLeft: alertTrigger.minutesDiff,
            timestamp: Date.now(),
          };

          setActiveAlerts((prev) => [newAlert, ...prev.slice(0, 4)]);

          if (notificationSettings.soundEnabled) {
            playNotificationChime();
          }

          if (
            typeof Notification !== 'undefined' &&
            Notification.permission === 'granted'
          ) {
            try {
              new Notification(`Horizon Alert: ${task.title}`, {
                body: `Starts in ${alertTrigger.minutesDiff} mins at ${task.time} (${subjectName}).`,
                icon: '/assets/horizon/cyber_shield.png',
                tag: task.id,
              });
            } catch (err) {
              console.warn('Native notification dispatch error:', err);
            }
          }
        }
      });
    };

    checkUpcomingClassesAndTasks();
    const interval = window.setInterval(checkUpcomingClassesAndTasks, 30000);
    return () => window.clearInterval(interval);
  }, [tasks, subjects, notificationSettings]);

  // Request native permission
  const requestNotificationPermission = async (): Promise<'default' | 'granted' | 'denied'> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    try {
      const perm = await Notification.requestPermission();
      setNotificationSettings((prev) => ({
        ...prev,
        permissionState: perm,
        enabled: perm === 'granted' ? true : prev.enabled,
      }));
      return perm;
    } catch {
      return 'denied';
    }
  };

  const dismissAlert = (alertId: string) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const triggerTestNotification = () => {
    const testAlert: InAppAlert = {
      id: 'test_' + Date.now(),
      taskId: 'test_task',
      title: 'Practice C++ Virtual Destructors & Polymorphism',
      subjectName: 'C++ / DSA',
      time: 'In 10 mins',
      minutesLeft: notificationSettings.leadTimeMinutes || 10,
      timestamp: Date.now(),
    };
    setActiveAlerts((prev) => [testAlert, ...prev]);

    if (notificationSettings.soundEnabled) {
      playNotificationChime();
    }

    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification('Horizon Alert (Test)', {
          body: `Upcoming session starting in ${notificationSettings.leadTimeMinutes} minutes.`,
          icon: '/assets/horizon/cyber_shield.png',
        });
      } catch (err) {
        console.warn('Native notification failed:', err);
      }
    }
  };

  // Focus Arena Sessions
  const addFocusSession = (session: Omit<FocusSession, 'id' | 'timestamp'>) => {
    const newSession: FocusSession = {
      ...session,
      id: 'fs_' + Date.now(),
      timestamp: Date.now(),
    };
    setFocusSessions((prev) => [newSession, ...prev]);

    // Update study hours in profile
    const hoursAdded = Math.round((session.durationMinutes / 60) * 10) / 10;
    if (session.completed && hoursAdded > 0) {
      setProfile((prev) => {
        const currentHoursMatch = prev.dailyStudyHours.match(/\d+(\.\d+)?/);
        const currentNum = currentHoursMatch ? parseFloat(currentHoursMatch[0]) : 4;
        return {
          ...prev,
          dailyStudyHours: `${Math.round((currentNum + hoursAdded) * 10) / 10} hrs`,
        };
      });
    }
  };

  // YouTube Cinema & Lectures
  const addCustomYouTubeLecture = (urlOrId: string, customTitle?: string): YouTubeLecture | null => {
    const videoId = extractYouTubeVideoId(urlOrId);
    if (!videoId) return null;

    const existing = youtubeLectures.find((l) => l.videoId === videoId);
    if (existing) {
      setSelectedLecture(existing);
      return existing;
    }

    const newLecture: YouTubeLecture = {
      id: 'custom-yt-' + Date.now(),
      title: customTitle || `YouTube Lecture (${videoId})`,
      videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      category: 'Custom Lecture',
      channel: 'User Video',
      duration: 'Interactive',
      isCustom: true,
      notes: '',
    };

    setYoutubeLectures((prev) => [newLecture, ...prev]);
    setSelectedLecture(newLecture);
    return newLecture;
  };

  const updateLectureNotes = (id: string, notes: string) => {
    setYoutubeLectures((prev) =>
      prev.map((l) => (l.id === id ? { ...l, notes } : l))
    );
    if (selectedLecture.id === id) {
      setSelectedLecture((prev) => ({ ...prev, notes }));
    }
  };

  const handleSetActivePlaylistVideoIndex = (idx: number) => {
    setActivePlaylistVideoIndex(idx);
    if (activePlaylist) {
      setLastWatchedVideoByPlaylist((prev) => {
        const next = {
          ...prev,
          [activePlaylist.playlistId]: idx,
          [activePlaylist.id]: idx,
        };
        try {
          localStorage.setItem('horizon_yt_last_watched_v1', JSON.stringify(next));
        } catch (e) {
          console.warn(e);
        }
        return next;
      });
    }
  };

  const setActivePlaylistById = (playlistId: string | null) => {
    if (!playlistId) {
      setActivePlaylist(null);
      return;
    }
    const found = savedPlaylists.find((p) => p.playlistId === playlistId || p.id === playlistId);
    if (found) {
      setActivePlaylist(found);
      const resumeIndex =
        lastWatchedVideoByPlaylist[found.playlistId] ??
        lastWatchedVideoByPlaylist[found.id] ??
        0;
      setActivePlaylistVideoIndex(
        Math.min(resumeIndex, Math.max(0, found.videos.length - 1))
      );
    }
  };

  const addCustomYouTubePlaylist = async (
    urlOrId: string,
    customTitle?: string,
    category?: string
  ): Promise<YouTubePlaylist | null> => {
    const playlistId = extractYouTubePlaylistId(urlOrId);
    if (!playlistId) return null;

    // Detect target video if present in the link (e.g. youtu.be/VTLCoHnyACE?list=... or &v=...)
    let targetVideoId: string | null = null;
    const vMatch = urlOrId.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
    if (vMatch) {
      targetVideoId = vMatch[1];
    } else {
      const shortMatch = urlOrId.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
      if (shortMatch) {
        targetVideoId = shortMatch[1];
      }
    }

    // Check if it matches our pre-loaded curated complete library
    const curatedMatch = initialYouTubePlaylists.find((p) => p.playlistId === playlistId);
    if (curatedMatch && curatedMatch.videos.length >= 40) {
      const alreadySaved = savedPlaylists.find((p) => p.playlistId === playlistId);
      if (alreadySaved && alreadySaved.videos.length >= curatedMatch.videos.length) {
        setActivePlaylist(alreadySaved);
        if (targetVideoId) {
          const matchedIdx = alreadySaved.videos.findIndex((v) => v.videoId === targetVideoId);
          if (matchedIdx !== -1) {
            handleSetActivePlaylistVideoIndex(matchedIdx);
            return alreadySaved;
          }
        }
        const resumeIdx =
          lastWatchedVideoByPlaylist[alreadySaved.playlistId] ??
          lastWatchedVideoByPlaylist[alreadySaved.id] ??
          0;
        setActivePlaylistVideoIndex(
          Math.min(resumeIdx, Math.max(0, alreadySaved.videos.length - 1))
        );
        return alreadySaved;
      }
      setSavedPlaylists((prev) => [curatedMatch, ...prev.filter((p) => p.playlistId !== playlistId)]);
      try {
        localStorage.setItem(
          STORAGE_KEYS.YOUTUBE_PLAYLISTS,
          JSON.stringify([curatedMatch, ...savedPlaylists.filter((p) => p.playlistId !== playlistId)])
        );
      } catch (e) {
        console.warn(e);
      }
      setActivePlaylist(curatedMatch);
      if (targetVideoId) {
        const matchedIdx = curatedMatch.videos.findIndex((v) => v.videoId === targetVideoId);
        if (matchedIdx !== -1) {
          handleSetActivePlaylistVideoIndex(matchedIdx);
        } else {
          setActivePlaylistVideoIndex(0);
        }
      } else {
        setActivePlaylistVideoIndex(0);
      }
      return curatedMatch;
    }

    // Check if already in saved playlists
    const existing = savedPlaylists.find((p) => p.playlistId === playlistId);
    if (existing) {
      setActivePlaylist(existing);
      if (targetVideoId) {
        const matchedIdx = existing.videos.findIndex((v) => v.videoId === targetVideoId);
        if (matchedIdx !== -1) {
          handleSetActivePlaylistVideoIndex(matchedIdx);
          return existing;
        }
      }
      const resumeIdx =
        lastWatchedVideoByPlaylist[existing.playlistId] ??
        lastWatchedVideoByPlaylist[existing.id] ??
        0;
      setActivePlaylistVideoIndex(
        Math.min(resumeIdx, Math.max(0, existing.videos.length - 1))
      );
      return existing;
    }

    setIsFetchingPlaylist(true);
    let resolvedPlaylist: YouTubePlaylist | null = null;

    try {
      // Call server proxy extraction endpoint
      const res = await fetch(`/api/youtube/playlist?id=${encodeURIComponent(playlistId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.playlist && Array.isArray(data.playlist.videos) && data.playlist.videos.length > 0) {
          resolvedPlaylist = {
            id: `custom-pl-${Date.now()}`,
            playlistId,
            title: customTitle?.trim() || data.playlist.title || `YouTube Playlist (${playlistId.slice(0, 8)})`,
            channel: data.playlist.channel || 'YouTube Series',
            category: category || 'DSA & Computer Science',
            description: data.playlist.description || `Complete playlist with ${data.playlist.videos.length} episodes.`,
            itemCount: data.playlist.videos.length,
            url: `https://www.youtube.com/playlist?list=${playlistId}`,
            isCustom: true,
            videos: data.playlist.videos.map((v: any, i: number) => ({
              id: v.id || `vid-${playlistId}-${i + 1}`,
              title: v.title || `Episode ${i + 1}`,
              videoId: v.videoId || '',
              duration: v.duration || 'Lesson',
              completed: false,
            })),
          };
        }
      }
    } catch (fetchErr) {
      console.warn('Server playlist proxy failed, building resilient series:', fetchErr);
    } finally {
      setIsFetchingPlaylist(false);
    }

    // Graceful fallback if proxy is unavailable or rate-limited
    if (!resolvedPlaylist) {
      const fallbackTitle = customTitle?.trim() || `YouTube Playlist (${playlistId.slice(0, 8)})`;
      resolvedPlaylist = {
        id: `custom-pl-${Date.now()}`,
        playlistId,
        title: fallbackTitle,
        channel: 'YouTube Series',
        category: category || 'Custom Playlist',
        description: 'Imported YouTube playlist with queue navigation and auto-playback.',
        itemCount: 20,
        url: `https://www.youtube.com/playlist?list=${playlistId}`,
        isCustom: true,
        videos: Array.from({ length: 20 }, (_, i) => ({
          id: `vid-${playlistId}-${i + 1}`,
          title: `${fallbackTitle} - Track ${i + 1}`,
          videoId: '',
          duration: 'Lesson',
          completed: false,
        })),
      };
    }

    setSavedPlaylists((prev) => {
      const next = [resolvedPlaylist!, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.YOUTUBE_PLAYLISTS, JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });

    setActivePlaylist(resolvedPlaylist);

    // Auto-jump to target video if specified in link
    if (targetVideoId) {
      const matchedIdx = resolvedPlaylist.videos.findIndex((v) => v.videoId === targetVideoId);
      if (matchedIdx !== -1) {
        handleSetActivePlaylistVideoIndex(matchedIdx);
      } else {
        handleSetActivePlaylistVideoIndex(0);
      }
    } else {
      handleSetActivePlaylistVideoIndex(0);
    }

    return resolvedPlaylist;
  };

  const refreshPlaylist = async (playlistId: string): Promise<boolean> => {
    setIsFetchingPlaylist(true);
    try {
      const res = await fetch(`/api/youtube/playlist?id=${encodeURIComponent(playlistId)}&refresh=1`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.playlist && Array.isArray(data.playlist.videos) && data.playlist.videos.length > 0) {
          const updatedPlaylist: YouTubePlaylist = {
            id: `pl-${playlistId}`,
            playlistId,
            title: data.playlist.title,
            channel: data.playlist.channel,
            category: data.playlist.category || 'DSA & Computer Science',
            description: data.playlist.description,
            itemCount: data.playlist.videos.length,
            url: `https://www.youtube.com/playlist?list=${playlistId}`,
            isCustom: true,
            videos: data.playlist.videos.map((v: any, i: number) => ({
              id: v.id || `vid-${playlistId}-${i + 1}`,
              title: v.title || `Episode ${i + 1}`,
              videoId: v.videoId || '',
              duration: v.duration || 'Lesson',
              completed: false,
            })),
          };

          setSavedPlaylists((prev) => {
            const next = [
              updatedPlaylist,
              ...prev.filter((p) => p.playlistId !== playlistId && p.id !== playlistId),
            ];
            try {
              localStorage.setItem(STORAGE_KEYS.YOUTUBE_PLAYLISTS, JSON.stringify(next));
            } catch (e) {
              console.warn(e);
            }
            return next;
          });

          setActivePlaylist(updatedPlaylist);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.warn('Failed to refresh playlist:', err);
      return false;
    } finally {
      setIsFetchingPlaylist(false);
    }
  };

  const toggleVideoCompletedInPlaylist = (playlistId: string, videoId: string) => {
    setSavedPlaylists((prev) => {
      const next = prev.map((pl) => {
        if (pl.id === playlistId || pl.playlistId === playlistId) {
          const updatedVideos = pl.videos.map((v) =>
            v.id === videoId ? { ...v, completed: !v.completed } : v
          );
          return { ...pl, videos: updatedVideos };
        }
        return pl;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.YOUTUBE_PLAYLISTS, JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });

    if (activePlaylist && (activePlaylist.id === playlistId || activePlaylist.playlistId === playlistId)) {
      setActivePlaylist((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          videos: prev.videos.map((v) =>
            v.id === videoId ? { ...v, completed: !v.completed } : v
          ),
        };
      });
    }
  };

  const markPlaylistUpToEpisodeWatched = (playlistId: string, episodeIndex: number) => {
    setSavedPlaylists((prev) => {
      const next = prev.map((pl) => {
        if (pl.id === playlistId || pl.playlistId === playlistId) {
          const updatedVideos = pl.videos.map((v, idx) =>
            idx <= episodeIndex ? { ...v, completed: true } : v
          );
          return { ...pl, videos: updatedVideos };
        }
        return pl;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.YOUTUBE_PLAYLISTS, JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });

    if (activePlaylist && (activePlaylist.id === playlistId || activePlaylist.playlistId === playlistId)) {
      setActivePlaylist((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          videos: prev.videos.map((v, idx) =>
            idx <= episodeIndex ? { ...v, completed: true } : v
          ),
        };
      });
    }
  };

  const playNextInPlaylist = () => {
    if (!activePlaylist || activePlaylist.videos.length === 0) return;
    const nextIdx = (activePlaylistVideoIndex + 1) % activePlaylist.videos.length;
    handleSetActivePlaylistVideoIndex(nextIdx);
  };

  const playPrevInPlaylist = () => {
    if (!activePlaylist || activePlaylist.videos.length === 0) return;
    const prevIdx =
      activePlaylistVideoIndex === 0
        ? activePlaylist.videos.length - 1
        : activePlaylistVideoIndex - 1;
    handleSetActivePlaylistVideoIndex(prevIdx);
  };

  // Profile
  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Tasks
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: 'task_' + Date.now(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, updated: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleLessonCompleted = (subjectId: string, moduleId: string, lessonId: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const updatedMods = sub.modules.map((mod) => {
          if (mod.id !== moduleId) return mod;
          return {
            ...mod,
            lessons: mod.lessons.map((l) =>
              l.id === lessonId ? { ...l, completed: !l.completed } : l
            ),
          };
        });
        const completedCount = updatedMods.reduce(
          (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
          0
        );
        return {
          ...sub,
          modules: updatedMods,
          completedLessons: completedCount,
        };
      })
    );
  };

  const togglePracticeCompleted = (subjectId: string, moduleId: string, taskId: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          modules: sub.modules.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  practiceTasks: m.practiceTasks.map((p) =>
                    p.id === taskId ? { ...p, completed: !p.completed } : p
                  ),
                }
              : m
          ),
        };
      })
    );
  };

  const toggleRevisionChecklist = (subjectId: string, moduleId: string, checkId: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          modules: sub.modules.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  revisionChecklist: m.revisionChecklist.map((r) =>
                    r.id === checkId ? { ...r, checked: !r.checked } : r
                  ),
                }
              : m
          ),
        };
      })
    );
  };

  // Roadmap
  const toggleMilestoneStatus = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextStatus =
          m.status === 'upcoming'
            ? 'in_progress'
            : m.status === 'in_progress'
            ? 'completed'
            : 'upcoming';
        return {
          ...m,
          status: nextStatus,
          progress: nextStatus === 'completed' ? 100 : nextStatus === 'in_progress' ? 50 : 0,
        };
      })
    );
  };

  // Cybersecurity
  const toggleCyberLabCompleted = (moduleId: string, labId: string) => {
    setCyberModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;
        const updatedLabs = mod.labs.map((lab) =>
          lab.id === labId ? { ...lab, completed: !lab.completed } : lab
        );
        const allCompleted = updatedLabs.every((l) => l.completed);
        const anyCompleted = updatedLabs.some((l) => l.completed);
        return {
          ...mod,
          labs: updatedLabs,
          status: allCompleted ? 'completed' : anyCompleted ? 'in_progress' : 'upcoming',
        };
      })
    );
  };

  // AI / ML
  const toggleAILabCompleted = (moduleId: string, labId: string) => {
    setAiModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;
        const updatedLabs = mod.labs.map((lab) =>
          lab.id === labId ? { ...lab, completed: !lab.completed } : lab
        );
        const allCompleted = updatedLabs.every((l) => l.completed);
        const anyCompleted = updatedLabs.some((l) => l.completed);
        return {
          ...mod,
          labs: updatedLabs,
          status: allCompleted ? 'completed' : anyCompleted ? 'in_progress' : 'upcoming',
        };
      })
    );
  };

  // Projects
  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    const newProj: ProjectItem = {
      ...project,
      id: 'proj_' + Date.now(),
    };
    setProjects((prev) => [newProj, ...prev]);
  };

  const updateProject = (id: string, updated: Partial<ProjectItem>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProjectTask = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedTasks = p.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const progress = Math.round((completedCount / (updatedTasks.length || 1)) * 100);
        return {
          ...p,
          tasks: updatedTasks,
          progress,
          status: progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Planned',
        };
      })
    );
  };

  // Placement Tracker
  const updateDsaCount = (solved: number) => {
    setPlacementTracker((prev) => ({
      ...prev,
      dsaSolved: Math.max(0, solved),
    }));
  };

  const toggleAptitudeModule = (id: string) => {
    setPlacementTracker((prev) => ({
      ...prev,
      aptitudeModules: prev.aptitudeModules.map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      ),
    }));
  };

  const toggleTechnicalTopic = (id: string) => {
    setPlacementTracker((prev) => ({
      ...prev,
      technicalTopics: prev.technicalTopics.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    }));
  };

  const toggleResumeItem = (id: string) => {
    setPlacementTracker((prev) => ({
      ...prev,
      resumeChecklist: prev.resumeChecklist.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      ),
    }));
  };

  const addMockInterview = (mock: Omit<PlacementTracker['mockInterviews'][0], 'id'>) => {
    setPlacementTracker((prev) => ({
      ...prev,
      mockInterviews: [...prev.mockInterviews, { ...mock, id: 'mock_' + Date.now() }],
    }));
  };

  const addJobApplication = (app: Omit<PlacementTracker['jobApplications'][0], 'id'>) => {
    setPlacementTracker((prev) => ({
      ...prev,
      jobApplications: [...prev.jobApplications, { ...app, id: 'job_' + Date.now() }],
    }));
  };

  const updateJobApplicationStatus = (
    id: string,
    status: PlacementTracker['jobApplications'][0]['status']
  ) => {
    setPlacementTracker((prev) => ({
      ...prev,
      jobApplications: prev.jobApplications.map((j) => (j.id === id ? { ...j, status } : j)),
    }));
  };

  const updateNotificationSettings = (updated: Partial<NotificationSettings>) => {
    setNotificationSettings((prev) => ({ ...prev, ...updated }));
  };

  // Reset all to clean zero baseline
  const resetAllData = () => {
    setProfile(initialUserProfile);
    setTasks(initialTasks);
    setFocusSessions(initialFocusSessions);
    setMilestones(initialRoadmapMilestones);
    setCyberModules(initialCybersecurityModules);
    setAiModules(initialAIModules);
    setProjects(initialProjects);
    setPlacementTracker(initialPlacementTracker);
    setNotificationSettings(initialNotificationSettings);
    setYoutubeLectures(initialYouTubeLectures);
    setSelectedLecture(initialYouTubeLectures[0]);
    localStorage.clear();
  };

  // Export JSON backup
  const exportDataJson = () => {
    const backup = {
      profile,
      tasks,
      focusSessions,
      youtubeLectures,
      milestones,
      cyberModules,
      aiModules,
      projects,
      placementTracker,
      notificationSettings,
      exportedAt: new Date().toISOString(),
    };
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `horizon_bca_backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <HorizonContext.Provider
      value={{
        splashActive,
        setSplashActive,
        onboardingActive,
        setOnboardingActive,
        onboardingStep,
        setOnboardingStep,
        activeTab,
        setActiveTab,
        selectedSubjectId,
        setSelectedSubjectId,
        sidebarCollapsed,
        setSidebarCollapsed,
        searchQuery,
        setSearchQuery,
        quickAddOpen,
        setQuickAddOpen,
        authModalOpen,
        setAuthModalOpen,
        user,
        authLoading,
        authError,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginAsGuest,
        logout,
        profile,
        updateProfile,
        subjects,
        tasks,
        addTask,
        updateTask,
        toggleTaskCompleted,
        deleteTask,
        toggleLessonCompleted,
        togglePracticeCompleted,
        toggleRevisionChecklist,
        focusSessions,
        addFocusSession,
        youtubeLectures,
        selectedLecture,
        setSelectedLecture,
        addCustomYouTubeLecture,
        updateLectureNotes,
        savedPlaylists,
        activePlaylist,
        activePlaylistVideoIndex,
        autoPlayNext,
        setAutoPlayNext,
        setActivePlaylistById,
        setActivePlaylistVideoIndex: handleSetActivePlaylistVideoIndex,
        addCustomYouTubePlaylist,
        toggleVideoCompletedInPlaylist,
        markPlaylistUpToEpisodeWatched,
        playNextInPlaylist,
        playPrevInPlaylist,
        refreshPlaylist,
        isFetchingPlaylist,
        lastWatchedVideoByPlaylist,
        milestones,
        toggleMilestoneStatus,
        cyberModules,
        toggleCyberLabCompleted,
        aiModules,
        toggleAILabCompleted,
        projects,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectTask,
        placementTracker,
        updateDsaCount,
        toggleAptitudeModule,
        toggleTechnicalTopic,
        toggleResumeItem,
        addMockInterview,
        addJobApplication,
        updateJobApplicationStatus,
        notificationSettings,
        updateNotificationSettings,
        requestNotificationPermission,
        activeAlerts,
        dismissAlert,
        triggerTestNotification,
        resetAllData,
        exportDataJson,
        syncStatus,
        lastSyncedAt,
        syncNow,
        currentTheme,
        setCurrentTheme,
        solvedLeetCodeIds,
        markLeetCodeSolved,
        streakDays,
        setStreakDays,
        aiCopilotOpen,
        setAiCopilotOpen,
        selectedLeetCodeProblemId,
        setSelectedLeetCodeProblemId,
        completedSystemDesignIds,
        markSystemDesignCompleted,
        starStories,
        addStarStory,
        updateStarStory,
        deleteStarStory,
        mockSessions,
        addMockSessionRecord,
      }}
    >
      {children}
    </HorizonContext.Provider>
  );
};

export const useHorizon = () => {
  const context = useContext(HorizonContext);
  if (!context) {
    throw new Error('useHorizon must be used within a HorizonProvider');
  }
  return context;
};
