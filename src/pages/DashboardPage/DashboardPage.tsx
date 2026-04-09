'use client';

import Icons from '@/components/Icons';
import {
  DASHBOARD_QUERY_KEYS,
  useFsrsDailyReportQuery,
  useFsrsInsightsQuery,
  useFsrsRecommendationsQuery,
  useFsrsRiskCardsQuery
} from '@/api/dashboard-management';
import { useCourseQuery, useCoursesQuery } from '@/api/course-management';
import { CourseGrid } from './CourseGrid';
import { LessonWordsModal } from '@/modals/LessonWordsModal';
import { Leaderboard } from './Leaderboard';
import {
  DailyReportItem,
  RiskCardItem,
  SectionState,
  TrendStat,
  percent
} from './DashboardWidgets';
import { useLessonsQuery } from '@/api/lesson-management';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const mockLeaderboard = [
  { rank: 1, name: 'Nguyen Linh', points: 2850, streak: 45, avatar: '👑' },
  { rank: 2, name: 'Tran Minh', points: 2720, streak: 38, avatar: '🥈' },
  { rank: 3, name: 'Hoang Nam', points: 2650, streak: 42, avatar: '🥉' },
  { rank: 4, name: 'You', points: 1890, streak: 12, avatar: '😊' },
  { rank: 5, name: 'Lan Phuong', points: 1750, streak: 25, avatar: '📚' }
];

