import { createFileRoute, redirect } from '@tanstack/react-router';
import { getMe } from '@/api/auth-management';
import LoginPage from '@/pages/LoginPage';

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    let isAuthenticated = false;

    try {
      await getMe();
      isAuthenticated = true;
    } catch {
      // Not authenticated yet -> stay on login page.
    }

    if (isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage
});
