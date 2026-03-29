/**
 * useAnimationTriggers Hook
 * Manages animation state ONLY - no business logic
 * Receives triggers, manages animation state, emits completion callbacks
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { createFeedbackAnimation, createExerciseEnterAnimation, createTransitionAnimation, waitForAnimation } from '@/utilities/practice/animationHelpers';
import { PRACTICE_CONFIG } from '@/utilities/practice/practiceConfig';

interface UseAnimationTriggersProps {
  isEnabled?: boolean;
}

interface UseAnimationTriggersReturn {
  animationState: Practice.AnimationState;
  containerRef: React.RefObject<HTMLDivElement>;
  triggerFeedbackAnimation: (isCorrect: boolean) => Promise<void>;
  triggerEnterAnimation: () => Promise<void>;
  triggerTransitionAnimation: (nextExerciseRef: React.RefObject<HTMLDivElement>) => Promise<void>;
  reset: () => void;
}

export const useAnimationTriggers = (props: UseAnimationTriggersProps = {}): UseAnimationTriggersReturn => {
  const { isEnabled = true } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationState, setAnimationState] = useState<Practice.AnimationState>({
    isEntering: false,
    isFeedback: false,
    isTransitioning: false,
  });

  const reset = useCallback(() => {
    setAnimationState({
      isEntering: false,
      isFeedback: false,
      isTransitioning: false,
    });
  }, []);

  const triggerFeedbackAnimation = useCallback(
    async (isCorrect: boolean) => {
      if (!isEnabled || !containerRef.current) return;

      setAnimationState({
        isEntering: false,
        isFeedback: true,
        isTransitioning: false,
        feedbackType: isCorrect ? 'correct' : 'wrong',
      });

      const timeline = createFeedbackAnimation(containerRef.current, isCorrect);
      await waitForAnimation(timeline);

      setAnimationState({
        isEntering: false,
        isFeedback: false,
        isTransitioning: false,
      });
    },
    [isEnabled]
  );

  const triggerEnterAnimation = useCallback(async () => {
    if (!isEnabled || !containerRef.current) return;

    setAnimationState({
      isEntering: true,
      isFeedback: false,
      isTransitioning: false,
    });

    const timeline = createExerciseEnterAnimation(containerRef.current);
    await waitForAnimation(timeline);

    setAnimationState({
      isEntering: false,
      isFeedback: false,
      isTransitioning: false,
    });
  }, [isEnabled]);

  const triggerTransitionAnimation = useCallback(
    async (nextExerciseRef: React.RefObject<HTMLDivElement>) => {
      if (!isEnabled || !containerRef.current) return;

      setAnimationState({
        isEntering: false,
        isFeedback: false,
        isTransitioning: true,
      });

      const timeline = createTransitionAnimation(containerRef.current, nextExerciseRef.current);
      await waitForAnimation(timeline);

      setAnimationState({
        isEntering: false,
        isFeedback: false,
        isTransitioning: false,
      });
    },
    [isEnabled]
  );

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current);
      }
    };
  }, []);

  return {
    animationState,
    containerRef,
    triggerFeedbackAnimation,
    triggerEnterAnimation,
    triggerTransitionAnimation,
    reset,
  };
};
