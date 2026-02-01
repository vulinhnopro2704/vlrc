import { Card, CardContent } from '@/components/ui/card';
import { Headphones, BookOpen, PenTool, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type TabType = 'listening' | 'reading' | 'writing';

export const ExperienceSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('listening');
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, { scope: sectionRef });

  const handleTabChange = (tab: TabType) => {
    gsap.to(cardRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.2,
      onComplete: () => {
        setActiveTab(tab);
        gsap.to(cardRef.current, { opacity: 1, y: 0, duration: 0.3 });
      }
    });
  };

  const tabIcons = { listening: Headphones, reading: BookOpen, writing: PenTool };

  return (
    <section ref={sectionRef} className="bg-secondary/30 py-20 lg:py-28 dark:bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t('experience.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('experience.subtitle')}
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {/* Tabs */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-xl bg-muted p-1 dark:bg-muted/50 dark:backdrop-blur-sm">
              {(['listening', 'reading', 'writing'] as const).map((tab) => {
                const Icon = tabIcons[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-card text-foreground shadow-sm dark:bg-card/80'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(`experience.tabs.${tab}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <Card ref={cardRef} className="border-0 shadow-xl dark:bg-card/60 dark:backdrop-blur-md dark:border dark:border-white/10">
            <CardContent className="p-8">
              <TabContent tab={activeTab} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

const TabContent = ({ tab }: { tab: TabType }) => {
  const { t } = useTranslation();
  const features = t(`experience.${tab}.features`, { returnObjects: true }) as string[];

  return (
    <div className="grid items-center gap-8 md:grid-cols-2">
      <div>
        <h3 className="mb-4 text-2xl font-bold text-foreground">
          {t(`experience.${tab}.title`)}
        </h3>
        <p className="mb-6 text-muted-foreground leading-relaxed">
          {t(`experience.${tab}.description`)}
        </p>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <TabPreview tab={tab} />
    </div>
  );
};

const TabPreview = ({ tab }: { tab: TabType }) => {
  const { t } = useTranslation();

  if (tab === 'listening') {
    return (
      <div className="rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 p-6 dark:from-accent/20 dark:to-accent/10">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{t('hero.dictation')}</span>
          <span className="text-xs text-accent">00:45</span>
        </div>
        <div className="mb-4 flex items-center justify-center gap-1">
          {[30, 50, 70, 40, 60, 80, 50, 70, 35, 65, 45, 75].map((h, i) => (
            <div key={i} className="w-3 rounded-full bg-accent/60" style={{ height: `${h}px` }} />
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-sm text-foreground">{"The most important thing is to..."}</p>
          <input
            type="text"
            placeholder="Type what you hear..."
            className="w-full rounded-lg border bg-background/50 px-3 py-2 text-sm dark:bg-background/30"
            disabled
          />
        </div>
      </div>
    );
  }

  if (tab === 'reading') {
    return (
      <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-6 dark:from-primary/20 dark:to-primary/10">
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            {"Climate change is one of the most pressing issues of our time."}
          </p>
          <div className="rounded-lg bg-primary/10 p-3 dark:bg-primary/20">
            <p className="text-sm text-primary font-medium mb-1">Translation:</p>
            <p className="text-sm text-muted-foreground">
              {"Biến đổi khí hậu là một trong những vấn đề cấp bách nhất của thời đại chúng ta."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-6 dark:from-blue-500/20 dark:to-blue-500/10">
      <div className="mb-4">
        <span className="text-sm font-medium text-muted-foreground">Topic: Benefits of learning English</span>
      </div>
      <div className="space-y-3">
        <div className="h-3 rounded bg-muted dark:bg-muted/50" style={{ width: '100%' }} />
        <div className="h-3 rounded bg-muted dark:bg-muted/50" style={{ width: '90%' }} />
        <div className="h-3 rounded bg-muted dark:bg-muted/50" style={{ width: '95%' }} />
      </div>
      <div className="mt-4 rounded-lg bg-green-500/10 p-3 dark:bg-green-500/20">
        <p className="text-xs text-green-600 dark:text-green-400 font-medium">AI Feedback: Good structure! Consider adding more examples.</p>
      </div>
    </div>
  );
};

export default ExperienceSection;
