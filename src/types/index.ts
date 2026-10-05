export type SubjectId = 'physics' | 'chemistry' | 'mathematics';

export type TopicStatus = 'not_started' | 'in_progress' | 'mastered';

export interface Topic {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  chapterTitle: string;
  title: string;
  subtopics: string[];
  status: TopicStatus;
  confidence: number; // 1 to 5
  targetMinutes: number;
  minutesSpent: number;
  lastStudiedDate: string | null; // 'YYYY-MM-DD'
  revisionCount: number;
  keyFormulas?: string[];
  quickNotes?: string;
}

export interface Chapter {
  id: string;
  subjectId: SubjectId;
  number: number;
  title: string;
  description: string;
  topics: Topic[];
}

export interface StudySession {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  chapterTitle: string;
  topicId: string;
  topicTitle: string;
  durationMinutes: number;
  date: string; // 'YYYY-MM-DD'
  timestamp: number;
  mode: 'pomodoro' | 'stopwatch';
  notes?: string;
  rating?: number; // 1-5
}

export interface StudyNote {
  id: string;
  title: string;
  subjectId: SubjectId;
  chapterId?: string;
  topicId?: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  tagline: string;
  color: string;
  accentBg: string;
  borderColor: string;
  iconName: string;
  heroImage: string;
}

export interface StudyGoal {
  weeklyTargetMinutes: number;
  dailyTargetMinutes: number;
}

export interface MockQuestion {
  id: string;
  subjectId: SubjectId;
  chapterId?: string;
  chapterTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface MockTestAttempt {
  id: string;
  title: string;
  subjectId: 'all' | SubjectId;
  chapterTitle?: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  timeSpentSeconds: number;
  date: string;
  timestamp: number;
  userAnswers: { [questionId: string]: number };
  questions: MockQuestion[];
}
