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
    courseId?: number;
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
    lessonId?: number;
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
    courseId?: number;
    isPublished?: boolean;
    sortBy?: 'order' | 'createdAt' | 'title';
    sortOrder?: App.SortOrder;
  }

  interface WordQueryParams extends App.CursorPaginationParams {
    search?: string;
    lessonId?: number;
    cefr?: string;
    pos?: string;
    sortBy?: 'word' | 'createdAt' | 'cefr';
    sortOrder?: App.SortOrder;
  }

  // ── Create / Update payloads (reuse entity via Pick + Partial) ──

  type CreateCoursePayload = Pick<Course, 'title'> &
    Partial<Pick<Course, 'enTitle' | 'description' | 'image' | 'icon' | 'order' | 'isPublished'>>;

  type UpdateCoursePayload = Partial<CreateCoursePayload>;

  type CreateLessonPayload = Pick<Lesson, 'title'> &
    Partial<Pick<Lesson, 'description' | 'image' | 'order' | 'isPublished' | 'courseId'>>;

  type UpdateLessonPayload = Partial<CreateLessonPayload>;

  type CreateWordPayload = Pick<Word, 'word' | 'meaning'> &
    Partial<
      Pick<
        Word,
        'pronunciation' | 'example' | 'exampleVi' | 'image' | 'audio' | 'pos' | 'cefr' | 'lessonId'
      >
    >;

  type UpdateWordPayload = Partial<CreateWordPayload>;

  // ── Activity types (client-side) ──

  interface VocabularyProgress extends App.Base {
    wordId: number;
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
