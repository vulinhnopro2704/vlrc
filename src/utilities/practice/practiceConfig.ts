/**
 * Practice Feature Configuration
 * Contains all game mechanics constants and defaults
 */

export const PRACTICE_CONFIG = {
  // Scoring system
  BASE_SCORE: 10,
  SPEED_BONUS_THRESHOLD_MS: 5000, // 5 seconds
  SPEED_BONUS_POINTS: 5,
  FIRST_ATTEMPT_BONUS: 5,
  MAX_STREAK_MULTIPLIER: 1.5,
  MIN_STREAK_MULTIPLIER: 1.0,

  // Lives and mistakes
  INITIAL_LIVES: 3,
  MAX_MISTAKES: 3,

  // Streak system
  STREAK_RESET_THRESHOLD: 1, // Reset at 1 wrong answer
  STREAK_MULTIPLIER_INCREMENT: 0.1, // Multiplier increases by 0.1 per streak level

  // Timings
  ANIMATION_DURATION_MS: 600,
  FEEDBACK_DISPLAY_MS: 800,
  TRANSITION_DELAY_MS: 300,

  // Exercise variants
  EXERCISES_PER_SESSION: 'all', // 'all' or a number
  REUSE_EXISTING_EXERCISES: true,
  NEW_EXERCISE_TYPES: ['scrambled-word', 'speed-challenge', 'word-puzzle', 'matching-pairs', 'streak-challenge'] as const,

  // Difficulty settings
  DIFFICULTY_LEVELS: {
    EASY: { livesMultiplier: 1.5, scoreMultiplier: 0.8 },
    NORMAL: { livesMultiplier: 1.0, scoreMultiplier: 1.0 },
    HARD: { livesMultiplier: 0.8, scoreMultiplier: 1.3 },
  },
} as const;

export type DifficultyLevel = keyof typeof PRACTICE_CONFIG.DIFFICULTY_LEVELS;
