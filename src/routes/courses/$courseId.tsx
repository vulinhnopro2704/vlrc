import CourseDetailPage from '@/pages/CourseDetailPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/courses/$courseId')({
  component: CourseDetailPage
});
