/**
 * Animation Helpers
 * Pure GSAP animation factory functions - no component state, no side effects
 * Returns GSAP timelines for different animation scenarios
 */

import gsap from 'gsap';

/**
 * Create exercise entry animation (fade in + slide up)
 */
export const createExerciseEnterAnimation = (element: HTMLElement | null): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  if (!element) return timeline;

  timeline.fromTo(
    element,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    }
  );

  return timeline;
};

/**
 * Create feedback animation (correct = green flash + scale, wrong = red shake)
 */
export const createFeedbackAnimation = (element: HTMLElement | null, isCorrect: boolean): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  if (!element) return timeline;

  if (isCorrect) {
    // Correct: Green flash + scale pulse
    timeline
      .to(
        element,
        {
          backgroundColor: 'rgba(34, 197, 94, 0.2)', // green-500 with alpha
          duration: 0.3,
        },
        0
      )
      .to(
        element,
        {
          scale: 1.05,
          duration: 0.2,
        },
        0
      )
      .to(
        element,
        {
          scale: 1,
          duration: 0.2,
        },
        0.2
      )
      .to(
        element,
        {
          backgroundColor: 'transparent',
          duration: 0.3,
        },
        0.4
      );
  } else {
    // Wrong: Red shake
    timeline.to(
      element,
      {
        x: -5,
        backgroundColor: 'rgba(239, 68, 68, 0.2)', // red-500 with alpha
        duration: 0.1,
        repeat: 2,
        yoyo: true,
      },
      0
    );

    timeline.to(
      element,
      {
        x: 0,
        backgroundColor: 'transparent',
        duration: 0.1,
      },
      0.6
    );
  }

  return timeline;
};

/**
 * Create score counter animation (number counting up)
 */
export const createScoreCountAnimation = (element: HTMLElement | null, fromScore: number, toScore: number): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  if (!element) return timeline;

  const obj = { value: fromScore };

  timeline.to(obj, {
    value: toScore,
    duration: 0.6,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.floor(obj.value).toString();
    },
  });

  return timeline;
};

/**
 * Create streak icon floating animation (float up + fade)
 */
export const createStreakFloatingAnimation = (element: HTMLElement | null): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  if (!element) return timeline;

  timeline.fromTo(
    element,
    {
      opacity: 1,
      y: 0,
    },
    {
      opacity: 0,
      y: -50,
      duration: 1.5,
      ease: 'power1.out',
    }
  );

  return timeline;
};

/**
 * Create exercise transition animation (fade out current + fade in next)
 */
export const createTransitionAnimation = (exitElement: HTMLElement | null, enterElement: HTMLElement | null): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  if (exitElement) {
    timeline.to(
      exitElement,
      {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: 'power2.in',
      },
      0
    );
  }

  if (enterElement) {
    timeline.fromTo(
      enterElement,
      {
        opacity: 0,
        y: 10,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      },
      0.2
    );
  }

  return timeline;
};

/**
 * Create celebration animation (confetti-like effect with floating elements)
 * This creates scattered bouncy animations
 */
export const createCelebrationAnimation = (particles: HTMLElement[]): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  particles.forEach((particle, index) => {
    const delay = index * 0.05;
    const duration = 0.8 + Math.random() * 0.4;

    timeline.fromTo(
      particle,
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
      },
      {
        opacity: 0,
        y: -100 - Math.random() * 50,
        x: (Math.random() - 0.5) * 100,
        scale: 0,
        duration,
        ease: 'back.out',
      },
      delay
    );
  });

  return timeline;
};

/**
 * Create milestone achievement animation (bounce + glow)
 */
export const createMilestoneAnimation = (element: HTMLElement | null): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  if (!element) return timeline;

  timeline
    .to(
      element,
      {
        scale: 0,
        opacity: 0,
        duration: 0,
      },
      0
    )
    .to(
      element,
      {
        scale: 1.2,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out',
      },
      0
    )
    .to(
      element,
      {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      },
      0.5
    );

  // Add box shadow glow
  timeline.to(
    element,
    {
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)',
      duration: 0.6,
      ease: 'sine.inOut',
    },
    0
  );

  timeline.to(
    element,
    {
      boxShadow: '0 0 0px rgba(59, 130, 246, 0)',
      duration: 0.4,
    },
    0.6
  );

  return timeline;
};

/**
 * Kill all animations on element
 */
export const killAnimations = (element: HTMLElement | null): void => {
  if (element) {
    gsap.killTweensOf(element);
  }
};

/**
 * Wait for animation to complete
 */
export const waitForAnimation = (timeline: gsap.core.Timeline): Promise<void> => {
  return new Promise((resolve) => {
    if (timeline.totalDuration() === 0) {
      resolve();
    } else {
      timeline.eventCallback('onComplete', resolve);
    }
  });
};
