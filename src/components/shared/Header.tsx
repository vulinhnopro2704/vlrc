import Icons from '@/components/Icons';
import { logout } from '@/api/auth-management';
import { AUTH_ME_QUERY_KEY, useAuthSession } from '@/hooks/useAuthSession';
import { toast } from '@/shared';

const getAvatarFallback = (name?: string) => {
  if (!name || !name.trim()) {
    return 'U';
  }

  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 1).toUpperCase();
  }

  return `${words[0].slice(0, 1)}${words[words.length - 1].slice(0, 1)}`.toUpperCase();
};

export const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useAuthSession();
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [avatarHasError, setAvatarHasError] = useState(false);
  const currentLanguage = i18n.resolvedLanguage?.startsWith('vi') ? 'vi' : 'en';
  const currentFlag = currentLanguage === 'vi' ? '🇻🇳' : '🇺🇸';
  const appNavItems = me
    ? [
        { key: 'courses', label: t('learning_courses'), to: '/courses' as const },
        { key: 'notebook', label: t('header_notebook_dictionary'), to: '/notebook' as const },
        { key: 'practice', label: t('header_practice'), to: '/practice' as const },
        { key: 'tutor_3d', label: t('header_tutor_3d'), to: '/tutor-3d' as const }
      ]
    : [];

  const avatarUrl = me?.avatar?.trim() ? me.avatar : null;
  const avatarFallback = getAvatarFallback(me?.name);

  useEffect(() => {
    setAvatarHasError(false);
  }, [avatarUrl]);

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

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.error(t('auth_logout_failed'));
    } finally {
      queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY });
      navigate({ to: '/' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg border-b shadow-sm dark:bg-background/60 dark:border-white/10'
          : 'bg-transparent'
      }`}>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between gap-3'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate({ to: '/' })}
            className='h-auto p-0 text-2xl font-bold text-primary hover:bg-transparent'>
            VLRC
          </Button>

          {appNavItems.length > 0 ? (
            <nav className='hidden items-center gap-1 rounded-xl border bg-card/60 p-1 md:flex'>
              {appNavItems.map(item => (
                <Button
                  key={item.key}
                  variant='ghost'
                  size='sm'
                  className='h-8 px-3 text-xs font-semibold'
                  onClick={() => navigate({ to: item.to })}>
                  {item.label}
                </Button>
              ))}
            </nav>
          ) : null}

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

            {me ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='ml-2 h-9 gap-2 px-2'>
                    <div className='h-7 w-7 overflow-hidden rounded-full bg-primary/15 text-primary ring-1 ring-border flex items-center justify-center text-xs font-semibold'>
                      {avatarUrl && !avatarHasError ? (
                        <img
                          src={avatarUrl}
                          alt={t('header_user_avatar_alt', { name: me.name || me.email })}
                          className='h-full w-full object-cover'
                          onError={() => setAvatarHasError(true)}
                        />
                      ) : (
                        <span>{avatarFallback}</span>
                      )}
                    </div>
                    <span className='max-w-28 truncate text-sm font-medium'>
                      {me.name || me.email}
                    </span>
                    <Icons.ChevronDown className='h-4 w-4 opacity-70' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  className='w-56 dark:bg-card/90 dark:backdrop-blur-lg dark:border-white/10'>
                  <DropdownMenuLabel>
                    <div className='flex flex-col'>
                      <span className='truncate text-sm font-semibold'>{me.name || me.email}</span>
                      <span className='truncate text-xs text-muted-foreground'>{me.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: '/dashboard' })}>
                    {t('learning_dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>{t('auth_logout')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant='accent' className='ml-2' onClick={() => navigate({ to: '/login' })}>
                {t('start_free')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
