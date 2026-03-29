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
    <div className='flex items-center justify-between gap-4'>
      <Button variant='outline' onClick={onPrev} disabled={disablePrev}>
        <Icons.ChevronLeft className='h-4 w-4 mr-2' />
        {t('lesson_prev')}
      </Button>
      <div className='text-center text-sm text-muted-foreground'>
        {t('lesson_of_counter', { current: currentIndex + 1, total: totalWords })}
      </div>
      <Button onClick={onNext} disabled={disableNext}>
        {t('lesson_next')}
        <Icons.ChevronRight className='h-4 w-4 ml-2' />
      </Button>
    </div>
  );
};

export default LessonNavigation;
