import { SubjectCourse, Task, PlacementTracker, ProjectItem } from '../types';

/**
 * Calculates progress percentage for a subject given its modules and lessons
 */
export function calculateSubjectProgress(subject: SubjectCourse): number {
  if (!subject.modules || subject.modules.length === 0) {
    if (subject.totalLessons <= 0) return 0;
    return Math.round((subject.completedLessons / subject.totalLessons) * 100);
  }

  let total = 0;
  let completed = 0;

  for (const mod of subject.modules) {
    for (const lesson of mod.lessons) {
      total++;
      if (lesson.completed) completed++;
    }
  }

  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Calculates overall BCA curriculum progress across all core subjects
 */
export function calculateOverallProgress(subjects: SubjectCourse[]): {
  percentage: number;
  completedLessons: number;
  totalLessons: number;
} {
  if (!subjects || subjects.length === 0) {
    return { percentage: 0, completedLessons: 0, totalLessons: 0 };
  }

  let total = 0;
  let completed = 0;

  for (const s of subjects) {
    if (s.modules && s.modules.length > 0) {
      for (const m of s.modules) {
        for (const l of m.lessons) {
          total++;
          if (l.completed) completed++;
        }
      }
    } else {
      total += s.totalLessons;
      completed += s.completedLessons;
    }
  }

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { percentage, completedLessons: completed, totalLessons: total };
}

/**
 * Calculates transparent placement readiness percentage based on tracked components:
 * - DSA problem tracker (35% weight)
 * - Aptitude preparation (20% weight)
 * - Technical core concepts (20% weight)
 * - Resume & portfolio readiness (15% weight)
 * - Mock interviews done (10% weight)
 */
export function calculatePlacementReadiness(tracker: PlacementTracker): {
  overallPercentage: number;
  dsaScore: number;
  aptitudeScore: number;
  technicalScore: number;
  resumeScore: number;
  mockScore: number;
} {
  // 1. DSA Score (capped at 100%)
  const dsaRatio = tracker.dsaTarget > 0 ? Math.min(tracker.dsaSolved / tracker.dsaTarget, 1) : 0;
  const dsaScore = Math.round(dsaRatio * 100);

  // 2. Aptitude Score
  const totalAptitude = tracker.aptitudeModules.length;
  const completedAptitude = tracker.aptitudeModules.filter(a => a.completed).length;
  const aptitudeScore = totalAptitude > 0 ? Math.round((completedAptitude / totalAptitude) * 100) : 0;

  // 3. Technical Core Topics
  const totalTech = tracker.technicalTopics.length;
  const completedTech = tracker.technicalTopics.filter(t => t.completed).length;
  const technicalScore = totalTech > 0 ? Math.round((completedTech / totalTech) * 100) : 0;

  // 4. Resume & Portfolio Checklist
  const totalResume = tracker.resumeChecklist.length;
  const completedResume = tracker.resumeChecklist.filter(r => r.completed).length;
  const resumeScore = totalResume > 0 ? Math.round((completedResume / totalResume) * 100) : 0;

  // 5. Mock Interview Score
  // Baseline: at least 3 completed mock interviews with average score
  const mockCount = tracker.mockInterviews.length;
  let mockScore = 0;
  if (mockCount > 0) {
    const avgScore = tracker.mockInterviews.reduce((acc, m) => acc + m.scorePercent, 0) / mockCount;
    // Scale by having at least 3 mocks
    const quantityMultiplier = Math.min(mockCount / 3, 1);
    mockScore = Math.round(avgScore * quantityMultiplier);
  }

  const overallPercentage = Math.round(
    dsaScore * 0.35 +
    aptitudeScore * 0.20 +
    technicalScore * 0.20 +
    resumeScore * 0.15 +
    mockScore * 0.10
  );

  return {
    overallPercentage: Math.min(Math.max(overallPercentage, 0), 100),
    dsaScore,
    aptitudeScore,
    technicalScore,
    resumeScore,
    mockScore,
  };
}

/**
 * Calculates total planned study hours and completed study hours from tasks
 */
export function calculateStudyHoursFromTasks(tasks: Task[]): {
  totalHours: number;
  completedHours: number;
  completionRate: number;
} {
  if (!tasks || tasks.length === 0) {
    return { totalHours: 0, completedHours: 0, completionRate: 0 };
  }

  let totalMinutes = 0;
  let completedMinutes = 0;
  let completedCount = 0;

  for (const t of tasks) {
    const mins = t.durationMinutes || 60;
    totalMinutes += mins;
    if (t.completed) {
      completedMinutes += mins;
      completedCount++;
    }
  }

  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const completedHours = Math.round((completedMinutes / 60) * 10) / 10;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return { totalHours, completedHours, completionRate };
}

/**
 * Computes weekly study activity breakdown for the last 7 days
 */
export function calculateWeeklyActivityBreakdown(tasks: Task[]): {
  dayName: string;
  dateStr: string;
  hours: number;
  tasksCompleted: number;
}[] {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result: { dayName: string; dateStr: string; hours: number; tasksCompleted: number }[] = [];

  // Anchor to a 7-day window
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = dayNames[d.getDay()];

    const daysTasks = tasks.filter(t => t.date === dateStr);
    let hours = 0;
    let completedCount = 0;

    for (const t of daysTasks) {
      if (t.completed) {
        hours += (t.durationMinutes || 60) / 60;
        completedCount++;
      }
    }

    result.push({
      dayName,
      dateStr,
      hours: Math.round(hours * 10) / 10,
      tasksCompleted: completedCount,
    });
  }

  return result;
}

