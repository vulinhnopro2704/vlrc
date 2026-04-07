'use client';

import type { ReactNode } from 'react';
import { FlipCard } from '@/components/FlipCard';
import type { AnimationConfig, FlipCardSize, FlipDirection } from '@/components/FlipCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import useAudioSynthesis from '@/hooks/useAudioSynthesis';
import Icons from '@/components/Icons';

type VocabCardLabels = {
  pronunciation: ReactNode;
  flipToReveal: ReactNode;
  meaning: ReactNode;
  example: ReactNode;
};

const defaultLabels: VocabCardLabels = {
  pronunciation: 'Pronunciation',
  flipToReveal: 'Flip to reveal',
  meaning: 'Meaning',
  example: 'Example'
};

const VocabCard = ({
  vocabulary,
  className,
  width,
  height,
  direction = 'horizontal',
  animation = { duration: 700, easing: 'ease' },
  flipOnHover = true,
  flipOnClick = true,
  showPronunciation = true,
  showExample = true,
  showLevel = true,
  labels,
  frontClassName,
  backClassName,
  frontContentClassName,
  backContentClassName,
  levelBadgeClassName
}: {
  vocabulary: LearningManagement.Word;
  className?: string;
  width?: FlipCardSize;
  height?: FlipCardSize;
  direction?: FlipDirection;
  animation?: AnimationConfig;
  flipOnHover?: boolean;
  flipOnClick?: boolean;
  showPronunciation?: boolean;
  showExample?: boolean;
  showLevel?: boolean;
  labels?: Partial<VocabCardLabels>;
  frontClassName?: string;
  backClassName?: string;
  frontContentClassName?: string;
  backContentClassName?: string;
  levelBadgeClassName?: string;
}) => {
  const mergedLabels = { ...defaultLabels, ...labels };
  const { speak, isPlaying } = useAudioSynthesis();

  return (
    <FlipCard.Root
      flipOnHover={flipOnHover}
      flipOnClick={flipOnClick}
      direction={direction}
      animation={animation}
      width={width}
      height={height}
      className={className}>
      <FlipCard.Front
        className={cn(
          'bg-linear-to-br from-primary/90 to-primary/70 dark:from-primary/80 dark:to-primary/60 rounded-xl p-12 flex flex-col items-center justify-center border border-primary/40',
          frontClassName
        )}>
        <div className={cn('text-center space-y-6', frontContentClassName)}>
          <div>
            {showPronunciation && (
              <p className='text-sm text-primary-foreground/80 mb-2'>
                {mergedLabels.pronunciation}
              </p>
            )}
            <div className='flex items-center justify-center gap-2 mb-4'>
              <p className='text-4xl font-bold text-primary-foreground'>{vocabulary.word}</p>
              <Button
                variant='ghost'
                size='icon-sm'
                onClick={e => {
                  e.stopPropagation();
                  speak(vocabulary.word, { lang: 'en-US', rate: 0.85 });
                }}
                disabled={isPlaying}
                className='text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/10 rounded-full transition-colors'>
                <Icons.Volume2 className='w-5 h-5' />
              </Button>
            </div>
            {showPronunciation && vocabulary.pronunciation && (
              <p className='text-lg text-primary-foreground/90 font-medium italic'>
                /{vocabulary.pronunciation}/
              </p>
            )}
          </div>
          <p className='text-primary-foreground/70 text-sm'>{mergedLabels.flipToReveal}</p>
        </div>
      </FlipCard.Front>

      <FlipCard.Back
        className={cn(
          'bg-linear-to-br from-accent/90 to-accent/70 dark:from-accent/80 dark:to-accent/60 rounded-xl p-12 flex flex-col items-center justify-center border border-accent/40',
          backClassName
        )}>
        <div className={cn('space-y-6 text-left w-full', backContentClassName)}>
          <div>
            <p className='text-sm text-accent-foreground/80 mb-2'>{mergedLabels.meaning}:</p>
            <p className='text-2xl font-semibold text-accent-foreground'>{vocabulary.meaning}</p>
          </div>

          {showExample && vocabulary.example && (
            <div>
              <p className='text-sm text-accent-foreground/80 mb-2'>{mergedLabels.example}:</p>
              <p className='text-base italic text-accent-foreground/90'>{vocabulary.example}</p>
            </div>
          )}

          {showLevel && vocabulary.cefr && (
            <div className='flex gap-2 items-center'>
              <Badge variant='secondary' className={cn(levelBadgeClassName)}>
                {vocabulary.cefr}
              </Badge>
            </div>
          )}
        </div>
      </FlipCard.Back>
    </FlipCard.Root>
  );
};

export default VocabCard;
