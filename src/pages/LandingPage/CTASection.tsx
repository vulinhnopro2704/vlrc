import Icons from '@/components/Icons';

gsap.registerPlugin(ScrollTrigger);

export const CTASection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
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
        <div
          ref={contentRef}
          className='mx-auto max-w-4xl rounded-3xl bg-linear-to-r from-primary to-primary/80 p-12 text-center shadow-2xl dark:from-primary/90 dark:to-primary/70 dark:backdrop-blur-sm'>
          <h2 className='mb-4 text-3xl font-bold text-primary-foreground md:text-4xl text-balance'>
            {t('cta_title')}
          </h2>
          <p className='mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80'>
            {t('cta_subtitle')}
          </p>
          <Button
            variant='accent-cta'
            size='2xl'
            className='font-semibold'
            onClick={() => navigate({ to: '/login' })}>
            {t('cta_button')}
            <Icons.ChevronRight className='ml-2 h-5 w-5' />
          </Button>
          <p className='mt-6 text-sm text-primary-foreground/70'>{t('cta_note')}</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
