import { Outlet, createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '@/components/shared';

const AppShellLayout = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export const Route = createFileRoute('/_app')({
  component: AppShellLayout
});
