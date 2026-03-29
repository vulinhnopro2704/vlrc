/**
 * Exercise Logic Handlers
 * Pure functions for validating and checking answers
 * Completely separate from UI components and animation
 */

import { normalizeString } from './exerciseCommon';

/**
 * Validate user input based on exercise type
 * @param userInput - The user's answer
 * @param exerciseType - Type of exercise
 * @returns Validation result
 */
export const validateInput = (userInput: string | string[], exerciseType: LearningManagement.ActivityType | Practice.PracticeActivityType): boolean => {
  const normalized = Array.isArray(userInput) ? userInput.filter((v) => v.trim().length > 0) : userInput.trim();

  switch (exerciseType) {
    case 'scrambled-word':
    case 'fill-blank':
    case 'meaning-lookup':
      return typeof normalized === 'string' && normalized.length > 0;

    case 'speed-challenge':
      return typeof normalized === 'string' && normalized.length > 0;

    case 'word-puzzle':
      return typeof normalized === 'string' && normalized.length > 0;

    case 'matching-pairs':
      return Array.isArray(normalized) && normalized.length > 0;

    case 'streak-challenge':
      return typeof normalized === 'string' && normalized.length > 0;

    case 'listen-fill':
      return typeof normalized === 'string' && normalized.length > 0;

    case 'flip':
      return true; // Flip cards always valid once viewed

    case 'multiple-choice':
      return typeof normalized === 'string' && normalized.length > 0;

    case 'pronunciation':
      return true; // Pronunciation checked by audio comparison

    default:
      return false;
  }
};

/**
 * Check if user answer is correct
 * Core exercise validation logic
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
    case 'scrambled-word':
      // User should match the original word
      return normalized === correctNormalized;

    case 'speed-challenge':
      // Same as scrambled - match the word quickly
      return normalized === correctNormalized;

    case 'fill-blank':
      return normalized === correctNormalized;

    case 'meaning-lookup':
      // Check against English meaning (case-insensitive, partial match acceptable)
      if (!correctWord.meaning) return false;
      return correctWord.meaning.toLowerCase().includes(normalized) || normalized.toLowerCase().includes(correctWord.meaning.toLowerCase());

    case 'word-puzzle':
      // Word puzzle requires exact match
      return normalized === correctNormalized;

    case 'matching-pairs':
      // For matching pairs, check if the pairs are correctly matched
      if (!Array.isArray(userAnswer) || !exerciseData?.correctPairs) return false;
      return JSON.stringify(userAnswer.sort()) === JSON.stringify(exerciseData.correctPairs.sort());

    case 'streak-challenge':
      // Streak challenge - same as regular word match but in succession
      return normalized === correctNormalized;

    case 'listen-fill':
      return normalized === correctNormalized;

    case 'flip':
      // Flip card reveals the answer - always "correct" once viewed
      return true;

    case 'multiple-choice':
      // Multiple choice - user selects from options
      return normalized === correctNormalized;

    case 'pronunciation':
      // Pronunciation is checked by audio comparison (not pure text)
      return true;

    default:
      return false;
  }
};

/**
 * Generate exercise variant data based on exercise type
 * Pure function returning exercise-specific data
 */
export const generateExerciseVariant = (
  word: LearningManagement.Word,
  exerciseType: LearningManagement.ActivityType | Practice.PracticeActivityType
): Practice.ExerciseVariant => {
  const baseVariant: Practice.ExerciseVariant = {
    exerciseType,
    word,
    data: {},
  };

  switch (exerciseType) {
    case 'scrambled-word':
      baseVariant.data = {
        scrambledLetters: shuffleLetters(word.word),
        hint: getWordHint(word),
      };
      break;

    case 'speed-challenge':
      baseVariant.data = {
        timeLimit: 10000, // 10 seconds
        scrambledLetters: shuffleLetters(word.word),
      };
      break;

    case 'word-puzzle':
      baseVariant.data = {
        hints: generateWordPuzzleHints(word),
        hiddenLetters: generateHiddenLetters(word.word),
      };
      break;

    case 'matching-pairs':
      baseVariant.data = {
        pairs: generateMatchingPairs(word),
      };
      break;

    case 'streak-challenge':
      baseVariant.data = {
        scrambledLetters: shuffleLetters(word.word),
      };
      break;

    case 'fill-blank':
      baseVariant.data = {
        example: word.example || '',
        blank: '_'.repeat(word.word.length),
      };
      break;

    case 'listen-fill':
      baseVariant.data = {
        audioUrl: word.audio || '',
        blank: '_'.repeat(word.word.length),
      };
      break;

    case 'meaning-lookup':
      baseVariant.data = {
        meaning: word.meaning,
        example: word.example || '',
      };
      break;

    default:
      break;
  }

  return baseVariant;
};

// ── Helper Functions ──

/**
 * Shuffle letters of a word
 */
function shuffleLetters(word: string): string[] {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters;
}

/**
 * Get hint for word puzzle
 */
function getWordHint(word: LearningManagement.Word): string {
  return `${word.word[0]}${'_'.repeat(word.word.length - 2)}${word.word[word.word.length - 1]}`;
}

/**
 * Generate hints for word puzzle exercise
 */
function generateWordPuzzleHints(word: LearningManagement.Word): string[] {
  const hints: string[] = [];

  if (word.meaning) hints.push(`Meaning: ${word.meaning}`);
  if (word.partOfSpeech) hints.push(`Part of speech: ${word.partOfSpeech}`);
  if (word.example) hints.push(`Example: ${word.example}`);

  return hints;
}

/**
 * Generate hidden letters pattern (some letters visible, some hidden)
 */
function generateHiddenLetters(word: string): string {
  const visibleCount = Math.ceil(word.length / 3);
  const letters = word.split('');
  const hiddenIndices = new Set<number>();

  // Hide some random letters
  while (hiddenIndices.size < Math.max(1, word.length - visibleCount)) {
    hiddenIndices.add(Math.floor(Math.random() * word.length));
  }

  return letters.map((letter, idx) => (hiddenIndices.has(idx) ? '_' : letter)).join('');
}

/**
 * Generate matching pairs for matching-pairs exercise
 */
function generateMatchingPairs(word: LearningManagement.Word): { word: string; meaning: string }[] {
  return [
    { word: word.word, meaning: word.meaning },
  ];
}
