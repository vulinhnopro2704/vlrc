import { createFileRoute } from '@tanstack/react-router';
import VerifyEmailPage from '@/pages/VerifyEmailPage';

export const Route = createFileRoute('/verify-email' as any)({
  component: VerifyEmailPage,
});
