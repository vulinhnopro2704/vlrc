import { Button } from '@/components/ui/button';
import { Sparkles, ChevronRight, Play, Headphones, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export const HeroSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo(titleRef.current, 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0, duration: 0.8 }
    )
    .fromTo(descRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.6 }, 
      '-=0.4'
    )
    .fromTo(ctaRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.5 }, 
      '-=0.3'
    )
    .fromTo(previewRef.current, 
      { opacity: 0, y: 60, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.8 }, 
      '-=0.2'
    );
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-20 lg:py-32"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl dark:bg-accent/15" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary dark:bg-primary/20 dark:backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span>{t('hero.badge')}</span>
          </div>
          
          <h1 
            ref={titleRef}
            className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance"
          >
            {t('hero.titleLine1')} <br />
            <span className="text-primary">{t('hero.titleLine2')}</span>
          </h1>
          
          <p 
            ref={descRef}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {t('hero.description')}
          </p>
          
          <div ref={ctaRef} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 hover:scale-105"
            >
              {t('common.startFree')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg dark:bg-card/50 dark:backdrop-blur-sm">
              <Play className="mr-2 h-5 w-5" />
              {t('common.watchHow')}
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground">
            {t('common.noCreditCard')}
          </p>
        </div>
        
        {/* App Preview Mockup */}
        <div ref={previewRef} className="mx-auto mt-16 max-w-5xl">
          <div className="relative rounded-2xl border bg-card/80 p-4 shadow-2xl backdrop-blur-sm dark:bg-card/40 dark:border-white/10">
            <div className="grid gap-4 md:grid-cols-3">
              <FlashcardPreview />
              <AudioPreview />
              <ProgressPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FlashcardPreview = () => {
  const { t } = useTranslation();
  
  return (
    <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-6 dark:from-primary/20 dark:to-primary/10 dark:backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{t('hero.flashcard')}</span>
        <span className="rounded-full bg-primary/20 px-2 py-1 text-xs font-medium text-primary">{t('hero.due')}</span>
      </div>
      <div className="mb-4 text-center">
        <p className="text-2xl font-bold text-foreground">Perseverance</p>
        <p className="mt-2 text-muted-foreground">{t('hero.meaning')}</p>
      </div>
      <div className="flex justify-center gap-2">
        <span className="rounded-lg bg-destructive/10 px-3 py-1 text-xs text-destructive">{t('hero.forgot')}</span>
        <span className="rounded-lg bg-yellow-500/10 px-3 py-1 text-xs text-yellow-600 dark:text-yellow-400">{t('hero.hard')}</span>
        <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs text-primary">{t('hero.good')}</span>
        <span className="rounded-lg bg-green-500/10 px-3 py-1 text-xs text-green-600 dark:text-green-400">{t('hero.easy')}</span>
      </div>
    </div>
  );
};

const AudioPreview = () => {
  const { t } = useTranslation();
  
  return (
    <div className="rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 p-6 dark:from-accent/20 dark:to-accent/10 dark:backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{t('hero.dictation')}</span>
        <Headphones className="h-4 w-4 text-accent" />
      </div>
      <div className="mb-4 flex items-center justify-center gap-1">
        {[40, 60, 80, 50, 70, 90, 60, 80, 45, 75, 55, 85].map((h, i) => (
          <div
            key={i}
            className="w-2 rounded-full bg-accent/60"
            style={{ height: `${h}%`, maxHeight: '60px' }}
          />
        ))}
      </div>
      <div className="text-center text-sm text-muted-foreground">
        {"The key to success is..."}
      </div>
    </div>
  );
};

const ProgressPreview = () => {
  const { t } = useTranslation();
  
  return (
    <div className="rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 dark:from-green-500/20 dark:to-green-500/10 dark:backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{t('hero.todayProgress')}</span>
        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
      </div>
      <div className="space-y-3">
        <ProgressBar label={t('hero.vocabulary')} value="45/50" percent={90} color="bg-green-500" />
        <ProgressBar label={t('hero.listening')} value="8/10" percent={80} color="bg-primary" />
        <ProgressBar label={t('hero.writing')} value="3/5" percent={60} color="bg-accent" />
      </div>
    </div>
  );
};

const ProgressBar = ({ label, value, percent, color }: { label: string; value: string; percent: number; color: string }) => (
  <div>
    <div className="mb-1 flex justify-between text-sm">
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
    <div className="h-2 rounded-full bg-muted">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${percent}%` }} />
    </div>
  </div>
);

export default HeroSection;
