
import type { FC } from 'react';

const SkeletonCard = () => (
  <div className='rounded-lg border bg-card/40 p-3.5 sm:p-4 animate-pulse space-y-3.5'>
    <div className='flex items-start justify-between gap-2'>
      <div className='flex-1 space-y-2'>
        {/* Word Title Placeholder */}
        <div className='h-5 w-2/3 rounded bg-slate-200/80 dark:bg-slate-800/80' />
        {/* CEFR Badge Placeholder */}
        <div className='h-4.5 w-12 rounded bg-slate-200/80 dark:bg-slate-800/80' />
      </div>
    </div>

    {/* Meaning Text Placeholder */}
    <div className='space-y-1.5'>
      <div className='h-3.5 w-full rounded bg-slate-200/80 dark:bg-slate-800/80' />
      <div className='h-3.5 w-5/6 rounded bg-slate-200/80 dark:bg-slate-800/80' />
    </div>

    {/* Example Sentence Placeholder */}
    <div className='border-l-2 border-slate-200/50 dark:border-slate-800/50 pl-2 space-y-1.5'>
      <div className='h-3 w-4/5 rounded bg-slate-200/80 dark:bg-slate-800/80' />
      <div className='h-3 w-3/4 rounded bg-slate-200/80 dark:bg-slate-800/80' />
    </div>

    {/* Phonetics/Audio Placeholder */}
    <div className='flex flex-wrap gap-2 pt-1'>
      <div className='h-8 w-16 rounded bg-slate-200/80 dark:bg-slate-800/80' />
      <div className='h-8 w-16 rounded bg-slate-200/80 dark:bg-slate-800/80' />
    </div>
  </div>
);

export const NotebookTabState: FC<{
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  isEmpty?: boolean;
  emptyText?: string;
  loadingText?: string;
}> = ({ isLoading, isError, errorMessage, isEmpty, emptyText }) => {
  if (isLoading) {
    return (
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className='border border-destructive/30 bg-destructive/5 p-6'>
        <p className='text-sm text-destructive'>{errorMessage}</p>
      </Card>
    );
  }

  if (isEmpty) {
    return (
      <Card className='p-6'>
        <p className='text-center text-sm text-muted-foreground'>{emptyText}</p>
      </Card>
    );
  }

  return null;
};
