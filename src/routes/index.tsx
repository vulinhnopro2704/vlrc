import LandingPage from '@/pages/LandingPage/LandingPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: LandingPage
});
