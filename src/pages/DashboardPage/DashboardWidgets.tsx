import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Icons from '@/components/Icons';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  <div className='rounded-xl border bg-card/30 p-3 backdrop-blur-xs'>
    <p className='text-xs text-muted-foreground'>{label}</p>
    <p className='text-lg font-bold'>{value}</p>
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
    <div className='rounded-lg border bg-card/20 p-3 transition-colors hover:bg-card/40'>
      <div className='flex flex-wrap items-center justify-between gap-2 text-sm mb-2'>
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
          style={{ width: `${Math.max(6, barWidth)}%` }}
        />
      </div>
      <div className='mt-2 text-xs text-muted-foreground'>
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
    <div className='group relative overflow-hidden rounded-xl border bg-card/50 p-4 transition-all hover:bg-card hover:shadow-lg sm:p-5'>
      {/* Background decoration */}
      <div className='absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/5 transition-transform group-hover:scale-150' />

      <div className='relative flex flex-col h-full space-y-3'>
        <div className='flex items-start justify-between gap-2'>
          <div className='space-y-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <h4 className='text-xl font-bold tracking-tight text-foreground'>
                {word?.word ?? `#${item.wordId}`}
              </h4>
              {word?.pos && (
                <span className='text-xs font-medium text-muted-foreground uppercase'>
                  {word.pos}
                </span>
              )}
              {word?.cefr && (
                <Badge variant='outline' className='h-5 px-1.5 text-[10px] uppercase font-bold'>
                  {word.cefr}
                </Badge>
              )}
            </div>
            {word?.pronunciation && (
              <p className='text-sm font-medium text-primary/80 italic'>/{word.pronunciation}/</p>
            )}
          </div>

          <div className='text-right'>
            <div className='text-xs font-bold text-destructive uppercase tracking-wider mb-1'>
              {t('dashboard_risk_score')}
            </div>
            <div className='text-xl font-black text-destructive'>{percent(item.riskScore)}</div>
          </div>
        </div>

        <div className='flex-1 border-t border-dashed pt-3'>
          <p className='text-base font-semibold text-foreground/90 line-clamp-2'>
            {word?.meaningVi ?? word?.meaning ?? t('dashboard_risk_empty')}
          </p>
          {word?.example && (
            <p className='mt-2 text-sm italic text-muted-foreground line-clamp-2'>
              "{word.example}"
            </p>
          )}
        </div>

        <TooltipProvider>
          <div className='grid grid-cols-2 gap-3 pt-3 border-t'>
            <div>
              <div className='flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1'>
                <span>{t('dashboard_retrievability')}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icons.Info className='h-3 w-3 cursor-help opacity-60 hover:opacity-100 transition-opacity' />
                  </TooltipTrigger>
                  <TooltipContent className='max-w-[280px] p-3 text-xs leading-relaxed'>
                    {t('dashboard_retrievability_info')}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className='text-sm font-bold text-foreground'>
                {percent(item.retrievability)}
              </div>
            </div>

            <div>
              <div className='flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1'>
                <span>{t('dashboard_stability')}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icons.Info className='h-3 w-3 cursor-help opacity-60 hover:opacity-100 transition-opacity' />
                  </TooltipTrigger>
                  <TooltipContent className='max-w-[280px] p-3 text-xs leading-relaxed'>
                    {t('dashboard_stability_info')}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className='text-sm font-bold text-foreground'>
                {item.stability} {t('days')}
              </div>
            </div>
          </div>
        </TooltipProvider>

        <div className='flex items-center gap-2 pt-2 text-[10px] text-muted-foreground italic opacity-70'>
          <Icons.Clock className='h-3 w-3' />
          <span>
            {t('dashboard_days_overdue')}: {item.daysOverdue} {t('days')}
          </span>
        </div>
      </div>
    </div>
  );
};
