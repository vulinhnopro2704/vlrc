import AuthCard from '@/components/AuthCard';
import LiquidBackground from '@/components/LiquidBackground';
import ThemeToggle from '@/components/ThemeToggle';
import AnimatedLogo from '@/components/AnimatedLogo';
import { resetPassword } from '@/api/auth-management';
import AuthStatusCard from '@/components/AuthStatusCard';
import { AuthFormSkeleton } from '@/components/AuthSkeletons';

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const search = new URLSearchParams(window.location.search);
  const token = search.get('token') ?? '';

  const { control, handleSubmit, watch } = useForm<{ password: string; confirmPassword: string }>({
    defaultValues: { password: '', confirmPassword: '' },
  });

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => toast.success(t('auth_reset_success_title')),
    onError: () => toast.error(t('auth_reset_error_title')),
  });

  if (!token) {
    return (
      <AuthStatusCard
        state='error'
        title={t('auth_reset_error_title')}
        description={t('auth_reset_error_description')}
        actions={
          <Link to='/forgot-password' className='text-sm text-primary hover:text-primary/80 transition-colors'>
            {t('auth_send_reset_link')}
          </Link>
        }
      />
    );
  }

  if (mutation.isPending) {
    return <AuthFormSkeleton />;
  }

  if (mutation.isSuccess) {
    return (
      <AuthStatusCard
        state='success'
        title={t('auth_reset_success_title')}
        description={t('auth_reset_success_description')}
        actions={
          <Link to='/login' className='text-sm text-primary hover:text-primary/80 transition-colors'>
            {t('auth_back_to_login')}
          </Link>
        }
      />
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <LiquidBackground />
      <ThemeToggle />

      <AuthCard>
        <form
          onSubmit={handleSubmit(async values => {
            if (values.password !== values.confirmPassword) {
              toast.error(t('auth_password_mismatch'));
              return;
            }
            await mutation.mutateAsync({ token, password: values.password });
          })}
          className='space-y-6'>
          <div className='text-center space-y-2'>
            <AnimatedLogo className='flex justify-center mb-4' />
            <h1 className='text-2xl font-bold text-foreground'>{t('auth_reset_title')}</h1>
            <p className='text-sm text-muted-foreground'>{t('auth_reset_subtitle')}</p>
          </div>

          <div className='space-y-4'>
            <FormInput control={control} name='password' label={t('auth_password')} htmlType='password' rules={{ required: true, minLength: { value: 8, message: t('auth_password_min') } }} />
            <FormInput control={control} name='confirmPassword' label={t('auth_confirm_password')} htmlType='password' rules={{ required: true, validate: value => value === watch('password') || t('auth_password_mismatch') }} />
          </div>

          <Button type='submit' variant='gradient' size='xl' disabled={mutation.isPending} className='w-full font-medium'>
            {mutation.isPending ? <Icons.LoaderCircleIcon className='w-5 h-5 animate-spin' /> : t('auth_reset_submit')}
          </Button>

          <div className='text-center'>
            <Link to='/login' className='text-sm text-primary hover:text-primary/80 transition-colors'>
              {t('auth_back_to_login')}
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  );
};

export default ResetPasswordPage;
