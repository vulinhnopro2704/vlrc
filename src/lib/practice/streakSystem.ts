/**
 * Streak & Lives System Utilities
 * Pure functions for streak tracking and lives management - NO side effects
 */

import { PRACTICE_CONFIG } from './practiceConfig';

export interface StreakState {
  currentStreak: number;
  bestStreak: number;
  livesRemaining: number;
  totalMistakes: number;
}

/**
 * Initialize streak state with starting lives
 */
export const initializeStreakState = (livesCount: number): StreakState => {
  return {
    currentStreak: 0,
    bestStreak: 0,
    livesRemaining: livesCount,
    totalMistakes: 0,
  };
};

/**
 * Update streak based on exercise result
 */
export const updateStreak = (state: StreakState, isCorrect: boolean): StreakState => {
  if (isCorrect) {
    return {
      ...state,
      currentStreak: state.currentStreak + 1,
    };
  }

  // Reset streak on incorrect answer
  return {
    ...state,
    currentStreak: 0,
  };
};

/**
 * Update best streak if current exceeds previous
 */
export const updateBestStreak = (state: StreakState): StreakState => {
  if (state.currentStreak > state.bestStreak) {
    return {
      ...state,
      bestStreak: state.currentStreak,
    };
  }
  return state;
};

/**
 * Update lives on incorrect answer
 */
export const updateLives = (state: StreakState): StreakState => {
  const newLives = Math.max(0, state.livesRemaining - 1);

  return {
    ...state,
    livesRemaining: newLives,
    totalMistakes: state.totalMistakes + 1,
  };
};

/**
 * Check if game should end (no lives remaining)
 */
export const shouldGameEnd = (state: StreakState): boolean => {
  return state.livesRemaining <= 0;
};

/**
 * Check if milestone achieved (streak multiples of 5)
 */
export const checkMilestone = (streak: number): boolean => {
  return streak > 0 && streak % 5 === 0;
};

/**
 * Get milestone message based on streak
 */
export const getMilestoneMessage = (streak: number): string => {
  const milestones: { [key: number]: string } = {
    5: 'Great start! 5 in a row!',
    10: 'Awesome! 10 streak!',
    15: 'Incredible! 15 streak!',
    20: 'Outstanding! 20 streak!',
    25: 'Legendary! 25 streak!',
    50: 'Unbelievable! 50 streak!',
  };

  return milestones[streak] || `Amazing! ${streak} streak!`;
};
