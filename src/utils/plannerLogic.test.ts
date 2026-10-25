import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSubjectProgress,
  calculateOverallProgress,
  calculatePlacementReadiness,
  calculateStudyHoursFromTasks,
  calculateWeeklyActivityBreakdown,
  searchWorkspace,
  calculateStudyStreak,
  shouldTriggerTaskAlert,
} from './plannerLogic';
import { SubjectCourse, Task, PlacementTracker, ProjectItem } from '../types';

test('calculateSubjectProgress accurately sums lesson completion across modules', () => {
  const dummySubject: SubjectCourse = {
    id: 'cpp-dsa',
    name: 'C++ & DSA',
    shortName: 'C++/DSA',
    category: 'core',
    color: '#8B5CFF',
    accentColor: '#35D9FF',
    iconName: 'Code',
    description: 'Master Data Structures & Algorithms',
    totalLessons: 4,
    completedLessons: 2,
    modules: [
      {
        id: 'm1',
        title: 'Arrays & Vectors',
        lessons: [
          { id: 'l1', title: 'Intro', durationMinutes: 60, completed: true },
          { id: 'l2', title: 'Sliding Window', durationMinutes: 90, completed: true },
        ],
        practiceTasks: [],
        revisionChecklist: [],
      },
      {
        id: 'm2',
        title: 'Linked Lists',
        lessons: [
          { id: 'l3', title: 'Singly Linked', durationMinutes: 60, completed: false },
          { id: 'l4', title: 'Doubly Linked', durationMinutes: 60, completed: false },
        ],
        practiceTasks: [],
        revisionChecklist: [],
      },
    ],
  };

  const progress = calculateSubjectProgress(dummySubject);
  assert.equal(progress, 50); // 2 of 4 lessons completed
});

test('calculateOverallProgress computes total curriculum progress accurately', () => {
  const dummySubjects: SubjectCourse[] = [
    {
      id: 'sub1',
      name: 'Subject 1',
      shortName: 'S1',
      category: 'core',
      color: '#8B5CFF',
      accentColor: '#35D9FF',
      iconName: 'Code',
      description: 'Desc 1',
      totalLessons: 10,
      completedLessons: 5,
      modules: [],
    },
    {
      id: 'sub2',
      name: 'Subject 2',
      shortName: 'S2',
      category: 'specialization',
      color: '#35D9FF',
      accentColor: '#8B5CFF',
      iconName: 'Shield',
      description: 'Desc 2',
      totalLessons: 20,
      completedLessons: 10,
      modules: [],
    },
  ];

  const overall = calculateOverallProgress(dummySubjects);
  assert.equal(overall.totalLessons, 30);
  assert.equal(overall.completedLessons, 15);
  assert.equal(overall.percentage, 50);
});

test('calculatePlacementReadiness returns weighted score without fabricating numbers', () => {
  const dummyTracker: PlacementTracker = {
    dsaTarget: 200,
    dsaSolved: 100, // 50% * 0.35 = 17.5
    dsaCategories: [{ name: 'Arrays', solved: 20, total: 30 }],
    aptitudeModules: [
      { id: 'a1', title: 'Percentages', completed: true },
      { id: 'a2', title: 'Permutations', completed: false },
    ], // 50% * 0.20 = 10
    technicalTopics: [
      { id: 't1', title: 'DBMS Normalization', completed: true, category: 'DBMS' },
      { id: 't2', title: 'OS Deadlocks', completed: true, category: 'OS' },
    ], // 100% * 0.20 = 20
    resumeChecklist: [
      { id: 'r1', text: 'Tailored resume', completed: true },
      { id: 'r2', text: 'GitHub pinned', completed: true },
    ], // 100% * 0.15 = 15
    mockInterviews: [
      {
        id: 'm1',
        date: '2026-04-10',
        topic: 'DSA Mock',
        interviewerOrPlatform: 'Pramp',
        scorePercent: 80,
        feedback: 'Good tree explanations',
      },
    ], // 1 mock of target 3 -> (80 * 1/3) = ~27% * 0.10 = 2.7
    jobApplications: [],
  };

  const result = calculatePlacementReadiness(dummyTracker);
  assert.equal(result.dsaScore, 50);
  assert.equal(result.aptitudeScore, 50);
  assert.equal(result.technicalScore, 100);
  assert.equal(result.resumeScore, 100);
  // Total ~ 17.5 + 10 + 20 + 15 + 3 = ~65
  assert.ok(result.overallPercentage >= 60 && result.overallPercentage <= 70);
});

