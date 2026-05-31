import LiquidBackground from '@/components/LiquidBackground';
import AuthCard from '@/components/AuthCard';
import ThemeToggle from '@/components/ThemeToggle';
import AnimatedLogo from '@/components/AnimatedLogo';
import { forgotPassword } from '@/api/auth-management';
import { getErrorMessage } from '@/api/api-error';
import { AuthFormSkeleton } from '@/components/AuthSkeletons';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);

  const { control, handleSubmit, getValues } = useForm<Auth.ForgotPasswordFormData>({
    defaultValues: {
      email: ''
    }
  });

  const forgotMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: error => toast.error(getErrorMessage(error, t('auth_reset_request_error')))
  });

  const onSubmit = async (data: Auth.ForgotPasswordFormData) => {
    await forgotMutation.mutateAsync({ email: data.email });
  };

  if (forgotMutation.isPending) {
    return <AuthFormSkeleton />;
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <LiquidBackground />
      <ThemeToggle />

      <AuthCard>
        {isSuccess ? (
          <div className='text-center space-y-6 py-4'>
            <div className='mx-auto w-16 h-16 rounded-full bg-linear-to-r from-primary to-accent text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30'>
              <Icons.CheckIcon className='w-8 h-8' />
            </div>
            <div className='space-y-2'>
              <h2 className='text-2xl font-bold text-foreground'>{t('auth_email_sent_title')}</h2>
              <p className='text-sm text-muted-foreground'>
                {t('auth_email_sent_description', { email: getValues('email') })}
              </p>
            </div>
            <div className='space-y-3'>
              <Button
                onClick={() => setIsSuccess(false)}
                variant='outline'
                size='xl'
                className='w-full border-border/70 hover:bg-secondary/60'>
                {t('auth_resend_email')}
              </Button>
              <Link
                to='/login'
                className='block text-sm font-medium text-primary hover:text-primary/80 transition-colors'>
                ← {t('auth_back_to_login')}
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='text-center space-y-2'>
              <AnimatedLogo className='flex justify-center mb-4' />
              <h1 className='text-2xl font-bold text-foreground'>{t('auth_forgot_title')}</h1>
              <p className='text-sm text-muted-foreground'>{t('auth_forgot_subtitle')}</p>
            </div>

            <div className='space-y-4'>
              <FormInput
                control={control}
                name='email'
                label={t('auth_email')}
                htmlType='email'
                rules={{ required: true }}
              />
            </div>

            <Button
              type='submit'
              variant='gradient'
              size='xl'
              disabled={forgotMutation.isPending}
              className='w-full font-medium'>
              {forgotMutation.isPending ? (
                <Icons.LoaderCircleIcon className='w-5 h-5 animate-spin' />
              ) : (
                <>
                  <Icons.Mail className='w-4 h-4 mr-2' />
                  {t('auth_send_reset_link')}
                </>
              )}
            </Button>

            <div className='text-center'>
              <Link
                to='/login'
                className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors'>
                <Icons.ChevronLeft className='w-4 h-4' />
                {t('auth_back_to_login')}
              </Link>
            </div>
          </form>
        )}
      </AuthCard>
    </div>
  );
};

export default ForgotPasswordPage;
