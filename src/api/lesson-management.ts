import apiClient from './api-client';

// ── Lessons ──

export const getLessons = (params?: LearningManagement.LessonQueryParams) =>
  apiClient
    .get('lessons', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<LearningManagement.Lesson>>();

export const getLesson = (id: number) =>
  apiClient.get(`lessons/${id}`).json<LearningManagement.Lesson>();

export const createLesson = (payload: LearningManagement.CreateLessonPayload) =>
  apiClient.post('lessons', { json: payload }).json<LearningManagement.Lesson>();

export const updateLesson = (id: number, payload: LearningManagement.UpdateLessonPayload) =>
  apiClient.patch(`lessons/${id}`, { json: payload }).json<LearningManagement.Lesson>();

export const deleteLesson = (id: number) => apiClient.delete(`lessons/${id}`).json<void>();
