import Icons from '@/components/Icons';

gsap.registerPlugin(ScrollTrigger);

export const HowItWorksSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  const steps = [
    { step: 1, icon: Icons.Target, titleKey: 'step1_title', descKey: 'step1_description' },
    { step: 2, icon: Icons.Sparkles, titleKey: 'step2_title', descKey: 'step2_description' },
    { step: 3, icon: Icons.BookOpen, titleKey: 'step3_title', descKey: 'step3_description' },
    { step: 4, icon: Icons.BarChart3, titleKey: 'step4_title', descKey: 'step4_description' }
  ];

  useGSAP(
    () => {
      const stepElements = stepsRef.current?.querySelectorAll('.step-item');
      if (!stepElements) return;

      gsap.fromTo(
        stepElements,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className='bg-secondary/30 py-20 lg:py-28 dark:bg-secondary/10'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <h2 className='mb-4 text-3xl font-bold text-foreground md:text-4xl'>
            {t('how_it_works_title')}
          </h2>
          <p className='text-lg text-muted-foreground'>{t('how_it_works_subtitle')}</p>
        </div>

        <div className='mx-auto max-w-5xl'>
          <div ref={stepsRef} className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {steps.map((item, index) => (
              <div key={index} className='step-item relative'>
                {index < steps.length - 1 && (
                  <div
                    className='absolute right-0 top-8 hidden h-0.5 w-full bg-border lg:block dark:bg-white/10'
                    style={{ width: 'calc(100% - 2rem)', left: '50%' }}
                  />
                )}
                <div className='relative flex flex-col items-center text-center'>
                  <div className='relative mb-6'>
                    <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg dark:shadow-primary/20'>
                      <item.icon className='h-7 w-7' />
                    </div>
                    <span className='absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground shadow-md'>
                      {item.step}
                    </span>
                  </div>
                  <h3 className='mb-2 text-lg font-semibold text-foreground'>{t(item.titleKey)}</h3>
                  <p className='text-muted-foreground'>{t(item.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
