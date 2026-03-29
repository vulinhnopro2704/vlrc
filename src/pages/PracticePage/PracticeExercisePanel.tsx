/**
 * PracticeExercisePanel Component
 * Dispatches to appropriate exercise component and handles result flow
 * Connects UI to game mechanics
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ExerciseManager } from '@/components/Exercises/ExerciseManager';
import { checkGenericAnswer } from '@/lib/practice/exerciseHandlers';
import { useAnimationTriggers } from '@/hooks/practice/useAnimationTriggers';
import { useExerciseState } from '@/hooks/practice/useExerciseState';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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
  'streak-challenge',
] as const;

const PracticeExercisePanel: React.FC<PracticeExercisePanelProps> = ({
  currentWord,
  gameState,
  session,
  allWords,
}) => {
  const { t } = useTranslation();
  const { containerRef, triggerFeedbackAnimation } = useAnimationTriggers();
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Determine which exercise type to use based on word index
  const exerciseTypeIndex = session.currentWordIndex % EXERCISE_SEQUENCE.length;
  const currentExerciseType = EXERCISE_SEQUENCE[exerciseTypeIndex] as any;

  const handleExerciseComplete = useCallback(
    async (result: Practice.ExerciseResult) => {
      if (isProcessing) return;

      setIsProcessing(true);

      try {
        // Record result in game state
        gameState.recordResult({
          wordId: currentWord.id,
          exerciseType: result.exerciseType,
          isCorrect: result.isCorrect,
          timeSpentMs: result.timeSpentMs,
          attempts: result.attempts,
        });

        // Provide feedback
        if (result.isCorrect) {
          toast.success(t('exercise.correct'));
        } else {
          toast.error(t('exercise.incorrect'));
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

        // Reset for next exercise
        setCurrentAttempt(0);
        startTimeRef.current = Date.now();
      } catch (error) {
        console.error('Error processing exercise result:', error);
        toast.error(t('exercise.error'));
      } finally {
        setIsProcessing(false);
      }
    },
    [currentWord, gameState, session, isProcessing, t]
  );

  const isGameEnded = gameState.hasEnded() || session.sessionStatus === 'ended';

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Game Over Warning */}
      {isGameEnded && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700">{t('practice.game-over')}</p>
            <p className="text-sm text-red-600">{t('practice.no-lives-remaining')}</p>
          </div>
        </div>
      )}

      {/* Exercise Container */}
      {!isGameEnded && (
        <>
          {/* Exercise Info */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              {t(`exercise.${currentExerciseType}`)}
            </p>
            <h2 className="text-3xl font-bold text-foreground">{currentWord.word}</h2>
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
