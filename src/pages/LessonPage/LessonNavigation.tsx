import Icons from '@/components/Icons';

const LessonNavigation = ({
  currentIndex,
  currentExerciseTypeIndex,
  totalWords,
  totalExerciseTypes,
  onPrev,
  onNext
}: {
  currentIndex: number;
  currentExerciseTypeIndex: number;
  totalWords: number;
  totalExerciseTypes: number;
  onPrev: () => void;
  onNext: () => void;
}) => {
  const { t } = useTranslation();
  const disablePrev = currentIndex === 0 && currentExerciseTypeIndex === 0;
  const disableNext =
    currentIndex === totalWords - 1 && currentExerciseTypeIndex === totalExerciseTypes - 1;

  return (
    <div className='glass-card sticky bottom-2 z-20 rounded-2xl border border-border/70 bg-background/80 p-2.5 backdrop-blur-sm sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none'>
      <div className='mb-2 text-center text-xs text-muted-foreground sm:mb-0 sm:text-sm'>
        {t('lesson_of_counter', { current: currentIndex + 1, total: totalWords })}
      </div>

      <div className='grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-between sm:gap-4'>
        <Button
          variant='outline'
          onClick={onPrev}
          disabled={disablePrev}
          className='h-10 w-full sm:h-9 sm:w-auto'>
          <Icons.ChevronLeft className='mr-1.5 h-4 w-4' />
          {t('lesson_prev')}
        </Button>

        <Button onClick={onNext} disabled={disableNext} className='h-10 w-full sm:h-9 sm:w-auto'>
          {t('lesson_next')}
          <Icons.ChevronRight className='ml-1.5 h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};

export default LessonNavigation;
