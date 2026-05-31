import { Header } from './Header';
import { SelectionDictionaryPopover } from './SelectionDictionaryPopover';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const isImmersiveRoute = pathname === '/role-play';

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <Header />
      <main className={cn('flex-1 pt-16', isImmersiveRoute && 'overflow-hidden')}>{children}</main>
      <SelectionDictionaryPopover />
    </div>
  );
};

export default AppLayout;
