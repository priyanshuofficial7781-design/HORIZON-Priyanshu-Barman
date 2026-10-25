export type ProgrammingLanguage = 'python' | 'cpp' | 'java';

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export type SheetType =
  | 'Blind 75'
  | 'NeetCode 150'
  | 'Striver SDE'
  | 'FAANG Tags'
  | 'Core CS Master'
  | 'System Design 100'
  | 'Aptitude 500'
  | 'AI Generated';

export type MainDomain =
  | 'All'
  | 'DSA & Algorithms'
  | 'System Design'
  | 'Core Computer Science'
  | 'Aptitude & Logic';

export interface QuestionQuery {
  domain?: string;
  category?: string;
  difficulty?: ProblemDifficulty | 'All';
  companyTag?: string;
  sheet?: string;
  search?: string;
  page: number;
  pageSize: number;
}

export interface QuestionPageResult {
  problems: LeetCodeProblem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface TestCase {
  input: string;
  expected: string;
  isHidden?: boolean;
}

export interface ExampleCase {
  input: string;
  output: string;
  explanation?: string;
}

export interface LeetCodeProblem {
  id: string;
  number: number;
  title: string;
  difficulty: ProblemDifficulty;
  category: string;
  acceptanceRate: string;
  sheets: SheetType[];
  companyTags: string[];
  description: string;
  examples: ExampleCase[];
  constraints: string[];
  starterCode: Record<ProgrammingLanguage, string>;
  testCases: TestCase[];
  socraticHints: string[];
  timeComplexityOptimal: string;
  spaceComplexityOptimal: string;
  isAiGenerated?: boolean;
}

export type SubmissionStatus =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Time Limit Exceeded'
  | 'Compilation Error'
  | 'Runtime Error';

export interface CodeEvaluationResult {
  status: SubmissionStatus;
  passedTests: number;
  totalTests: number;
  runtimeMs: number;
  runtimeBeatsPercent: number;
  memoryMb: number;
  memoryBeatsPercent: number;
  testCaseResults: {
    index: number;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    stdout?: string;
  }[];
  errorMessage?: string;
  timestamp: number;
}

export interface ProblemStats {
  problemId: string;
  solved: boolean;
  attemptsCount: number;
  lastLanguageUsed?: ProgrammingLanguage;
  lastCode?: Record<ProgrammingLanguage, string>;
  solvedAt?: number;
  bestRuntimeMs?: number;
}
