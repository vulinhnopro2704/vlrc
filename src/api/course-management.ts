import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './api-client';

// ── Courses ──

export const getCourses = (params?: LearningManagement.CourseQueryParams) =>
  apiClient
    .get('courses', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<LearningManagement.Course>>();

export const getCourse = (id: number) =>
  apiClient.get(`courses/${id}`).json<LearningManagement.Course>();

export const createCourse = (payload: LearningManagement.CreateCoursePayload) =>
  apiClient.post('courses', { json: payload }).json<LearningManagement.Course>();

export const updateCourse = (id: number, payload: LearningManagement.UpdateCoursePayload) =>
  apiClient.patch(`courses/${id}`, { json: payload }).json<LearningManagement.Course>();

export const deleteCourse = (id: number) => apiClient.delete(`courses/${id}`).json<void>();

// ── TanStack Query ──

export const COURSE_QUERY_KEYS = {
  all: ['courses'] as const,
  lists: () => [...COURSE_QUERY_KEYS.all, 'list'] as const,
  list: (params?: LearningManagement.CourseQueryParams) =>
    [...COURSE_QUERY_KEYS.lists(), params ?? {}] as const,
  details: () => [...COURSE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: App.ID) => [...COURSE_QUERY_KEYS.details(), id] as const
};

export const getCoursesQueryOptions = (params?: LearningManagement.CourseQueryParams) => ({
  queryKey: COURSE_QUERY_KEYS.list(params),
  queryFn: () => getCourses(params)
});

export const getCourseQueryOptions = (id: number) => ({
  queryKey: COURSE_QUERY_KEYS.detail(id),
  queryFn: () => getCourse(id),
  enabled: id > 0
});

export const useCoursesQuery = (params?: LearningManagement.CourseQueryParams) =>
  useQuery(getCoursesQueryOptions(params));

export const useCourseQuery = (id: number) => useQuery(getCourseQueryOptions(id));

export const useCreateCourseMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const entityLabel = t('entity_course');

  return useMutation({
    mutationFn: createCourse,
    onSuccess: course => {
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.lists() });
      if (course.id != null) {
        queryClient.setQueryData(COURSE_QUERY_KEYS.detail(course.id), course);
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

export const useUpdateCourseMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const entityLabel = t('entity_course');

  return useMutation({
    mutationFn: ({
      id,
      payload
    }: {
      id: number;
      payload: LearningManagement.UpdateCoursePayload;
    }) => updateCourse(id, payload),
    onSuccess: course => {
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.lists() });
      if (course.id != null) {
        queryClient.setQueryData(COURSE_QUERY_KEYS.detail(course.id), course);
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
