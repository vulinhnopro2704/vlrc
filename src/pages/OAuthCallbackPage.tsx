import { getMe, getGoogleOAuthStartUrl } from '@/api/auth-management';
import { AUTH_ME_QUERY_KEY } from '@/hooks/useAuthSession';
import AuthStatusCard from '@/components/AuthStatusCard';
import { AuthStatusSkeleton } from '@/components/AuthSkeletons';
import { CapacitorCookies } from '@capacitor/core';

const OAuthCallbackPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isCapacitor = typeof window !== 'undefined' && !!(window as any).Capacitor;

  const search = new URLSearchParams(window.location.search);
  const error = search.get('error');
  const accessToken = isCapacitor ? search.get('access_token') : null;
  const refreshToken = isCapacitor ? search.get('refresh_token') : null;

  const [isSettingTokens, setIsSettingTokens] = useState(!!(accessToken && refreshToken));

  useEffect(() => {
    const saveTokens = async () => {
      if (accessToken && refreshToken) {
        try {
          const apiURL = import.meta.env.VITE_BACKEND_API_URL;
          // Set cookies natively via CapacitorCookies
          await CapacitorCookies.setCookie({
            url: apiURL,
            key: 'access_token',
            value: accessToken,
          });
          await CapacitorCookies.setCookie({
            url: apiURL,
            key: 'refresh_token',
            value: refreshToken,
          });
          console.log('Successfully set Capacitor cookies natively');
        } catch (e) {
          console.error('Failed to set Capacitor cookies:', e);
        } finally {
          setIsSettingTokens(false);
        }
      }
    };

    saveTokens();
  }, [accessToken, refreshToken]);

  const callbackQuery = useQuery({
    queryKey: ['auth', 'oauth-callback', error, isSettingTokens],
    enabled: !error && !isSettingTokens,
    retry: 0,
    queryFn: async () => {
      const user = await getMe();
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, user);
      return user;
    },
  });

  useEffect(() => {
    if (callbackQuery.isSuccess) {
      toast.success(t('auth_login_success'));
      navigate({ to: '/dashboard' });
    }
  }, [callbackQuery.isSuccess, navigate, t]);

  if (error) {
    return (
      <AuthStatusCard
        state='error'
        title={t('auth_oauth_error_title')}
        description={t('auth_oauth_error_description')}
        actions={
          <>
            <Button
              variant='gradient'
              size='xl'
              className='w-full'
              onClick={() => {
                window.location.href = getGoogleOAuthStartUrl();
              }}>
              {t('auth_retry_google')}
            </Button>
            <Link to='/login' className='text-sm text-primary hover:text-primary/80 transition-colors'>
              {t('auth_back_to_login')}
            </Link>
          </>
        }
      />
    );
  }

  if (callbackQuery.isError) {
    return (
      <AuthStatusCard
        state='error'
        title={t('auth_oauth_error_title')}
        description={t('auth_oauth_error_description')}
        actions={
          <Link to='/login' className='text-sm text-primary hover:text-primary/80 transition-colors'>
            {t('auth_back_to_login')}
          </Link>
        }
      />
    );
  }

  return <AuthStatusSkeleton />;
};

export default OAuthCallbackPage;
