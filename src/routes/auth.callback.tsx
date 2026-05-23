import { createFileRoute } from '@tanstack/react-router';
import OAuthCallbackPage from '@/pages/OAuthCallbackPage';

export const Route = createFileRoute('/auth/callback')({
  component: OAuthCallbackPage,
});
