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

/**
 * Validate user input by exercise type.
 * Compatibility API used by practice UI hooks/components.
 */
export const validateInput = (
  userInput: string | string[],
  exerciseType: LearningManagement.ActivityType | Practice.PracticeActivityType
): boolean => {
  const normalized = Array.isArray(userInput)
    ? userInput.filter(value => value.trim().length > 0)
    : userInput.trim();

  switch (exerciseType) {
    case 'fill-blank':
    case 'meaning-lookup':
    case 'speed-challenge':
    case 'word-puzzle':
    case 'streak-challenge':
    case 'listen-fill':
    case 'multiple-choice':
      return typeof normalized === 'string' && normalized.length > 0;
    case 'matching-pairs':
      return Array.isArray(normalized) && normalized.length > 0;
    case 'flip':
    case 'pronunciation':
      return true;
    default:
      return false;
  }
};

/**
 * Generic answer checker by exercise type.
 * Compatibility API used by practice UI components.
 */
export const checkAnswer = (
  userAnswer: string | string[],
  correctWord: LearningManagement.Word,
  exerciseType: LearningManagement.ActivityType | Practice.PracticeActivityType,
  exerciseData?: Record<string, any>
): boolean => {
  if (!validateInput(userAnswer, exerciseType)) {
    return false;
  }

  const normalized = normalizeString(Array.isArray(userAnswer) ? userAnswer[0] : userAnswer);
  const correctNormalized = normalizeString(correctWord.word);

  switch (exerciseType) {
    case 'speed-challenge':
    case 'fill-blank':
    case 'word-puzzle':
    case 'streak-challenge':
    case 'listen-fill':
    case 'multiple-choice':
      return normalized === correctNormalized;
    case 'meaning-lookup':
      if (!correctWord.meaning) return false;
      return (
        correctWord.meaning.toLowerCase().includes(normalized) ||
        normalized.toLowerCase().includes(correctWord.meaning.toLowerCase())
      );
    case 'matching-pairs':
      if (!Array.isArray(userAnswer) || !exerciseData?.correctPairs) return false;
      return JSON.stringify(userAnswer.sort()) === JSON.stringify(exerciseData.correctPairs.sort());
    case 'flip':
    case 'pronunciation':
      return true;
    default:
      return false;
  }
};
