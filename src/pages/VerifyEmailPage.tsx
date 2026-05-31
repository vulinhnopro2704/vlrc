import AuthStatusCard from '@/components/AuthStatusCard';
import { resendVerifyEmail, verifyEmail } from '@/api/auth-management';
import { AuthStatusSkeleton } from '@/components/AuthSkeletons';

const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const search = new URLSearchParams(window.location.search);
  const token = search.get('token');
  const email = search.get('email');

  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
  });

  const resendMutation = useMutation({
    mutationFn: resendVerifyEmail,
    onSuccess: () => toast.success(t('auth_verify_resend_success')),
    onError: () => toast.error(t('auth_verify_resend_error')),
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate({ token });
    }
  }, [token]);

  if (!token) {
    return (
      <AuthStatusCard
        state='success'
        title={t('auth_verify_pending_title')}
        description={t('auth_verify_pending_description')}
        actions={
          <>
            <Button
              variant='outline'
              size='xl'
              disabled={!email || resendMutation.isPending}
              onClick={() => {
                if (email) {
                  resendMutation.mutate({ email });
                }
              }}
              className='w-full'>
              {resendMutation.isPending ? <Icons.LoaderCircleIcon className='w-5 h-5 animate-spin' /> : t('auth_resend_email')}
            </Button>
            <Link to='/login' className='text-sm text-primary hover:text-primary/80 transition-colors'>
              {t('auth_back_to_login')}
            </Link>
          </>
        }
      />
    );
  }

  if (verifyMutation.isPending) {
    return <AuthStatusSkeleton />;
  }

  if (verifyMutation.isSuccess) {
    return (
      <AuthStatusCard
        state='success'
        title={t('auth_verify_success_title')}
        description={t('auth_verify_success_description')}
        actions={
          <Link to='/login' className='text-sm text-primary hover:text-primary/80 transition-colors'>
            {t('auth_back_to_login')}
          </Link>
        }
      />
    );
  }

  return (
    <AuthStatusCard
      state='error'
      title={t('auth_verify_error_title')}
      description={t('auth_verify_error_description')}
      actions={
        <>
          <Button
            variant='outline'
            size='xl'
            disabled={!email || resendMutation.isPending}
            onClick={() => {
              if (email) {
                resendMutation.mutate({ email });
              }
            }}
            className='w-full'>
            {resendMutation.isPending ? <Icons.LoaderCircleIcon className='w-5 h-5 animate-spin' /> : t('auth_resend_email')}
          </Button>
          <Link to='/login' className='text-sm text-primary hover:text-primary/80 transition-colors'>
            {t('auth_back_to_login')}
          </Link>
        </>
      }
    />
  );
};

export default VerifyEmailPage;
