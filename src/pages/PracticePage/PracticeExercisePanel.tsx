/**
 * PracticeExercisePanel Component
 * Dispatches to appropriate exercise component and handles result flow
 * Connects UI to game mechanics
 */

import { ExerciseManager } from '@/components/Exercises';
import { useAnimationTriggers } from '@/hooks/practice/useAnimationTriggers';

interface PracticeExercisePanelProps {
  currentWord: LearningManagement.Word;
  gameState: ReturnType<typeof import('@/hooks/practice/useGameState').useGameState>;
  session: ReturnType<typeof import('@/hooks/practice/usePracticeSession').usePracticeSession>;
  allWords: LearningManagement.Word[];
}

// Mix of new and existing exercises for variety
const EXERCISE_SEQUENCE = [
  'scrambled-word',
  'flip',
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

const PracticeExercisePanel: React.FC<PracticeExercisePanelProps> = ({
  currentWord,
  gameState,
  session,
  allWords
}) => {
  const { t } = useTranslation();
  const { containerRef, triggerFeedbackAnimation } = useAnimationTriggers();
  const [isProcessing, setIsProcessing] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Determine which exercise type to use based on word index
  const exerciseTypeIndex = session.currentWordIndex % EXERCISE_SEQUENCE.length;
  const currentExerciseType = EXERCISE_SEQUENCE[exerciseTypeIndex] as any;

  const handleExerciseComplete = useCallback(
    (result: LearningManagement.ActivityResult | Practice.ExerciseResult) => {
      if (isProcessing) return;

      setIsProcessing(true);

      try {
        const normalizedResult = toPracticeResult(result);

        // Record result in game state
        gameState.recordResult({
          ...normalizedResult,
          wordId: currentWord.id ?? normalizedResult.wordId
        });

        void triggerFeedbackAnimation(normalizedResult.isCorrect);

        // Provide feedback
        if (normalizedResult.isCorrect) {
          toast.success(t('exercise_correct'));
        } else {
          toast.error(t('exercise_incorrect'));
        }

        // Check if game ended
        if (gameState.hasEnded()) {
          return;
        }

        // Move to next word
        const hasMore = session.moveToNextWord();
        if (!hasMore) {
          session.endSession();
        }
        startTimeRef.current = Date.now();
      } catch (error) {
        console.error('Error processing exercise result:', error);
        toast.error(t('exercise_error'));
      } finally {
        setIsProcessing(false);
      }
    },
    [currentWord, gameState, session, isProcessing, t, triggerFeedbackAnimation]
  );

  const isGameEnded = gameState.hasEnded() || session.sessionStatus === 'ended';

  return (
    <div ref={containerRef} className='space-y-6'>
      {/* Game Over Warning */}
      {isGameEnded && (
        <div className='p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-start gap-3'>
          <AlertCircle className='w-5 h-5 text-red-600 shrink-0 mt-0.5' />
          <div>
            <p className='font-semibold text-red-700'>{t('practice_game_over')}</p>
            <p className='text-sm text-red-600'>{t('practice_no_lives_remaining')}</p>
          </div>
        </div>
      )}

      {/* Exercise Container */}
      {!isGameEnded && (
        <>
          {/* Exercise Info */}
          <div className='text-center space-y-2'>
            <p className='text-sm text-muted-foreground uppercase tracking-wider'>
              {t(`exercise_${String(currentExerciseType).replaceAll('-', '_')}`)}
            </p>
            <h2 className='text-3xl font-bold text-foreground'>{currentWord.word}</h2>
          </div>

          {/* Exercise Component */}
          <ExerciseManager
            vocabulary={currentWord}
            activityType={currentExerciseType}
            onComplete={handleExerciseComplete}
            disabled={isProcessing}
            words={allWords}
          />
        </>
      )}
    </div>
  );
};

export default PracticeExercisePanel;
