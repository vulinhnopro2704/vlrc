import { applyApiFieldErrors, getErrorMessage } from '@/api/api-error';
import { FormInput } from '@/components/Form';
import Icons from '@/components/Icons';
import LiquidBackground from '@/components/LiquidBackground';
import AuthCard from '@/components/AuthCard';
import ThemeToggle from '@/components/ThemeToggle';
import AnimatedLogo from '@/components/AnimatedLogo';
import { register as registerApi } from '@/api/auth-management';
import { toast } from '@/shared';
import { AUTH_ME_QUERY_KEY } from '@/hooks/useAuthSession';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const { control, handleSubmit, watch, setError } = useForm<Auth.RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(titleRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
        .fromTo(
          fieldsRef.current?.children || [],
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
          '-=0.2'
        )
        .fromTo(
          buttonRef.current,
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4 },
          '-=0.1'
        )
        .fromTo(footerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }, '-=0.1');
    },
    { scope: formRef }
  );

  const registerMutation = useMutation({
    mutationFn: (payload: Auth.RegisterPayload) => registerApi(payload),
    onSuccess: response => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, response.user);
      toast.success(t('auth_register_success'));
      navigate({ to: '/dashboard' });
    },
    onError: error => {
      applyApiFieldErrors(error, setError);

      const message = getErrorMessage(error, t('auth_register_failed'));
      toast.error(message);
    }
  });

  const onSubmit = async (data: Auth.RegisterFormData) => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    }

    const { confirmPassword: _confirmPassword, ...payload } = data;
    await registerMutation.mutateAsync(payload);
  };

  const isSubmitting = registerMutation.isPending;

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <LiquidBackground />
      <ThemeToggle />

      <AuthCard>
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Logo & Title */}
          <div ref={titleRef} className='text-center space-y-2'>
            <AnimatedLogo className='flex justify-center mb-4' />
            <h1 className='text-2xl font-bold text-foreground'>{t('auth_register_title')}</h1>
            <p className='text-sm text-muted-foreground'>{t('auth_register_subtitle')}</p>
          </div>

          {/* Form Fields */}
          <div ref={fieldsRef} className='space-y-4'>
            <FormInput
              control={control}
              name='name'
              label={t('auth_name')}
              htmlType='text'
              rules={{ required: true }}
            />

            <FormInput
              control={control}
              name='email'
              label={t('auth_email')}
              htmlType='email'
              rules={{ required: true }}
            />

            <FormInput
              control={control}
              name='password'
              label={t('auth_password')}
              htmlType='password'
              rules={{
                required: true,
                minLength: { value: 6, message: t('auth_password_min') }
              }}
            />

            <FormInput
              control={control}
              name='confirmPassword'
              label={t('auth_confirm_password')}
              htmlType='password'
              rules={{
                required: true,
                validate: (value: string) => value === password || t('auth_password_mismatch')
              }}
            />
          </div>

          {/* Submit Button */}
          <Button
            ref={buttonRef}
            type='submit'
            variant='gradient'
            size='xl'
            disabled={isSubmitting}
            className='w-full font-medium'>
            {isSubmitting ? (
              <Icons.LoaderCircleIcon className='w-5 h-5 animate-spin' />
            ) : (
              <>
                <Icons.Users className='w-4 h-4 mr-2' />
                {t('auth_register_button')}
              </>
            )}
          </Button>

          {/* Footer */}
          <div ref={footerRef} className='text-center'>
            <p className='text-sm text-muted-foreground'>
              {t('auth_have_account')}{' '}
              <Link
                to='/login'
                className='font-medium text-primary hover:text-primary/80 transition-colors'>
                {t('auth_login_link')}
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className='text-xs text-center text-muted-foreground'>
            {t('auth_terms_prefix')}{' '}
            <a href='#' className='text-primary hover:underline'>
              {t('auth_terms_of_service')}
            </a>{' '}
            {t('auth_and')}{' '}
            <a href='#' className='text-primary hover:underline'>
              {t('auth_privacy_policy')}
            </a>
          </p>
        </form>
      </AuthCard>
    </div>
  );
};

export default RegisterPage;
