/**
 * ScrambledWordExercise Component
 * UI-only component: reorder scrambled letters to form the correct word
 * All logic delegated to utilities
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAnimationTriggers } from '@/hooks/practice/useAnimationTriggers';
import { useExerciseState } from '@/hooks/practice/useExerciseState';
import { checkAnswer } from '@/utilities/practice/exerciseHandlers';

interface ScrambledWordExerciseProps extends LearningManagement.ActivityCardProps {
  exerciseData?: Practice.ExerciseVariant;
  onExerciseComplete?: (result: Practice.ExerciseResult) => void;
}

export const ScrambledWordExercise: React.FC<ScrambledWordExerciseProps> = ({
  vocabulary,
  onExerciseComplete,
  disabled = false,
  exerciseData,
}) => {
  const { t } = useTranslation();
  const { containerRef, triggerFeedbackAnimation } = useAnimationTriggers();
  const { userAnswer, updateAnswer, getTimeSinceStart } = useExerciseState({ exerciseType: 'scrambled-word' });
  const startTimeRef = useRef(Date.now());
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);

  const scrambledLetters = exerciseData?.data?.scrambledLetters || vocabulary.word.split('').sort(() => Math.random() - 0.5);

  const handleLetterClick = useCallback((index: number) => {
    if (disabled) return;

    setSelectedLetters((prev) => {
      const newSelected = [...prev];
      const selectedIndex = newSelected.indexOf(index);

      if (selectedIndex > -1) {
        newSelected.splice(selectedIndex, 1);
      } else {
        newSelected.push(index);
      }

      return newSelected;
    });

    const answer = selectedLetters.map((i) => scrambledLetters[i]).join('');
    updateAnswer(answer);
  }, [selectedLetters, scrambledLetters, disabled, updateAnswer]);

  const handleClear = useCallback(() => {
    setSelectedLetters([]);
    updateAnswer('');
  }, [updateAnswer]);

  const handleSubmit = useCallback(async () => {
    if (disabled) return;

    setAttempts((prev) => prev + 1);
    const answer = selectedLetters.map((i) => scrambledLetters[i]).join('');
    const isCorrect = checkAnswer(answer, vocabulary, 'scrambled-word');

    await triggerFeedbackAnimation(isCorrect);

    const timeSpent = Date.now() - startTimeRef.current;
    onExerciseComplete?.({
      wordId: vocabulary.id,
      exerciseType: 'scrambled-word',
      isCorrect,
      timeSpentMs: timeSpent,
      attempts,
      timestamp: new Date().toISOString(),
    });
  }, [disabled, selectedLetters, scrambledLetters, vocabulary, triggerFeedbackAnimation, attempts, onExerciseComplete]);

  const currentAnswer = selectedLetters.map((i) => scrambledLetters[i]).join('');

  return (
    <div ref={containerRef} className="flex flex-col gap-6 p-6 bg-card rounded-lg border">
      {/* Word Definition */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{t('exercise.rearrange-letters')}</p>
        <p className="text-lg font-semibold text-foreground">{vocabulary.meaning}</p>
      </div>

      {/* Current Answer Display */}
      {currentAnswer && (
        <div className="p-4 bg-primary/10 rounded-lg">
          <p className="text-2xl font-bold text-primary text-center">{currentAnswer}</p>
        </div>
      )}

      {/* Scrambled Letters Grid */}
      <div className="flex flex-wrap gap-3 justify-center">
        {scrambledLetters.map((letter, index) => {
          const isSelected = selectedLetters.includes(index);
          return (
            <button
              key={index}
              onClick={() => handleLetterClick(index)}
              disabled={disabled}
              className={`
                w-12 h-12 rounded-lg font-bold text-lg transition-all
                ${
                  isSelected
                    ? 'bg-primary text-primary-foreground scale-110'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {letter.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={handleClear} disabled={disabled || selectedLetters.length === 0}>
          {t('action.clear')}
        </Button>
        <Button onClick={handleSubmit} disabled={disabled || selectedLetters.length === 0}>
          {t('action.check')}
        </Button>
      </div>
    </div>
  );
};

export default ScrambledWordExercise;
