/**
 * SpeedChallengeExercise Component
 * UI-only: Answer a scrambled word within time limit
 * All logic delegated to practice library helpers
 */

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnimationTriggers } from '@/hooks/practice/useAnimationTriggers';
import { useExerciseState } from '@/hooks/practice/useExerciseState';
import { checkAnswer } from '@/lib/practice/exerciseHandlers';

interface SpeedChallengeExerciseProps extends LearningManagement.ActivityCardProps {
  exerciseData?: Practice.ExerciseVariant;
  onExerciseComplete?: (result: Practice.ExerciseResult) => void;
}

const TIME_LIMIT_MS = 10000; // 10 seconds

export const SpeedChallengeExercise: React.FC<SpeedChallengeExerciseProps> = ({
  vocabulary,
  onExerciseComplete,
  disabled = false,
  exerciseData
}) => {
  const { t } = useTranslation();
  const { containerRef, triggerFeedbackAnimation } = useAnimationTriggers();
  const { userAnswer, updateAnswer } = useExerciseState({ exerciseType: 'speed-challenge' });
  const startTimeRef = useRef(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT_MS);
  const [attempts, setAttempts] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const scrambledLetters =
    exerciseData?.data?.scrambledLetters ||
    vocabulary.word.split('').sort(() => Math.random() - 0.5);

  // Timer countdown
  useEffect(() => {
    if (isTimedOut || disabled) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 100;
        if (newTime <= 0) {
          setIsTimedOut(true);
          handleTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [disabled, isTimedOut]);

  const handleTimeUp = async () => {
    const timeSpent = Date.now() - startTimeRef.current;
    await triggerFeedbackAnimation(false);

    onExerciseComplete?.({
      wordId: vocabulary.id,
      exerciseType: 'speed-challenge',
      isCorrect: false,
      timeSpentMs: timeSpent,
      attempts: Math.max(1, attempts),
      timestamp: new Date().toISOString()
    });
  };

  const handleSubmit = async () => {
    if (disabled || isTimedOut) return;

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const isCorrect = checkAnswer(userAnswer as string, vocabulary, 'speed-challenge');

    await triggerFeedbackAnimation(isCorrect);

    const timeSpent = Date.now() - startTimeRef.current;
    onExerciseComplete?.({
      wordId: vocabulary.id,
      exerciseType: 'speed-challenge',
      isCorrect,
      timeSpentMs: timeSpent,
      attempts: nextAttempts,
      timestamp: new Date().toISOString()
    });
  };

  const timePercentage = (timeRemaining / TIME_LIMIT_MS) * 100;
  const timeColor =
    timePercentage > 50 ? 'bg-green-500' : timePercentage > 25 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div ref={containerRef} className='flex flex-col gap-6 p-6 bg-card rounded-lg border'>
      {/* Timer Display */}
      <div className='space-y-2'>
        <div className='flex justify-between items-center'>
          <p className='text-sm font-semibold text-foreground'>{t('exercise_time_remaining')}</p>
          <p className='text-2xl font-bold text-primary'>{(timeRemaining / 1000).toFixed(1)}s</p>
        </div>
        <div className='w-full bg-secondary rounded-full h-2 overflow-hidden'>
          <div
            className={`h-full transition-all ${timeColor}`}
            style={{ width: `${timePercentage}%` }}
          />
        </div>
      </div>

      {/* Word Definition */}
      <div className='space-y-2'>
        <p className='text-sm text-muted-foreground'>{t('exercise_rearrange_letters')}</p>
        <p className='text-lg font-semibold text-foreground'>{vocabulary.meaning}</p>
      </div>

      {/* Scrambled Letters Display */}
      <div className='p-4 bg-secondary/30 rounded-lg text-center'>
        <p className='text-3xl font-bold tracking-widest text-foreground'>
          {scrambledLetters.join(' ')}
        </p>
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
        disabled={disabled || isTimedOut}
        autoFocus
        className='text-lg'
      />

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={disabled || isTimedOut || !userAnswer}
        data-exercise-submit='true'
        className='w-full'>
        {t('action_check')}
      </Button>

      {isTimedOut && (
        <div className='p-4 bg-red-500/10 border border-red-500 rounded-lg'>
          <p className='text-center font-semibold text-red-600'>{t('exercise_time_up')}</p>
        </div>
      )}
    </div>
  );
};

export default SpeedChallengeExercise;
