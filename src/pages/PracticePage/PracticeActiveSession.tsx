import { useSubmitFSRSMutation } from '@/api/practice-management';
import { usePracticeSession } from '@/hooks/practice/usePracticeSession';
import { useGameState } from '@/hooks/practice/useGameState';
import PracticeHeader from './PracticeHeader';
import PracticeExercisePanel from './PracticeExercisePanel';
import PracticeResults from './PracticeResults';

const PracticeActiveSession = ({
  words,
  onExit
}: {
  words: LearningManagement.Word[];
  onExit: () => void;
}) => {
  const { t } = useTranslation();
  const [sessionEnded, setSessionEnded] = useState(false);
  const [answers, setAnswers] = useState<Practice.SubmitFSRSItem[]>([]);
  const [sessionWords, setSessionWords] = useState<LearningManagement.Word[]>(words);
  const hasSubmittedRef = useRef(false);
  const answersRef = useRef<Practice.SubmitFSRSItem[]>([]);
  const shouldAutoSubmitRef = useRef(false);
  const beforeUnloadHandlerRef = useRef<(event: BeforeUnloadEvent) => void>(() => {});
  const pageHideHandlerRef = useRef<() => void>(() => {});
  const beforeUnloadListenerRef = useRef<(event: BeforeUnloadEvent) => void>(() => {});
  const pageHideListenerRef = useRef<() => void>(() => {});

  const submitMutation = useSubmitFSRSMutation();

  const wordsById = new Map(sessionWords.map(word => [word.id, word]));

  useUpdateEffect(() => {
    if (sessionWords.length === 0 && words.length > 0) {
      setSessionWords(words);
    }
  }, [words, sessionWords.length]);

  // Initialize session
  const session = usePracticeSession({
    words: sessionWords,
    onSessionEnd: () => setSessionEnded(true)
  });

  // Initialize game state
  const gameState = useGameState({
    totalWords: sessionWords.length,
    difficulty: 'NORMAL'
  });

  const canSubmitPending = () =>
    !hasSubmittedRef.current && answersRef.current.length > 0 && !shouldAutoSubmitRef.current;

  const submitPendingWithKeepalive = () => {
    if (!canSubmitPending()) return;
    hasSubmittedRef.current = true;

    submitMutation.mutate({
      payload: { items: answersRef.current },
      options: { keepalive: true }
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
        attempts: (existing?.attempts ?? 0) + safeAttempts
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
        await submitMutation.mutateAsync({ payload: { items: answers } });
      } catch (error) {
        console.error('Failed to submit practice results on session-end', error);
      }
    };

    void submitResults();
  }, [shouldAutoSubmit, answers, submitMutation]);

  useEffect(() => {
    beforeUnloadHandlerRef.current = (event: BeforeUnloadEvent) => {
      if (!canSubmitPending()) return;
      event.preventDefault();
      event.returnValue = '';
    };

    pageHideHandlerRef.current = () => {
      submitPendingWithKeepalive();
    };
  });

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
    onExit();
  };

  const { currentWord } = session;

  if (sessionEnded || gameState.gameState.hasEnded) {
    return <PracticeResults session={gameState} reviewItems={reviewResultItems} onBack={onExit} />;
  }

  if (!currentWord) {
    return (
      <div className='flex items-center justify-center min-h-screen p-4'>
        <div className='text-center space-y-4'>
          <p className='text-muted-foreground'>{t('practice_no_words')}</p>
          <Button variant='outline' onClick={onExit}>
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
      <main className='container mx-auto max-w-3xl px-3 py-4 sm:px-4 sm:py-6 lg:py-8'>
        <PracticeExercisePanel
          currentWord={currentWord}
          gameState={gameState}
          session={session}
          allWords={sessionWords}
          onExerciseResult={upsertAnswer}
        />
      </main>
    </div>
  );
};

export default PracticeActiveSession;
