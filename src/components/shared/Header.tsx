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
        <div className='flex h-16 items-center justify-between'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate({ to: '/' })}
            className='h-auto p-0 text-2xl font-bold text-primary hover:bg-transparent'>
            VLRC
          </Button>

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

            {me ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='ml-2 h-9 gap-2 px-2'>
                    <div className='h-7 w-7 overflow-hidden rounded-full bg-primary/15 text-primary ring-1 ring-border flex items-center justify-center text-xs font-semibold'>
                      {avatarUrl && !avatarHasError ? (
                        <img
                          src={avatarUrl}
                          alt={me.name || 'User avatar'}
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
