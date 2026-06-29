'use client';

import { useFSRSDueWordsQuery } from '@/api/practice-management';
import {
  useFsrsDailyReportQuery,
  useFsrsInsightsQuery,
  useFsrsRecommendationsQuery,
  useFsrsRiskCardsQuery
} from '@/api/dashboard-management';
import {
  DailyReportItem,
  RiskCardItem,
  SectionState,
  TrendStat,
  percent
} from '@/pages/DashboardPage/DashboardWidgets';
import PracticeActiveSession from './PracticeActiveSession';

const toYmd = (value: Date) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const PracticePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [fsrsWindow, setFsrsWindow] = useState<Dashboard.FsrsWindow>('30d');

  // Fetch words from backend spaced-repetition scheduling
  const { data: reviewWords, isLoading, isError } = useFSRSDueWordsQuery();

  const reviewRows = Array.isArray(reviewWords?.data) ? reviewWords.data : [];
  const words = reviewRows
    .map(row => row.word)
    .filter((word): word is LearningManagement.Word => Boolean(word));

  // Compute dates for daily report (last 7 days)
  const dailyTo = useMemo(() => toYmd(new Date()), []);
  const dailyFrom = useMemo(() => {
    const from = new Date();
    from.setDate(from.getDate() - 6);
    return toYmd(from);
  }, []);

  // Fetch FSRS stats
  const insightsQuery = useFsrsInsightsQuery(fsrsWindow);
  const recommendationsQuery = useFsrsRecommendationsQuery();
  const dailyQuery = useFsrsDailyReportQuery(dailyFrom, dailyTo);
  const riskQuery = useFsrsRiskCardsQuery(6);

  const insights = insightsQuery.data;
  const recommendations = recommendationsQuery.data;
  const daily = dailyQuery.data;
  const risk = riskQuery.data;

  const maxDailyReviews = useMemo(() => {
    const values = (daily?.metrics.days ?? [])
      .map(point => Number(point.reviews))
      .filter(val => !isNaN(val));
    return Math.max(1, ...values);
  }, [daily?.metrics.days]);

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

  const isStatsLoading = insightsQuery.isLoading || recommendationsQuery.isLoading;

  if (isError) {
    return (
      <div className='flex items-center justify-center min-h-screen p-4'>
        <div className='text-center space-y-4'>
          <h1 className='text-2xl font-bold text-foreground'>{t('practice_error_title')}</h1>
          <p className='text-muted-foreground'>{t('practice_error_message')}</p>
          <Button onClick={() => navigate({ to: '/dashboard' })}>{t('action_back')}</Button>
        </div>
      </div>
    );
  }

  // Render the gameplay session if active
  if (isSessionActive) {
    return (
      <PracticeActiveSession
        words={words}
        onExit={() => setIsSessionActive(false)}
      />
    );
  }

  // Render the pre-practice statistics dashboard
  return (
    <div className='relative min-h-screen bg-background w-full px-3 py-6 sm:px-6 sm:py-8 lg:px-8 max-w-7xl mx-auto'>
      {/* Background decorations */}
      <div className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute -left-14 top-6 h-44 w-44 rounded-full bg-primary/12 blur-3xl' />
        <div className='absolute right-0 top-24 h-52 w-52 rounded-full bg-accent/12 blur-3xl' />
        <div className='absolute bottom-10 left-1/3 h-44 w-44 rounded-full bg-chart-3/10 blur-3xl' />
      </div>

      <div className='space-y-6'>
        {/* Header Section */}
        <div className='flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-border/40'>
          <div>
            <h1 className='text-2xl font-black tracking-tight text-foreground sm:text-3xl'>
              {t('nav_practice') || 'Ôn tập từ vựng'}
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Ôn luyện Spaced Repetition tối ưu theo thuật toán FSRS
            </p>
          </div>

          {/* Time range options */}
          <div className='flex items-center gap-1.5 bg-muted/40 p-1 rounded-full border border-border/50'>
            {(['7d', '30d', '90d'] as Dashboard.FsrsWindow[]).map(option => (
              <Button
                key={option}
                size='sm'
                variant={fsrsWindow === option ? 'default' : 'ghost'}
                className='h-7 rounded-full px-3 text-xs font-semibold'
                onClick={() => setFsrsWindow(option)}>
                {t(`dashboard_window_${option}`)}
              </Button>
            ))}
          </div>
        </div>

        {/* Hero Spaced Repetition Due Card */}
        {isLoading ? (
          <Card className='relative overflow-hidden border border-border/60 bg-card/50 shadow-lg backdrop-blur-md animate-pulse'>
            <CardContent className='p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
              <div className='space-y-3 w-full max-w-xl'>
                <div className='h-4.5 w-24 rounded bg-muted/60' />
                <div className='h-7 w-3/4 rounded bg-muted/60' />
                <div className='h-4.5 w-5/6 rounded bg-muted/60' />
              </div>
              <div className='h-12 w-44 rounded-xl bg-muted/60 shrink-0' />
            </CardContent>
          </Card>
        ) : (
          <Card className='relative overflow-hidden border border-border/60 bg-gradient-to-br from-card/85 via-card/90 to-primary/5 shadow-lg backdrop-blur-md'>
            <div className='absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none' />
            <div className='absolute left-10 bottom-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none' />

            <CardContent className='p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10'>
              <div className='space-y-2.5 max-w-xl'>
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary' className='bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold text-xs uppercase tracking-wider px-2.5 py-0.5'>
                    {t('dashboard_recommendations') || 'Khuyến nghị'}
                  </Badge>
                  {words.length > 0 && (
                    <span className='flex h-2 w-2 rounded-full bg-destructive animate-ping' />
                  )}
                </div>

                <h2 className='text-xl sm:text-2xl font-bold tracking-tight text-foreground'>
                  {words.length > 0 ? (
                    <>
                      Bạn có <span className='text-primary font-extrabold'>{words.length}</span> từ vựng đang chờ ôn tập
                    </>
                  ) : (
                    'Thật tuyệt vời! Chưa có từ nào đến lịch ôn tập'
                  )}
                </h2>

                <p className='text-sm text-muted-foreground leading-relaxed'>
                  {words.length > 0
                    ? 'Việc ôn tập đều đặn hàng ngày giúp kích hoạt vùng nhớ dài hạn, củng cố và tăng cường đáng kể tỷ lệ lưu giữ từ vựng mới học.'
                    : 'Bạn đã hoàn thành xuất sắc các từ vựng đến hạn ôn tập ngày hôm nay. Hãy tiếp tục học thêm các bài mới để duy trì tần suất học nhé!'}
                </p>
              </div>

              <div className='flex shrink-0 items-center justify-start md:justify-end'>
                {words.length > 0 ? (
                  <Button
                    size='lg'
                    className='h-12 px-6 font-bold shadow-md hover:shadow-lg transition-all rounded-xl gap-2 bg-gradient-to-r from-primary to-primary/95 text-primary-foreground hover:scale-102 duration-200'
                    onClick={() => setIsSessionActive(true)}>
                    <Icons.Play className='h-4 w-4 fill-current' />
                    Bắt đầu ôn tập ngay
                  </Button>
                ) : (
                  <Button
                    size='lg'
                    disabled
                    variant='outline'
                    className='h-12 px-6 font-bold rounded-xl gap-2 opacity-60 cursor-not-allowed bg-muted text-muted-foreground border-border/80'>
                    <Icons.Check className='h-4 w-4' />
                    Hôm nay đã hoàn thành
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* FSRS Overview Stats */}
        {isStatsLoading ? (
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className='border border-border/50 bg-background/50 animate-pulse'>
                <CardContent className='p-4.5 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='h-4 w-24 rounded bg-muted/60' />
                    <div className='h-7 w-7 rounded bg-muted/60' />
                  </div>
                  <div className='h-6 w-16 rounded bg-muted/60' />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            {statCards.map(stat => (
              <Card key={stat.key} className='stats-card border border-border/50 bg-background/50 hover:bg-background/80 hover:shadow-xs transition-all duration-300'>
                <CardContent className='p-4.5'>
                  <div className='mb-2 flex items-center justify-between'>
                    <span className='line-clamp-1 text-xs text-muted-foreground font-medium'>
                      {stat.label}
                    </span>
                    <span className='text-primary/70 bg-primary/5 p-1.5 rounded-lg'>{stat.icon}</span>
                  </div>
                  <div className='flex items-baseline gap-1 mt-1'>
                    <span className='text-xl font-extrabold leading-none tracking-tight text-foreground sm:text-2xl'>
                      {stat.value}
                    </span>
                    {stat.unit ? (
                      <span className='text-xs text-muted-foreground font-semibold'>{stat.unit}</span>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Mastery and Workload Details */}
        {isStatsLoading ? (
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
            <Card className='lg:col-span-2 border border-border/60 bg-card/65 animate-pulse'>
              <CardContent className='p-6 space-y-4'>
                <div className='h-5 w-40 rounded bg-muted/60' />
                <div className='grid grid-cols-3 gap-3'>
                  <div className='h-16 rounded bg-muted/60' />
                  <div className='h-16 rounded bg-muted/60' />
                  <div className='h-16 rounded bg-muted/60' />
                </div>
                <div className='h-4 w-2/3 rounded bg-muted/60' />
              </CardContent>
            </Card>

            <Card className='border border-border/60 bg-card/65 animate-pulse'>
              <CardContent className='p-6 space-y-4'>
                <div className='h-5 w-44 rounded bg-muted/60' />
                <div className='space-y-3'>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className='space-y-1'>
                      <div className='flex justify-between'>
                        <div className='h-3 w-16 rounded bg-muted/60' />
                        <div className='h-3 w-8 rounded bg-muted/60' />
                      </div>
                      <div className='h-2 rounded bg-muted/60' />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
            {/* Workload Trend */}
            <Card className='lg:col-span-2 border border-border/60 bg-card/65 backdrop-blur-xs'>
              <CardHeader className='pb-2.5'>
                <CardTitle className='flex items-center gap-2 text-base font-bold text-foreground'>
                  <Icons.TrendingUp className='h-4 w-4 text-primary' />
                  {t('dashboard_trend_workload')}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                  <TrendStat
                    label={t('dashboard_trend_vs_prev')}
                    value={insights ? percent(insights.metrics.trend.vsPreviousWindow) : '--'}
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

                <div className='text-xs font-medium text-muted-foreground border-t border-border/40 pt-3'>
                  {recommendations ? (
                    <div className='flex flex-wrap items-center gap-y-1 gap-x-4'>
                      <span>
                        {t('dashboard_speed_delta')}:{' '}
                        <span className='font-bold text-foreground'>
                          {percent(recommendations.metrics.speedDeltaPct)}
                        </span>
                      </span>
                      <span className='text-muted-foreground/30'>•</span>
                      <span>
                        {t('dashboard_accuracy_delta')}:{' '}
                        <span className='font-bold text-foreground'>
                          {percent(recommendations.metrics.accuracyDeltaPct)}
                        </span>
                      </span>
                    </div>
                  ) : (
                    t('dashboard_loading_data')
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mastery Distribution */}
            <Card className='border border-border/60 bg-card/65 backdrop-blur-xs'>
              <CardHeader className='pb-2'>
                <CardTitle className='flex items-center gap-2 text-base font-bold text-foreground'>
                  <Icons.PieChart className='h-4 w-4 text-primary' />
                  {t('dashboard_mastery_distribution')}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3.5'>
                {masteryItems.map(item => {
                  const value =
                    insights?.metrics.masteryDistribution[
                      item.key as keyof Dashboard.MasteryDistribution
                    ] ?? 0;

                  return (
                    <div key={item.key} className='space-y-1'>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='text-muted-foreground font-medium'>{item.label}</span>
                        <span className='font-bold text-foreground'>{value}</span>
                      </div>
                      <div className='h-2 rounded-full bg-muted/60 overflow-hidden'>
                        <div
                          className='h-2 rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-500'
                          style={{ width: `${Math.min(100, value)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Daily Report / Study Activity */}
        <Card className='border border-border/60 bg-card/65 backdrop-blur-xs'>
          <CardHeader className='pb-3.5'>
            <CardTitle className='flex items-center gap-2 text-base font-bold text-foreground'>
              <Icons.BarChart3 className='h-4 w-4 text-primary' />
              {t('dashboard_daily_report_7d')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyQuery.isLoading ? (
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 animate-pulse'>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className='h-20 rounded bg-muted/60' />
                ))}
              </div>
            ) : null}

            {!dailyQuery.isLoading && (daily?.metrics.days?.length ?? 0) === 0 ? (
              <SectionState className='h-32'>{t('dashboard_daily_empty')}</SectionState>
            ) : null}

            {!dailyQuery.isLoading && (daily?.metrics.days?.length ?? 0) > 0 ? (
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {daily?.metrics.days.map(point => (
                  <DailyReportItem
                    key={point.date}
                    point={point}
                    maxDailyReviews={maxDailyReviews}
                  />
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* High Risk Cards Section */}
        <Card className='border border-border/60 bg-card/65 backdrop-blur-xs'>
          <CardHeader className='pb-3.5'>
            <div className='flex items-center gap-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive'>
                <Icons.Shield className='h-4 w-4' />
              </div>
              <div>
                <CardTitle className='text-base font-bold flex items-center gap-2 text-foreground'>
                  {t('dashboard_risk_cards')}
                </CardTitle>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  Các từ vựng có khả năng bị quên cao, cần đặc biệt lưu ý ôn tập
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {riskQuery.isLoading ? (
              <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 animate-pulse'>
                {[1, 2, 3].map(i => (
                  <div key={i} className='h-28 rounded bg-muted/60' />
                ))}
              </div>
            ) : null}

            {!riskQuery.isLoading && (risk?.metrics.items.length ?? 0) === 0 ? (
              <SectionState className='h-24'>{t('dashboard_risk_empty')}</SectionState>
            ) : null}

            {!riskQuery.isLoading && (risk?.metrics.items.length ?? 0) > 0 ? (
              <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3'>
                {risk?.metrics.items.map(item => (
                  <RiskCardItem key={`${item.wordId}-${item.riskScore}`} item={item} />
                ))}
              </div>
            ) : null}

            {(risk?.narrative.length ?? 0) > 0 ? (
              <p className='mt-4 text-xs font-semibold text-muted-foreground border-t border-border/40 pt-3 italic'>
                "{risk?.narrative[0]}"
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PracticePage;
