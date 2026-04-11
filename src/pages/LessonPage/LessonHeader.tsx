import Icons from '@/components/Icons';

const LessonHeader = ({
  lesson,
  onBack
}: {
  lesson: LearningManagement.Lesson;
  onBack: () => void;
}) => {
  const { t } = useTranslation();
  const lessonTitle = get(lesson, 'title', '');
  const courseTitle = (get(lesson, 'course.title') as string) || t('learning_courses');

  return (
    <div className='glass-card rounded-2xl border bg-card/50 p-3.5 sm:p-5'>
      <div className='flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:text-sm'>
        <Button
          variant='ghost'
          size='sm'
          className='h-auto p-0 text-xs text-primary hover:bg-transparent hover:text-primary sm:text-sm'
          onClick={onBack}>
          <Icons.ChevronLeft className='h-4 w-4 mr-1' />
          {courseTitle}
        </Button>
        <span>/</span>
        <span className='line-clamp-1 font-medium text-foreground'>{lessonTitle}</span>
      </div>
    </div>
  );
};

export default LessonHeader;
