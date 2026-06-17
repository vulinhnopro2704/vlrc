import { Outlet, createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Button } from '@platform-core/components';
import Icons from '@platform-core/components/Icons';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  const { data: me, isLoading } = useAuthSession();
  const navigate = useNavigate();
  const currentPath = useRouterState({ select: s => s.location.pathname });

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Đang tải cấu hình Admin...</p>
        </div>
      </div>
    );
  }

  // Not logged in or not admin
  if (!me || me.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-6 bg-card border rounded-2xl p-8 shadow-xl relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Truy cập bị từ chối</h2>
            <p className="text-sm text-muted-foreground">
              Bạn không có quyền truy cập vào khu vực Quản trị hệ thống. Trang web này chỉ dành cho Quản trị viên.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate({ to: '/' })} className="w-full">
              Quay lại Trang chủ
            </Button>
            {!me && (
              <Button onClick={() => navigate({ to: '/login' })} variant="outline" className="w-full">
                Đăng nhập tài khoản Admin
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      key: 'users',
      label: 'Quản lý người dùng',
      to: '/admin/users' as const,
      icon: <Icons.Users className="h-4 w-4" />
    },
    {
      key: 'courses',
      label: 'Quản lý khoá học',
      to: '/admin/courses' as any,
      icon: <Icons.BookOpen className="h-4 w-4" />,
      disabled: true // Will be implemented in the future
    },
    {
      key: 'roleplays',
      label: 'Kịch bản Role-play',
      to: '/admin/roleplay' as any,
      icon: <Icons.MessageSquare className="h-4 w-4" />,
      disabled: true // Will be implemented in the future
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r bg-card/60 backdrop-blur-xl flex flex-col fixed inset-y-0 left-0 z-20">
        <div className="h-16 flex items-center px-6 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
              A
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">VLRC ADMIN</h1>
              <p className="text-[10px] text-muted-foreground font-medium">Hệ thống quản trị</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map(item => {
            const isActive = currentPath.startsWith(item.to);
            return (
              <button
                key={item.key}
                disabled={item.disabled}
                onClick={() => navigate({ to: item.to })}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.disabled && (
                  <span className="ml-auto text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase tracking-wider scale-90">
                    Sắp có
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t bg-card/40">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs ring-1 ring-border">
              {me.name ? me.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate leading-none mb-1">{me.name || 'Admin'}</p>
              <p className="text-[10px] text-muted-foreground truncate leading-none">{me.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => navigate({ to: '/' })}
              title="Quay lại Client"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="pl-64 flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b bg-card/60 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span>Admin</span>
            <span>/</span>
            <span className="text-foreground capitalize">
              {currentPath.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold"
              onClick={() => navigate({ to: '/' })}
            >
              Trở về Trang chủ
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/admin')({
  component: AdminLayout
});
