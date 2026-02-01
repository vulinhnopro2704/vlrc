import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const DashboardSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = cardsRef.current?.querySelectorAll('.dashboard-card');
    if (!cards) return;

    gsap.fromTo(cards,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t('dashboard.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div ref={cardsRef} className="mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-3">
            <MemoryStrengthCard />
            <StreakCard />
            <WeeklyProgressCard />
          </div>
        </div>
      </div>
    </section>
  );
};

const MemoryStrengthCard = () => {
  const { t } = useTranslation();
  
  return (
    <Card className="dashboard-card border-0 shadow-lg dark:bg-card/60 dark:backdrop-blur-md dark:border dark:border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          {t('dashboard.memoryStrength')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pt-4">
          {/* Circular progress */}
          <div className="mx-auto h-32 w-32">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8" className="stroke-muted" />
              <circle
                cx="50" cy="50" r="40" fill="none" strokeWidth="8"
                strokeLinecap="round" className="stroke-primary"
                strokeDasharray={`${78 * 2.51} ${100 * 2.51}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-foreground">78%</span>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t('dashboard.avgRetention')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const StreakCard = () => {
  const { t } = useTranslation();
  
  return (
    <Card className="dashboard-card border-0 shadow-lg dark:bg-card/60 dark:backdrop-blur-md dark:border dark:border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 dark:bg-accent/20">
            <Calendar className="h-4 w-4 text-accent" />
          </div>
          {t('dashboard.currentStreak')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="pt-4 text-center">
          <div className="text-5xl font-bold text-foreground">15</div>
          <div className="mt-1 text-lg text-muted-foreground">{t('dashboard.days')}</div>
          <div className="mt-4 flex justify-center gap-1">
            {[1, 1, 1, 1, 1, 0, 1].map((active, i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-full ${
                  active ? 'bg-accent' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {t('dashboard.longestStreak', { days: 21 })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const WeeklyProgressCard = () => {
  const { t } = useTranslation();
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
  const data = [45, 32, 58, 41, 55, 28, 62];

  return (
    <Card className="dashboard-card border-0 shadow-lg dark:bg-card/60 dark:backdrop-blur-md dark:border dark:border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{t('dashboard.weeklyProgress')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-32 items-end justify-between gap-2">
          {data.map((value, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-sm bg-primary/80 transition-all hover:bg-primary"
                style={{ height: `${(value / 62) * 100}%` }}
              />
              <span className="text-xs text-muted-foreground">
                {t(`dashboard.daysOfWeek.${days[i]}`)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <span className="text-2xl font-bold text-foreground">321</span>
          <span className="ml-2 text-muted-foreground">{t('dashboard.wordsLearned')}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardSection;
