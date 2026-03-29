import { createFileRoute, redirect } from '@tanstack/react-router';
import { getMe } from '@/api/auth-management';
import RegisterPage from '@/pages/RegisterPage';

export const Route = createFileRoute('/register')({
  beforeLoad: async () => {
    let isAuthenticated = false;

    try {
      await getMe();
      isAuthenticated = true;
    } catch {
      // Not authenticated yet -> stay on register page.
    }

    if (isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: RegisterPage
});
