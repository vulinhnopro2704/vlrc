'use client';

import { useLessonQuery } from '@/api/lesson-management';
import { useCompleteLessonMutation } from '@/api/lesson-management';
import { LESSON_QUERY_KEYS } from '@/api/lesson-management';
import { useWordsQuery } from '@/api/word-management';
import { COURSE_QUERY_KEYS } from '@/api/course-management';
import Icons from '@/components/Icons';
import LessonHeader from './LessonHeader';
import LessonExercisePanel from './LessonExercisePanel';
import LessonSubmissionState from './LessonSubmissionState';
import LessonNavigation from './LessonNavigation';
import { WordReview } from '@/components/WordReview';

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
  const queryClient = useQueryClient();
  const { lessonId } = useParams({ from: '/_app/lessons/$lessonId' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentExerciseTypeIndex, setCurrentExerciseTypeIndex] = useState(0);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewResult, setReviewResult] = useState<{
    word: LearningManagement.Word;
    isCorrect: boolean;
    attempts: number;
  } | null>(null);
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
  const totalWords = size(lessonWords);
  const totalExerciseTypes = size(exerciseTypes);
  const lessonProgressPercent = ((currentIndex + 1) / Math.max(totalWords, 1)) * 100;

  const navigateToCourseDetail = () => {
    const courseId = Number(get(lesson, 'courseId'));

    if (Number.isFinite(courseId) && courseId > 0) {
      navigate({
        to: '/courses/$courseId',
        params: { courseId: String(courseId) }
      });
      return;
    }

    navigate({ to: '/courses' });
  };

  const submitLessonCompletion = () => {
    if (completeLessonMutation.isPending) {
      return;
    }

    const totalWords = size(lessonWords);
    const wrongWords = reduce(
      lessonWords,
      (count, word) => {
        const key = String(word.id ?? '');
        return count + (hasMistakeByWordRef.current[key] ? 1 : 0);
      },
      0
    );
    const score = totalWords > 0 ? wrongWords / totalWords : 0;

    setCompletionError(null);
    completeLessonMutation.mutate(
      { id: numericLessonId, score },
      {
        onSuccess: () => {
          const courseId = Number(get(lesson, 'courseId'));

          queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.lists() });
          queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.detail(numericLessonId) });

          if (Number.isFinite(courseId) && courseId > 0) {
            queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(courseId) });
          }

          navigateToCourseDetail();
        },
        onError: error => {
          setCompletionError((error as Error).message || t('lesson_submit_retry_message'));
        }
      }
    );
  };

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

  const advanceToNextExercise = () => {
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
        submitLessonCompletion();
      }
    }
  };

  const handleExerciseComplete = (result: LearningManagement.ActivityResult) => {
    const resultWordId = get(result, 'wordId', get(currentWord, 'id'));
    if (resultWordId != null) {
      const key = String(resultWordId);
      const hadMistakeThisExercise = !result.isCorrect || result.attempts > 1;
      hasMistakeByWordRef.current[key] =
        Boolean(hasMistakeByWordRef.current[key]) || hadMistakeThisExercise;
    }

    if (currentExerciseType === 'flip') {
      advanceToNextExercise();
      return;
    }

    setReviewResult({
      word: currentWord,
      isCorrect: result.isCorrect,
      attempts: result.attempts
    });
    setIsReviewOpen(true);
  };

  const handleReviewNext = () => {
    setIsReviewOpen(false);
    advanceToNextExercise();
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
        <LessonHeader
          lesson={lesson}
          currentIndex={currentIndex}
          totalWords={totalWords}
          onBack={navigateToCourseDetail}
        />
        <LessonExercisePanel
          currentIndex={currentIndex}
          currentExerciseTypeIndex={currentExerciseTypeIndex}
          totalExerciseTypes={totalExerciseTypes}
          currentWord={currentWord}
          lessonWords={lessonWords}
          exerciseType={currentExerciseType}
          onComplete={handleExerciseComplete}
        />
        <div className='mb-8'>
          <div className='w-full h-2 bg-primary/20 rounded-full overflow-hidden'>
            <div
              className='h-full bg-linear-to-r from-primary to-accent transition-all duration-300'
              style={{ width: `${lessonProgressPercent}%` }}
            />
          </div>
        </div>
        <LessonSubmissionState
          isSubmitting={completeLessonMutation.isPending}
          completionError={completionError}
          onRetry={submitLessonCompletion}
        />
        <LessonNavigation
          currentIndex={currentIndex}
          currentExerciseTypeIndex={currentExerciseTypeIndex}
          totalWords={totalWords}
          totalExerciseTypes={totalExerciseTypes}
          onPrev={handlePrev}
          onNext={handleNext}
        />
        {reviewResult && (
          <WordReview
            open={isReviewOpen}
            word={reviewResult.word}
            isCorrect={reviewResult.isCorrect}
            attempts={reviewResult.attempts}
            onNext={handleReviewNext}
          />
        )}
      </div>
    </main>
  );
};

export default LessonPage;
