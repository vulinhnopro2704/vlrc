import CourseDetailPage from '@/pages/CourseDetailPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/courses/$courseId')({
  component: CourseDetailPage
});
