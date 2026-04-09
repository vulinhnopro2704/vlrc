import { ExerciseManager } from '@/components/Exercises';
import { WordReview } from '@/components/WordReview';

interface PendingReviewState {
  payload: Practice.SubmitFSRSItem;
  exerciseResult: Omit<Practice.ExerciseResult, 'streakAtTime' | 'timestamp'>;
}

const EXERCISE_SEQUENCE = [
  'speed-challenge',
  'fill-blank',
  'word-puzzle',
  'listen-fill',
  'matching-pairs',
  'meaning-lookup',
  'streak-challenge'
] as const;

const toPracticeResult = (
  result: LearningManagement.ActivityResult | Practice.ExerciseResult
): Omit<Practice.ExerciseResult, 'streakAtTime' | 'timestamp'> => {
  if ('exerciseType' in result) {
    return {
      wordId: result.wordId,
      exerciseType: result.exerciseType,
      isCorrect: result.isCorrect,
      timeSpentMs: result.timeSpentMs,
      pointsEarned: result.pointsEarned ?? 0,
      attempts: result.attempts
    };
  }

  return {
    wordId: result.wordId,
    exerciseType: result.activityType,
    isCorrect: result.isCorrect,
    timeSpentMs: result.timeSpent,
    pointsEarned: 0,
    attempts: result.attempts
  };
};

const PracticeExercisePanel: FC<{
  currentWord: LearningManagement.Word;
  gameState: ReturnType<typeof import('@/hooks/practice/useGameState').useGameState>;
  session: ReturnType<typeof import('@/hooks/practice/usePracticeSession').usePracticeSession>;
  allWords: LearningManagement.Word[];
  onExerciseResult?: (result: Practice.SubmitFSRSItem) => void;
}> = ({ currentWord, gameState, session, allWords, onExerciseResult }) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingReview, setPendingReview] = useState<PendingReviewState | null>(null);
  const startTimeRef = useRef(Date.now());
  const [currentExerciseType, setCurrentExerciseType] = useState<
    (typeof EXERCISE_SEQUENCE)[number]
  >(() => EXERCISE_SEQUENCE[Math.floor(Math.random() * EXERCISE_SEQUENCE.length)]);

  useUpdateEffect(() => {
    const randomIndex = Math.floor(Math.random() * EXERCISE_SEQUENCE.length);
    setCurrentExerciseType(EXERCISE_SEQUENCE[randomIndex]);
  }, [session.currentWordIndex]);

  useUpdateEffect(() => {
    setIsProcessing(false);
    setPendingReview(null);
    startTimeRef.current = Date.now();
  }, [session.currentWordIndex, currentWord.id, currentExerciseType]);

  const commitAnswer = async (payload: Practice.SubmitFSRSItem) => {
    const resolvedExerciseType =
      (payload.exerciseType as LearningManagement.ActivityType | Practice.PracticeActivityType) ??
      currentExerciseType;

    const exerciseResult: Omit<Practice.ExerciseResult, 'streakAtTime' | 'timestamp'> = {
      wordId: payload.wordId,
      exerciseType: resolvedExerciseType,
      isCorrect: payload.isCorrect,
      timeSpentMs: payload.durationMs ?? 0,
      attempts: Math.max(1, payload.attempts ?? 1),
      pointsEarned: 0
    };

    onExerciseResult?.(payload);
    gameState.recordResult(exerciseResult);
    setPendingReview({
      payload,
      exerciseResult
    });
  };

  const handleExerciseComplete = (
    result: LearningManagement.ActivityResult | Practice.ExerciseResult
  ) => {
    if (isProcessing || pendingReview) return;

    setIsProcessing(true);

    try {
      const normalizedResult = toPracticeResult(result);
      const durationMs = Date.now() - startTimeRef.current;
      const resolvedWordId = Number(currentWord.id ?? normalizedResult.wordId);

      if (!Number.isFinite(resolvedWordId)) {
        throw new Error('Invalid word id for FSRS submission');
      }

      const payload: Practice.SubmitFSRSItem = {
        wordId: resolvedWordId,
        isCorrect: normalizedResult.isCorrect,
        durationMs,
        exerciseType: normalizedResult.exerciseType,
        attempts: Math.max(1, normalizedResult.attempts ?? 1)
      };
      void commitAnswer(payload);
    } catch (error) {
      console.error('Error processing exercise result:', error);
      toast.error(t('exercise_error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDontRemember = () => {
    if (isProcessing || pendingReview) return;
    setIsProcessing(true);

    const resolvedWordId = Number(currentWord.id);
    if (!Number.isFinite(resolvedWordId)) {
      setIsProcessing(false);
      toast.error(t('exercise_error'));
      return;
    }

    const payload: Practice.SubmitFSRSItem = {
      wordId: resolvedWordId,
      isCorrect: false,
      durationMs: Date.now() - startTimeRef.current,
      exerciseType: currentExerciseType,
      attempts: 1
    };

    void commitAnswer(payload).finally(() => {
      setIsProcessing(false);
    });
  };

  const handleNextWord = () => {
    if (!pendingReview) return;

    if (!pendingReview.payload.isCorrect) {
      session.requeueCurrentWordRandomly();
    }

    if (gameState.hasEnded()) {
      session.endSession();
      return;
    }

    const hasMore = session.moveToNextWord();
    if (!hasMore) {
      session.endSession();
    }
  };

  const isGameEnded = gameState.hasEnded() || session.sessionStatus === 'ended';

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Game Over Warning */}
      {isGameEnded && (
        <div className='flex items-start gap-3 rounded-lg border border-red-500 bg-red-500/10 p-3 sm:p-4'>
          <AlertCircle className='w-5 h-5 text-red-600 shrink-0 mt-0.5' />
          <div>
            <p className='font-semibold text-red-700'>{t('practice_game_over')}</p>
            <p className='text-xs text-red-600 sm:text-sm'>{t('practice_no_lives_remaining')}</p>
          </div>
        </div>
      )}
      {!isGameEnded && (
        <>
          <div className='space-y-1.5 text-center sm:space-y-2'>
            <p className='text-[11px] uppercase tracking-wider text-muted-foreground sm:text-sm'>
              {t(`exercise_${String(currentExerciseType).replaceAll('-', '_')}`)}
            </p>
            <h2 className='text-lg font-bold text-foreground sm:text-2xl'>
              {t('practice_focus_no_word_hint')}
            </h2>
          </div>
          <ExerciseManager
            key={`${String(currentExerciseType)}-${session.currentWordIndex}-${String(currentWord.id ?? '')}`}
            vocabulary={currentWord}
            activityType={currentExerciseType}
            onComplete={handleExerciseComplete}
            disabled={isProcessing || Boolean(pendingReview)}
            words={allWords}
          />
          <div className='flex justify-center'>
            <Button
              variant='outline'
              onClick={handleDontRemember}
              disabled={isProcessing || Boolean(pendingReview)}
              className='h-10 w-full sm:w-auto'>
              {t('practice_dont_remember')}
            </Button>
          </div>
          <WordReview
            open={Boolean(pendingReview)}
            word={currentWord}
            isCorrect={pendingReview?.payload.isCorrect ?? false}
            attempts={pendingReview?.exerciseResult.attempts}
            onNext={pendingReview ? handleNextWord : undefined}
          />
        </>
      )}
    </div>
  );
};

export default PracticeExercisePanel;
