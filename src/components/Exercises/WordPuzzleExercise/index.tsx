/**
 * WordPuzzleExercise Component
 * UI-only: Guess word from hints with progressive letter reveals
 * All logic delegated to utilities
 */

import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnimationTriggers } from '@/hooks/practice/useAnimationTriggers';
import { useExerciseState } from '@/hooks/practice/useExerciseState';
import { checkAnswer } from '@/utilities/practice/exerciseHandlers';
import { Lightbulb } from 'lucide-react';

interface WordPuzzleExerciseProps extends LearningManagement.ActivityCardProps {
  exerciseData?: Practice.ExerciseVariant;
  onExerciseComplete?: (result: Practice.ExerciseResult) => void;
}

export const WordPuzzleExercise: React.FC<WordPuzzleExerciseProps> = ({
  vocabulary,
  onExerciseComplete,
  disabled = false,
  exerciseData,
}) => {
  const { t } = useTranslation();
  const { containerRef, triggerFeedbackAnimation } = useAnimationTriggers();
  const { userAnswer, updateAnswer } = useExerciseState({ exerciseType: 'word-puzzle' });
  const startTimeRef = useRef(Date.now());
  const [usedHints, setUsedHints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [revealedLetters, setRevealedLetters] = useState<Set<number>>(new Set());

  const hints = exerciseData?.data?.hints || [`Meaning: ${vocabulary.meaning}`];
  const maxHints = hints.length;

  const currentPattern = vocabulary.word
    .split('')
    .map((letter, idx) => (revealedLetters.has(idx) ? letter : '_'))
    .join(' ');

  const handleRevealHint = useCallback(() => {
    if (usedHints < maxHints) {
      setUsedHints((prev) => prev + 1);
    }
  }, [usedHints, maxHints]);

  const handleRevealLetter = useCallback(() => {
    const hiddenIndices = vocabulary.word
      .split('')
      .map((_, idx) => idx)
      .filter((idx) => !revealedLetters.has(idx));

    if (hiddenIndices.length > 0) {
      const randomIdx = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
      setRevealedLetters((prev) => {
        const newSet = new Set(prev);
        newSet.add(randomIdx);
        return newSet;
      });
    }
  }, [vocabulary.word, revealedLetters]);

  const handleSubmit = useCallback(async () => {
    if (disabled) return;

    setAttempts((prev) => prev + 1);
    const isCorrect = checkAnswer(userAnswer as string, vocabulary, 'word-puzzle');

    await triggerFeedbackAnimation(isCorrect);

    const timeSpent = Date.now() - startTimeRef.current;
    onExerciseComplete?.({
      wordId: vocabulary.id,
      exerciseType: 'word-puzzle',
      isCorrect,
      timeSpentMs: timeSpent,
      attempts,
      timestamp: new Date().toISOString(),
    });
  }, [disabled, userAnswer, vocabulary, triggerFeedbackAnimation, attempts, onExerciseComplete]);

  return (
    <div ref={containerRef} className="flex flex-col gap-6 p-6 bg-card rounded-lg border">
      {/* Pattern Display */}
      <div className="p-6 bg-primary/5 rounded-lg border-2 border-primary">
        <p className="text-center text-5xl font-bold tracking-widest text-primary">{currentPattern}</p>
      </div>

      {/* Hints Section */}
      <div className="space-y-3">
        {hints.map((hint, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border flex items-start gap-3 transition-all ${
              idx < usedHints ? 'bg-primary/10 border-primary' : 'bg-secondary/30 border-secondary'
            }`}
          >
            <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500" />
            <p className={`text-sm ${idx < usedHints ? 'text-foreground' : 'text-muted-foreground'}`}>
              {idx < usedHints ? hint : t('exercise.hint-locked')}
            </p>
          </div>
        ))}
      </div>

      {/* Helper Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRevealHint}
          disabled={disabled || usedHints >= maxHints}
          className="flex-1"
        >
          {t('exercise.reveal-hint')} ({usedHints}/{maxHints})
        </Button>
        <Button variant="outline" size="sm" onClick={handleRevealLetter} disabled={disabled} className="flex-1">
          {t('exercise.reveal-letter')}
        </Button>
      </div>

      {/* Input Field */}
      <Input
        type="text"
        placeholder={t('exercise.type-answer')}
        value={userAnswer as string}
        onChange={(e) => updateAnswer(e.target.value)}
        disabled={disabled}
        autoFocus
        className="text-lg"
      />

      {/* Submit Button */}
      <Button onClick={handleSubmit} disabled={disabled || !userAnswer} className="w-full">
        {t('action.check')}
      </Button>
    </div>
  );
};

export default WordPuzzleExercise;
