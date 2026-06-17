import { createFileRoute } from '@tanstack/react-router';
import { AdminScenariosPage } from '@/pages/AdminScenariosPage';

export const Route = createFileRoute('/admin/roleplay')({
  component: AdminScenariosPage
});
