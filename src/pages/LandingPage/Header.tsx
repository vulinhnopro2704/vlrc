import { Button } from '@/components/ui/button';
import Icons from '@/components/Icons';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg border-b shadow-sm dark:bg-background/60 dark:border-white/10'
          : 'bg-transparent'
      }`}>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          <a href='/' className='text-2xl font-bold text-primary'>
            VLRC
          </a>

          <div className='flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='h-9 w-9'>
                  <Icons.Globe className='h-4 w-4' />
                  <span className='sr-only'>Change language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='dark:bg-card/90 dark:backdrop-blur-lg dark:border-white/10'>
                <DropdownMenuItem onClick={() => changeLanguage('vi')}>
                  {t('vietnamese')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('en')}>
                  {t('english')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant='ghost' size='icon' onClick={toggleTheme} className='h-9 w-9'>
              {isDark ? <Icons.Sun className='h-4 w-4' /> : <Icons.Moon className='h-4 w-4' />}
              <span className='sr-only'>Toggle theme</span>
            </Button>

            <Button variant='accent' className='ml-2'>
              {t('start_free')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
