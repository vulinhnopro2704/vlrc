/**
 * usePracticeSession Hook
 * Manages session lifecycle and word management
 * Does NOT manage game mechanics, animation, or exercise state
 */

import { useState, useCallback, useEffect } from 'react';

interface UsePracticeSessionProps {
  words: LearningManagement.Word[];
  onSessionEnd?: () => void;
}

interface UsePracticeSessionReturn {
  currentWord: LearningManagement.Word | null;
  allWords: LearningManagement.Word[];
  currentWordIndex: number;
  totalWords: number;
  sessionStatus: 'loading' | 'active' | 'paused' | 'ended';
  moveToNextWord: () => boolean; // returns true if there are more words
  resetSession: () => void;
  endSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
}

export const usePracticeSession = (props: UsePracticeSessionProps): UsePracticeSessionReturn => {
  const { words, onSessionEnd } = props;
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [sessionStatus, setSessionStatus] = useState<'loading' | 'active' | 'paused' | 'ended'>('loading');

  // Initialize session when words are loaded
  useEffect(() => {
    if (words && words.length > 0) {
      setCurrentWordIndex(0);
      setSessionStatus('active');
    }
  }, [words]);

  const currentWord = words.length > 0 ? words[currentWordIndex] ?? null : null;

  const moveToNextWord = useCallback((): boolean => {
    const nextIndex = currentWordIndex + 1;

    if (nextIndex >= words.length) {
      setSessionStatus('ended');
      onSessionEnd?.();
      return false;
    }

    setCurrentWordIndex(nextIndex);
    return true;
  }, [currentWordIndex, words.length, onSessionEnd]);

  const resetSession = useCallback(() => {
    setCurrentWordIndex(0);
    setSessionStatus('active');
  }, []);

  const endSession = useCallback(() => {
    setSessionStatus('ended');
    onSessionEnd?.();
  }, [onSessionEnd]);

  const pauseSession = useCallback(() => {
    setSessionStatus('paused');
  }, []);

  const resumeSession = useCallback(() => {
    setSessionStatus('active');
  }, []);

  return {
    currentWord,
    allWords: words,
    currentWordIndex,
    totalWords: words.length,
    sessionStatus,
    moveToNextWord,
    resetSession,
    endSession,
    pauseSession,
    resumeSession,
  };
};
