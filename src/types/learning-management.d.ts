declare namespace LearningManagement {
  type DateTime = string;

  interface CountSummary {
    lessons?: number;
    words?: number;
  }

  interface CourseProgressSummary {
    isStarted: boolean;
    isCompleted: boolean;
    startedAt?: DateTime | null;
    lastAccessedAt?: DateTime | null;
    completedLessons: number;
    totalLessons: number;
    lastCompletedLessonAt?: DateTime | null;
  }

  interface LessonProgressSummary {
    status: string;
    score?: number;
    completedAt?: DateTime | null;
    isLearned: boolean;
    learnedAt?: DateTime | null;
  }

  type ActivityType =
    | 'flip'
    | 'listen-fill'
    | 'fill-blank'
    | 'meaning-lookup'
    | 'multiple-choice'
    | 'pronunciation';

  // ── Entities ──

  interface Course extends App.Base {
    title: string;
    enTitle?: string;
    description?: string;
    image?: string;
    icon?: string;
    order?: number;
    isPublished?: boolean;
    isUserCreated?: boolean;
    createdByUserId?: string;
    lessons?: Lesson[];
    _count?: CountSummary;
    completedLessons?: number;
    totalLessons?: number;
    progress?: number | CourseProgressSummary;
  }

  interface Lesson extends App.Base {
    title: string;
    description?: string;
    image?: string;
    order?: number;
    isPublished?: boolean;
    isUserCreated?: boolean;
    createdByUserId?: string;
    courseId?: App.ID;
    course?: Course;
    words?: Word[];
    wordCount?: number;
    completed?: boolean;
    isLearned?: boolean;
    learnedAt?: DateTime | null;
    progress?: LessonProgressSummary | null;
    _count?: CountSummary;
    activities?: ActivityType[];
  }

  interface Word extends App.Base {
    word: string;
    pronunciation?: string;
    meaning: string;
    meaningVi?: string;
    example?: string;
    exampleVi?: string;
    image?: string;
    audio?: string;
    pos?: string;
    partOfSpeech?: string;
    cefr?: string;
    synonyms?: string[];
    difficulty?: number;
    lessonId?: App.ID;
    lesson?: Lesson;
  }

  // ── Query params ──

  interface CourseQueryParams extends App.CursorPaginationParams {
    search?: string;
    isPublished?: boolean;
    sortBy?: 'order' | 'createdAt' | 'title';
    sortOrder?: App.SortOrder;
  }

  interface LessonQueryParams extends App.CursorPaginationParams {
    search?: string;
    courseId?: App.ID;
    isPublished?: boolean;
    createdByMe?: boolean;
    sortBy?: 'order' | 'createdAt' | 'title';
    sortOrder?: App.SortOrder;
  }

  interface WordQueryParams extends App.CursorPaginationParams {
    search?: string;
    lessonId?: App.ID;
    cefr?: string;
    pos?: string;
    sortBy?: 'word' | 'createdAt' | 'cefr';
    sortOrder?: App.SortOrder;
  }

  // ── Activity types (client-side) ──

  interface VocabularyProgress extends App.Base {
    wordId: App.ID;
    userId?: number;
    reviewCount: number;
    correctCount: number;
    lastReviewedAt?: DateTime;
    nextReviewAt?: DateTime;
    proficiencyLevel: number;
    masteryScore: number;
  }

  interface ActivityCardProps {
    vocabulary: Word;
    onCorrect?: () => void;
    onIncorrect?: () => void;
    onComplete?: (result: ActivityResult) => void;
    disabled?: boolean;
  }

  interface ActivityResult {
    wordId?: App.ID;
    activityType: ActivityType;
    isCorrect: boolean;
    timeSpent: number;
    attempts: number;
    timestamp: DateTime;
  }
}
