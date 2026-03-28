'use client';

import { useLessonQuery } from '@/api/lesson-management';
import { useCompleteLessonMutation } from '@/api/lesson-management';
import { useWordsQuery } from '@/api/word-management';
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
  const { lessonId } = useParams({ from: '/_app/lessons/$lessonId' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentExerciseTypeIndex, setCurrentExerciseTypeIndex] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);
  const hasMistakeByWordRef = useRef<Record<string, boolean>>({});
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

  const lessonWords =
    (get(wordsResponse, 'data', null) as LearningManagement.Word[] | null) ??
    (get(lesson, 'words', []) as LearningManagement.Word[]) ??
    [];
  const currentWord = lessonWords[currentIndex];
  const currentExerciseType = exerciseTypes[currentExerciseTypeIndex];

  useEffect(() => {
    const page = get(pageRef, 'current');
    if (page) {
      gsap.fromTo(
        page,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [currentIndex, currentExerciseTypeIndex]);

  useGSAP(
    () => {
      const page = get(pageRef, 'current');
      if (page) {
        gsap.fromTo(page, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      }
    },
    { scope: pageRef }
  );

  const handleExerciseComplete = (result: LearningManagement.ActivityResult) => {
    const resultWordId = get(result, 'wordId', get(currentWord, 'id'));
    if (resultWordId != null) {
      const key = String(resultWordId);
      const hadMistakeThisExercise = result.attempts > 1;
      hasMistakeByWordRef.current[key] =
        Boolean(hasMistakeByWordRef.current[key]) || hadMistakeThisExercise;
    }

    const exerciseTypesCount = size(exerciseTypes);
    const wordsCount = size(lessonWords);
    const isLastExerciseForWord = currentExerciseTypeIndex === exerciseTypesCount - 1;
    const isLastWord = currentIndex === wordsCount - 1;

    if (currentExerciseTypeIndex < exerciseTypesCount - 1) {
      setCurrentExerciseTypeIndex(currentExerciseTypeIndex + 1);
    } else if (lesson && currentIndex < wordsCount - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentExerciseTypeIndex(0);
    } else {
      if (isLastExerciseForWord && isLastWord && !completeLessonMutation.isPending) {
        const totalWords = wordsCount;
        const wrongWords = reduce(
          lessonWords,
          (count, word) => {
            const key = String(word.id ?? '');
            return count + (hasMistakeByWordRef.current[key] ? 1 : 0);
          },
          0
        );
        const score = totalWords > 0 ? wrongWords / totalWords : 0;

        completeLessonMutation.mutate({ id: numericLessonId, score });
      }
    }
  };

  const handlePrev = () => {
    if (currentExerciseTypeIndex > 0) {
      setCurrentExerciseTypeIndex(currentExerciseTypeIndex - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentExerciseTypeIndex(size(exerciseTypes) - 1);
    }
  };

  const handleNext = () => {
    const exerciseTypesCount = size(exerciseTypes);
    const wordsCount = size(lessonWords);

    if (currentExerciseTypeIndex < exerciseTypesCount - 1) {
      setCurrentExerciseTypeIndex(currentExerciseTypeIndex + 1);
    } else if (lesson && currentIndex < wordsCount - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentExerciseTypeIndex(0);
    }
  };

  if (Number.isNaN(numericLessonId)) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-muted-foreground'>{t('learning_select_lesson')}</p>
      </div>
    );
  }

  if (isLessonLoading || isWordsLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Icons.LoaderCircleIcon className='h-6 w-6 animate-spin text-primary' />
      </div>
    );
  }

  if (isLessonError || isWordsError || !lesson || !currentWord) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-muted-foreground'>
          {`${t('mutation_error_create', { entity: t('entity_lesson') })}: ${get(lessonError || wordsError, 'message', '')}`}
        </p>
      </div>
    );
  }

  return (
    <main ref={pageRef} className='w-full bg-background px-4 py-6 sm:px-6 lg:px-8'>
      <div className='max-w-6xl mx-auto h-full flex flex-col space-y-6'>
        <div className='rounded-2xl border bg-card/50 p-4 sm:p-5'>
          <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
            <Button
              variant='ghost'
              size='sm'
              className='h-auto p-0 text-primary hover:bg-transparent'
              onClick={() => {
                const courseId = Number(get(lesson, 'courseId'));

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
              {(get(lesson, 'course.title') as string) || t('learning_courses')}
            </Button>
            <span>/</span>
            <span className='font-medium text-foreground'>{lesson.title}</span>
          </div>

          <div className='mt-4 flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold mb-2'>{lesson.title}</h1>
              <p className='text-muted-foreground'>{size(lessonWords)} vocabulary items</p>
            </div>
            <span className='text-sm font-semibold text-primary'>
              {currentIndex + 1} / {size(lessonWords)}
            </span>
          </div>

          <div className='mt-4 flex flex-wrap gap-2'>
            {map(lessonWords, (word, index) => (
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
                Word {currentIndex + 1} / {size(lessonWords)}
              </span>
              <span className='text-muted-foreground'>
                Exercise {currentExerciseTypeIndex + 1} / {size(exerciseTypes)}
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
              style={{ width: `${((currentIndex + 1) / Math.max(size(lessonWords), 1)) * 100}%` }}
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
            {currentIndex + 1} of {size(lessonWords)}
          </div>
          <Button
            onClick={handleNext}
            disabled={
              currentIndex === size(lessonWords) - 1 &&
              currentExerciseTypeIndex === size(exerciseTypes) - 1
            }>
            Next
            <Icons.ChevronRight className='h-4 w-4 ml-2' />
          </Button>
        </div>
      </div>
    </main>
  );
};

export default LessonPage;
