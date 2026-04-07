'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Icons from '@/components/Icons';
import {
  DASHBOARD_QUERY_KEYS,
  useFsrsDailyReportQuery,
  useFsrsInsightsQuery,
  useFsrsRecommendationsQuery,
  useFsrsRiskCardsQuery
} from '@/api/dashboard-management';
import { useCourseQuery, useCoursesQuery } from '@/api/course-management';
import { getLessonsQueryOptions } from '@/api/lesson-management';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CourseGrid } from './CourseGrid';
import { LessonWordsModal } from '@/modals/LessonWordsModal';
import { StatsCard } from './StatsCard';
import { Leaderboard } from './Leaderboard';
import {
  DailyReportItem,
  RiskCardItem,
  SectionState,
  TrendStat,
  percent
} from './DashboardWidgets';

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
  const lessonsQuery = useQuery({
    ...getLessonsQueryOptions({
      courseId: selectedCourseId,
      sortBy: 'order',
      sortOrder: 'asc',
      take: 100
    }),
    enabled: !!selectedCourseId
  });
  const lessons = lessonsQuery.data?.data ?? selectedCourse?.lessons ?? [];
  const selectedCourseWithLessons = selectedCourse
    ? {
        ...selectedCourse,
        lessons
      }
    : null;
  const [window, setWindow] = useState<Dashboard.FsrsWindow>('30d');
  const dashboardRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const dailyTo = useMemo(() => toYmd(new Date()), []);
  const dailyFrom = useMemo(() => {
    const from = new Date();
    from.setDate(from.getDate() - 6);
    return toYmd(from);
  }, []);

  const [riskTake, setRiskTake] = useState(6);
  const insightsQuery = useFsrsInsightsQuery(window);
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
      icon: <Icons.Brain className='h-5 w-5' />,
      label: t('learning_memory_strength'),
      value: insights?.metrics.memoryScore ?? '--',
      unit: insights ? '%' : undefined,
      color: 'primary' as const
    },
    {
      key: 'avg-retention',
      icon: <Icons.Activity className='h-5 w-5' />,
      label: t('learning_avg_retention'),
      value: insights ? percent(insights.metrics.retentionRate) : '--',
      color: 'accent' as const
    },
    {
      key: 'due-tomorrow',
      icon: <Icons.Calendar className='h-5 w-5' />,
      label: t('dashboard_due_tomorrow'),
      value: insights?.metrics.workloadForecast.dueTomorrow ?? '--',
      unit: t('learning_cards'),
      color: 'success' as const
    },
    {
      key: 'overdue-gt3d',
      icon: <Icons.Clock className='h-5 w-5' />,
      label: t('dashboard_overdue_gt3d'),
      value: recommendations?.metrics.overdueGt3d ?? '--',
      unit: t('learning_cards'),
      color: 'accent' as const
    }
  ];

  const masteryItems = [
    { key: 'new', label: t('dashboard_mastery_new') },
    { key: 'learning', label: t('dashboard_mastery_learning') },
    { key: 'review', label: t('dashboard_mastery_review') },
    { key: 'relearning', label: t('dashboard_mastery_relearning') }
  ];

  const windowOptions: Dashboard.FsrsWindow[] = ['7d', '30d', '90d'];

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

  useGSAP(
    () => {
      const statsCards = mainContentRef.current?.querySelectorAll('[class*="stats-card"]');
      statsCards?.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1 }
        );
      });

      const sections = dashboardRef.current?.querySelectorAll('[class*="content-section"]');
      sections?.forEach(section => {
        gsap.fromTo(
          section,
          { opacity: 0.8 },
          {
            opacity: 1,
            duration: 0.4,
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 0.5
            }
          }
        );
      });
    },
    { scope: dashboardRef }
  );

  return (
    <div ref={dashboardRef} className='w-full px-4 py-6 sm:px-6 lg:px-8'>
      <div ref={mainContentRef} className='space-y-6'>
        <div className='rounded-2xl border bg-card/50 p-4 sm:p-5'>
          <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate({ to: '/' })}
              className='h-auto p-0 text-primary hover:bg-transparent'>
              <Icons.ChevronLeft className='h-4 w-4 mr-1' />
              {t('header_home')}
            </Button>
            <span>/</span>
            <span className='font-medium text-foreground'>{t('learning_dashboard')}</span>
            {selectedCourse && (
              <>
                <span>/</span>
                <span className='font-medium text-foreground'>{selectedCourse.title}</span>
              </>
            )}
          </div>

          <div className='mt-4 flex flex-wrap items-center gap-2'>
            <Button size='sm' onClick={() => navigate({ to: '/practice' })} className='gap-2'>
              <Icons.Play className='h-4 w-4' />
              {t('dashboard_start_practice')}
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigate({ to: '/courses' })}>
              {t('dashboard_browse_courses')}
            </Button>
            <Button variant='ghost' size='sm' onClick={handleRefresh} className='gap-2'>
              <Icons.Undo2 className={`h-4 w-4 ${isAnyLoading ? 'animate-spin' : ''}`} />
              {t('dashboard_refresh')}
            </Button>
          </div>

          <div className='mt-4 flex flex-wrap gap-2'>
            {windowOptions.map(option => (
              <Button
                key={option}
                size='sm'
                variant={window === option ? 'default' : 'outline'}
                onClick={() => setWindow(option)}>
                {t(`dashboard_window_${option}`)}
              </Button>
            ))}
          </div>
        </div>

        {errorCount > 0 && (
          <Card className='border-destructive/40 bg-destructive/5 content-section'>
            <div className='p-4 text-sm text-destructive'>
              {errorCount >= 4 ? t('dashboard_error_all') : t('dashboard_error_partial')}
            </div>
          </Card>
        )}

        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 content-section'>
          {statCards.map(stat => (
            <div key={stat.key} className='stats-card'>
              <StatsCard
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                unit={stat.unit}
                color={stat.color}
              />
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 content-section'>
          <Card className='p-5 xl:col-span-2'>
            <div className='flex items-center justify-between gap-2 mb-4'>
              <h3 className='font-semibold flex items-center gap-2'>
                <Icons.TrendingUp className='h-4 w-4 text-primary' />
                {t('dashboard_trend_workload')}
              </h3>
              <Badge variant='outline'>{t('dashboard_window_current', { window })}</Badge>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
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
            <div className='mt-4 text-sm text-muted-foreground'>
              {recommendations ? (
                <>
                  {t('dashboard_speed_delta')}: {trendLabel(recommendations.metrics.speedDeltaPct)}
                  {' · '}
                  {t('dashboard_accuracy_delta')}:{' '}
                  {trendLabel(recommendations.metrics.accuracyDeltaPct)}
                </>
              ) : (
                t('dashboard_loading_data')
              )}
            </div>
          </Card>

          <Card className='p-5'>
            <h3 className='font-semibold flex items-center gap-2 mb-4'>
              <Icons.PieChart className='h-4 w-4 text-primary' />
              {t('dashboard_mastery_distribution')}
            </h3>
            <div className='space-y-3'>
              {masteryItems.map(item => {
                const value =
                  insights?.metrics.masteryDistribution[
                    item.key as keyof Dashboard.MasteryDistribution
                  ] ?? 0;

                return (
                  <div key={item.key}>
                    <div className='flex items-center justify-between text-sm mb-1'>
                      <span className='text-muted-foreground'>{item.label}</span>
                      <span className='font-medium'>{value}</span>
                    </div>
                    <div className='h-2 rounded-full bg-muted'>
                      <div
                        className='h-2 rounded-full bg-primary/70'
                        style={{ width: `${Math.min(100, value)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 content-section'>
          <Card className='p-5 xl:col-span-2'>
            <h3 className='font-semibold flex items-center gap-2 mb-4'>
              <Icons.BarChart3 className='h-4 w-4 text-primary' />
              {t('dashboard_daily_report_7d')}
            </h3>

            {dailyQuery.isLoading && (
              <SectionState className='h-44'>
                <Icons.LoaderCircleIcon className='h-4 w-4 animate-spin mr-2' />
                {t('dashboard_loading_data')}
              </SectionState>
            )}

            {!dailyQuery.isLoading && (daily?.metrics.days?.length ?? 0) === 0 && (
              <SectionState className='h-44'>{t('dashboard_daily_empty')}</SectionState>
            )}

            {!dailyQuery.isLoading && (daily?.metrics.days?.length ?? 0) > 0 && (
              <div className='space-y-2'>
                {daily?.metrics.days.map(point => (
                  <DailyReportItem
                    key={point.date}
                    point={point}
                    maxDailyReviews={maxDailyReviews}
                  />
                ))}
              </div>
            )}
          </Card>

          <Card className='p-5'>
            <h3 className='font-semibold flex items-center gap-2 mb-4'>
              <Icons.WandSparkles className='h-4 w-4 text-primary' />
              {t('dashboard_recommendations')}
            </h3>
            {(recommendationLines.length ?? 0) === 0 ? (
              <p className='text-sm text-muted-foreground'>
                {t('dashboard_recommendations_empty')}
              </p>
            ) : (
              <div className='space-y-2'>
                {recommendationLines.slice(0, 3).map((line, index) => (
                  <p key={`${line}-${index}`} className='text-sm text-foreground/90'>
                    {line}
                  </p>
                ))}
              </div>
            )}
            <Button className='mt-4 w-full gap-2' onClick={() => navigate({ to: '/practice' })}>
              <Icons.Play className='h-4 w-4' />
              {t('dashboard_start_practice')}
            </Button>
          </Card>
        </div>

        <Card className='p-5 content-section'>
          <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                <Icons.Shield className='h-5 w-5' />
              </div>
              <div>
                <h3 className='text-lg font-bold flex items-center gap-2'>
                  {t('dashboard_risk_cards')}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Icons.Info className='h-4 w-4 cursor-help opacity-40 hover:opacity-100 transition-opacity' />
                      </TooltipTrigger>
                      <TooltipContent className='max-w-[320px] p-4 text-sm leading-relaxed'>
                        {t('dashboard_fsrs_summary_info')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h3>
                <p className='text-xs text-muted-foreground'>
                  {t('dashboard_risk_empty')} • {risk?.metrics.items.length ?? 0} {t('learning_cards')}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                {t('dashboard_risk_show_count')}
              </span>
              <Select
                value={riskTake.toString()}
                onValueChange={val => setRiskTake(Number(val))}>
                <SelectTrigger className='h-9 w-[80px] bg-card/50'>
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

          {riskQuery.isLoading && (
            <SectionState className='h-28'>
              <Icons.LoaderCircleIcon className='h-4 w-4 animate-spin mr-2' />
              {t('dashboard_loading_data')}
            </SectionState>
          )}

          {!riskQuery.isLoading && (risk?.metrics.items.length ?? 0) === 0 && (
            <SectionState className='h-28'>{t('dashboard_risk_empty')}</SectionState>
          )}

          {!riskQuery.isLoading && (risk?.metrics.items.length ?? 0) > 0 && (
            <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4'>
              {risk?.metrics.items.map(item => (
                <RiskCardItem key={`${item.wordId}-${item.riskScore}`} item={item} />
              ))}
            </div>
          )}

          {(risk?.narrative.length ?? 0) > 0 && (
            <p className='mt-4 text-sm text-muted-foreground'>{risk?.narrative[0]}</p>
          )}
        </Card>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 content-section'>
          <div className='lg:col-span-2 space-y-6'>
            <CourseGrid course={selectedCourseWithLessons} onSelectLesson={handleSelectLesson} />
          </div>

          <Leaderboard users={mockLeaderboard} currentUserRank={4} />
        </div>
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
