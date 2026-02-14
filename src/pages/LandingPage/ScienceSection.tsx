import Icons from '@/components/Icons';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ScienceSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(
        chartRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className='py-20 lg:py-28'>
      <div className='container mx-auto px-4'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          <div ref={contentRef}>
            <div className='mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary dark:bg-primary/20 dark:backdrop-blur-sm'>
              <Icons.Brain className='h-4 w-4' />
              <span>{t('science_badge')}</span>
            </div>
            <h2 className='mb-6 text-3xl font-bold text-foreground md:text-4xl text-balance'>
              {t('science_title')}
            </h2>
            <div className='space-y-6 text-muted-foreground'>
              <p className='text-lg leading-relaxed'>
                <strong className='text-foreground'>{t('spaced_repetition_title')}</strong>{' '}
                {t('spaced_repetition_description')}
              </p>
              <p className='text-lg leading-relaxed'>
                <strong className='text-foreground'>{t('fsrs_algo_title')}</strong>{' '}
                {t('fsrs_algo_description')}
              </p>
              <p className='text-lg leading-relaxed'>
                <strong className='text-foreground'>{t('ml_algo_title')}</strong>{' '}
                {t('ml_algo_description')}
              </p>
            </div>

            <div className='mt-8 grid grid-cols-3 gap-6'>
              <StatBox value='90%' label={t('time_saved')} />
              <StatBox value='1.5x' label={t('more_accurate')} />
              <StatBox value='85%' label={t('long_term_retention')} />
            </div>
          </div>

          <div ref={chartRef} className='relative'>
            <div className='rounded-2xl bg-linear-to-r from-primary/5 via-secondary to-accent/5 p-8 dark:from-primary/10 dark:via-secondary/20 dark:to-accent/10 dark:backdrop-blur-sm'>
              <ForgettingCurveChart />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatBox = ({ value, label }: { value: string; label: string }) => (
  <div className='text-center'>
    <div className='text-3xl font-bold text-primary'>{value}</div>
    <div className='text-sm text-muted-foreground'>{label}</div>
  </div>
);

const ForgettingCurveChart = () => {
  const { t } = useTranslation();

  return (
    <div className='rounded-xl bg-card p-6 shadow-lg dark:bg-card/60 dark:backdrop-blur-md dark:border dark:border-white/10'>
      <h4 className='mb-4 font-semibold text-foreground'>{t('chart_title')}</h4>
      <div className='relative h-48'>
        <div className='absolute left-0 top-0 flex h-full flex-col justify-between text-xs text-muted-foreground'>
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>
        <div className='ml-8 h-full'>
          <svg viewBox='0 0 300 150' className='h-full w-full'>
            <path
              d='M0,10 Q50,30 100,80 T200,120 T300,140'
              fill='none'
              stroke='hsl(0, 70%, 60%)'
              strokeWidth='2'
              strokeDasharray='5,5'
            />
            <path
              d='M0,10 Q20,20 40,10 Q60,20 80,10 Q100,20 120,10 Q160,25 200,15 Q260,30 300,20'
              fill='none'
              stroke='hsl(175, 70%, 45%)'
              strokeWidth='3'
            />
            {[40, 80, 120, 200].map((x, i) => (
              <circle key={i} cx={x} cy={10} r='5' fill='hsl(30, 90%, 55%)' />
            ))}
          </svg>
        </div>
      </div>
      <div className='mt-4 flex items-center justify-center gap-6 text-sm'>
        <div className='flex items-center gap-2'>
          <div className='h-0.5 w-6 border-t-2 border-dashed border-red-500' />
          <span className='text-muted-foreground'>{t('no_review')}</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='h-0.5 w-6 bg-primary' />
          <span className='text-muted-foreground'>{t('with_review')}</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='h-3 w-3 rounded-full bg-accent' />
          <span className='text-muted-foreground'>{t('review_point')}</span>
        </div>
      </div>
    </div>
  );
};

export default ScienceSection;
