/**
 * PracticePage
 * Main practice feature orchestration component
 * Composes multiple hooks and manages data flow between systems
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearch } from '@tanstack/react-router';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useWordsQuery } from '@/api/word-management';
import { usePracticeSession } from '@/hooks/practice/usePracticeSession';
import { useGameState } from '@/hooks/practice/useGameState';
import { useExerciseState } from '@/hooks/practice/useExerciseState';
import { useAnimationTriggers } from '@/hooks/practice/useAnimationTriggers';
import { checkGenericAnswer } from '@/lib/practice/exerciseHandlers';
import PracticeHeader from './PracticeHeader';
import PracticeExercisePanel from './PracticeExercisePanel';
import PracticeResults from './PracticeResults';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

gsap.registerPlugin(useGSAP);

interface PracticePageSearch {
  courseId?: string;
  lessonId?: string;
  difficulty?: 'EASY' | 'NORMAL' | 'HARD';
}

const PracticePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/practice' }) as PracticePageSearch;
  const pageRef = useRef<HTMLDivElement>(null);
  const [sessionEnded, setSessionEnded] = useState(false);

  // Parse lesson ID from search params
  const lessonId = searchParams.lessonId ? Number(searchParams.lessonId) : undefined;

  // Fetch words
  const { data: wordsResponse, isLoading, isError } = useWordsQuery(
    lessonId
      ? {
          lessonId,
          sortBy: 'word',
          sortOrder: 'asc',
          take: 100,
        }
      : undefined,
    { enabled: !!lessonId }
  );

  const words = Array.isArray(wordsResponse?.data) ? wordsResponse.data : [];

  // Initialize session
  const session = usePracticeSession({
    words,
    onSessionEnd: () => setSessionEnded(true),
  });

  // Initialize game state
  const gameState = useGameState({
    totalWords: words.length,
    difficulty: (searchParams.difficulty as any) || 'NORMAL',
  });

  const { currentWord } = session;

  if (isError || !lessonId) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">{t('practice.error-title')}</h1>
          <p className="text-muted-foreground">{t('practice.error-message')}</p>
          <Button onClick={() => navigate({ to: '/courses' })}>{t('action.back-to-courses')}</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (sessionEnded || gameState.gameState.hasEnded) {
    return <PracticeResults session={gameState} lessonId={lessonId} />;
  }

  if (!currentWord) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">{t('practice.no-words')}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      {/* Header with stats */}
      <PracticeHeader gameState={gameState} session={session} />

      {/* Main exercise panel */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <PracticeExercisePanel currentWord={currentWord} gameState={gameState} session={session} allWords={words} />
      </main>
    </div>
  );
};

export default PracticePage;
