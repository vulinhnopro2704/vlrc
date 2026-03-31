/**
 * usePracticeSession Hook
 * Manages session lifecycle and word management
 * Does NOT manage game mechanics, animation, or exercise state
 */

import { useEffect, useState } from 'react';

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
  requeueCurrentWordRandomly: () => void;
  resetSession: () => void;
  endSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
}

export const usePracticeSession = (props: UsePracticeSessionProps): UsePracticeSessionReturn => {
  const { words, onSessionEnd } = props;
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordQueue, setWordQueue] = useState<number[]>([]);
  const [sessionStatus, setSessionStatus] = useState<'loading' | 'active' | 'paused' | 'ended'>(
    'loading'
  );

  // Initialize session when words are loaded
  useEffect(() => {
    if (words && words.length > 0) {
      setWordQueue(words.map((_word, index) => index));
      setCurrentWordIndex(0);
      setSessionStatus('active');
    }
  }, [words]);

  const currentWord = wordQueue.length > 0 ? (words[wordQueue[currentWordIndex]] ?? null) : null;

  const moveToNextWord = (): boolean => {
    const nextIndex = currentWordIndex + 1;

    if (nextIndex >= wordQueue.length) {
      setSessionStatus('ended');
      onSessionEnd?.();
      return false;
    }

    setCurrentWordIndex(nextIndex);
    return true;
  };

  const requeueCurrentWordRandomly = () => {
    // Move the current word to a random position later in the queue (no duplicates)
    setWordQueue(prevQueue => {
      const current = prevQueue[currentWordIndex];
      if (current === undefined) return prevQueue;

      const nextQueue = [...prevQueue];
      nextQueue.splice(currentWordIndex, 1);

      const remaining = nextQueue.length - currentWordIndex;
      const insertionOffset = Math.floor(Math.random() * (remaining + 1));
      const insertAt = currentWordIndex + insertionOffset;

      nextQueue.splice(insertAt, 0, current);
      return nextQueue;
    });
  };

  const resetSession = () => {
    setWordQueue(words.map((_word, index) => index));
    setCurrentWordIndex(0);
    setSessionStatus('active');
  };

  const endSession = () => {
    setSessionStatus('ended');
    onSessionEnd?.();
  };

  const pauseSession = () => {
    setSessionStatus('paused');
  };

  const resumeSession = () => {
    setSessionStatus('active');
  };

  return {
    currentWord,
    allWords: words,
    currentWordIndex,
    totalWords: wordQueue.length,
    sessionStatus,
    moveToNextWord,
    requeueCurrentWordRandomly,
    resetSession,
    endSession,
    pauseSession,
    resumeSession
  };
};
