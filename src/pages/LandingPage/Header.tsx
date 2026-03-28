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
  const currentLanguage = i18n.resolvedLanguage?.startsWith('vi') ? 'vi' : 'en';
  const currentFlag = currentLanguage === 'vi' ? '🇻🇳' : '🇺🇸';

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
                <Button variant='ghost' size='sm' className='h-9 gap-2 px-2'>
                  <span aria-hidden='true' className='text-base leading-none'>
                    {currentFlag}
                  </span>
                  <span className='text-xs font-semibold uppercase'>{currentLanguage}</span>
                  <Icons.ChevronDown className='h-3.5 w-3.5 opacity-70' />
                  <span className='sr-only'>{t('header_change_language')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='dark:bg-card/90 dark:backdrop-blur-lg dark:border-white/10'>
                <DropdownMenuItem
                  onClick={() => changeLanguage('vi')}
                  className='flex items-center justify-between gap-3'>
                  <span className='flex items-center gap-2'>
                    <span aria-hidden='true'>🇻🇳</span>
                    <span>{t('vietnamese')}</span>
                  </span>
                  {currentLanguage === 'vi' ? (
                    <Icons.Check className='h-4 w-4 text-primary' />
                  ) : null}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => changeLanguage('en')}
                  className='flex items-center justify-between gap-3'>
                  <span className='flex items-center gap-2'>
                    <span aria-hidden='true'>🇺🇸</span>
                    <span>{t('english')}</span>
                  </span>
                  {currentLanguage === 'en' ? (
                    <Icons.Check className='h-4 w-4 text-primary' />
                  ) : null}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant='ghost' size='icon' onClick={toggleTheme} className='h-9 w-9'>
              {isDark ? <Icons.Sun className='h-4 w-4' /> : <Icons.Moon className='h-4 w-4' />}
              <span className='sr-only'>{t('header_toggle_theme')}</span>
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
