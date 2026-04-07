import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './api-client';

// ── Words ──

export const getWords = (params?: LearningManagement.WordQueryParams) =>
  apiClient
    .get('words', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<LearningManagement.Word>>();

export const getWord = (id: App.ID) => apiClient.get(`words/${id}`).json<LearningManagement.Word>();

export const createWord = (payload: LearningManagement.CreateWordPayload) =>
  apiClient.post('words', { json: payload }).json<LearningManagement.Word>();

export const updateWord = (id: App.ID, payload: LearningManagement.UpdateWordPayload) =>
  apiClient.patch(`words/${id}`, { json: payload }).json<LearningManagement.Word>();

export const deleteWord = (id: App.ID) => apiClient.delete(`words/${id}`).json<void>();

// ── TanStack Query ──

export const WORD_QUERY_KEYS = {
  all: ['words'] as const,
  lists: () => [...WORD_QUERY_KEYS.all, 'list'] as const,
  list: (params?: LearningManagement.WordQueryParams) =>
    [...WORD_QUERY_KEYS.lists(), params ?? {}] as const,
  details: () => [...WORD_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: App.ID) => [...WORD_QUERY_KEYS.details(), id] as const
};

export const getWordsQueryOptions = (params?: LearningManagement.WordQueryParams) => ({
  queryKey: WORD_QUERY_KEYS.list(params),
  queryFn: () => getWords(params)
});

export const getWordQueryOptions = (id: App.ID) => ({
  queryKey: WORD_QUERY_KEYS.detail(id),
  queryFn: () => getWord(id),
  enabled: !!id
});

export const useWordsQuery = (params?: LearningManagement.WordQueryParams) =>
  useQuery(getWordsQueryOptions(params));

export const useWordQuery = (id: App.ID) => useQuery(getWordQueryOptions(id));

export const useCreateWordMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const entityLabel = t('entity_word');

  return useMutation({
    mutationFn: createWord,
    onSuccess: word => {
      queryClient.invalidateQueries({ queryKey: WORD_QUERY_KEYS.lists() });
      if (word.id != null) {
        queryClient.setQueryData(WORD_QUERY_KEYS.detail(word.id), word);
      }
      toast.success(t('mutation_success_create', { entity: entityLabel }));
    },
    onError: error => {
      toast.error(
        `${t('mutation_error_create', { entity: entityLabel })}: ${(error as Error).message}`
      );
    }
  });
};

export const useUpdateWordMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const entityLabel = t('entity_word');

  return useMutation({
    mutationFn: ({ id, payload }: { id: App.ID; payload: LearningManagement.UpdateWordPayload }) =>
      updateWord(id, payload),
    onSuccess: word => {
      queryClient.invalidateQueries({ queryKey: WORD_QUERY_KEYS.lists() });
      if (word.id != null) {
        queryClient.setQueryData(WORD_QUERY_KEYS.detail(word.id), word);
      }
      toast.success(t('mutation_success_update', { entity: entityLabel }));
    },
    onError: error => {
      toast.error(
        `${t('mutation_error_update', { entity: entityLabel })}: ${(error as Error).message}`
      );
    }
  });
};

export const useDeleteWordMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const entityLabel = t('entity_word');

  return useMutation({
    mutationFn: deleteWord,
    onSuccess: (_, wordId) => {
      queryClient.invalidateQueries({ queryKey: WORD_QUERY_KEYS.lists() });
      queryClient.removeQueries({ queryKey: WORD_QUERY_KEYS.detail(wordId) });
      toast.success(t('mutation_success_delete', { entity: entityLabel }));
    },
    onError: error => {
      toast.error(
        `${t('mutation_error_delete', { entity: entityLabel })}: ${(error as Error).message}`
      );
    }
  });
};
