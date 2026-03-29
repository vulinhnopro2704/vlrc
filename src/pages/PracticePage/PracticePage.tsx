/**
 * PracticePage
 * Main practice feature orchestration component
 * Composes multiple hooks and manages data flow between systems
 */

'use client';

import { useNavigate } from '@tanstack/react-router';
import { useWordsToReviewQuery } from '@/api/progress-management';
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

  // Fetch words from backend spaced-repetition scheduling
  const { data: reviewWords, isLoading, isError } = useWordsToReviewQuery({ take: 100 });

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
        />
      </main>
    </div>
  );
};

export default PracticePage;