/**
 * Filter global search items across subjects, tasks, and projects
 */
export function searchWorkspace(
  query: string,
  subjects: SubjectCourse[],
  tasks: Task[],
  projects: ProjectItem[]
): {
  subjects: SubjectCourse[];
  tasks: Task[];
  projects: ProjectItem[];
} {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { subjects: [], tasks: [], projects: [] };
  }

  const matchedSubjects = subjects.filter(
    s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
  );

  const matchedTasks = tasks.filter(
    t => t.title.toLowerCase().includes(q) || (t.notes && t.notes.toLowerCase().includes(q))
  );

  const matchedProjects = projects.filter(
    p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.techStack.some(ts => ts.toLowerCase().includes(q))
  );

  return {
    subjects: matchedSubjects,
    tasks: matchedTasks,
    projects: matchedProjects,
  };
}

/**
 * Calculates current streak in days based on consecutive active task completion
 */
export function calculateStudyStreak(tasks: Task[]): number {
  const completedDates = new Set(
    tasks.filter(t => t.completed && t.date).map(t => t.date)
  );

  if (completedDates.size === 0) return 1; // Default friendly baseline streak

  let streak = 0;
  const current = new Date();
  
  // Check up to last 30 days
  for (let i = 0; i < 30; i++) {
    const d = new Date(current);
    d.setDate(current.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    if (completedDates.has(dateStr)) {
      streak++;
    } else if (i > 0) {
      // Allow today to not be completed yet if yesterday was completed
      break;
    }
  }

  return Math.max(streak, 1);
}

/**
 * Checks whether a scheduled task is within the alert lead time window (e.g. 10 minutes before start)
 */
export function shouldTriggerTaskAlert(
  taskDate: string,
  taskTime: string,
  now: Date,
  leadMinutes: number = 10
): { shouldAlert: boolean; minutesDiff: number } {
  if (!taskDate || !taskTime) {
    return { shouldAlert: false, minutesDiff: -1 };
  }

  // Parse YYYY-MM-DD
  const [year, month, day] = taskDate.split('-').map(Number);
  // Parse HH:MM
  const [hours, minutes] = taskTime.split(':').map(Number);

  if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
    return { shouldAlert: false, minutesDiff: -1 };
  }

  const taskDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
  const diffMs = taskDateTime.getTime() - now.getTime();
  const minutesDiff = Math.floor(diffMs / (1000 * 60));

  // Trigger if task starts within leadMinutes (and not already in the past by more than 1 minute)
  const shouldAlert = minutesDiff >= 0 && minutesDiff <= leadMinutes;

  return { shouldAlert, minutesDiff };
}

/**
 * Synthesizes a soft, pleasant futuristic dual-tone chime using Web Audio API
 */
export function playNotificationChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // First tone (cyan chime, 880Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Second harmonic tone (violet chime, 1320Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.1);
    gain2.gain.setValueAtTime(0.06, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.35);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.5);
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}
