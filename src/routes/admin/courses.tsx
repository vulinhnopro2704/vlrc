import { createFileRoute } from '@tanstack/react-router';
import { AdminCoursesPage } from '@/pages/AdminCoursesPage';

export const Route = createFileRoute('/admin/courses')({
  component: AdminCoursesPage
});
