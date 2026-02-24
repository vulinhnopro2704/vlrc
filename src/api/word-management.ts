import apiClient from './api-client';

// ── Words ──

export const getWords = (params?: LearningManagement.WordQueryParams) =>
  apiClient
    .get('words', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<LearningManagement.Word>>();

export const getWord = (id: number) => apiClient.get(`words/${id}`).json<LearningManagement.Word>();

export const createWord = (payload: LearningManagement.CreateWordPayload) =>
  apiClient.post('words', { json: payload }).json<LearningManagement.Word>();

export const updateWord = (id: number, payload: LearningManagement.UpdateWordPayload) =>
  apiClient.patch(`words/${id}`, { json: payload }).json<LearningManagement.Word>();

export const deleteWord = (id: number) => apiClient.delete(`words/${id}`).json<void>();
