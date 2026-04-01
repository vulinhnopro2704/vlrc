import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './api-client';

// ── FSRS Practice ──

export const getFSRSDueWords = () =>
  apiClient.get('practice/fsrs/due').json<Progress.ReviewWordsResponse>();

export const submitFSRSPractice = (payload: Practice.SubmitFSRSPayload) =>
  apiClient.post('practice/fsrs', { json: payload }).json<Practice.SubmitFSRSResponse>();

// ── TanStack Query ──

export const PRACTICE_QUERY_KEYS = {
  all: ['fsrs-practice'] as const,
  dueLists: () => [...PRACTICE_QUERY_KEYS.all, 'due-list'] as const,
  dueList: () => [...PRACTICE_QUERY_KEYS.dueLists()] as const
};

export const getFSRSDueWordsQueryOptions = () => ({
  queryKey: PRACTICE_QUERY_KEYS.dueList(),
  queryFn: getFSRSDueWords
});

export const useFSRSDueWordsQuery = () => useQuery(getFSRSDueWordsQueryOptions());

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
