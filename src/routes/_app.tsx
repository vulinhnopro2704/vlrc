import { useEffect } from 'react';
import { Outlet, createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router';
import { AppLayout } from '@/components/shared';
import { useAuthSession } from '@hooks/useAuthSession';
import { PagePendingFallback } from '@/components/router';

const AppShellLayout = () => {
  const { data: me, isLoading } = useAuthSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: state => state.location.pathname });

  const isPublicRoute = pathname === '/';

  useEffect(() => {
    if (!isLoading && !me && !isPublicRoute) {
      navigate({ to: '/login', search: { redirect: pathname } as any });
    }
  }, [isLoading, me, isPublicRoute, pathname, navigate]);

  if (isLoading && !isPublicRoute) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <PagePendingFallback />
      </div>
    );
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export const Route = createFileRoute('/_app')({
  component: AppShellLayout
});
