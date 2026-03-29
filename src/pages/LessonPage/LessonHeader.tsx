import Icons from '@/components/Icons';

const LessonHeader = ({
  lesson,
  currentIndex,
  totalWords,
  onBack
}: {
  lesson: LearningManagement.Lesson;
  currentIndex: number;
  totalWords: number;
  onBack: () => void;
}) => {
  const { t } = useTranslation();
  const lessonTitle = get(lesson, 'title', '');
  const courseTitle = (get(lesson, 'course.title') as string) || t('learning_courses');

  return (
    <div className='rounded-2xl border bg-card/50 p-4 sm:p-5'>
      <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
        <Button
          variant='ghost'
          size='sm'
          className='h-auto p-0 text-primary hover:bg-transparent'
          onClick={onBack}>
          <Icons.ChevronLeft className='h-4 w-4 mr-1' />
          {courseTitle}
        </Button>
        <span>/</span>
        <span className='font-medium text-foreground'>{lessonTitle}</span>
      </div>

      <div className='mt-4 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>{lessonTitle}</h1>
          <p className='text-muted-foreground'>
            {t('lesson_vocabulary_items', { count: totalWords })}
          </p>
        </div>
        <span className='text-sm font-semibold text-primary'>
          {currentIndex + 1} / {totalWords}
        </span>
      </div>
    </div>
  );
};

export default LessonHeader;
