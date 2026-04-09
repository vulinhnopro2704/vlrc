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
    <header className='sticky top-0 z-20 border-b bg-card/95 backdrop-blur-sm'>
      <div className='container mx-auto max-w-3xl px-3 py-2 sm:px-4'>
        <div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
          <Button variant='ghost' size='icon-sm' onClick={onExit} className='h-8 w-8 shrink-0'>
            <Icons.X className='w-4 h-4' />
          </Button>
          <div className='flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1'>
            <Icons.Star className='h-3.5 w-3.5 text-primary sm:h-4 sm:w-4' />
            <span className='text-xs font-semibold text-foreground sm:text-sm'>{score}</span>
          </div>
          <div className='flex items-center gap-1 rounded-md bg-orange-500/10 px-2 py-1'>
            <Icons.Flame className='h-3.5 w-3.5 text-orange-500 sm:h-4 sm:w-4' />
            <span className='text-xs font-semibold text-orange-600 sm:text-sm'>{streak}</span>
          </div>
          <div className='flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1'>
            <Icons.Heart className='h-3.5 w-3.5 text-red-500 sm:h-4 sm:w-4' />
            <span className='text-xs font-semibold text-red-600 sm:text-sm'>
              {Math.max(0, lives)}
            </span>
          </div>
          <div className='flex w-full min-w-0 items-center gap-2 pt-1 sm:ml-auto sm:w-auto sm:pt-0'>
            <span className='whitespace-nowrap text-[11px] font-medium text-muted-foreground sm:text-xs'>
              {session.currentWordIndex + 1}/{session.totalWords}
            </span>
            <div className='flex-1 sm:w-32 sm:flex-none'>
              <Progress value={progress} className='h-1.5' />
            </div>
            <span className='whitespace-nowrap text-[11px] text-muted-foreground sm:text-xs'>
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PracticeHeader;
