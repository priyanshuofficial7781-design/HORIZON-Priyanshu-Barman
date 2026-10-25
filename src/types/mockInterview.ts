import { LeetCodeProblem, ProgrammingLanguage, CodeEvaluationResult } from './leetcode';

export type InterviewRoundType = 'timed_coding' | 'conversational_technical' | 'conversational_behavioral';

export type InterviewerPersona = 'FAANG Bar Raiser' | 'Staff Systems Engineer' | 'Engineering Director';

export interface InterviewMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
}

export interface RubricScore {
  category: string;
  score: number; // 1 to 5
  feedback: string;
}

export interface ConversationalInterviewResult {
  id: string;
  roundType: InterviewRoundType;
  interviewerPersona: InterviewerPersona;
  topic: string;
  durationMinutes: number;
  overallDecision: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Leaning No Hire' | 'No Hire';
  rubricScores: RubricScore[];
  keyStrengths: string[];
  areasForImprovement: string[];
  summaryFeedback: string;
  timestamp: number;
}

export interface TimedCodingSession {
  id: string;
  problem: LeetCodeProblem;
  language: ProgrammingLanguage;
  code: string;
  timeRemainingSeconds: number;
  totalTimeSeconds: number;
  isCompleted: boolean;
  evaluation?: CodeEvaluationResult;
  scorePercent?: number;
  interviewerNotes?: string;
  timestamp: number;
}
