export interface CompensationLevel {
  id: string;
  company: 'Google' | 'Meta' | 'Amazon' | 'Microsoft' | 'Uber';
  level: string; // e.g. 'L3 (Entry / SDE 1)', 'L4 (Mid / SDE 2)', 'L5 (Senior)'
  title: string;
  yearsOfExp: string;
  baseSalary: number; // in USD or INR equivalent
  equityYearly: number;
  bonusYearly: number;
  totalCompensationYearly: number;
  currency: 'USD' | 'INR';
  vestingSchedule: string;
  samplePerks: string[];
}

export interface CompanyTrack {
  id: string;
  company: 'Google' | 'Meta' | 'Amazon' | 'Microsoft' | 'Uber';
  logoColor: string;
  focusTagline: string;
  difficultyRating: 'Extreme' | 'High' | 'Moderate';
  interviewFormat: string[];
  keyAlgorithmicFocus: string[];
  systemDesignExpectations: string;
  behavioralStyle: string;
  coreProblems: string[]; // problem IDs
}

export interface StarStory {
  id: string;
  title: string;
  targetCompany: 'Google' | 'Meta' | 'Amazon' | 'Microsoft' | 'Uber' | 'General';
  leadershipPillar: string; // e.g. 'Customer Obsession', 'Ownership', 'Deep Dive', 'Googleyness'
  situation: string;
  task: string;
  action: string;
  result: string;
  metricsMentioned: string[];
  aiFeedback?: string;
  aiScore?: number; // 0 - 100
  updatedAt: number;
}

export interface StudentReadinessState {
  problemsSolvedIds: string[];
  currentStreakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalSubmissions: number;
  mockInterviewsCompleted: number;
  systemDesignsCompleted: number;
  readinessScore: number; // 0 - 100
  contestRank: number;
  starStoriesCount: number;
}
