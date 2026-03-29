/**
 * StreakChallengeExercise Component
 * UI-only: Rapid-fire scrambled words to build streak
 * All logic delegated to utilities
 */

import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnimationTriggers } from '@/hooks/practice/useAnimationTriggers';
import { useExerciseState } from '@/hooks/practice/useExerciseState';
import { checkAnswer } from '@/utilities/practice/exerciseHandlers';
import { Flame } from 'lucide-react';

interface StreakChallengeExerciseProps extends LearningManagement.ActivityCardProps {
  exerciseData?: Practice.ExerciseVariant;
  onExerciseComplete?: (result: Practice.ExerciseResult) => void;
  currentStreak?: number;
}

export const StreakChallengeExercise: React.FC<StreakChallengeExerciseProps> = ({
  vocabulary,
  onExerciseComplete,
  disabled = false,
  exerciseData,
  currentStreak = 0,
}) => {
  const { t } = useTranslation();
  const { containerRef, triggerFeedbackAnimation } = useAnimationTriggers();
  const { userAnswer, updateAnswer } = useExerciseState({ exerciseType: 'streak-challenge' });
  const startTimeRef = useRef(Date.now());
  const [attempts, setAttempts] = useState(0);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);

  const scrambledLetters = exerciseData?.data?.scrambledLetters || vocabulary.word.split('').sort(() => Math.random() - 0.5);

  const handleSubmit = useCallback(async () => {
    if (disabled) return;

    setAttempts((prev) => prev + 1);
    const isCorrect = checkAnswer(userAnswer as string, vocabulary, 'streak-challenge');

    setLastResult(isCorrect ? 'correct' : 'wrong');

    await triggerFeedbackAnimation(isCorrect);

    const timeSpent = Date.now() - startTimeRef.current;
    onExerciseComplete?.({
      wordId: vocabulary.id,
      exerciseType: 'streak-challenge',
      isCorrect,
      timeSpentMs: timeSpent,
      attempts,
      timestamp: new Date().toISOString(),
    });
  }, [disabled, userAnswer, vocabulary, triggerFeedbackAnimation, attempts, onExerciseComplete]);

  const streakLevel = Math.min(Math.floor(currentStreak / 5), 4);
  const streakColors = ['text-gray-400', 'text-orange-400', 'text-orange-500', 'text-red-500', 'text-red-600'];

  return (
    <div ref={containerRef} className="flex flex-col gap-6 p-6 bg-card rounded-lg border">
      {/* Streak Counter */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <Flame className={`w-8 h-8 ${streakColors[streakLevel]} animate-pulse`} />
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{currentStreak}</p>
          <p className="text-xs text-muted-foreground">{t('exercise.current-streak')}</p>
        </div>
        <Flame className={`w-8 h-8 ${streakColors[streakLevel]} animate-pulse`} />
      </div>

      {/* Challenge Description */}
      <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
        <p className="text-sm text-foreground text-center">{t('exercise.answer-correctly-to-build-streak')}</p>
      </div>

      {/* Word Display */}
      <div className="p-6 bg-secondary/30 rounded-lg">
        <p className="text-center text-sm text-muted-foreground mb-2">{t('exercise.unscramble-word')}</p>
        <p className="text-3xl font-bold tracking-widest text-foreground text-center">{scrambledLetters.join(' ')}</p>
      </div>

      {/* Word Meaning */}
      <div className="p-4 bg-card rounded-lg border">
        <p className="text-center text-lg font-medium text-foreground">{vocabulary.meaning}</p>
      </div>

      {/* Input Field */}
      <Input
        type="text"
        placeholder={t('exercise.type-answer')}
        value={userAnswer as string}
        onChange={(e) => updateAnswer(e.target.value)}
        disabled={disabled}
        autoFocus
        className="text-lg text-center"
      />

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={disabled || !userAnswer}
        className={`w-full text-lg h-12 font-bold transition-all ${
          lastResult === 'correct'
            ? 'bg-green-500 hover:bg-green-600'
            : lastResult === 'wrong'
              ? 'bg-red-500 hover:bg-red-600'
              : ''
        }`}
      >
        {t('action.answer')}
      </Button>

      {/* Last Result Display */}
      {lastResult && (
        <div className={`p-4 rounded-lg text-center font-semibold ${lastResult === 'correct' ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'}`}>
          {lastResult === 'correct' ? (
            <div className="space-y-1">
              <p className="text-lg">✓ {t('exercise.correct')}</p>
              <p className="text-xs text-opacity-75">+{Math.ceil(10 * (1 + currentStreak * 0.1))} {t('exercise.points')}</p>
            </div>
          ) : (
            <p className="text-lg">✗ {t('exercise.wrong')}</p>
          )}
        </div>
      )}

      {/* Tip */}
      <p className="text-center text-xs text-muted-foreground">{t('exercise.answer-fast-for-bonus')}</p>
    </div>
  );
};

export default StreakChallengeExercise;
