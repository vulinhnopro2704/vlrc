import { Header } from './Header';
import { Footer } from './Footer';
import { SelectionDictionaryPopover } from './SelectionDictionaryPopover';

interface AppLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export const AppLayout = ({ children, showFooter = true }: AppLayoutProps) => {
  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <Header />
      <main className='flex-1 pt-16'>{children}</main>
      <SelectionDictionaryPopover />
      {showFooter && <Footer />}
    </div>
  );
};

export default AppLayout;
