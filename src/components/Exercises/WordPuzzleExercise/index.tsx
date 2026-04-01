/**
 * WordPuzzleExercise Component
 * UI-only: Guess word from hints with progressive letter reveals
 * All logic delegated to practice library helpers
 */

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnimationTriggers } from '@/hooks/practice/useAnimationTriggers';
import { useExerciseState } from '@/hooks/practice/useExerciseState';
import { checkAnswer } from '@/lib/practice/exerciseHandlers';
import { Lightbulb } from 'lucide-react';

interface WordPuzzleExerciseProps extends LearningManagement.ActivityCardProps {
  exerciseData?: Practice.ExerciseVariant;
  onExerciseComplete?: (result: Practice.ExerciseResult) => void;
}

export const WordPuzzleExercise: React.FC<WordPuzzleExerciseProps> = ({
  vocabulary,
  onExerciseComplete,
  disabled = false
}) => {
  const { t } = useTranslation();
  const { containerRef, triggerFeedbackAnimation } = useAnimationTriggers();
  const { userAnswer, updateAnswer } = useExerciseState({ exerciseType: 'word-puzzle' });
  const startTimeRef = useRef(Date.now());
  const [attempts, setAttempts] = useState(0);
  const [revealedLetters, setRevealedLetters] = useState<Set<number>>(new Set());
  const pronunciationHint = vocabulary.pronunciation || '/.../';

  const currentPattern = vocabulary.word
    .split('')
    .map((letter, idx) => (revealedLetters.has(idx) ? letter : '_'))
    .join(' ');

  const handleRevealLetter = () => {
    const hiddenIndices = vocabulary.word
      .split('')
      .map((_, idx) => idx)
      .filter(idx => !revealedLetters.has(idx));

    if (hiddenIndices.length > 0) {
      const randomIdx = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
      setRevealedLetters(prev => {
        const newSet = new Set(prev);
        newSet.add(randomIdx);
        return newSet;
      });
    }
  };

  const handleSubmit = async () => {
    if (disabled) return;

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const isCorrect = checkAnswer(userAnswer as string, vocabulary, 'word-puzzle');

    await triggerFeedbackAnimation(isCorrect);

    const timeSpent = Date.now() - startTimeRef.current;
    onExerciseComplete?.({
      wordId: vocabulary.id,
      exerciseType: 'word-puzzle',
      isCorrect,
      timeSpentMs: timeSpent,
      attempts: nextAttempts,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div ref={containerRef} className='flex flex-col gap-6 p-6 bg-card rounded-lg border'>
      {/* Pattern Display */}
      <div className='p-6 bg-primary/5 rounded-lg border-2 border-primary'>
        <p className='text-center text-5xl font-bold tracking-widest text-primary'>
          {currentPattern}
        </p>
      </div>

      {/* Hints Section */}
      <div className='space-y-3'>
        <div className='p-3 rounded-lg border flex items-start gap-3 bg-primary/10 border-primary'>
          <Lightbulb className='w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500' />
          <div>
            <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              Pronunciation Hint
            </p>
            <p className='text-sm text-foreground'>{pronunciationHint}</p>
          </div>
        </div>
        <div className='p-3 rounded-lg border border-secondary bg-secondary/20'>
          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
            Meaning
          </p>
          <p className='mt-1 text-sm text-foreground'>{vocabulary.meaning}</p>
        </div>
        {vocabulary.exampleVi ? (
          <div className='p-3 rounded-lg border border-secondary bg-secondary/20'>
            <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              Example (VI)
            </p>
            <p className='mt-1 text-sm text-foreground'>{vocabulary.exampleVi}</p>
          </div>
        ) : null}
      </div>

      {/* Helper Buttons */}
      <div className='flex gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={handleRevealLetter}
          disabled={disabled}
          className='flex-1'>
          {t('exercise_reveal_letter')}
        </Button>
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
        className='text-lg'
      />

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={disabled || !userAnswer}
        data-exercise-submit='true'
        className='w-full'>
        {t('action_check')}
      </Button>
    </div>
  );
};

export default WordPuzzleExercise;
