/**
 * Animation Helpers
 * Pure functions for GSAP animation factory functions
 * NO state, NO side effects, returns animations only
 */

import gsap from 'gsap';
import { PRACTICE_CONFIG } from './practiceConfig';

/**
 * Create exercise enter animation (fade in + slide up)
 */
export const createExerciseEnterAnimation = (element: HTMLElement | null): gsap.core.Tween => {
  if (!element) return gsap.timeline();

  return gsap.from(element, {
    opacity: 0,
    y: 30,
    duration: PRACTICE_CONFIG.ANIMATION_DURATION_MS / 1000,
    ease: 'power2.out',
  });
};

/**
 * Create correct answer animation (green flash + scale up)
 */
export const createCorrectAnswerAnimation = (element: HTMLElement | null): gsap.core.Tween => {
  if (!element) return gsap.timeline();

  const tl = gsap.timeline();

  tl.to(element, {
    backgroundColor: '#10b981',
    duration: 0.2,
    ease: 'power2.out',
  })
    .to(
      element,
      {
        scale: 1.05,
        duration: 0.3,
        ease: 'back.out',
      },
      0
    )
    .to(element, {
      backgroundColor: 'transparent',
      duration: 0.2,
    });

  return tl;
};

/**
 * Create incorrect answer animation (red shake)
 */
export const createIncorrectAnswerAnimation = (element: HTMLElement | null): gsap.core.Tween => {
  if (!element) return gsap.timeline();

  return gsap.to(element, {
    x: [0, -5, 5, -5, 5, 0],
    duration: 0.5,
    ease: 'power2.inOut',
  });
};

/**
 * Create score update animation (number counter)
 */
export const createScoreUpdateAnimation = (
  element: HTMLElement | null,
  fromScore: number,
  toScore: number
): gsap.core.Tween => {
  if (!element) return gsap.timeline();

  const tl = gsap.timeline();

  // Animate number change
  const textObj = { value: fromScore };
  tl.to(textObj, {
    value: toScore,
    duration: 0.6,
    ease: 'power2.out',
    onUpdate() {
      if (element) {
        element.textContent = Math.round(textObj.value).toString();
      }
    },
  })
    // Add scale pulse
    .to(
      element,
      {
        scale: 1.2,
        duration: 0.3,
        ease: 'back.out',
      },
      0
    )
    .to(element, {
      scale: 1,
      duration: 0.3,
      ease: 'back.in',
    });

  return tl;
};

/**
 * Create streak animation (floating flame icon)
 */
export const createStreakAnimation = (element: HTMLElement | null): gsap.core.Tween => {
  if (!element) return gsap.timeline();

  return gsap.to(element, {
    y: -20,
    opacity: [1, 0.8, 1],
    scale: [1, 1.2, 1],
    duration: 1,
    ease: 'sine.inOut',
    repeat: -1,
  });
};

/**
 * Create exercise transition animation (fade out then fade in)
 */
export const createExerciseTransitionAnimation = (element: HTMLElement | null): gsap.core.Tween => {
  if (!element) return gsap.timeline();

  const tl = gsap.timeline();

  tl.to(element, {
    opacity: 0,
    y: -20,
    duration: PRACTICE_CONFIG.TRANSITION_DELAY_MS / 1000,
    ease: 'power2.in',
  }).to(
    element,
    {
      opacity: 1,
      y: 0,
      duration: PRACTICE_CONFIG.ANIMATION_DURATION_MS / 1000,
      ease: 'power2.out',
    },
    PRACTICE_CONFIG.TRANSITION_DELAY_MS / 1000
  );

  return tl;
};

/**
 * Create confetti animation (simple particles falling)
 */
export const createConfettiAnimation = (container: HTMLElement | null): gsap.core.Tween => {
  if (!container) return gsap.timeline();

  // Create confetti particles
  const particleCount = 30;
  const particles: HTMLElement[] = [];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.pointerEvents = 'none';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = '-10px';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.backgroundColor = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][i % 4];
    particle.style.borderRadius = '50%';
    particle.style.opacity = '0.8';
    document.body.appendChild(particle);
    particles.push(particle);
  }

  const tl = gsap.timeline({
    onComplete() {
      particles.forEach(p => p.remove());
    },
  });

  particles.forEach((particle, index) => {
    tl.to(
      particle,
      {
        y: window.innerHeight + 50,
        opacity: 0,
        rotation: Math.random() * 360,
        duration: 2 + Math.random() * 0.5,
        ease: 'none',
      },
      Math.random() * 0.3
    );
  });

  return tl;
};

/**
 * Create celebration animation for milestones
 */
export const createMilestoneAnimation = (element: HTMLElement | null): gsap.core.Tween => {
  if (!element) return gsap.timeline();

  const tl = gsap.timeline();

  tl.to(element, {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    duration: 0.5,
    ease: 'back.out',
  })
    .to(
      element,
      {
        y: -20,
        duration: 0.4,
        ease: 'power2.out',
      },
      0
    )
    .to(element, {
      scale: 0.95,
      duration: 0.2,
    })
    .to(element, {
      scale: 1,
      duration: 0.2,
    });

  return tl;
};

/**
 * Create feedback message animation
 */
export const createFeedbackMessageAnimation = (element: HTMLElement | null): gsap.core.Tween => {
  if (!element) return gsap.timeline();

  return gsap.to(element, {
    opacity: [0, 1, 0],
    y: [-20, 0, 20],
    duration: 1.5,
    ease: 'power2.inOut',
  });
};
