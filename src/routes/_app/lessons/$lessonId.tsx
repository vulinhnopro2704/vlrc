import LessonPage from '@/pages/LessonPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/lessons/$lessonId')({
  component: LessonPage
});
