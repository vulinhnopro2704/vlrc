/**
 * Streak System Utilities
 * Pure functions for streak and lives management - no side effects
 */

import { PRACTICE_CONFIG } from './practiceConfig';

export interface StreakState {
  currentStreak: number;
  bestStreak: number;
  livesRemaining: number;
  mistakesCount: number;
}

/**
 * Update streak based on exercise result
 * @param currentStreak - Current streak count
 * @param isCorrect - Whether the exercise was correct
 * @returns New streak count (incremented if correct, reset if wrong)
 */
export const updateStreak = (currentStreak: number, isCorrect: boolean): number => {
  if (isCorrect) {
    return currentStreak + 1;
  }
  return 0; // Reset streak on wrong answer
};

/**
 * Update best streak if current exceeds it
 * @param currentStreak - Current streak
 * @param bestStreak - Best streak so far
 * @returns Updated best streak
 */
export const updateBestStreak = (currentStreak: number, bestStreak: number): number => {
  return Math.max(currentStreak, bestStreak);
};

/**
 * Calculate remaining lives after a wrong answer
 * @param currentLives - Current lives remaining
 * @param isCorrect - Whether the exercise was correct
 * @returns New lives count
 */
export const updateLives = (currentLives: number, isCorrect: boolean): number => {
  if (isCorrect) {
    return currentLives; // No change on correct answer
  }
  return Math.max(0, currentLives - 1); // Lose one life on wrong answer
};

/**
 * Check if game should end (no lives remaining)
 * @param livesRemaining - Current lives count
 * @returns true if game should end
 */
export const shouldGameEnd = (livesRemaining: number): boolean => {
  return livesRemaining <= 0;
};

/**
 * Get milestone achievements (for celebrations)
 * @param streak - Current streak
 * @returns Milestone info
 */
export interface MilestoneAchievement {
  achieved: boolean;
  type: 'streak-5' | 'streak-10' | 'streak-25' | 'none';
  message: string;
}

export const checkMilestone = (streak: number): MilestoneAchievement => {
  if (streak === 25) {
    return { achieved: true, type: 'streak-25', message: 'streak-25-milestone' };
  }
  if (streak === 10) {
    return { achieved: true, type: 'streak-10', message: 'streak-10-milestone' };
  }
  if (streak === 5) {
    return { achieved: true, type: 'streak-5', message: 'streak-5-milestone' };
  }
  return { achieved: false, type: 'none', message: '' };
};

/**
 * Get streak level for visual representation
 * @param streak - Current streak count
 * @returns Level number (0-4)
 */
export const getStreakLevel = (streak: number): number => {
  if (streak >= 25) return 4;
  if (streak >= 10) return 3;
  if (streak >= 5) return 2;
  if (streak > 0) return 1;
  return 0;
};

/**
 * Initialize streak state
 * @param initialLives - Starting lives (default from config)
 * @returns Initial streak state
 */
export const initializeStreakState = (initialLives: number = PRACTICE_CONFIG.INITIAL_LIVES): StreakState => {
  return {
    currentStreak: 0,
    bestStreak: 0,
    livesRemaining: initialLives,
    mistakesCount: 0,
  };
};
