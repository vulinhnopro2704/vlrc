import Icons from '@/components/Icons';

const LessonSubmissionState = ({
  isSubmitting,
  completionError,
  onRetry
}: {
  isSubmitting: boolean;
  completionError: string | null;
  onRetry: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <>
      {isSubmitting ? (
        <div className='rounded-xl border bg-card/60 p-4 text-sm text-muted-foreground'>
          <div className='flex items-center gap-2'>
            <Icons.LoaderCircleIcon className='h-4 w-4 animate-spin text-primary' />
            {t('lesson_submitting_completion')}
          </div>
        </div>
      ) : null}

      {completionError ? (
        <div className='rounded-xl border border-destructive/30 bg-destructive/5 p-4'>
          <p className='text-sm text-destructive'>{t('lesson_submit_failed')}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{completionError}</p>
          <Button size='sm' className='mt-3' onClick={onRetry}>
            {t('lesson_retry_submit')}
          </Button>
        </div>
      ) : null}
    </>
  );
};

export default LessonSubmissionState;
