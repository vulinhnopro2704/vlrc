import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './api-client';

// ── Progress ──

export const startCourse = (courseId: number) =>
  apiClient.post(`progress/courses/${courseId}/start`).json<Progress.CourseProgress>();

export const getMyCourses = (params?: Progress.CourseQueryParams) =>
  apiClient
    .get('progress/courses', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<Progress.CourseProgress>>();

export const getMyLessons = (params?: Progress.LessonQueryParams) =>
  apiClient
    .get('progress/lessons', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<Progress.LessonProgress>>();

export const getWordsToReview = (params?: Progress.ReviewQueryParams) =>
  apiClient
    .get('progress/review', { searchParams: params as Record<string, string | number | boolean> })
    .json<Progress.ReviewWordsResponse>();

export const reviewWord = (payload: Progress.ReviewWordPayload) =>
  apiClient.post('progress/review', { json: payload }).json<void>();

export const getMyWords = (params?: Progress.WordQueryParams) =>
  apiClient
    .get('progress/words', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<Progress.WordProgress>>();

export const getStats = () => apiClient.get('progress/stats').json<Progress.LearningStats>();

// ── TanStack Query ──

export const REVIEW_QUERY_KEYS = {
  all: ['review-words'] as const,
  lists: () => [...REVIEW_QUERY_KEYS.all, 'list'] as const,
  list: (params?: Progress.ReviewQueryParams) =>
    [...REVIEW_QUERY_KEYS.lists(), params ?? {}] as const
};

export const getWordsToReviewQueryOptions = (params?: Progress.ReviewQueryParams) => ({
  queryKey: REVIEW_QUERY_KEYS.list(params),
  queryFn: () => getWordsToReview(params)
});

export const useWordsToReviewQuery = (params?: Progress.ReviewQueryParams) =>
  useQuery(getWordsToReviewQueryOptions(params));

// ── TanStack Mutations ──

export const useReviewWordMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const entityLabel = t('entity_word');

  return useMutation({
    mutationFn: reviewWord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.all });
      toast.success(t('mutation_success_update', { entity: entityLabel }));
    },
    onError: error => {
      toast.error(
        `${t('mutation_error_update', { entity: entityLabel })}: ${(error as Error).message}`
      );
    }
  });
};
