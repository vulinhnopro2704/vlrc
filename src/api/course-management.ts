import apiClient from './api-client';

// ── Courses ──

export const getCourses = (params?: LearningManagement.CourseQueryParams) =>
  apiClient
    .get('courses', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<LearningManagement.Course>>();

export const getCourse = (id: number) =>
  apiClient.get(`courses/${id}`).json<LearningManagement.Course>();

export const createCourse = (payload: LearningManagement.CreateCoursePayload) =>
  apiClient.post('courses', { json: payload }).json<LearningManagement.Course>();

export const updateCourse = (id: number, payload: LearningManagement.UpdateCoursePayload) =>
  apiClient.patch(`courses/${id}`, { json: payload }).json<LearningManagement.Course>();

export const deleteCourse = (id: number) => apiClient.delete(`courses/${id}`).json<void>();
