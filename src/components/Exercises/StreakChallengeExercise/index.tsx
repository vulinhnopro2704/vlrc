/**
 * StreakChallengeExercise Component
 * UI-only: Rapid-fire scrambled word challenge
 * All logic delegated to practice library helpers
 */

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnimationTriggers } from '@/hooks/practice/useAnimationTriggers';
import { useExerciseState } from '@/hooks/practice/useExerciseState';
import { checkAnswer } from '@/lib/practice/exerciseHandlers';

interface StreakChallengeExerciseProps extends LearningManagement.ActivityCardProps {
  exerciseData?: Practice.ExerciseVariant;
  onExerciseComplete?: (result: Practice.ExerciseResult) => void;
}

export const StreakChallengeExercise: React.FC<StreakChallengeExerciseProps> = ({
  vocabulary,
  onExerciseComplete,
  disabled = false,
  exerciseData
}) => {
  const { t } = useTranslation();
  const { containerRef, triggerFeedbackAnimation } = useAnimationTriggers();
  const { userAnswer, updateAnswer } = useExerciseState({ exerciseType: 'streak-challenge' });
  const startTimeRef = useRef(Date.now());
  const [attempts, setAttempts] = useState(0);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);

  const scrambledLetters =
    exerciseData?.data?.scrambledLetters ||
    vocabulary.word.split('').sort(() => Math.random() - 0.5);

  const handleSubmit = async () => {
    if (disabled) return;

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const isCorrect = checkAnswer(userAnswer as string, vocabulary, 'streak-challenge');

    setLastResult(isCorrect ? 'correct' : 'wrong');

    await triggerFeedbackAnimation(isCorrect);

    const timeSpent = Date.now() - startTimeRef.current;
    onExerciseComplete?.({
      wordId: vocabulary.id,
      exerciseType: 'streak-challenge',
      isCorrect,
      timeSpentMs: timeSpent,
      attempts: nextAttempts,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div ref={containerRef} className='flex flex-col gap-6 p-6 bg-card rounded-lg border'>
      {/* Challenge Description */}
      <div className='p-4 bg-primary/10 rounded-lg border border-primary/30'>
        <p className='text-sm text-foreground text-center'>
          {t('exercise_answer_fast_for_bonus')}
        </p>
      </div>

      {/* Word Display */}
      <div className='p-6 bg-secondary/30 rounded-lg'>
        <p className='text-center text-sm text-muted-foreground mb-2'>
          {t('exercise_unscramble_word')}
        </p>
        <p className='text-3xl font-bold tracking-widest text-foreground text-center'>
          {scrambledLetters.join(' ')}
        </p>
      </div>

      {/* Word Meaning */}
      <div className='p-4 bg-card rounded-lg border'>
        <p className='text-center text-lg font-medium text-foreground'>{vocabulary.meaning}</p>
      </div>

      {/* Input Field */}
      <Input
        type='text'
        placeholder={t('exercise_type_answer')}
        value={userAnswer as string}
        onChange={e => updateAnswer(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            void handleSubmit();
          }
        }}
        disabled={disabled}
        autoFocus
        className='text-lg text-center'
      />

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={disabled || !userAnswer}
        data-exercise-submit='true'
        className={`w-full text-lg h-12 font-bold transition-all ${
          lastResult === 'correct'
            ? 'bg-green-500 hover:bg-green-600'
            : lastResult === 'wrong'
              ? 'bg-red-500 hover:bg-red-600'
              : ''
        }`}>
        {t('action_answer')}
      </Button>

      {/* Last Result Display */}
      {lastResult && (
        <div
          className={`p-4 rounded-lg text-center font-semibold ${lastResult === 'correct' ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'}`}>
          {lastResult === 'correct' ? (
            <div className='space-y-1'>
              <p className='text-lg'>✓ {t('exercise_correct')}</p>
              <p className='text-xs text-opacity-75'>+10 {t('exercise_points')}</p>
            </div>
          ) : (
            <p className='text-lg'>✗ {t('exercise_wrong')}</p>
          )}
        </div>
      )}

      {/* Tip */}
      <p className='text-center text-xs text-muted-foreground'>
        {t('exercise_answer_fast_for_bonus')}
      </p>
    </div>
  );
};

export default StreakChallengeExercise;
