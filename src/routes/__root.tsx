import { useEffect } from 'react';
import { createRootRoute, Outlet, useNavigate, useRouter } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from 'sonner';
import { useAuthSession } from '@hooks/useAuthSession';

const RootLayout = () => {
  useAuthSession();
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    const handleUnauthorized = () => {
      const currentPath = router.state.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        navigate({ to: '/login', search: { redirect: currentPath } as any });
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [navigate, router]);

  return (
    <>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