const toYmd = (value: Date) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const trendLabel = (value: number) => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(1)}%`;
};

const DASHBOARD_DISPLAY_SETTINGS_KEY = 'dashboard_display_settings_v1';

const defaultDisplaySettings = {
  showOverview: true,
  showDailyReport: true,
  showRecommendations: true,
  showLeaderboard: true,
  showRiskCards: true
};

const DashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const coursesQuery = useCoursesQuery({ sortBy: 'order', sortOrder: 'asc', take: 20 });
  const courses = coursesQuery.data?.data ?? [];
  const selectedCourseId = courses[0]?.id ?? 0;
  const selectedCourseQuery = useCourseQuery(selectedCourseId);
  const selectedCourse = selectedCourseQuery.data ?? courses[0] ?? null;
  const [reviewLessonId, setReviewLessonId] = useState<number | null>(null);
  const lessonsQuery = useLessonsQuery(
    {
      courseId: selectedCourseId,
      sortBy: 'order',
      sortOrder: 'asc',
      take: 100
    },
    !!selectedCourseId
  );
  const lessons = lessonsQuery.data?.data ?? selectedCourse?.lessons ?? [];
  const selectedCourseWithLessons = selectedCourse
    ? {
        ...selectedCourse,
        lessons
      }
    : null;

  const [fsrsWindow, setFsrsWindow] = useState<Dashboard.FsrsWindow>('30d');
  const [riskTake, setRiskTake] = useState(6);
  const [isDisplaySettingsOpen, setIsDisplaySettingsOpen] = useState(false);

  const [displaySettings, setDisplaySettings] = useState<{
    showOverview: boolean;
    showDailyReport: boolean;
    showRecommendations: boolean;
    showLeaderboard: boolean;
    showRiskCards: boolean;
  }>(() => {
    try {
      const rawSettings = localStorage.getItem(DASHBOARD_DISPLAY_SETTINGS_KEY);
      if (!rawSettings) {
        return defaultDisplaySettings;
      }

      return {
        ...defaultDisplaySettings,
        ...(JSON.parse(rawSettings) as Partial<typeof defaultDisplaySettings>)
      };
    } catch {
      return defaultDisplaySettings;
    }
  });

  const dashboardRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const dailyTo = useMemo(() => toYmd(new Date()), []);
  const dailyFrom = useMemo(() => {
    const from = new Date();
    from.setDate(from.getDate() - 6);
    return toYmd(from);
  }, []);

  const insightsQuery = useFsrsInsightsQuery(fsrsWindow);
  const recommendationsQuery = useFsrsRecommendationsQuery();
  const dailyQuery = useFsrsDailyReportQuery(dailyFrom, dailyTo);
  const riskQuery = useFsrsRiskCardsQuery(riskTake);

  const insights = insightsQuery.data;
  const recommendations = recommendationsQuery.data;
  const daily = dailyQuery.data;
  const risk = riskQuery.data;

  const isAnyLoading =
    insightsQuery.isLoading ||
    recommendationsQuery.isLoading ||
    dailyQuery.isLoading ||
    riskQuery.isLoading;

  const errorCount = [insightsQuery, recommendationsQuery, dailyQuery, riskQuery].filter(
    query => query.isError
  ).length;

  const maxDailyReviews = useMemo(() => {
    const values = (daily?.metrics.days ?? []).map(point => point.reviews);
    return Math.max(1, ...values);
  }, [daily?.metrics.days]);

  const recommendationLines =
    recommendations?.narrative?.length && recommendations.narrative.length > 0
      ? recommendations.narrative
      : (insights?.narrative ?? []);

  const statCards = [
    {
      key: 'memory-strength',
      icon: <Icons.Brain className='h-4 w-4' />,
      label: t('learning_memory_strength'),
      value: insights?.metrics.memoryScore ?? '--',
      unit: insights ? '%' : undefined
    },
    {
      key: 'avg-retention',
      icon: <Icons.Activity className='h-4 w-4' />,
      label: t('learning_avg_retention'),
      value: insights ? percent(insights.metrics.retentionRate) : '--'
    },
    {
      key: 'due-tomorrow',
      icon: <Icons.Calendar className='h-4 w-4' />,
      label: t('dashboard_due_tomorrow'),
      value: insights?.metrics.workloadForecast.dueTomorrow ?? '--',
      unit: t('learning_cards')
    },
    {
      key: 'overdue-gt3d',
      icon: <Icons.Clock className='h-4 w-4' />,
      label: t('dashboard_overdue_gt3d'),
      value: recommendations?.metrics.overdueGt3d ?? '--',
      unit: t('learning_cards')
    }
  ];

  const masteryItems = [
    { key: 'new', label: t('dashboard_mastery_new') },
    { key: 'learning', label: t('dashboard_mastery_learning') },
    { key: 'review', label: t('dashboard_mastery_review') },
    { key: 'relearning', label: t('dashboard_mastery_relearning') }
  ];

  const windowOptions: Dashboard.FsrsWindow[] = ['7d', '30d', '90d'];

  const displaySettingItems: Array<{
    key: keyof typeof defaultDisplaySettings;
    label: string;
  }> = [
    { key: 'showOverview', label: t('dashboard_show_overview') },
    { key: 'showDailyReport', label: t('dashboard_show_daily_report') },
    { key: 'showRecommendations', label: t('dashboard_show_recommendations') },
    { key: 'showLeaderboard', label: t('dashboard_show_leaderboard') },
    { key: 'showRiskCards', label: t('dashboard_show_risk_cards') }
  ];

  const handleSelectLesson = (lesson: LearningManagement.Lesson) => {
    const isLearned = lesson.isLearned ?? lesson.completed ?? false;
    if (lesson.id === undefined) return;

    if (!isLearned) {
      navigate({ to: '/lessons/$lessonId', params: { lessonId: lesson.id.toString() } });
    } else {
      setReviewLessonId(Number(lesson.id));
    }
  };

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.all });
  };

  const handleToggleDisplaySetting = (key: keyof typeof defaultDisplaySettings) => {
    setDisplaySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  useEffect(() => {
    localStorage.setItem(DASHBOARD_DISPLAY_SETTINGS_KEY, JSON.stringify(displaySettings));
  }, [displaySettings]);

  useGSAP(
    () => {
      const statsCards = mainContentRef.current?.querySelectorAll('[class*="stats-card"]');
      statsCards?.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.45, delay: index * 0.06 }
        );
      });

      const sections = dashboardRef.current?.querySelectorAll('[class*="content-section"]');
      sections?.forEach(section => {
        gsap.fromTo(
          section,
          { opacity: 0.85, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            scrollTrigger: {
              trigger: section,
              start: 'top 88%',
              end: 'top 55%',
              scrub: 0.4
            }
          }
        );
      });
    },
    { scope: dashboardRef }
  );

  return (
    <div ref={dashboardRef} className='relative w-full overflow-hidden px-4 py-4 sm:px-6 lg:px-8'>
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute -left-14 top-6 h-44 w-44 rounded-full bg-primary/12 blur-3xl' />
        <div className='absolute right-0 top-24 h-52 w-52 rounded-full bg-accent/12 blur-3xl' />
        <div className='absolute bottom-10 left-1/3 h-44 w-44 rounded-full bg-chart-3/10 blur-3xl' />
      </div>

      <div ref={mainContentRef} className='space-y-3.5'>
        <div className='content-section glass-card rounded-2xl border border-border/60 p-3'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='min-w-0'>
              <h1 className='text-base font-semibold sm:text-lg'>{t('learning_dashboard')}</h1>
              {selectedCourse ? (
                <p className='truncate text-xs text-muted-foreground'>{selectedCourse.title}</p>
              ) : null}
            </div>

            <div className='flex flex-wrap items-center gap-2'>
              <div className='flex flex-wrap gap-1'>
                {windowOptions.map(option => (
                  <Button
                    key={option}
                    size='sm'
                    variant={fsrsWindow === option ? 'default' : 'outline'}
                    className='h-8 rounded-full px-3 text-xs'
                    onClick={() => setFsrsWindow(option)}>
                    {t(`dashboard_window_${option}`)}
                  </Button>
                ))}
              </div>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsDisplaySettingsOpen(prev => !prev)}
                className='h-8 gap-1.5 rounded-full border border-border/70 px-2 text-xs'>
                <Icons.MoreHorizontal className='h-3.5 w-3.5' />
                {t('dashboard_customize_view')}
              </Button>

              <Button
                variant='ghost'
                size='sm'
                onClick={handleRefresh}
                className='h-8 gap-1.5 rounded-full border border-border/70 px-2 text-xs'>
                <Icons.Undo2 className={`h-3.5 w-3.5 ${isAnyLoading ? 'animate-spin' : ''}`} />
                {t('dashboard_refresh')}
              </Button>
            </div>
          </div>

          {isDisplaySettingsOpen ? (
            <div className='mt-3 rounded-xl border border-border/70 bg-background/45 p-2.5 backdrop-blur-md'>
              <p className='mb-2 text-xs font-medium text-muted-foreground'>
                {t('dashboard_display_settings')}
              </p>
              <div className='flex flex-wrap gap-1.5'>
                {displaySettingItems.map(item => {
                  const isActive = displaySettings[item.key];

                  return (
                    <Button
                      key={item.key}
                      size='sm'
                      variant={isActive ? 'default' : 'outline'}
                      className='h-7 rounded-full px-2.5 text-[11px]'
                      onClick={() => handleToggleDisplaySetting(item.key)}>
                      {isActive ? <Icons.Check className='mr-1 h-3 w-3' /> : null}
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {errorCount > 0 ? (
          <Card className='content-section border-destructive/40 bg-destructive/5'>
            <div className='p-4 text-sm text-destructive'>
              {errorCount >= 4 ? t('dashboard_error_all') : t('dashboard_error_partial')}
            </div>
          </Card>
        ) : null}

        {displaySettings.showOverview ? (
          <Card className='content-section glass-card relative overflow-hidden rounded-2xl border-border/60 p-3.5 sm:p-4'>
            <div className='pointer-events-none absolute right-2 top-2 h-28 w-28 rounded-full bg-primary/10 blur-2xl' />
            <div className='pointer-events-none absolute -bottom-8 left-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl' />

            <div className='relative space-y-3'>
              <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
                {statCards.map(stat => (
                  <div
                    key={stat.key}
                    className='stats-card rounded-xl border bg-background/50 p-2.5'>
                    <div className='mb-1.5 flex items-center justify-between'>
                      <span className='line-clamp-1 text-[11px] text-muted-foreground sm:text-xs'>
                        {stat.label}
                      </span>
                      <span className='text-primary/80'>{stat.icon}</span>
                    </div>
                    <div className='flex items-baseline gap-1'>
                      <span className='text-base font-bold leading-none sm:text-lg'>
                        {stat.value}
                      </span>
                      {stat.unit ? (
                        <span className='text-[10px] text-muted-foreground'>{stat.unit}</span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              <div className='grid grid-cols-1 gap-2 lg:grid-cols-3'>
                <div className='rounded-xl border bg-background/45 p-2.5 lg:col-span-2'>
                  <div className='mb-2 flex items-center justify-between gap-2'>
                    <h3 className='flex items-center gap-2 text-sm font-semibold'>
                      <Icons.TrendingUp className='h-3.5 w-3.5 text-primary' />
                      {t('dashboard_trend_workload')}
                    </h3>
                    <Badge variant='outline' className='text-[10px]'>
                      {t('dashboard_window_current', { window: fsrsWindow })}
                    </Badge>
                  </div>

                  <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
                    <TrendStat
                      label={t('dashboard_trend_vs_prev')}
                      value={insights ? trendLabel(insights.metrics.trend.vsPreviousWindow) : '--'}
                    />
                    <TrendStat
                      label={t('dashboard_due_next7d')}
                      value={insights?.metrics.workloadForecast.next7dDue ?? '--'}
                    />
                    <TrendStat
                      label={t('dashboard_suggested_daily_limit')}
                      value={recommendations?.metrics.suggestedDailyLimit ?? '--'}
                    />
                  </div>

                  <div className='mt-2 text-[11px] text-muted-foreground sm:text-xs'>
                    {recommendations ? (
                      <>
                        {t('dashboard_speed_delta')}:{' '}
                        {trendLabel(recommendations.metrics.speedDeltaPct)}
                        {' · '}
                        {t('dashboard_accuracy_delta')}:{' '}
                        {trendLabel(recommendations.metrics.accuracyDeltaPct)}
                      </>
                    ) : (
                      t('dashboard_loading_data')
                    )}
                  </div>
                </div>

                <div className='rounded-xl border bg-background/45 p-2.5'>
                  <h3 className='mb-2 flex items-center gap-2 text-sm font-semibold'>
                    <Icons.PieChart className='h-3.5 w-3.5 text-primary' />
                    {t('dashboard_mastery_distribution')}
                  </h3>
                  <div className='space-y-2'>
                    {masteryItems.map(item => {
                      const value =
                        insights?.metrics.masteryDistribution[
                          item.key as keyof Dashboard.MasteryDistribution
                        ] ?? 0;

                      return (
                        <div key={item.key}>
                          <div className='mb-1 flex items-center justify-between text-[11px]'>
                            <span className='text-muted-foreground'>{item.label}</span>
                            <span className='font-medium'>{value}</span>
                          </div>
                          <div className='h-1.5 rounded-full bg-muted'>
                            <div
                              className='h-1.5 rounded-full bg-primary/80'
                              style={{ width: `${Math.min(100, value)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ) : null}

        <Card className='content-section glass-card rounded-2xl border-border/60 p-3.5 sm:p-4'>
          <div className='mb-3 flex items-center justify-between gap-2'>
            <h3 className='text-sm font-semibold sm:text-base'>{t('dashboard_lessons_focus')}</h3>
            <span className='rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary'>
              {t('dashboard_lessons_showing_limit', {
                shown: Math.min(6, lessons.length),
                total: lessons.length
              })}
            </span>
          </div>
          <CourseGrid
            course={selectedCourseWithLessons}
            onSelectLesson={handleSelectLesson}
            maxVisibleLessons={6}
          />
        </Card>

        <div className='content-section grid grid-cols-1 gap-3 lg:grid-cols-2'>
          {displaySettings.showDailyReport ? (
            <Card className='glass-card border-border/60 p-4'>
              <h3 className='mb-3 flex items-center gap-2 font-semibold'>
                <Icons.BarChart3 className='h-4 w-4 text-primary' />
                {t('dashboard_daily_report_7d')}
              </h3>

              {dailyQuery.isLoading ? (
                <SectionState className='h-32'>
                  <Icons.LoaderCircleIcon className='mr-2 h-4 w-4 animate-spin' />
                  {t('dashboard_loading_data')}
                </SectionState>
              ) : null}

              {!dailyQuery.isLoading && (daily?.metrics.days?.length ?? 0) === 0 ? (
                <SectionState className='h-32'>{t('dashboard_daily_empty')}</SectionState>
              ) : null}

              {!dailyQuery.isLoading && (daily?.metrics.days?.length ?? 0) > 0 ? (
                <div className='space-y-2'>
                  {daily?.metrics.days.map(point => (
                    <DailyReportItem
                      key={point.date}
                      point={point}
                      maxDailyReviews={maxDailyReviews}
                    />
                  ))}
                </div>
              ) : null}
            </Card>
          ) : null}

          {displaySettings.showRecommendations ? (
            <Card className='glass-card border-border/60 p-4'>
              <h3 className='mb-3 flex items-center gap-2 font-semibold'>
                <Icons.WandSparkles className='h-4 w-4 text-primary' />
                {t('dashboard_recommendations')}
              </h3>

              {(recommendationLines.length ?? 0) === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  {t('dashboard_recommendations_empty')}
                </p>
              ) : (
                <div className='space-y-2'>
                  {recommendationLines.slice(0, 5).map((line, index) => (
                    <p key={`${line}-${index}`} className='text-xs text-foreground/90 sm:text-sm'>
                      {line}
                    </p>
                  ))}
                </div>
              )}

              <Button
                className='mt-3 h-9 w-full gap-2 text-xs sm:text-sm'
                onClick={() => navigate({ to: '/practice' })}>
                <Icons.Play className='h-4 w-4' />
                {t('dashboard_start_practice')}
              </Button>
            </Card>
          ) : null}
        </div>

        {displaySettings.showLeaderboard ? (
          <div className='content-section'>
            <Leaderboard users={mockLeaderboard} currentUserRank={4} />
          </div>
        ) : null}

        {displaySettings.showRiskCards ? (
          <Card className='content-section glass-card border-border/60 p-4'>
            <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                  <Icons.Shield className='h-4 w-4' />
                </div>
                <div>
                  <h3 className='flex items-center gap-2 text-base font-bold'>
                    {t('dashboard_risk_cards')}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Icons.Info className='h-4 w-4 cursor-help opacity-40 transition-opacity hover:opacity-100' />
                        </TooltipTrigger>
                        <TooltipContent className='max-w-80 p-4 text-sm leading-relaxed'>
                          {t('dashboard_fsrs_summary_info')}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h3>
                  <p className='text-[11px] text-muted-foreground'>
                    {t('dashboard_risk_empty')} • {risk?.metrics.items.length ?? 0}{' '}
                    {t('learning_cards')}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                  {t('dashboard_risk_show_count')}
                </span>
                <Select value={riskTake.toString()} onValueChange={val => setRiskTake(Number(val))}>
                  <SelectTrigger className='h-8 w-19 bg-card/50'>
                    <SelectValue placeholder='6' />
                  </SelectTrigger>
                  <SelectContent>
                    {[6, 12, 24, 48].map(val => (
                      <SelectItem key={val} value={val.toString()}>
                        {val}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {riskQuery.isLoading ? (
              <SectionState className='h-24'>
                <Icons.LoaderCircleIcon className='mr-2 h-4 w-4 animate-spin' />
                {t('dashboard_loading_data')}
              </SectionState>
            ) : null}

            {!riskQuery.isLoading && (risk?.metrics.items.length ?? 0) === 0 ? (
              <SectionState className='h-24'>{t('dashboard_risk_empty')}</SectionState>
            ) : null}

            {!riskQuery.isLoading && (risk?.metrics.items.length ?? 0) > 0 ? (
              <div className='grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3'>
                {risk?.metrics.items.map(item => (
                  <RiskCardItem key={`${item.wordId}-${item.riskScore}`} item={item} />
                ))}
              </div>
            ) : null}

            {(risk?.narrative.length ?? 0) > 0 ? (
              <p className='mt-3 text-xs text-muted-foreground sm:text-sm'>{risk?.narrative[0]}</p>
            ) : null}
          </Card>
        ) : null}
      </div>

      {reviewLessonId ? (
        <LessonWordsModal
          id={reviewLessonId}
          open={!!reviewLessonId}
          onCancel={() => setReviewLessonId(null)}
        />
      ) : null}
    </div>
  );
};

export default DashboardPage;