test('calculateStudyHoursFromTasks calculates total hours, completed hours and rate', () => {
  const dummyTasks: Task[] = [
    {
      id: 't1',
      title: 'DSA Binary Search',
      subjectId: 'cpp-dsa',
      date: '2026-04-15',
      time: '18:30',
      durationMinutes: 120, // 2 hours
      priority: 'high',
      completed: true,
    },
    {
      id: 't2',
      title: 'Python Scripting',
      subjectId: 'python',
      date: '2026-04-15',
      time: '13:00',
      durationMinutes: 60, // 1 hour
      priority: 'medium',
      completed: false,
    },
  ];

  const hours = calculateStudyHoursFromTasks(dummyTasks);
  assert.equal(hours.totalHours, 3);
  assert.equal(hours.completedHours, 2);
  assert.equal(hours.completionRate, 50);
});

test('searchWorkspace filters subjects, tasks, and projects by keyword query', () => {
  const subjects: SubjectCourse[] = [
    {
      id: 'cpp',
      name: 'C++ & DSA',
      shortName: 'C++',
      category: 'core',
      color: '#8B5CFF',
      accentColor: '#35D9FF',
      iconName: 'Code',
      description: 'Competitive programming and algorithms',
      totalLessons: 10,
      completedLessons: 0,
      modules: [],
    },
  ];

  const tasks: Task[] = [
    {
      id: 't1',
      title: 'Dynamic Programming practice',
      subjectId: 'cpp',
      date: '2026-04-15',
      time: '18:30',
      durationMinutes: 120,
      priority: 'high',
      completed: false,
    },
  ];

  const projects: ProjectItem[] = [
    {
      id: 'p1',
      title: 'Cybersecurity Packet Sniffer',
      description: 'A tool built in Python and Scapy',
      techStack: ['Python', 'Networking'],
      status: 'In Progress',
      category: 'cybersecurity',
      progress: 60,
      tasks: [],
      startDate: '2026-04-01',
      dueDate: '2026-05-01',
    },
  ];

  const res1 = searchWorkspace('programming', subjects, tasks, projects);
  assert.equal(res1.subjects.length, 1);
  assert.equal(res1.tasks.length, 1);
  assert.equal(res1.projects.length, 0);

  const res2 = searchWorkspace('packet', subjects, tasks, projects);
  assert.equal(res2.projects.length, 1);
});

test('shouldTriggerTaskAlert triggers accurately 10 minutes prior to scheduled start time', () => {
  // If task starts at 18:30 on 2026-10-23
  // And now is 18:20 on 2026-10-23 (exactly 10 minutes before)
  const nowExact10 = new Date(2026, 9, 23, 18, 20, 0, 0);
  const res1 = shouldTriggerTaskAlert('2026-10-23', '18:30', nowExact10, 10);
  assert.equal(res1.shouldAlert, true);
  assert.equal(res1.minutesDiff, 10);

  // If now is 18:15 (15 mins before), should not trigger for 10m threshold
  const now15Before = new Date(2026, 9, 23, 18, 15, 0, 0);
  const res2 = shouldTriggerTaskAlert('2026-10-23', '18:30', now15Before, 10);
  assert.equal(res2.shouldAlert, false);
  assert.equal(res2.minutesDiff, 15);

  // If now is 18:25 (5 mins before), is within 10m window
  const now5Before = new Date(2026, 9, 23, 18, 25, 0, 0);
  const res3 = shouldTriggerTaskAlert('2026-10-23', '18:30', now5Before, 10);
  assert.equal(res3.shouldAlert, true);
  assert.equal(res3.minutesDiff, 5);

  // If task already started 10 mins ago (18:40), should not trigger
  const nowPast = new Date(2026, 9, 23, 18, 40, 0, 0);
  const res4 = shouldTriggerTaskAlert('2026-10-23', '18:30', nowPast, 10);
  assert.equal(res4.shouldAlert, false);
  assert.ok(res4.minutesDiff < 0);
});
