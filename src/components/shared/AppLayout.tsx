import { useRouterState } from '@tanstack/react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { SelectionDictionaryPopover } from './SelectionDictionaryPopover';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export const AppLayout = ({ children, showFooter = true }: AppLayoutProps) => {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const isImmersiveRoute = pathname === '/tutor-3d';

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <Header />
      <main className={cn('flex-1 pt-16', isImmersiveRoute && 'overflow-hidden')}>{children}</main>
      <SelectionDictionaryPopover />
      {showFooter && !isImmersiveRoute && <Footer />}
    </div>
  );
};

export default AppLayout;
