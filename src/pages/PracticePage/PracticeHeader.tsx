/**
 * PracticeHeader Component
 * Displays game stats: score, streak, lives, progress
 * Pure UI component
 */

import Icons from '@/components/Icons';

interface PracticeHeaderProps {
  gameState: ReturnType<typeof import('@/hooks/practice/useGameState').useGameState>;
  session: ReturnType<typeof import('@/hooks/practice/usePracticeSession').usePracticeSession>;
}

const PracticeHeader: React.FC<PracticeHeaderProps> = ({ gameState, session }) => {
  const { t } = useTranslation();

  const score = gameState.getScore();
  const streak = gameState.getStreak();
  const lives = gameState.getLives();
  const progress = gameState.getProgress();

  return (
    <header className='bg-card border-b sticky top-0 z-10'>
      <div className='container mx-auto px-4 py-4 max-w-3xl'>
        {/* Progress Bar */}
        <div className='mb-6'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm font-medium text-foreground'>
              {session.currentWordIndex + 1} / {session.totalWords}
            </span>
            <span className='text-sm text-muted-foreground'>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className='h-2' />
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-3 gap-4'>
          {/* Score */}
          <div className='flex items-center gap-3 p-3 bg-primary/10 rounded-lg'>
            <Icons.Star className='w-5 h-5 text-primary' />
            <div>
              <p className='text-xs text-muted-foreground'>{t('exercise_score')}</p>
              <p className='text-xl font-bold text-foreground'>{score}</p>
            </div>
          </div>

          {/* Streak */}
          <div className='flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg'>
            <Icons.Flame className='w-5 h-5 text-orange-500' />
            <div>
              <p className='text-xs text-muted-foreground'>{t('exercise_streak')}</p>
              <p className='text-xl font-bold text-orange-600'>{streak}</p>
            </div>
          </div>

          {/* Lives */}
          <div className='flex items-center gap-3 p-3 bg-red-500/10 rounded-lg'>
            <Icons.Heart className='w-5 h-5 text-red-500' />
            <div>
              <p className='text-xs text-muted-foreground'>{t('exercise_lives')}</p>
              <p className='text-xl font-bold text-red-600'>{Math.max(0, lives)}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PracticeHeader;
