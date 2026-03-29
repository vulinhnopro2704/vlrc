/**
 * Exercise Logic Handlers
 * Pure functions for exercise validation and answer checking
 * Completely separated from UI - NO side effects, fully testable
 */

import { normalizeString, calculateSimilarity, shuffleArray } from './exerciseCommon';

/**
 * Validate input for scrambled word exercise
 */
export const validateScrambledWordInput = (input: string): boolean => {
  return input.trim().length > 0;
};

/**
 * Check answer for scrambled word exercise
 */
export const checkScrambledWordAnswer = (userAnswer: string, correctWord: string): boolean => {
  const normalized = normalizeString(userAnswer);
  const expected = normalizeString(correctWord);
  return normalized === expected;
};

/**
 * Validate input for speed challenge
 */
export const validateSpeedChallengeInput = (input: string): boolean => {
  return input.trim().length > 0;
};

/**
 * Check answer for speed challenge
 */
export const checkSpeedChallengeAnswer = (userAnswer: string, correctWord: string): boolean => {
  const normalized = normalizeString(userAnswer);
  const expected = normalizeString(correctWord);
  return normalized === expected;
};

/**
 * Validate input for word puzzle (should be single word)
 */
export const validateWordPuzzleInput = (input: string): boolean => {
  return input.trim().length > 0;
};

/**
 * Check answer for word puzzle (fuzzy match with similarity threshold)
 */
export const checkWordPuzzleAnswer = (userAnswer: string, correctWord: string, threshold: number = 0.8): boolean => {
  const normalized = normalizeString(userAnswer);
  const expected = normalizeString(correctWord);

  // Exact match
  if (normalized === expected) return true;

  // Fuzzy match with similarity threshold
  const similarity = calculateSimilarity(normalized, expected);
  return similarity >= threshold;
};

/**
 * Check matching pairs exercise (checks if selections are correct)
 */
export const checkMatchingPairsAnswer = (
  selections: Array<{ wordId: string; meaningId: string }>,
  correctPairs: Array<{ wordId: string; meaningId: string }>
): boolean => {
  if (selections.length !== correctPairs.length) return false;

  // Check if all selections match correct pairs
  return selections.every(selection =>
    correctPairs.some(pair => pair.wordId === selection.wordId && pair.meaningId === selection.meaningId)
  );
};

/**
 * Validate streak challenge input (rapid-fire)
 */
export const validateStreakChallengeInput = (input: string): boolean => {
  return input.trim().length > 0;
};

/**
 * Check answer for streak challenge
 */
export const checkStreakChallengeAnswer = (userAnswer: string, correctWord: string): boolean => {
  const normalized = normalizeString(userAnswer);
  const expected = normalizeString(correctWord);
  return normalized === expected;
};

/**
 * Generate variant for scrambled word exercise
 */
export const generateScrambledWordVariant = (word: string): string => {
  const letters = word.split('');
  return shuffleArray(letters).join('');
};

/**
 * Generate variant for speed challenge (just return scrambled)
 */
export const generateSpeedChallengeVariant = (word: string): string => {
  const letters = word.split('');
  return shuffleArray(letters).join('');
};

/**
 * Generate hints for word puzzle
 */
export const generateWordPuzzleHints = (word: string): string[] => {
  const hints: string[] = [];

  // Hint 1: First letter
  hints.push(`Starts with: ${word.charAt(0)}`);

  // Hint 2: Word length
  hints.push(`Length: ${word.length} letters`);

  // Hint 3: Last letter
  hints.push(`Ends with: ${word.charAt(word.length - 1)}`);

  return hints;
};

/**
 * Generate variant for matching pairs (shuffle meanings)
 */
export const generateMatchingPairsVariant = (meanings: string[]): string[] => {
  return shuffleArray([...meanings]);
};

/**
 * Generic answer checker that works with normalized strings
 */
export const checkGenericAnswer = (userAnswer: string, correctAnswer: string, tolerance: number = 0): boolean => {
  const normalized = normalizeString(userAnswer);
  const expected = normalizeString(correctAnswer);

  if (tolerance === 0) {
    return normalized === expected;
  }

  // For fuzzy matching
  const similarity = calculateSimilarity(normalized, expected);
  return similarity >= 1 - tolerance;
};
