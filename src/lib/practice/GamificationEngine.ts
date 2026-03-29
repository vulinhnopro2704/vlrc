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
  initializeStreakState,
  StreakState,
} from './streakSystem';
import { PRACTICE_CONFIG, DifficultyLevel } from './practiceConfig';

/**
 * GamificationEngine manages all game mechanics independently from UI/exercises
 * All methods are pure - they take state and return new state
 */
export class GamificationEngine {
  private gameState: Practice.GameState;
  private difficultyLevel: DifficultyLevel = 'NORMAL';
  private exerciseResults: Practice.ExerciseResult[] = [];
  private streakState: StreakState;

  constructor(totalWords: number, difficulty: DifficultyLevel = 'NORMAL') {
    this.difficultyLevel = difficulty;
    const livesCount = Math.ceil(
      PRACTICE_CONFIG.INITIAL_LIVES *
        PRACTICE_CONFIG.DIFFICULTY_LEVELS[this.difficultyLevel].livesMultiplier
    );
    this.streakState = initializeStreakState(livesCount);
    this.gameState = this.initializeGameState(totalWords);
  }

  private initializeGameState(totalWords: number): Practice.GameState {
    return {
      currentWordIndex: 0,
      totalWords,
      cumulativeScore: 0,
      currentStreak: 0,
      bestStreak: 0,
      livesRemaining: this.streakState.livesRemaining,
      exercisesCompleted: [],
      hasEnded: false,
    };
  }

  /**
   * Record an exercise result and update game state
   */
  public recordResult(result: Omit<Practice.ExerciseResult, 'streakAtTime' | 'timestamp'>): void {
    // Update streak state based on correctness
    this.streakState = updateStreak(this.streakState, result.isCorrect);

    if (!result.isCorrect) {
      this.streakState = updateLives(this.streakState);
    }

    // Update best streak if current is higher
    this.streakState = updateBestStreak(this.streakState);

    // Create exercise result with streak and timestamp
    const completeResult: Practice.ExerciseResult = {
      ...result,
      streakAtTime: this.gameState.currentStreak,
      timestamp: new Date().toISOString(),
    };

    this.exerciseResults.push(completeResult);

    // Update game state
    const scoreCalc = calculateTotalScore(
      result.isCorrect,
      result.timeSpentMs,
      result.attempts,
      this.gameState.currentStreak
    );

    const difficultyModifier =
      PRACTICE_CONFIG.DIFFICULTY_LEVELS[this.difficultyLevel].scoreMultiplier;
    const finalScore = applyDifficultyModifier(scoreCalc, difficultyModifier);

    this.gameState = {
      ...this.gameState,
      cumulativeScore: this.gameState.cumulativeScore + finalScore,
      currentStreak: this.streakState.currentStreak,
      bestStreak: this.streakState.bestStreak,
      livesRemaining: this.streakState.livesRemaining,
      exercisesCompleted: [...this.gameState.exercisesCompleted, completeResult],
      currentWordIndex: this.gameState.currentWordIndex + 1,
      hasEnded: shouldGameEnd(this.streakState) || this.gameState.currentWordIndex >= this.gameState.totalWords,
    };
  }

  /**
   * Get current game state snapshot
   */
  public getGameState(): Readonly<Practice.GameState> {
    return Object.freeze({ ...this.gameState });
  }

  /**
   * Get current score
   */
  public getScore(): number {
    return this.gameState.cumulativeScore;
  }

  /**
   * Get current streak
   */
  public getStreak(): number {
    return this.gameState.currentStreak;
  }

  /**
   * Get remaining lives
   */
  public getLives(): number {
    return this.gameState.livesRemaining;
  }

  /**
   * Check if game has ended
   */
  public hasGameEnded(): boolean {
    return this.gameState.hasEnded;
  }

  /**
   * Get best streak achieved
   */
  public getBestStreak(): number {
    return this.gameState.bestStreak;
  }

  /**
   * Check if milestone achieved
   */
  public isMilestoneAchieved(): boolean {
    return checkMilestone(this.gameState.currentStreak);
  }

  /**
   * Get progress percentage
   */
  public getProgress(): number {
    return (this.gameState.currentWordIndex / this.gameState.totalWords) * 100;
  }

  /**
   * Get all exercise results
   */
  public getResults(): readonly Practice.ExerciseResult[] {
    return Object.freeze([...this.exerciseResults]);
  }
}
