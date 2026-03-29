/**
 * useGameState Hook
 * Wraps GamificationEngine, provides game state to components
 * This is the bridge between pure GamificationEngine and React components
 */

import { useState, useCallback, useRef } from 'react';
import { GamificationEngine } from '@/lib/practice/GamificationEngine';
import { DifficultyLevel } from '@/lib/practice/practiceConfig';

interface UseGameStateProps {
  totalWords: number;
  difficulty?: DifficultyLevel;
}

interface UseGameStateReturn {
  gameState: Practice.GameState;
  recordResult: (result: Omit<Practice.ExerciseResult, 'streakAtTime' | 'timestamp'>) => void;
  getScore: () => number;
  getStreak: () => number;
  getBestStreak: () => number;
  getLives: () => number;
  hasEnded: () => boolean;
  getProgress: () => number;
  reset: () => void;
}

export const useGameState = (props: UseGameStateProps): UseGameStateReturn => {
  const { totalWords, difficulty = 'NORMAL' } = props;
  const engineRef = useRef<GamificationEngine | null>(null);
  const [gameState, setGameState] = useState<Practice.GameState>(() => {
    engineRef.current = new GamificationEngine(totalWords, difficulty);
    return engineRef.current.getGameState();
  });

  const recordResult = useCallback(
    (result: Omit<Practice.ExerciseResult, 'streakAtTime' | 'timestamp'>) => {
      if (!engineRef.current) return;

      try {
        const updatedState = engineRef.current.recordResult(result);
        setGameState({ ...updatedState });
      } catch (error) {
        console.error('Error recording result:', error);
      }
    },
    []
  );

  const getScore = useCallback(() => {
    return engineRef.current?.getScore() ?? 0;
  }, []);

  const getStreak = useCallback(() => {
    return engineRef.current?.getStreak() ?? 0;
  }, []);

  const getBestStreak = useCallback(() => {
    return engineRef.current?.getBestStreak() ?? 0;
  }, []);

  const getLives = useCallback(() => {
    return engineRef.current?.getLives() ?? 0;
  }, []);

  const hasEnded = useCallback(() => {
    return engineRef.current?.hasEnded() ?? false;
  }, []);

  const getProgress = useCallback(() => {
    return engineRef.current?.getProgress() ?? 0;
  }, []);



  const reset = useCallback(() => {
    engineRef.current = new GamificationEngine(totalWords, difficulty);
    setGameState(engineRef.current.getGameState());
  }, [totalWords, difficulty]);

  return {
    gameState,
    recordResult,
    getScore,
    getStreak,
    getBestStreak,
    getLives,
    hasEnded,
    getProgress,
    reset,
  };
};
