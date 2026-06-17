import { createFileRoute } from '@tanstack/react-router';
import { AdminCourseDetailPage } from '@/pages/AdminCourseDetailPage';

export const Route = createFileRoute('/admin/courses/$courseId')({
  component: AdminCourseDetailPage
});
