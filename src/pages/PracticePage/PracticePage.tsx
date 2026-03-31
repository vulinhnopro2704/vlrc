/**
 * PracticePage
 * Main practice feature orchestration component
 * Composes multiple hooks and manages data flow between systems
 */

'use client';

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
  const pageRef = useRef<HTMLDivElement>(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [answers, setAnswers] = useState<Practice.SubmitFSRSItem[]>([]);
  const hasSubmittedRef = useRef(false);

  // Fetch words from backend spaced-repetition scheduling
  const { data: reviewWords, isLoading, isError } = useFSRSDueWordsQuery({ take: 100 });
  const submitMutation = useSubmitFSRSMutation();

  const reviewRows = Array.isArray(reviewWords?.data) ? reviewWords.data : [];
  const words = reviewRows
    .map(row => row.word)
    .filter((word): word is LearningManagement.Word => Boolean(word));

  // Initialize session
  const session = usePracticeSession({
    words,
    onSessionEnd: () => setSessionEnded(true)
  });

  // Initialize game state
  const gameState = useGameState({
    totalWords: words.length,
    difficulty: 'NORMAL'
  });

  const upsertAnswer = (answer: Practice.SubmitFSRSItem) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(item => item.wordId === answer.wordId);
      const existing = existingIndex >= 0 ? prev[existingIndex] : undefined;

      const merged: Practice.SubmitFSRSItem = {
        wordId: answer.wordId,
        isCorrect: answer.isCorrect,
        exerciseType: answer.exerciseType ?? existing?.exerciseType,
        durationMs: (existing?.durationMs ?? 0) + (answer.durationMs ?? 0),
        attempts: (existing?.attempts ?? 0) + (answer.attempts ?? 1),
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

  useEffect(() => {
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

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasSubmittedRef.current || answers.length === 0) return;
      hasSubmittedRef.current = true;
      void submitMutation.mutateAsync({ items: answers });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [answers, submitMutation]);

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
    return <PracticeResults session={gameState} />;
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
    <div ref={pageRef} className='min-h-screen bg-background'>
      {/* Header with stats */}
      <PracticeHeader gameState={gameState} session={session} />

      {/* Main exercise panel */}
      <main className='container mx-auto px-4 py-8 max-w-3xl'>
        <PracticeExercisePanel
          currentWord={currentWord}
          gameState={gameState}
          session={session}
          allWords={words}
          onExerciseResult={upsertAnswer}
        />
      </main>
    </div>
  );
};

export default PracticePage;
