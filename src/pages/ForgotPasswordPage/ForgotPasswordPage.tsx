import { FormInput } from '@/components/Form';
import Icons from '@/components/Icons';
import LiquidBackground from '@/components/LiquidBackground';
import AuthCard from '@/components/AuthCard';
import ThemeToggle from '@/components/ThemeToggle';
import AnimatedLogo from '@/components/AnimatedLogo';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const { control, handleSubmit, getValues } = useForm<Auth.ForgotPasswordFormData>({
    defaultValues: {
      email: ''
    }
  });

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

  useGSAP(
    () => {
      if (isSuccess && successRef.current) {
        gsap.fromTo(
          successRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );
      }
    },
    { dependencies: [isSuccess] }
  );
  // @ts-ignore
  const onSubmit = async (data: Auth.ForgotPasswordFormData) => {
    setIsSubmitting(true);

    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <LiquidBackground />
      <ThemeToggle />

      <AuthCard>
        {isSuccess ? (
          <div ref={successRef} className='text-center space-y-6 py-4'>
            <div className='mx-auto w-16 h-16 rounded-full bg-linear-to-r from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30'>
              <Icons.CheckIcon className='w-8 h-8 text-white' />
            </div>
            <div className='space-y-2'>
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
                {t('auth_email_sent_title')}
              </h2>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                {t('auth_email_sent_description', { email: getValues('email') })}
              </p>
            </div>
            <div className='space-y-3'>
              <Button
                onClick={() => setIsSuccess(false)}
                variant='outline'
                size='xl'
                className='w-full border-slate-200 dark:border-slate-700'>
                {t('auth_resend_email')}
              </Button>
              <Link
                to='/login'
                className='block text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors'>
                ← {t('auth_back_to_login')}
              </Link>
            </div>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Logo & Title */}
            <div ref={titleRef} className='text-center space-y-2'>
              <AnimatedLogo className='flex justify-center mb-4' />
              <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
                {t('auth_forgot_title')}
              </h1>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                {t('auth_forgot_subtitle')}
              </p>
            </div>

            {/* Form Fields */}
            <div ref={fieldsRef} className='space-y-4'>
              <FormInput
                control={control}
                name='email'
                label={t('auth_email')}
                htmlType='email'
                rules={{ required: true }}
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
                  <Icons.Mail className='w-4 h-4 mr-2' />
                  {t('auth_send_reset_link')}
                </>
              )}
            </Button>

            {/* Footer */}
            <div ref={footerRef} className='text-center'>
              <Link
                to='/login'
                className='inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors'>
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
