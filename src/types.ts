export interface QuizSlide {
  id: number;
  questionNumber: number;
  category: string;
  topic: string; // The canonical answer topic: '저출산', '부양가족', etc.
  question: string;
  hints: [string, string];
  answer: string;
  acceptedAnswers: string[];
  explanation: string;
  keyFacts: string[];
  imageUrl: string;
  imageAlt: string;
  imageCaption: string;
}

export type ViewMode = 'quiz' | 'presentation';

export interface UserSlideProgress {
  userAnswer: string;
  isCorrect: boolean | null;
  revealedHints: [boolean, boolean];
  isAnswerRevealed: boolean;
  attempts: number;
  wrongAttempts: number;
}
