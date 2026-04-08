import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './api-client';

// ── Lessons ──

export const getLessons = (params?: LearningManagement.LessonQueryParams) =>
  apiClient
    .get('lessons', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<LearningManagement.Lesson>>();

export const getLesson = (id: App.ID) =>
  apiClient.get(`lessons/${id}`).json<LearningManagement.Lesson>();

export const createLesson = (payload: LearningManagement.Lesson) =>
  apiClient.post('lessons', { json: payload }).json<LearningManagement.Lesson>();

export const updateLesson = (id: App.ID, payload: LearningManagement.Lesson) =>
  apiClient.patch(`lessons/${id}`, { json: payload }).json<LearningManagement.Lesson>();

export const deleteLesson = (id: App.ID) => apiClient.delete(`lessons/${id}`).json<void>();

export const completeLesson = (id: App.ID, score?: number) =>
  apiClient
    .post(`lessons/${id}/complete`, {
      json: score == null ? {} : { score }
    })
    .json<{
      lessonProgress: Progress.LessonProgress;
      wordsUnlocked: number;
      session?: {
        id: App.ID;
        type: string;
        lessonId?: App.ID;
        totalWords: number;
        completedAt?: string;
      };
    }>();

// ── TanStack Query ──

export const LESSON_QUERY_KEYS = {
  all: ['lessons'] as const,
  lists: () => [...LESSON_QUERY_KEYS.all, 'list'] as const,
  list: (params?: LearningManagement.LessonQueryParams) =>
    [...LESSON_QUERY_KEYS.lists(), params ?? {}] as const,
  details: () => [...LESSON_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: App.ID) => [...LESSON_QUERY_KEYS.details(), id] as const
};

export const useLessonsQuery = (params?: LearningManagement.LessonQueryParams, enabled?: boolean) =>
  useQuery({
    queryKey: LESSON_QUERY_KEYS.list(params),
    queryFn: () => getLessons(params),
    enabled: enabled ?? true
  });

export const useLessonQuery = (id?: App.ID) =>
  useQuery({
    queryKey: LESSON_QUERY_KEYS.detail(id!),
    queryFn: () => getLesson(id!),
    enabled: !!id
  });

export const useLessonMutation = (options?: {
  onSuccess?: (
    data: LearningManagement.Lesson,
    variables: { id?: App.ID; payload: LearningManagement.Lesson }
  ) => void;
  onError?: (error: Error, variables: { id?: App.ID; payload: LearningManagement.Lesson }) => void;
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const entityLabel = t('entity_lesson');

  return useMutation({
    mutationFn: ({ id, payload }: { id?: App.ID; payload: LearningManagement.Lesson }) =>
      id != null ? updateLesson(id, payload) : createLesson(payload),
    onSuccess: (lesson, variables) => {
      queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.lists() });
      if (lesson.id != null) {
        queryClient.setQueryData(LESSON_QUERY_KEYS.detail(lesson.id), lesson);
      }
      toast.success(
        t(variables.id != null ? 'mutation_success_update' : 'mutation_success_create', {
          entity: entityLabel
        })
      );
      options?.onSuccess?.(lesson, variables);
    },
    onError: (error, variables) => {
      toast.error(
        `${t(variables.id != null ? 'mutation_error_update' : 'mutation_error_create', {
          entity: entityLabel
        })}: ${(error as Error).message}`
      );
      options?.onError?.(error as Error, variables);
    }
  });
};

export const useDeleteLessonMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const entityLabel = t('entity_lesson');

  return useMutation({
    mutationFn: deleteLesson,
    onSuccess: (_, lessonId) => {
      queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.lists() });
      queryClient.removeQueries({ queryKey: LESSON_QUERY_KEYS.detail(lessonId) });
      toast.success(t('mutation_success_delete', { entity: entityLabel }));
    },
    onError: error => {
      toast.error(
        `${t('mutation_error_delete', { entity: entityLabel })}: ${(error as Error).message}`
      );
    }
  });
};

export const useCompleteLessonMutation = () => {
  const { t } = useTranslation();
  const entityLabel = t('entity_lesson');

  return useMutation({
    mutationFn: ({ id, score }: { id: App.ID; score?: number }) => completeLesson(id, score),
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
