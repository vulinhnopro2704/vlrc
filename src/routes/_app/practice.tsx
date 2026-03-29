import { createFileRoute } from '@tanstack/react-router';
import PracticePage from '@/pages/PracticePage/PracticePage';

export const Route = createFileRoute('/_app/practice')({
  component: PracticePage,
  validateSearch: (search: Record<string, any>) => ({
    courseId: search.courseId as string | undefined,
    lessonId: search.lessonId as string | undefined,
    difficulty: search.difficulty as 'EASY' | 'NORMAL' | 'HARD' | undefined,
  }),
});
