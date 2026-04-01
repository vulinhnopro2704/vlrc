/**
 * PracticeHeader Component
 * Displays game stats: score, streak, lives, progress
 * Pure UI component
 */

import Icons from '@/components/Icons';
import { Button } from '@/components/ui/button';

interface PracticeHeaderProps {
  gameState: ReturnType<typeof import('@/hooks/practice/useGameState').useGameState>;
  session: ReturnType<typeof import('@/hooks/practice/usePracticeSession').usePracticeSession>;
  onExit?: () => void;
}

const PracticeHeader: React.FC<PracticeHeaderProps> = ({ gameState, session, onExit }) => {
  const score = gameState.getScore();
  const streak = gameState.getStreak();
  const lives = gameState.getLives();
  const progress = gameState.getProgress();

  return (
    <header className='bg-card border-b sticky top-0 z-10'>
      <div className='container mx-auto px-4 py-2 max-w-3xl'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon-sm' onClick={onExit} className='shrink-0'>
            <Icons.X className='w-4 h-4' />
          </Button>
          <div className='flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1'>
            <Icons.Star className='w-4 h-4 text-primary' />
            <span className='text-sm font-semibold text-foreground'>{score}</span>
          </div>
          <div className='flex items-center gap-1 rounded-md bg-orange-500/10 px-2 py-1'>
            <Icons.Flame className='w-4 h-4 text-orange-500' />
            <span className='text-sm font-semibold text-orange-600'>{streak}</span>
          </div>
          <div className='flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1'>
            <Icons.Heart className='w-4 h-4 text-red-500' />
            <span className='text-sm font-semibold text-red-600'>{Math.max(0, lives)}</span>
          </div>
          <div className='ml-auto flex min-w-0 items-center gap-2'>
            <span className='text-xs font-medium text-muted-foreground whitespace-nowrap'>
              {session.currentWordIndex + 1}/{session.totalWords}
            </span>
            <div className='w-24 sm:w-32'>
              <Progress value={progress} className='h-1.5' />
            </div>
            <span className='text-xs text-muted-foreground whitespace-nowrap'>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PracticeHeader;
