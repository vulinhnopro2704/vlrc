import apiClient from './api-client';

// ── Progress ──

export const startCourse = (courseId: number) =>
  apiClient.post(`progress/courses/${courseId}/start`).json<Progress.CourseProgress>();

export const getMyCourses = (params?: Progress.CourseQueryParams) =>
  apiClient
    .get('progress/courses', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<Progress.CourseProgress>>();

export const completeLesson = (lessonId: number) =>
  apiClient.post(`progress/lessons/${lessonId}/complete`).json<Progress.LessonProgress>();

export const getMyLessons = (params?: Progress.LessonQueryParams) =>
  apiClient
    .get('progress/lessons', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<Progress.LessonProgress>>();

export const getWordsToReview = (params?: Progress.ReviewQueryParams) =>
  apiClient
    .get('progress/review', { searchParams: params as Record<string, string | number | boolean> })
    .json<LearningManagement.Word[]>();

export const reviewWord = (payload: Progress.ReviewWordPayload) =>
  apiClient.post('progress/review', { json: payload }).json<void>();

export const getMyWords = (params?: Progress.WordQueryParams) =>
  apiClient
    .get('progress/words', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<Progress.WordProgress>>();

export const getStats = () => apiClient.get('progress/stats').json<Progress.LearningStats>();
