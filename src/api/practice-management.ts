import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './api-client';

// ── FSRS Practice ──

export const getFSRSDueWords = (params?: Progress.ReviewQueryParams) =>
  apiClient
    .get('practice/fsrs/due', {
      searchParams: params as Record<string, string | number | boolean>
    })
    .json<Progress.ReviewWordsResponse>();

export const submitFSRSPractice = (payload: Practice.SubmitFSRSPayload) =>
  apiClient.post('practice/fsrs', { json: payload }).json<Practice.SubmitFSRSResponse>();

// ── TanStack Query ──

export const PRACTICE_QUERY_KEYS = {
  all: ['fsrs-practice'] as const,
  dueLists: () => [...PRACTICE_QUERY_KEYS.all, 'due-list'] as const,
  dueList: (params?: Progress.ReviewQueryParams) =>
    [...PRACTICE_QUERY_KEYS.dueLists(), params ?? {}] as const
};

export const getFSRSDueWordsQueryOptions = (params?: Progress.ReviewQueryParams) => ({
  queryKey: PRACTICE_QUERY_KEYS.dueList(params),
  queryFn: () => getFSRSDueWords(params)
});

export const useFSRSDueWordsQuery = (params?: Progress.ReviewQueryParams) =>
  useQuery(getFSRSDueWordsQueryOptions(params));

// ── TanStack Mutations ──

export const useSubmitFSRSMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitFSRSPractice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRACTICE_QUERY_KEYS.all });
      toast.success(t('practice_submit_success'));
    },
    onError: error => {
      toast.error(t('practice_submit_error'));
      console.error('Failed to submit practice results', error);
    }
  });
};
