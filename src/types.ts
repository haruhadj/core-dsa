export type TopicCategory = "DS" | "ALGO";
export type DifficultyLevel = "Easy" | "Medium" | "Hard";

export interface ComplexityInfo {
  time: string;
  space: string;
  best?: string;
  average?: string;
  worst?: string;
}

export interface DSATopic {
  id: string;
  name: string;
  category: TopicCategory;
  difficulty: DifficultyLevel;
  shortDesc: string;
  fullDesc: string;
  complexity: ComplexityInfo;
  typescriptTemplate: string;
  explanationSteps: string[];
  realWorldUse: string;
}

export interface PracticeChallenge {
  id: string;
  topicId: string;
  title: string;
  difficulty: DifficultyLevel;
  prompt: string;
  starterCode: string;
  solutionSnippet: string;
  hints: string[];
  testRunner: (userCode: string) => { passed: boolean; logs: string[] };
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface UserProgress {
  completedTopics: string[]; // List of topic IDs
  solvedChallenges: string[]; // List of challenge IDs
  quizScores: Record<string, number>; // quizId -> score percentage
  streakCount: number;
  lastActiveDate: string | null;
  savedNotes: Record<string, string>; // topicId -> note content
}
