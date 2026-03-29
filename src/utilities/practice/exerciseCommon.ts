/**
 * Common Exercise Utilities
 * Shared helpers used across different exercise types
 */

/**
 * Normalize string for comparison (lowercase, trim, remove extra spaces)
 */
export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, ''); // Remove punctuation
};

/**
 * Check if two strings are similar (for fuzzy matching)
 * Returns similarity score 0-1
 */
export const calculateSimilarity = (a: string, b: string): number => {
  const normalized_a = normalizeString(a);
  const normalized_b = normalizeString(b);

  if (normalized_a === normalized_b) return 1;

  const longer = normalized_a.length > normalized_b.length ? normalized_a : normalized_b;
  const shorter = normalized_a.length > normalized_b.length ? normalized_b : normalized_a;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

/**
 * Levenshtein distance algorithm for string similarity
 */
function getEditDistance(s1: string, s2: string): number {
  const costs: number[] = [];

  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }

  return costs[s2.length];
}

/**
 * Format time duration for display
 * @param ms - Milliseconds
 * @returns Formatted string (e.g., "5.2s", "1m 23s")
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const milliseconds = ms % 1000;

  if (seconds === 0) {
    return `${milliseconds}ms`;
  }

  if (seconds < 60) {
    const totalSeconds = seconds + milliseconds / 1000;
    return `${totalSeconds.toFixed(1)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

/**
 * Get random item from array
 */
export const getRandomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Shuffle array in-place using Fisher-Yates algorithm
 */
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Create random incorrect answers for multiple choice
 */
export const generateDistractors = (correctAnswer: string, allOptions: string[], count: number = 3): string[] => {
  const filteredOptions = allOptions.filter((opt) => opt !== correctAnswer);
  const shuffled = shuffleArray(filteredOptions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

/**
 * Build multiple choice options (mix correct answer with distractors)
 */
export const buildMultipleChoiceOptions = (correctAnswer: string, distractors: string[]): string[] => {
  const options = [correctAnswer, ...distractors];
  return shuffleArray(options);
};

/**
 * Validate word object has required fields
 */
export const isValidWord = (word: any): word is LearningManagement.Word => {
  return (
    word &&
    typeof word === 'object' &&
    typeof word.word === 'string' &&
    word.word.length > 0 &&
    typeof word.meaning === 'string' &&
    word.meaning.length > 0
  );
};

/**
 * Validate exercise result has required fields
 */
export const isValidExerciseResult = (result: any): result is Practice.ExerciseResult => {
  return (
    result &&
    typeof result === 'object' &&
    typeof result.isCorrect === 'boolean' &&
    typeof result.timeSpentMs === 'number' &&
    result.timeSpentMs >= 0 &&
    typeof result.attempts === 'number' &&
    result.attempts > 0 &&
    typeof result.exerciseType === 'string'
  );
};
