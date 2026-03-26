'use client';

import { useLessonQuery } from '@/api/lesson-management';
import { useCompleteLessonMutation } from '@/api/progress-management';
import { useWordsQuery } from '@/api/word-management';
import { AppLayout } from '@/components/shared';
import { ExerciseManager } from '@/components/Exercises';
import Icons from '@/components/Icons';

gsap.registerPlugin(useGSAP);

const exerciseTypes: LearningManagement.ActivityType[] = [
  'flip',
  'listen-fill',
  'fill-blank',
  'meaning-lookup'
];

const LessonPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lessonId } = useParams({ from: '/lessons/$lessonId' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentExerciseTypeIndex, setCurrentExerciseTypeIndex] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);
  const numericLessonId = Number(lessonId);

  const {
    data: lesson,
    isLoading: isLessonLoading,
    isError: isLessonError,
    error: lessonError
  } = useLessonQuery(numericLessonId);

  const {
    data: wordsResponse,
    isLoading: isWordsLoading,
    isError: isWordsError,
    error: wordsError
  } = useWordsQuery({
    lessonId: numericLessonId,
    sortBy: 'word',
    sortOrder: 'asc',
    take: 100
  });

  const completeLessonMutation = useCompleteLessonMutation();

  const lessonWords = wordsResponse?.data ?? lesson?.words ?? [];
  const currentWord = lessonWords[currentIndex];
  const currentExerciseType = exerciseTypes[currentExerciseTypeIndex];

  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [currentIndex, currentExerciseTypeIndex]);

  useGSAP(
    () => {
      if (pageRef.current) {
        gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      }
    },
    { scope: pageRef }
  );

  const handleExerciseComplete = (result: LearningManagement.ActivityResult) => {
    void result;
    const isLastExerciseForWord = currentExerciseTypeIndex === exerciseTypes.length - 1;
    const isLastWord = currentIndex === lessonWords.length - 1;

    if (currentExerciseTypeIndex < exerciseTypes.length - 1) {
      setCurrentExerciseTypeIndex(currentExerciseTypeIndex + 1);
    } else if (lesson && currentIndex < lessonWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentExerciseTypeIndex(0);
    } else {
      if (isLastExerciseForWord && isLastWord && !completeLessonMutation.isPending) {
        completeLessonMutation.mutate(numericLessonId);
      }
    }
  };

  const handlePrev = () => {
    if (currentExerciseTypeIndex > 0) {
      setCurrentExerciseTypeIndex(currentExerciseTypeIndex - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentExerciseTypeIndex(exerciseTypes.length - 1);
    }
  };

  const handleNext = () => {
    if (currentExerciseTypeIndex < exerciseTypes.length - 1) {
      setCurrentExerciseTypeIndex(currentExerciseTypeIndex + 1);
    } else if (lesson && currentIndex < lessonWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentExerciseTypeIndex(0);
    }
  };

  if (Number.isNaN(numericLessonId)) {
    return (
      <AppLayout>
        <div className='flex items-center justify-center h-screen'>
          <p className='text-muted-foreground'>{t('learning_select_lesson')}</p>
        </div>
      </AppLayout>
    );
  }

  if (isLessonLoading || isWordsLoading) {
    return (
      <AppLayout>
        <div className='flex items-center justify-center h-screen'>
          <Icons.LoaderCircleIcon className='h-6 w-6 animate-spin text-primary' />
        </div>
      </AppLayout>
    );
  }

  if (isLessonError || isWordsError || !lesson || !currentWord) {
    return (
      <AppLayout>
        <div className='flex items-center justify-center h-screen'>
          <p className='text-muted-foreground'>
            {`${t('mutation_error_create', { entity: t('entity_lesson') })}: ${((lessonError || wordsError) as Error)?.message || ''}`}
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main ref={pageRef} className='w-full bg-background px-4 py-6 sm:px-6 lg:px-8'>
        <div className='max-w-6xl mx-auto h-full flex flex-col space-y-6'>
          <div className='rounded-2xl border bg-card/50 p-4 sm:p-5'>
            <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
              <Button
                variant='ghost'
                size='sm'
                className='h-auto p-0 text-primary hover:bg-transparent'
                onClick={() => {
                  const courseId = Number(lesson.courseId);

                  if (Number.isFinite(courseId) && courseId > 0) {
                    navigate({
                      to: '/courses/$courseId',
                      params: { courseId: String(courseId) }
                    });
                    return;
                  }

                  navigate({ to: '/courses' });
                }}>
                <Icons.ChevronLeft className='h-4 w-4 mr-1' />
                {lesson.course?.title || t('learning_courses')}
              </Button>
              <span>/</span>
              <span className='font-medium text-foreground'>{lesson.title}</span>
            </div>

            <div className='mt-4 flex items-center justify-between'>
              <div>
                <h1 className='text-3xl font-bold mb-2'>{lesson.title}</h1>
                <p className='text-muted-foreground'>{lessonWords.length} vocabulary items</p>
              </div>
              <span className='text-sm font-semibold text-primary'>
                {currentIndex + 1} / {lessonWords.length}
              </span>
            </div>

            <div className='mt-4 flex flex-wrap gap-2'>
              {lessonWords.map((word, index) => (
                <Button
                  key={word.id ?? `${word.word}-${index}`}
                  size='sm'
                  variant={index === currentIndex ? 'default' : 'outline'}
                  onClick={() => {
                    setCurrentIndex(index);
                    setCurrentExerciseTypeIndex(0);
                  }}>
                  {word.word}
                </Button>
              ))}
            </div>
          </div>

          <div className='flex-1 flex items-center justify-center'>
            <div className='w-full'>
              <div className='mb-4 flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>
                  Word {currentIndex + 1} / {lessonWords.length}
                </span>
                <span className='text-muted-foreground'>
                  Exercise {currentExerciseTypeIndex + 1} / {exerciseTypes.length}
                </span>
              </div>
              <ExerciseManager
                vocabulary={currentWord}
                allVocabularies={lessonWords}
                exerciseType={currentExerciseType}
                onComplete={handleExerciseComplete}
              />
            </div>
          </div>

          <div className='mb-8'>
            <div className='w-full h-2 bg-primary/20 rounded-full overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-primary to-accent transition-all duration-300'
                style={{ width: `${((currentIndex + 1) / lessonWords.length) * 100}%` }}
              />
            </div>
          </div>

          <div className='flex items-center justify-between gap-4'>
            <Button
              variant='outline'
              onClick={handlePrev}
              disabled={currentIndex === 0 && currentExerciseTypeIndex === 0}>
              <Icons.ChevronLeft className='h-4 w-4 mr-2' />
              Previous
            </Button>
            <div className='text-center text-sm text-muted-foreground'>
              {currentIndex + 1} of {lessonWords.length}
            </div>
            <Button
              onClick={handleNext}
              disabled={
                currentIndex === lessonWords.length - 1 &&
                currentExerciseTypeIndex === exerciseTypes.length - 1
              }>
              Next
              <Icons.ChevronRight className='h-4 w-4 ml-2' />
            </Button>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default LessonPage;
