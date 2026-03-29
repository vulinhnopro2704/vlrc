/**
 * useExerciseState Hook
 * Manages exercise-level input and validation ONLY
 * Does NOT manage game mechanics, score, or animation
 */

import { useState, useCallback, useRef } from 'react';

interface UseExerciseStateProps {
  exerciseType: LearningManagement.ActivityType | Practice.PracticeActivityType;
}

interface UseExerciseStateReturn {
  userAnswer: string | string[];
  validationError: string | null;
  isSubmitting: boolean;
  startTime: number;
  updateAnswer: (answer: string | string[]) => void;
  submitAnswer: (callback: (answer: string | string[]) => void) => Promise<boolean>;
  reset: () => void;
  getTimeSinceStart: () => number;
}

export const useExerciseState = (props: UseExerciseStateProps): UseExerciseStateReturn => {
  const { exerciseType } = props;
  const [userAnswer, setUserAnswer] = useState<string | string[]>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const updateAnswer = useCallback((answer: string | string[]) => {
    setUserAnswer(answer);
    setValidationError(null); // Clear error when user updates answer
  }, []);

  const submitAnswer = useCallback(
    async (callback: (answer: string | string[]) => void): Promise<boolean> => {
      // Validate input
      const isValid = validateInput(userAnswer, exerciseType);

      if (!isValid) {
        setValidationError('exercise-invalid-answer');
        return false;
      }

      setIsSubmitting(true);

      try {
        // Call the callback with the answer
        // The callback should be a pure function that doesn't modify state
        callback(userAnswer);
        return true;
      } catch (error) {
        console.error('Error submitting answer:', error);
        setValidationError('exercise-submission-error');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [userAnswer, exerciseType]
  );

  const reset = useCallback(() => {
    setUserAnswer('');
    setValidationError(null);
    setIsSubmitting(false);
    startTimeRef.current = Date.now();
  }, []);

  const getTimeSinceStart = useCallback(() => {
    return Date.now() - startTimeRef.current;
  }, []);

  return {
    userAnswer,
    validationError,
    isSubmitting,
    startTime: startTimeRef.current,
    updateAnswer,
    submitAnswer,
    reset,
    getTimeSinceStart,
  };
};
