import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './api-client';

// ── Courses ──

export const getCourses = (params?: LearningManagement.CourseQueryParams) =>
  apiClient
    .get('courses', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<LearningManagement.Course>>();

export const getCourse = (id: App.ID) =>
  apiClient.get(`courses/${id}`).json<LearningManagement.Course>();

export const createCourse = (payload: LearningManagement.Course) =>
  apiClient.post('courses', { json: payload }).json<LearningManagement.Course>();

export const updateCourse = (id: App.ID, payload: LearningManagement.Course) =>
  apiClient.patch(`courses/${id}`, { json: payload }).json<LearningManagement.Course>();

export const deleteCourse = (id: App.ID) => apiClient.delete(`courses/${id}`).json<void>();

// ── TanStack Query ──

export const COURSE_QUERY_KEYS = {
  all: ['courses'] as const,
  lists: () => [...COURSE_QUERY_KEYS.all, 'list'] as const,
  list: (params?: LearningManagement.CourseQueryParams) =>
    [...COURSE_QUERY_KEYS.lists(), params ?? {}] as const,
  details: () => [...COURSE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: App.ID) => [...COURSE_QUERY_KEYS.details(), id] as const
};

export const useCoursesQuery = (params?: LearningManagement.CourseQueryParams) =>
  useQuery({
    queryKey: COURSE_QUERY_KEYS.list(params),
    queryFn: () => getCourses(params)
  });

export const useCourseQuery = (id?: App.ID) =>
  useQuery({
    queryKey: COURSE_QUERY_KEYS.detail(id!),
    queryFn: () => getCourse(id!),
    enabled: !!id
  });

export const useCourseMutation = (options?: {
  onSuccess?: (
    data: LearningManagement.Course,
    variables: { id?: App.ID; payload: LearningManagement.Course }
  ) => void;
  onError?: (error: Error, variables: { id?: App.ID; payload: LearningManagement.Course }) => void;
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const entityLabel = t('entity_course');

  return useMutation({
    mutationFn: ({ id, payload }: { id?: App.ID; payload: LearningManagement.Course }) =>
      id != null ? updateCourse(id, payload) : createCourse(payload),
    onSuccess: (course, variables) => {
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.lists() });
      if (course.id != null) {
        queryClient.setQueryData(COURSE_QUERY_KEYS.detail(course.id), course);
      }
      toast.success(
        t(variables.id != null ? 'mutation_success_update' : 'mutation_success_create', {
          entity: entityLabel
        })
      );
      options?.onSuccess?.(course, variables);
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

export const useDeleteCourseMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const entityLabel = t('entity_course');

  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.lists() });
      queryClient.removeQueries({ queryKey: COURSE_QUERY_KEYS.detail(courseId) });
      toast.success(t('mutation_success_delete', { entity: entityLabel }));
    },
    onError: error => {
      toast.error(
        `${t('mutation_error_delete', { entity: entityLabel })}: ${(error as Error).message}`
      );
    }
  });
};
