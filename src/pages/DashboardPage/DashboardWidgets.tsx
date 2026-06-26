import { cn } from '@/lib/utils';

export const percent = (value: number, digits = 0) => `${(value * 100).toFixed(digits)}%`;

export const SectionState = ({
  className,
  children
}: {
  className: string;
  children: ReactNode;
}) => (
  <div className={cn('flex items-center justify-center text-muted-foreground text-sm', className)}>
    {children}
  </div>
);

export const TrendStat = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className='rounded-lg border bg-card/30 p-2.5 backdrop-blur-xs'>
    <p className='text-xs text-muted-foreground'>{label}</p>
    <p className='text-base font-bold leading-tight sm:text-lg'>{value}</p>
  </div>
);

export const DailyReportItem = ({
  point,
  maxDailyReviews
}: {
  point: Dashboard.DailyPoint;
  maxDailyReviews: number;
}) => {
  const { t } = useTranslation();
  const barWidth = (point.reviews / maxDailyReviews) * 100;

  return (
    <div className='rounded-md border bg-card/20 p-2.5 transition-colors hover:bg-card/40'>
      <div className='mb-1.5 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm'>
        <span className='font-medium'>
          {new Date(point.date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          })}
        </span>
        <span className='text-muted-foreground'>
          {point.reviews} {t('dashboard_reviews')}
          {' · '}
          {percent(point.accuracy)} {t('dashboard_accuracy')}
          {' · '}
          {Math.round(point.avgResponseMs)}ms
        </span>
      </div>
      <div className='h-2 rounded-full bg-muted'>
        <div
          className='h-2 rounded-full bg-primary'
          style={{ width: `${point.reviews > 0 ? Math.max(6, barWidth) : 0}%` }}
        />
      </div>
      <div className='mt-1.5 text-[11px] text-muted-foreground'>
        {t('dashboard_due_created')}: {point.dueCreated}
        {' · '}
        {t('dashboard_due_completed')}: {point.dueCompleted}
      </div>
    </div>
  );
};

export const RiskCardItem = ({ item }: { item: Dashboard.RiskItem }) => {
  const { t } = useTranslation();
  const word = item.word;

  return (
    <div className='group relative overflow-hidden rounded-lg border bg-card/50 p-2.5 transition-all hover:bg-card hover:shadow-md sm:p-3'>
      {/* Background decoration */}
      <div className='absolute -right-6 -top-6 h-12 w-12 rounded-full bg-primary/5 transition-transform group-hover:scale-150' />

      <div className='relative flex h-full flex-col space-y-2'>
        <div className='flex items-start justify-between gap-2'>
          <div className='space-y-0.5'>
            <div className='flex flex-wrap items-center gap-1.5'>
              <h4 className='text-[15px] font-bold tracking-tight text-foreground sm:text-base'>
                {word?.word ?? `#${item.wordId}`}
              </h4>
              {word?.pos && (
                <span className='text-[10px] font-medium text-muted-foreground uppercase'>
                  {word.pos}
                </span>
              )}
              {word?.cefr && (
                <Badge variant='outline' className='h-4.5 px-1.5 text-[9px] uppercase font-bold'>
                  {word.cefr}
                </Badge>
              )}
            </div>
            {word?.pronunciation && (
              <p className='text-xs font-medium text-primary/80 italic'>/{word.pronunciation}/</p>
            )}
          </div>

          <div className='text-right'>
            <div className='mb-0.5 text-[9px] font-bold uppercase tracking-wider text-destructive'>
              {t('dashboard_risk_score')}
            </div>
            <div className='text-base font-black text-destructive'>{percent(item.riskScore)}</div>
          </div>
        </div>

        <div className='flex-1 border-t border-dashed pt-2'>
          <p className='line-clamp-2 text-xs font-semibold text-foreground/90 sm:text-sm'>
            {word?.meaningVi ?? word?.meaning ?? t('dashboard_risk_empty')}
          </p>
          {word?.example && (
            <p className='mt-1 line-clamp-2 text-[11px] italic text-muted-foreground sm:text-xs'>
              "{word.example}"
            </p>
          )}
        </div>

        <TooltipProvider>
          <div className='grid grid-cols-2 gap-2 border-t pt-2'>
            <div>
              <div className='mb-0.5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground'>
                <span>{t('dashboard_retrievability')}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icons.Info className='h-2.5 w-2.5 cursor-help opacity-60 hover:opacity-100 transition-opacity' />
                  </TooltipTrigger>
                  <TooltipContent className='max-w-70 p-3 text-xs leading-relaxed'>
                    {t('dashboard_retrievability_info')}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className='text-xs font-bold text-foreground'>
                {percent(item.retrievability)}
              </div>
            </div>

            <div>
              <div className='mb-0.5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground'>
                <span>{t('dashboard_stability')}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icons.Info className='h-2.5 w-2.5 cursor-help opacity-60 hover:opacity-100 transition-opacity' />
                  </TooltipTrigger>
                  <TooltipContent className='max-w-70 p-3 text-xs leading-relaxed'>
                    {t('dashboard_stability_info')}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className='text-xs font-bold text-foreground'>
                {item.stability} {t('days')}
              </div>
            </div>
          </div>
        </TooltipProvider>

        <div className='flex items-center gap-1.5 pt-1 text-[9px] italic text-muted-foreground opacity-70'>
          <Icons.Clock className='h-2.5 w-2.5' />
          <span>
            {t('dashboard_days_overdue')}: {item.daysOverdue} {t('days')}
          </span>
        </div>
      </div>
    </div>
  );
};
