import { getMe, getGoogleOAuthStartUrl } from '@/api/auth-management';
import { AUTH_ME_QUERY_KEY } from '@/hooks/useAuthSession';
import AuthStatusCard from '@/components/AuthStatusCard';
import { AuthStatusSkeleton } from '@/components/AuthSkeletons';

const OAuthCallbackPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const search = new URLSearchParams(window.location.search);
  const error = search.get('error');

  const callbackQuery = useQuery({
    queryKey: ['auth', 'oauth-callback', error],
    enabled: !error,
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
