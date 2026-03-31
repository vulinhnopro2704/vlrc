/**
 * useAnimationTriggers Hook
 * Manages animation state ONLY - no business logic
 * Receives triggers, manages animation state, emits completion callbacks
 */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  createCorrectAnswerAnimation,
  createIncorrectAnswerAnimation,
  createExerciseEnterAnimation,
  createExerciseTransitionAnimation
} from '@/lib/practice/animationHelpers';

interface UseAnimationTriggersProps {
  isEnabled?: boolean;
}

interface UseAnimationTriggersReturn {
  animationState: Practice.AnimationState;
  containerRef: React.RefObject<HTMLDivElement | null>;
  triggerFeedbackAnimation: (isCorrect: boolean) => Promise<void>;
  triggerEnterAnimation: () => Promise<void>;
  triggerTransitionAnimation: (
    nextExerciseRef: React.RefObject<HTMLDivElement | null>
  ) => Promise<void>;
  reset: () => void;
}

const waitForAnimation = (timeline: gsap.core.Animation): Promise<void> => {
  return new Promise(resolve => {
    if (timeline.totalDuration() === 0) {
      resolve();
      return;
    }

    timeline.eventCallback('onComplete', resolve);
  });
};

export const useAnimationTriggers = (
  props: UseAnimationTriggersProps = {}
): UseAnimationTriggersReturn => {
  const { isEnabled = true } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationState, setAnimationState] = useState<Practice.AnimationState>({
    isEntering: false,
    isFeedback: false,
    isTransitioning: false
  });

  const reset = () => {
    setAnimationState({
      isEntering: false,
      isFeedback: false,
      isTransitioning: false
    });
  };

  const triggerFeedbackAnimation = async (isCorrect: boolean) => {
    if (!isEnabled || !containerRef.current) return;

    setAnimationState({
      isEntering: false,
      isFeedback: true,
      isTransitioning: false,
      feedbackType: isCorrect ? 'correct' : 'wrong'
    });

    const timeline = isCorrect
      ? createCorrectAnswerAnimation(containerRef.current)
      : createIncorrectAnswerAnimation(containerRef.current);
    await waitForAnimation(timeline);

    setAnimationState({
      isEntering: false,
      isFeedback: false,
      isTransitioning: false
    });
  };

  const triggerEnterAnimation = async () => {
    if (!isEnabled || !containerRef.current) return;

    setAnimationState({
      isEntering: true,
      isFeedback: false,
      isTransitioning: false
    });

    const timeline = createExerciseEnterAnimation(containerRef.current);
    await waitForAnimation(timeline);

    setAnimationState({
      isEntering: false,
      isFeedback: false,
      isTransitioning: false
    });
  };

  const triggerTransitionAnimation = async (
    _nextExerciseRef: React.RefObject<HTMLDivElement | null>
  ) => {
    if (!isEnabled || !containerRef.current) return;

    setAnimationState({
      isEntering: false,
      isFeedback: false,
      isTransitioning: true
    });

    const timeline = createExerciseTransitionAnimation(containerRef.current);
    await waitForAnimation(timeline);

    setAnimationState({
      isEntering: false,
      isFeedback: false,
      isTransitioning: false
    });
  };

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
    reset
  };
};
