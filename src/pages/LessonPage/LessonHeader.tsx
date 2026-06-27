
const LessonHeader = ({
  lesson,
  onBack
}: {
  lesson: LearningManagement.Lesson;
  onBack: () => void;
}) => {
  const { t } = useTranslation();
  const courseTitle = (get(lesson, 'course.title') as string) || t('learning_courses');

  return (
    <div className='flex items-center py-1'>
      <Button
        variant='ghost'
        size='sm'
        className='h-auto p-0 text-xs text-primary hover:bg-transparent hover:text-primary sm:text-sm font-semibold'
        onClick={onBack}>
        <Icons.ChevronLeft className='h-4 w-4 mr-1' />
        {courseTitle}
      </Button>
    </div>
  );
};

export default LessonHeader;
