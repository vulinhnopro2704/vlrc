'use client';

import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export const percent = (value: number, digits = 0) => `${(value * 100).toFixed(digits)}%`;

export const SectionState = ({
  className,
  children
}: {
  className: string;
  children: ReactNode;
}) => (
  <div className={`${className} flex items-center justify-center text-muted-foreground text-sm`}>
    {children}
  </div>
);

export const TrendStat = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className='rounded-xl border p-3'>
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
    <div className='rounded-lg border p-3'>
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

  return (
    <div className='rounded-lg border p-3'>
      <div className='flex items-center justify-between mb-2'>
        <p className='font-medium'>#{item.wordId}</p>
        <p className='text-sm text-destructive'>
          {t('dashboard_risk_score')}: {percent(item.riskScore)}
        </p>
      </div>
      <p className='text-xs text-muted-foreground'>
        {t('dashboard_retrievability')}: {percent(item.retrievability)}
      </p>
      <p className='text-xs text-muted-foreground'>
        {t('dashboard_days_overdue')}: {item.daysOverdue}
      </p>
    </div>
  );
};
