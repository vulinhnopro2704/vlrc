import { createFileRoute } from '@tanstack/react-router';
import RolePlayPage from '@/pages/RolePlayPage';

export const Route = createFileRoute('/_app/role-play')({
  component: RolePlayPage
});
