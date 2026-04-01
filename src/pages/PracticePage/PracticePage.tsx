/**
 * PracticePage
 * Main practice feature orchestration component
 * Composes multiple hooks and manages data flow between systems
 */

'use client';

import { useMount, useUnmount, useUpdateEffect } from 'ahooks';
import { useNavigate } from '@tanstack/react-router';
import { useFSRSDueWordsQuery, useSubmitFSRSMutation } from '@/api/practice-management';
import { usePracticeSession } from '@/hooks/practice/usePracticeSession';
import { useGameState } from '@/hooks/practice/useGameState';
import PracticeHeader from './PracticeHeader';
import PracticeExercisePanel from './PracticeExercisePanel';
import PracticeResults from './PracticeResults';

const PracticePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sessionEnded, setSessionEnded] = useState(false);
  const [answers, setAnswers] = useState<Practice.SubmitFSRSItem[]>([]);
  const [sessionWords, setSessionWords] = useState<LearningManagement.Word[]>([]);
  const hasSubmittedRef = useRef(false);
  const answersRef = useRef<Practice.SubmitFSRSItem[]>([]);
  const shouldAutoSubmitRef = useRef(false);
  const beforeUnloadHandlerRef = useRef<(event: BeforeUnloadEvent) => void>(() => {});
  const pageHideHandlerRef = useRef<() => void>(() => {});
  const beforeUnloadListenerRef = useRef<(event: BeforeUnloadEvent) => void>(() => {});
  const pageHideListenerRef = useRef<() => void>(() => {});

  // Fetch words from backend spaced-repetition scheduling
  const { data: reviewWords, isLoading, isError } = useFSRSDueWordsQuery();
  const submitMutation = useSubmitFSRSMutation();

  const reviewRows = Array.isArray(reviewWords?.data) ? reviewWords.data : [];
  const words = reviewRows
    .map(row => row.word)
    .filter((word): word is LearningManagement.Word => Boolean(word));
  const stableWords = sessionWords.length > 0 ? sessionWords : words;
  const wordsById = new Map(stableWords.map(word => [Number(word.id), word]));

  useUpdateEffect(() => {
    if (sessionWords.length === 0 && words.length > 0) {
      setSessionWords(words);
    }
  }, [words, sessionWords.length]);

  // Initialize session
  const session = usePracticeSession({
    words: stableWords,
    onSessionEnd: () => setSessionEnded(true)
  });

  // Initialize game state
  const gameState = useGameState({
    totalWords: stableWords.length,
    difficulty: 'NORMAL'
  });

  const canSubmitPending = () =>
    !hasSubmittedRef.current && answersRef.current.length > 0 && !shouldAutoSubmitRef.current;

  const submitPendingWithKeepalive = () => {
    if (!canSubmitPending()) return;
    hasSubmittedRef.current = true;

    const baseUrl = import.meta.env.VITE_BACKEND_API_URL as string | undefined;
    const endpoint = baseUrl ? `${baseUrl.replace(/\/$/, '')}/practice/fsrs` : '/practice/fsrs';

    void fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ items: answersRef.current })
    });
  };

  const upsertAnswer = (answer: Practice.SubmitFSRSItem) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(item => item.wordId === answer.wordId);
      const existing = existingIndex >= 0 ? prev[existingIndex] : undefined;
      const safeAttempts = Math.max(1, answer.attempts ?? 1);

      const merged: Practice.SubmitFSRSItem = {
        wordId: answer.wordId,
        isCorrect: answer.isCorrect,
        exerciseType: answer.exerciseType ?? existing?.exerciseType,
        durationMs: (existing?.durationMs ?? 0) + (answer.durationMs ?? 0),
        attempts: (existing?.attempts ?? 0) + safeAttempts,
        hadWrong: (existing?.hadWrong ?? false) || Boolean(answer.hadWrong)
      };

      if (existingIndex >= 0) {
        const next = [...prev];
        next.splice(existingIndex, 1, merged);
        return next;
      }

      return [...prev, merged];
    });
  };

  const shouldAutoSubmit = sessionEnded || gameState.gameState.hasEnded;

  const reviewResultItems = answers.map(answer => {
    const matchedWord = wordsById.get(answer.wordId);
    return {
      wordId: answer.wordId,
      word: matchedWord?.word ?? `#${answer.wordId}`,
      meaningVi: matchedWord?.meaningVi ?? matchedWord?.meaning ?? '-',
      example: matchedWord?.exampleVi ?? matchedWord?.example ?? '',
      isCorrect: answer.isCorrect,
      attempts: Math.max(1, answer.attempts ?? 1)
    };
  });

  useUpdateEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useUpdateEffect(() => {
    shouldAutoSubmitRef.current = shouldAutoSubmit;
  }, [shouldAutoSubmit]);

  useUpdateEffect(() => {
    if (!shouldAutoSubmit || answers.length === 0 || hasSubmittedRef.current) return;

    const submitResults = async () => {
      try {
        hasSubmittedRef.current = true;
        await submitMutation.mutateAsync({ items: answers });
      } catch (error) {
        console.error('Failed to submit practice results on session-end', error);
      }
    };

    void submitResults();
  }, [shouldAutoSubmit, answers, submitMutation]);

  beforeUnloadHandlerRef.current = (event: BeforeUnloadEvent) => {
    if (!canSubmitPending()) return;
    event.preventDefault();
    event.returnValue = '';
  };

  pageHideHandlerRef.current = () => {
    submitPendingWithKeepalive();
  };

  useMount(() => {
    beforeUnloadListenerRef.current = (event: BeforeUnloadEvent) => {
      beforeUnloadHandlerRef.current(event);
    };

    pageHideListenerRef.current = () => {
      pageHideHandlerRef.current();
    };

    window.addEventListener('beforeunload', beforeUnloadListenerRef.current);
    window.addEventListener('pagehide', pageHideListenerRef.current);
  });

  useUnmount(() => {
    window.removeEventListener('beforeunload', beforeUnloadListenerRef.current);
    window.removeEventListener('pagehide', pageHideListenerRef.current);
  });

  const handleExitPractice = () => {
    const shouldExit = window.confirm(t('practice_exit_confirm'));
    if (!shouldExit) return;

    submitPendingWithKeepalive();
    navigate({ to: '/dashboard' });
  };

  const { currentWord } = session;

  if (isError) {
    return (
      <div className='flex items-center justify-center min-h-screen p-4'>
        <div className='text-center space-y-4'>
          <h1 className='text-2xl font-bold text-foreground'>{t('practice_error_title')}</h1>
          <p className='text-muted-foreground'>{t('practice_error_message')}</p>
          <Button onClick={() => navigate({ to: '/dashboard' })}>{t('action_back')}</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <p className='text-muted-foreground'>{t('common_loading')}</p>
        </div>
      </div>
    );
  }

  if (sessionEnded || gameState.gameState.hasEnded) {
    return <PracticeResults session={gameState} reviewItems={reviewResultItems} />;
  }

  if (!currentWord) {
    return (
      <div className='flex items-center justify-center min-h-screen p-4'>
        <div className='text-center space-y-4'>
          <p className='text-muted-foreground'>{t('practice_no_words')}</p>
          <Button variant='outline' onClick={() => navigate({ to: '/dashboard' })}>
            {t('action_back')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header with stats */}
      <PracticeHeader gameState={gameState} session={session} onExit={handleExitPractice} />

      {/* Main exercise panel */}
      <main className='container mx-auto px-4 py-8 max-w-3xl'>
        <PracticeExercisePanel
          currentWord={currentWord}
          gameState={gameState}
          session={session}
          allWords={stableWords}
          onExerciseResult={upsertAnswer}
        />
      </main>
    </div>
  );
};

export default PracticePage;
