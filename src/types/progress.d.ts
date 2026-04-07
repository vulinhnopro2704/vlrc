declare namespace Progress {
  // ── Entities ──

  interface CourseProgress extends App.Base {
    courseId: number;
    userId: string;
    startedAt: string;
    lastAccessedAt?: string;
    completedAt?: string;
    isCompleted: boolean;
    course?: LearningManagement.Course;
  }

  interface LessonProgress extends App.Base {
    lessonId: number;
    userId: string;
    status: string;
    completedAt?: string;
    score?: number;
    lesson?: LearningManagement.Lesson;
  }

  interface WordProgress extends App.Base {
    wordId: App.ID;
    userId: string;
    status: 'new' | 'learning' | 'mastered';
    nextReview?: string;
    lastReviewedAt?: string;
    proficiency?: number;
    word?: LearningManagement.Word;
  }

  interface LearningStats {
    totalCourses: number;
    completedCourses: number;
    totalLessons: number;
    completedLessons: number;
    totalWords: number;
    masteredWords: number;
    learningWords: number;
    reviewsDue: number;
  }

  // ── Query params ──

  interface CourseQueryParams extends App.CursorPaginationParams {
    isCompleted?: boolean;
    sortBy?: 'startedAt' | 'lastAccessedAt';
    sortOrder?: App.SortOrder;
  }

  interface LessonQueryParams extends App.CursorPaginationParams {
    courseId?: App.ID;
    status?: string;
    sortBy?: 'status' | 'completedAt' | 'score';
    sortOrder?: App.SortOrder;
  }

  interface WordQueryParams extends App.CursorPaginationParams {
    status?: string;
    search?: string;
    sortBy?: 'status' | 'nextReview' | 'lastReviewedAt' | 'proficiency';
    sortOrder?: App.SortOrder;
  }

  interface ReviewQueryParams {
    take?: number;
  }

  interface ReviewWordsResponse {
    data: WordProgress[];
    total?: number;
    nextCursor?: number | null;
    hasMore?: boolean;
  }

  // ── Payloads ──

  type ReviewResult = 'correct' | 'incorrect';

  interface ReviewWordPayload {
    wordId: App.ID;
    result: ReviewResult;
  }
}
