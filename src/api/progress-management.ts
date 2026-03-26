import { HTTPError } from 'ky';
import { useMutation } from '@tanstack/react-query';
import apiClient from './api-client';

// ── Progress ──

export const startCourse = (courseId: number) =>
  apiClient.post(`progress/courses/${courseId}/start`).json<Progress.CourseProgress>();

export const getMyCourses = (params?: Progress.CourseQueryParams) =>
  apiClient
    .get('progress/courses', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<Progress.CourseProgress>>();

export const completeLesson = (lessonId: number) =>
  apiClient.post(`progress/lessons/${lessonId}/complete`).json<Progress.LessonProgress>();

export const getMyLessons = (params?: Progress.LessonQueryParams) =>
  apiClient
    .get('progress/lessons', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<Progress.LessonProgress>>();

export const getWordsToReview = (params?: Progress.ReviewQueryParams) =>
  apiClient
    .get('progress/review', { searchParams: params as Record<string, string | number | boolean> })
    .json<LearningManagement.Word[]>();

export const reviewWord = (payload: Progress.ReviewWordPayload) =>
  apiClient.post('progress/review', { json: payload }).json<void>();

export const getMyWords = (params?: Progress.WordQueryParams) =>
  apiClient
    .get('progress/words', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<Progress.WordProgress>>();

export const getStats = () => apiClient.get('progress/stats').json<Progress.LearningStats>();

// ── TanStack Mutations ──

export const useReviewWordMutation = () => {
  const { t } = useTranslation();
  const entityLabel = t('entity_word');

  return useMutation({
    mutationFn: reviewWord,
    onSuccess: () => {
      toast.success(t('mutation_success_update', { entity: entityLabel }));
    },
    onError: error => {
      toast.error(
        `${t('mutation_error_update', { entity: entityLabel })}: ${(error as Error).message}`
      );
    }
  });
};

export const useCompleteLessonMutation = () => {
  const { t } = useTranslation();
  const entityLabel = t('entity_lesson');

  return useMutation({
    mutationFn: completeLesson,
    onSuccess: () => {
      toast.success(t('mutation_success_update', { entity: entityLabel }));
    },
    onError: error => {
      toast.error(
        `${t('mutation_error_update', { entity: entityLabel })}: ${(error as Error).message}`
      );
    }
  });
};

export const useReviewWordWithLessonUnlockMutation = (lessonId: number) => {
  const { t } = useTranslation();
  const entityLabel = t('entity_word');

  return useMutation({
    mutationFn: async (payload: Progress.ReviewWordPayload) => {
      try {
        return await reviewWord(payload);
      } catch (error) {
        if (error instanceof HTTPError && error.response.status === 404) {
          await completeLesson(lessonId);
          return reviewWord(payload);
        }

        throw error;
      }
    },
    onError: error => {
      toast.error(
        `${t('mutation_error_update', { entity: entityLabel })}: ${(error as Error).message}`
      );
    }
  });
};
