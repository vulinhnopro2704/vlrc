/**
 * Gamification Engine
 * Pure class for managing game state and mechanics
 * NO React dependencies, NO side effects, fully testable
 */

import { calculateTotalScore, applyDifficultyModifier } from './scoringSystem';
import {
  updateStreak,
  updateBestStreak,
  updateLives,
  shouldGameEnd,
  checkMilestone,
  initializeStreakState
} from './streakSystem';
import { PRACTICE_CONFIG, type DifficultyLevel } from './practiceConfig';

/**
 * GamificationEngine manages all game mechanics independently from UI/exercises
 * All methods are pure - they take state and return new state
 */
export class GamificationEngine {
  private gameState: Practice.GameState;
  private difficultyLevel: DifficultyLevel = 'NORMAL';
  private exerciseResults: Practice.ExerciseResult[] = [];

  constructor(totalWords: number, difficulty: DifficultyLevel = 'NORMAL') {
    this.difficultyLevel = difficulty;
    this.gameState = this.initializeGameState(totalWords);
  }

  private initializeGameState(totalWords: number): Practice.GameState {
    const streakState = initializeStreakState(
      Math.ceil(
        PRACTICE_CONFIG.INITIAL_LIVES *
          PRACTICE_CONFIG.DIFFICULTY_LEVELS[this.difficultyLevel].livesMultiplier
      )
    );

    return {
      currentWordIndex: 0,
      totalWords,
      cumulativeScore: 0,
      currentStreak: streakState.currentStreak,
      bestStreak: streakState.bestStreak,
      livesRemaining: streakState.livesRemaining,
      exercisesCompleted: [],
      hasEnded: false
    };
  }

  /**
   * Record an exercise result and update game state
   * Pure method - returns new game state without mutation
   */
  recordResult(
    exerciseResult: Omit<Practice.ExerciseResult, 'streakAtTime' | 'timestamp'>
  ): Practice.GameState {
    if (this.gameState.hasEnded) {
      throw new Error('Cannot record result - game has ended');
    }

    // Calculate score
    const scoreCalc = calculateTotalScore(
      exerciseResult.isCorrect,
      exerciseResult.timeSpentMs,
      exerciseResult.attempts,
      this.gameState.currentStreak
    );

    const difficultyModifier =
      PRACTICE_CONFIG.DIFFICULTY_LEVELS[this.difficultyLevel].scoreMultiplier;
    const finalScore = applyDifficultyModifier(scoreCalc, difficultyModifier);

    // Update streak
    const newStreak = updateStreak(this.gameState.currentStreak, exerciseResult.isCorrect);
    const newBestStreak = updateBestStreak(newStreak, this.gameState.bestStreak);

    // Update lives
    const newLives = updateLives(this.gameState.livesRemaining, exerciseResult.isCorrect);
    const gameEnded = shouldGameEnd(newLives);

    // Create complete result with metadata
    const completeResult: Practice.ExerciseResult = {
      ...exerciseResult,
      pointsEarned: finalScore,
      streakAtTime: this.gameState.currentStreak,
      timestamp: new Date().toISOString()
    };

    // Update internal state
    this.gameState.cumulativeScore += finalScore;
    this.gameState.currentStreak = newStreak;
    this.gameState.bestStreak = newBestStreak;
    this.gameState.livesRemaining = newLives;
    this.gameState.currentWordIndex += 1;
    this.gameState.hasEnded =
      gameEnded || this.gameState.currentWordIndex >= this.gameState.totalWords;
    this.gameState.exercisesCompleted.push(completeResult);
    this.exerciseResults.push(completeResult);

    return { ...this.gameState };
  }

  /**
   * Get current immutable snapshot of game state
   */
  getGameState(): Practice.GameState {
    return { ...this.gameState };
  }

  /**
   * Get current score
   */
  getScore(): number {
    return this.gameState.cumulativeScore;
  }

  /**
   * Get current streak
   */
  getStreak(): number {
    return this.gameState.currentStreak;
  }

  /**
   * Get best streak achieved
   */
  getBestStreak(): number {
    return this.gameState.bestStreak;
  }

  /**
   * Get remaining lives
   */
  getLives(): number {
    return this.gameState.livesRemaining;
  }

  /**
   * Check if game has ended
   */
  hasEnded(): boolean {
    return this.gameState.hasEnded;
  }

  /**
   * Get milestone achievement if any
   */
  getLatestMilestone(): ReturnType<typeof checkMilestone> | null {
    if (this.exerciseResults.length === 0) return null;

    const lastResult = this.exerciseResults[this.exerciseResults.length - 1];
    if (lastResult.isCorrect) {
      return checkMilestone(this.gameState.currentStreak);
    }
    return null;
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    return (this.gameState.currentWordIndex / this.gameState.totalWords) * 100;
  }

  /**
   * Get all exercise results
   */
  getResults(): Practice.ExerciseResult[] {
    return [...this.exerciseResults];
  }

  /**
   * Get session summary
   */
  getSessionSummary() {
    const correctCount = this.exerciseResults.filter(r => r.isCorrect).length;
    const accuracy =
      this.exerciseResults.length > 0 ? (correctCount / this.exerciseResults.length) * 100 : 0;
    const averageTime =
      this.exerciseResults.length > 0
        ? this.exerciseResults.reduce((sum, r) => sum + r.timeSpentMs, 0) /
          this.exerciseResults.length
        : 0;

    return {
      totalExercises: this.exerciseResults.length,
      correctAnswers: correctCount,
      accuracy: Math.round(accuracy),
      totalScore: this.gameState.cumulativeScore,
      bestStreak: this.gameState.bestStreak,
      averageTimeMs: Math.round(averageTime),
      lastUpdated: new Date().toISOString()
    };
  }
}
