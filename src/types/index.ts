export type SemesterNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type ThemeId = 'electric-blue' | 'cyber-cyan' | 'emerald' | 'purple' | 'amber';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  gradient: string;
  glowClass: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
  photoURL?: string | null;
}

export interface FocusSession {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  timestamp: number;
  mode: '120min' | '90min' | '60min' | '45min' | '25min' | 'custom';
}

export interface YouTubeLecture {
  id: string;
  title: string;
  videoId: string;
  url: string;
  category: string;
  channel: string;
  duration: string;
  notes?: string;
  isCustom?: boolean;
}

export interface YouTubePlaylistItem {
  id: string;
  title: string;
  videoId: string;
  duration?: string;
  completed?: boolean;
}

export interface YouTubePlaylist {
  id: string;
  playlistId: string;
  title: string;
  channel: string;
  category: string;
  description?: string;
  itemCount: number;
  url: string;
  isCustom?: boolean;
  videos: YouTubePlaylistItem[];
}

export interface UserProfile {
  name: string;
  email: string;
  semester: SemesterNumber;
  dailyStudyHours: string;
  studyDays: string[];
  goals: string[];
  learningPriorities: string[];
  wakeUpWeekday: string;
  wakeUpWeekend: string;
  collegeHours: string;
  dinnerHours: string;
  onboarded: boolean;
}

export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  priority: PriorityLevel;
  completed: boolean;
  notes?: string;
  isRecurringClass?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  notes?: string;
}

export interface PracticeTask {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  codeSnippet?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
  practiceTasks: PracticeTask[];
  revisionChecklist: { id: string; text: string; checked: boolean }[];
}

export interface SubjectCourse {
  id: string;
  name: string;
  shortName: string;
  category: 'core' | 'specialization' | 'foundations' | 'career';
  color: string;
  accentColor: string;
  iconName: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  lastStudied?: string;
  modules: CourseModule[];
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  category: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  progress: number;
  prerequisites?: string[];
  semester: SemesterNumber;
  year: 1 | 2 | 3;
}

export interface LabItem {
  id: string;
  title: string;
  scenario: string;
  safeLabCommandOrTool: string;
  completed: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CybersecurityModule {
  id: string;
  order: number;
  title: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  objectives: string[];
  labs: LabItem[];
  notes: string;
}

export interface AIModule {
  id: string;
  order: number;
  title: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  objectives: string[];
  keyConcepts: string[];
  labs: { id: string; title: string; completed: boolean }[];
  projectIdea: string;
}

export type ProjectStatus = 'Planned' | 'In Progress' | 'Completed' | 'Archived';
export type ProjectCategory = 'web' | 'automation' | 'cybersecurity' | 'aiml' | 'systems';

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
  category: ProjectCategory;
  progress: number;
  tasks: ProjectTask[];
  startDate: string;
  dueDate: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface DSACategory {
  name: string;
  solved: number;
  total: number;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  appliedDate: string;
  status: 'Wishlist' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  notes?: string;
  packageLPA?: string;
}

export interface MockInterview {
  id: string;
  date: string;
  topic: string;
  interviewerOrPlatform: string;
  scorePercent: number;
  feedback: string;
}

export interface PlacementTracker {
  dsaTarget: number;
  dsaSolved: number;
  dsaCategories: DSACategory[];
  aptitudeModules: { id: string; title: string; completed: boolean; score?: number }[];
  technicalTopics: { id: string; title: string; completed: boolean; category: string }[];
  resumeChecklist: { id: string; text: string; completed: boolean }[];
  mockInterviews: MockInterview[];
  jobApplications: JobApplication[];
}

export interface ActivityDay {
  day: string;
  hours: number;
  tasksCompleted: number;
}

export interface NotificationSettings {
  enabled: boolean;
  leadTimeMinutes: number; // e.g., 10 minutes before start
  soundEnabled: boolean;
  permissionState: 'default' | 'granted' | 'denied';
}

export interface InAppAlert {
  id: string;
  taskId: string;
  title: string;
  subjectName: string;
  time: string;
  minutesLeft: number;
  timestamp: number;
}
