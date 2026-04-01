import Icons from '@/components/Icons';
import { Button } from '@/components/ui/button';
import useAudioSynthesis from '@/hooks/useAudioSynthesis';
import { cn } from '@/lib/utils';
import { useMount, useUnmount, useUpdateEffect } from 'ahooks';
import { createPortal } from 'react-dom';

interface WordReviewPopoverProps {
  word: LearningManagement.Word;
  isCorrect: boolean;
  open?: boolean;
  attempts?: number;
  onNext?: () => void;
  nextLabel?: string;
  className?: string;
}

const WordReviewPopover: React.FC<WordReviewPopoverProps> = ({
  word,
  isCorrect,
  open = false,
  attempts,
  onNext,
  nextLabel,
  className
}) => {
  const { t } = useTranslation();
  const { speak, isPlaying } = useAudioSynthesis();
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragStartYRef = useRef<number | null>(null);

  const resetDrag = () => {
    dragStartYRef.current = null;
    setIsDragging(false);
    setDragY(0);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!open) return;
    dragStartYRef.current = event.clientY;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging || dragStartYRef.current === null) return;
    setDragY(Math.max(0, event.clientY - dragStartYRef.current));
  };

  const handlePointerUp = () => {
    const shouldAdvance = dragY > 96;
    resetDrag();
    if (shouldAdvance && onNext) {
      onNext();
    }
  };

  useUpdateEffect(() => {
    if (!open) {
      resetDrag();
    }
  }, [open]);

  useMount(() => {
    setMounted(true);
  });

  useUnmount(() => {
    setMounted(false);
  });

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden={!open}
      className={cn(
        'fixed inset-0 z-50 transition-all duration-300',
        open ? 'pointer-events-auto' : 'pointer-events-none'
      )}>
      <div
        className={cn(
          'absolute inset-0 bg-background/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0'
        )}
      />

      <div
        className={cn(
          'fixed bottom-0 left-1/2 w-[min(94vw,760px)] -translate-x-1/2 rounded-t-3xl border px-4 pb-5 pt-3 shadow-2xl backdrop-blur-md',
          'sm:px-6 sm:pb-6',
          isCorrect
            ? 'border-emerald-300/40 bg-emerald-50/92 text-foreground dark:border-emerald-500/35 dark:bg-emerald-950/45'
            : 'border-rose-300/45 bg-rose-50/92 text-foreground dark:border-rose-500/35 dark:bg-rose-950/45',
          open ? 'translate-y-0' : 'translate-y-full',
          isDragging ? 'transition-none' : 'transition-transform duration-300',
          className
        )}
        style={{
          transform: `translateY(${open ? dragY : 999}px)`
        }}>
        <div className='space-y-4'>
          <div className='flex justify-center'>
            <button
              type='button'
              aria-label={t('action_next')}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={resetDrag}
              className='h-6 w-24 cursor-grab active:cursor-grabbing'>
              <span className='mx-auto mt-2 block h-1.5 w-14 rounded-full bg-foreground/25' />
            </button>
          </div>

          <div className='flex items-start justify-between gap-3'>
            <div className='space-y-1'>
              <p
                className={cn(
                  'text-xs uppercase tracking-wider',
                  isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                )}>
                {isCorrect ? t('exercise_correct') : t('exercise_wrong')}
              </p>
              <p className='text-3xl font-bold leading-tight'>{word.word}</p>
              {word.pronunciation ? <p className='text-lg text-foreground/80'>/{word.pronunciation}/</p> : null}
            </div>

            <Button
              variant='outline'
              size='icon-sm'
              onClick={() => speak(word.word, { lang: 'en-US', rate: 0.85 })}
              disabled={isPlaying}
              className='rounded-full bg-background/80 backdrop-blur'>
              <Icons.Volume2 className='w-4 h-4' />
            </Button>
          </div>

          <div className='space-y-2 text-sm'>
            <p>
              <span className='font-semibold'>{t('practice_meaning_vi_label')}:</span>{' '}
              {word.meaningVi ?? word.meaning}
            </p>
            {word.meaning ? (
              <p>
                <span className='font-semibold'>Meaning:</span> {word.meaning}
              </p>
            ) : null}
            {typeof attempts === 'number' ? (
              <p>
                <span className='font-semibold'>{t('practice_attempts_label')}:</span> {attempts}
              </p>
            ) : null}
            {word.example ? (
              <p>
                <span className='font-semibold'>Example:</span> {word.example}
              </p>
            ) : null}
            {word.exampleVi ? (
              <p>
                <span className='font-semibold'>Example (VI):</span> {word.exampleVi}
              </p>
            ) : null}
          </div>

          {onNext ? (
            <Button variant='default' className='w-full' onClick={onNext}>
              {nextLabel ?? t('action_next')}
            </Button>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WordReviewPopover;
