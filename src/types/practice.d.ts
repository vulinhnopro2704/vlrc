declare namespace Practice {
  // ── Game State ──

  interface GameState {
    currentWordIndex: number;
    totalWords: number;
    cumulativeScore: number;
    currentStreak: number;
    bestStreak: number;
    livesRemaining: number;
    exercisesCompleted: ExerciseResult[];
    hasEnded: boolean;
  }

  interface ExerciseResult {
    wordId?: App.ID;
    exerciseType: LearningManagement.ActivityType | PracticeActivityType;
    isCorrect: boolean;
    timeSpentMs: number;
    pointsEarned?: number;
    streakAtTime?: number;
    attempts: number;
    timestamp: string;
  }

  // ── New Activity Types for Practice Feature ──
  type PracticeActivityType =
    | 'speed-challenge'
    | 'word-puzzle'
    | 'matching-pairs'
    | 'streak-challenge';

  interface ExerciseInput {
    userAnswer: string;
    timeSpentMs: number;
    attempts: number;
  }

  interface ExerciseVariant {
    exerciseType: LearningManagement.ActivityType | PracticeActivityType;
    data: Record<string, any>;
    word: LearningManagement.Word;
  }

  interface PracticeSession {
    words: LearningManagement.Word[];
    currentWordIndex: number;
    gameState: GameState;
    isActive: boolean;
    isPaused: boolean;
  }

  // ── FSRS Submission ──
  interface SubmitFSRSItem {
    wordId: number;
    isCorrect: boolean;
    hadWrong?: boolean;
    durationMs?: number;
    exerciseType?: string;
    attempts?: number;
  }

  interface SubmitFSRSPayload {
    items: SubmitFSRSItem[];
  }

  interface SubmitFSRSResponse {
    session?: Record<string, unknown>;
    fsrsResult?: Record<string, unknown>;
  }

  // ── Animation State ──
  interface AnimationTrigger {
    type: 'entering' | 'feedback' | 'transitioning' | 'celebration';
    isCorrect?: boolean;
    scoreAwarded?: number;
  }

  interface AnimationState {
    isEntering: boolean;
    isFeedback: boolean;
    isTransitioning: boolean;
    feedbackType?: 'correct' | 'wrong';
    onAnimationComplete?: () => void;
  }
}
