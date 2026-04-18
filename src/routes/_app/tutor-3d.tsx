import { createFileRoute } from '@tanstack/react-router';
import Tutor3DPage from '@/pages/Tutor3DPage';

export const Route = createFileRoute('/_app/tutor-3d')({
  component: Tutor3DPage
});
