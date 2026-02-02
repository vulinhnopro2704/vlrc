import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icons from '@/components/Icons';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ValuePropsSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Icons.Brain,
      titleKey: 'fsrs_title',
      descKey: 'fsrs_description',
      color: 'text-primary',
      bgColor: 'bg-primary/10 dark:bg-primary/20'
    },
    {
      icon: Icons.Sparkles,
      titleKey: 'ml_title',
      descKey: 'ml_description',
      color: 'text-accent',
      bgColor: 'bg-accent/10 dark:bg-accent/20'
    },
    {
      icon: Icons.Headphones,
      titleKey: 'listening_title',
      descKey: 'listening_description',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10 dark:bg-green-500/20'
    },
    {
      icon: Icons.PenTool,
      titleKey: 'writing_title',
      descKey: 'writing_description',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10 dark:bg-blue-500/20'
    }
  ];

  useGSAP(
    () => {
      const cards = cardsRef.current?.querySelectorAll('.feature-card');
      if (!cards) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
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
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <h2 className='mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance'>
            {t('value_prop_title')}
          </h2>
          <p className='text-lg text-muted-foreground'>{t('value_prop_subtitle')}</p>
        </div>

        <div ref={cardsRef} className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {features.map((feature, index) => (
            <Card key={index} variant='elevated-glass' className='feature-card group'>
              <CardHeader>
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className='text-xl'>{t(feature.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='text-base leading-relaxed'>
                  {t(feature.descKey)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePropsSection;
