import apiClient from './api-client';

// ── FSRS Practice ──

export const getFSRSDueWords = () =>
  apiClient.get('practice/fsrs/due').json<Progress.ReviewWordsResponse>();

export const submitFSRSPractice = (
  payload: Practice.SubmitFSRSPayload,
  options?: { keepalive?: boolean }
) =>
  apiClient
    .post('practice/fsrs', { json: payload, ...options })
    .json<Practice.SubmitFSRSResponse>();

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
    mutationFn: (variables: {
      payload: Practice.SubmitFSRSPayload;
      options?: { keepalive?: boolean };
    }) => submitFSRSPractice(variables.payload, variables.options),
    retry: (failureCount, error) => {
      // Limit to 3 retries (4 total attempts)
      if (failureCount >= 3) return false;

      // Only retry on network errors, timeouts, or 5xx server errors
      if (error instanceof Error) {
        const isTimeout =
          error.name === 'TimeoutError' ||
          error.message?.toLowerCase().includes('timeout') ||
          error.message?.toLowerCase().includes('timed out');
        const isNetwork =
          error.message?.toLowerCase().includes('network') ||
          error.message?.toLowerCase().includes('failed to fetch') ||
          error.message?.toLowerCase().includes('load failed');
        
        const statusCode = (error as any).statusCode;
        const isServerError = typeof statusCode === 'number' && statusCode >= 500;

        return isTimeout || isNetwork || isServerError;
      }
      return false;
    },
    retryDelay: attempt => Math.min(attempt * 1000, 5000),
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
