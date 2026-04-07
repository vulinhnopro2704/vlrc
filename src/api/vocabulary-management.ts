import apiClient from './api-client';

// ── Vocabulary ──

export const getMyNotes = (params?: Vocabulary.NoteQueryParams) =>
  apiClient
    .get('vocabulary', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<Vocabulary.Note>>();

export const upsertNote = (payload: Vocabulary.UpsertNotePayload) =>
  apiClient.post('vocabulary', { json: payload }).json<Vocabulary.Note>();

export const updateNote = (id: App.ID, payload: Vocabulary.UpdateNotePayload) =>
  apiClient.patch(`vocabulary/${id}`, { json: payload }).json<Vocabulary.Note>();

export const removeNote = (id: App.ID) => apiClient.delete(`vocabulary/${id}`).json<void>();

export const toggleFavorite = (wordId: number) =>
  apiClient.post(`vocabulary/words/${wordId}/favorite`).json<void>();
