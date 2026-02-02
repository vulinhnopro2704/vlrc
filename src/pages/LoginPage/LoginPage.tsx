import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';
import { FormInput, FormCheckbox } from '@/components/Form';
import Icons from '@/components/Icons';
import LiquidBackground from '@/components/LiquidBackground';
import AuthCard from '@/components/AuthCard';
import ThemeToggle from '@/components/ThemeToggle';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Link } from '@tanstack/react-router';

const LoginPage = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const { control, handleSubmit } = useForm<Auth.LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
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

  const onSubmit = async (data: Auth.LoginFormData) => {
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
    console.log('Login data:', data);
    setIsSubmitting(false);
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <LiquidBackground />
      <ThemeToggle />

      <AuthCard>
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Logo & Title */}
          <div ref={titleRef} className='text-center space-y-2'>
            <AnimatedLogo className='flex justify-center mb-4' />
            <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
              {t('auth_login_title')}
            </h1>
            <p className='text-sm text-slate-600 dark:text-slate-400'>{t('auth_login_subtitle')}</p>
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

            <FormInput
              control={control}
              name='password'
              label={t('auth_password')}
              htmlType='password'
              rules={{ required: true, minLength: { value: 6, message: t('auth_password_min') } }}
            />

            <div className='flex items-center justify-between'>
              <FormCheckbox control={control} name='rememberMe' label={t('auth_remember_me')} />
              <Link
                to='/forgot-password'
                className='text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors'>
                {t('auth_forgot_password')}
              </Link>
            </div>
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
                {t('auth_login_button')}
              </>
            )}
          </Button>

          {/* Footer */}
          <div ref={footerRef} className='text-center'>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              {t('auth_no_account')}{' '}
              <Link
                to='/register'
                className='font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors'>
                {t('auth_register_link')}
              </Link>
            </p>
          </div>

          {/* Social Login Divider */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-slate-200 dark:border-slate-700' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white/70 dark:bg-slate-900/70 px-2 text-slate-500'>
                {t('auth_or_continue')}
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className='grid grid-cols-2 gap-3'>
            <Button
              type='button'
              variant='outline'
              size='xl'
              className='border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'>
              <Icons.GitHub className='w-5 h-5 mr-2' />
              GitHub
            </Button>
            <Button
              type='button'
              variant='outline'
              size='xl'
              className='border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'>
              <Icons.Globe className='w-5 h-5 mr-2' />
              Google
            </Button>
          </div>
        </form>
      </AuthCard>
    </div>
  );
};

export default LoginPage;
