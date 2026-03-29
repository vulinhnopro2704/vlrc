/**
 * Scoring System Utilities
 * Pure functions for calculating scores - no side effects
 */

import { PRACTICE_CONFIG } from './practiceConfig';

export interface ScoreCalculation {
  baseScore: number;
  speedBonus: number;
  firstAttemptBonus: number;
  streakMultiplier: number;
  totalScore: number;
}

/**
 * Calculate base score for correct answer
 * @param isCorrect - Whether answer was correct
 * @returns Base points (0 if wrong, BASE_SCORE if correct)
 */
export const calculateBaseScore = (isCorrect: boolean): number => {
  return isCorrect ? PRACTICE_CONFIG.BASE_SCORE : 0;
};

/**
 * Calculate speed bonus (awarded for fast correct answers)
 * @param timeSpentMs - Time spent on exercise in milliseconds
 * @param isCorrect - Whether answer was correct
 * @returns Speed bonus points
 */
export const calculateSpeedBonus = (timeSpentMs: number, isCorrect: boolean): number => {
  if (!isCorrect) return 0;
  if (timeSpentMs <= PRACTICE_CONFIG.SPEED_BONUS_THRESHOLD_MS) {
    return PRACTICE_CONFIG.SPEED_BONUS_POINTS;
  }
  return 0;
};

/**
 * Calculate first attempt bonus
 * @param attempts - Number of attempts made
 * @param isCorrect - Whether answer was correct
 * @returns First attempt bonus points
 */
export const calculateFirstAttemptBonus = (attempts: number, isCorrect: boolean): number => {
  if (!isCorrect || attempts > 1) return 0;
  return PRACTICE_CONFIG.FIRST_ATTEMPT_BONUS;
};

/**
 * Calculate streak multiplier (increases with each correct answer in a row)
 * @param currentStreak - Current streak count
 * @returns Multiplier value (1.0 to MAX_STREAK_MULTIPLIER)
 */
export const calculateStreakMultiplier = (currentStreak: number): number => {
  const multiplier =
    PRACTICE_CONFIG.MIN_STREAK_MULTIPLIER +
    Math.min(currentStreak * PRACTICE_CONFIG.STREAK_MULTIPLIER_INCREMENT, PRACTICE_CONFIG.MAX_STREAK_MULTIPLIER - PRACTICE_CONFIG.MIN_STREAK_MULTIPLIER);

  return Math.min(multiplier, PRACTICE_CONFIG.MAX_STREAK_MULTIPLIER);
};

/**
 * Calculate total score for an exercise result
 * @param isCorrect - Whether answer was correct
 * @param timeSpentMs - Time spent in milliseconds
 * @param attempts - Number of attempts
 * @param currentStreak - Current streak before this result
 * @returns Complete score breakdown and total
 */
export const calculateTotalScore = (isCorrect: boolean, timeSpentMs: number, attempts: number, currentStreak: number): ScoreCalculation => {
  const baseScore = calculateBaseScore(isCorrect);
  const speedBonus = calculateSpeedBonus(timeSpentMs, isCorrect);
  const firstAttemptBonus = calculateFirstAttemptBonus(attempts, isCorrect);
  const streakMultiplier = calculateStreakMultiplier(currentStreak);

  const totalScore = Math.floor((baseScore + speedBonus + firstAttemptBonus) * streakMultiplier);

  return {
    baseScore,
    speedBonus,
    firstAttemptBonus,
    streakMultiplier,
    totalScore,
  };
};

/**
 * Calculate score with difficulty modifier
 * @param baseCalculation - Result from calculateTotalScore
 * @param difficultyMultiplier - Difficulty modifier (0.8, 1.0, 1.3)
 * @returns Adjusted score
 */
export const applyDifficultyModifier = (baseCalculation: ScoreCalculation, difficultyMultiplier: number): number => {
  return Math.floor(baseCalculation.totalScore * difficultyMultiplier);
};
