import apiClient from './api-client';
import { useQuery } from '@tanstack/react-query';

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

export const VOCABULARY_QUERY_KEYS = {
  all: ['vocabulary'] as const,
  lists: () => [...VOCABULARY_QUERY_KEYS.all, 'list'] as const,
  list: (params?: Vocabulary.NoteQueryParams) =>
    [...VOCABULARY_QUERY_KEYS.lists(), params ?? {}] as const
};

export const getMyNotesQueryOptions = (params?: Vocabulary.NoteQueryParams) => ({
  queryKey: VOCABULARY_QUERY_KEYS.list(params),
  queryFn: () => getMyNotes(params)
});

export const useMyNotesQuery = (params?: Vocabulary.NoteQueryParams) =>
  useQuery(getMyNotesQueryOptions(params));
