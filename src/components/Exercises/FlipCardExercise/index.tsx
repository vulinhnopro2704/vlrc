'use client';

import { FlipCard } from '@/components/FlipCard';
import Icons from '@/components/Icons';
import useAudioSynthesis from '@/hooks/useAudioSynthesis';

export default function FlipCardExercise({
  vocabulary,
  onComplete
}: {
  vocabulary: LearningManagement.Word;
  onComplete?: (result: LearningManagement.ActivityResult) => void;
}) {
  // Image support is temporarily disabled.
  // const normalizeImageUrl = (imageUrl?: string) => {
  //   if (!imageUrl) {
  //     return null;
  //   }

  //   const trimmedImageUrl = imageUrl.trim();
  //   if (!trimmedImageUrl) {
  //     return null;
  //   }

  //   if (trimmedImageUrl.startsWith('http://') || trimmedImageUrl.startsWith('https://')) {
  //     return trimmedImageUrl;
  //   }

  //   const absoluteUrlStartIndex = Math.max(
  //     trimmedImageUrl.indexOf('https://'),
  //     trimmedImageUrl.indexOf('http://')
  //   );

  //   if (absoluteUrlStartIndex > -1) {
  //     return trimmedImageUrl.slice(absoluteUrlStartIndex);
  //   }

  //   return trimmedImageUrl;
  // };

  const { t } = useTranslation();
  const { speak, isPlaying } = useAudioSynthesis();
  const [startTime] = useState(Date.now());
  const [isWordAudioPlaying, setIsWordAudioPlaying] = useState(false);
  // const normalizedImageUrl = normalizeImageUrl(vocabulary.image);

  const handlePlayPronunciation = async () => {
    if (vocabulary.audio) {
      try {
        setIsWordAudioPlaying(true);
        const audio = new Audio(vocabulary.audio);
        await audio.play();
        audio.onended = () => setIsWordAudioPlaying(false);
        audio.onerror = () => setIsWordAudioPlaying(false);
        return;
      } catch {
        setIsWordAudioPlaying(false);
      }
    }

    speak(vocabulary.word, { lang: 'en-US', rate: 0.9 });
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        wordId: vocabulary.id,
        activityType: 'flip',
        isCorrect: true,
        timeSpent: Date.now() - startTime,
        attempts: 1,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className='flex w-full flex-col items-center gap-4 sm:gap-6'>
      <FlipCard.Root
        flipOnHover={false}
        flipOnClick
        direction='horizontal'
        animation={{ duration: 700, easing: 'ease' }}>
        <FlipCard.Front className='flex min-h-96 flex-col items-center justify-center rounded-2xl border border-primary/40 bg-linear-to-br from-primary/90 to-primary/70 p-4 dark:from-primary/80 dark:to-primary/60 sm:p-8'>
          <div className='w-full space-y-4 text-center sm:space-y-5'>
            <div className='flex justify-center'>
              <Button
                variant='secondary'
                size='icon'
                onClick={event => {
                  event.stopPropagation();
                  void handlePlayPronunciation();
                }}
                disabled={isPlaying || isWordAudioPlaying}
                aria-label={t('learning_pronunciation')}
                title={t('learning_pronunciation')}>
                {isPlaying || isWordAudioPlaying ? (
                  <Icons.LoaderCircleIcon className='h-4 w-4 animate-spin' />
                ) : (
                  <Icons.Volume2 className='h-4 w-4' />
                )}
              </Button>
            </div>

            {/* Image support is temporarily disabled.
            {normalizedImageUrl ? (
              <div className='mx-auto w-32 h-32 overflow-hidden rounded-xl border border-primary-foreground/20 bg-background/20'>
                <img
                  src={normalizedImageUrl}
                  alt={vocabulary.word}
                  className='w-full h-full object-cover'
                  loading='lazy'
                />
              </div>
            ) : null} */}

            <div>
              <p className='mb-3 text-xs text-primary-foreground/80 sm:mb-4 sm:text-sm'>
                {t('learning_pronunciation')}
              </p>
              <p className='mb-3 text-3xl font-bold text-primary-foreground sm:mb-4 sm:text-5xl'>
                {vocabulary.word}
              </p>
              {vocabulary.pronunciation ? (
                <p className='text-base font-medium italic text-primary-foreground/90 sm:text-xl'>
                  /{vocabulary.pronunciation}/
                </p>
              ) : null}
            </div>

            {vocabulary.pos || vocabulary.cefr ? (
              <div className='flex gap-2 items-center justify-center'>
                {vocabulary.pos ? <Badge variant='secondary'>{vocabulary.pos}</Badge> : null}
                {vocabulary.cefr ? <Badge variant='secondary'>{vocabulary.cefr}</Badge> : null}
              </div>
            ) : null}

            <p className='text-xs text-primary-foreground/70 sm:text-sm'>
              {t('learning_flip_to_reveal')}
            </p>
          </div>
        </FlipCard.Front>

        <FlipCard.Back className='flex min-h-96 flex-col items-center justify-center rounded-2xl border border-accent/40 bg-linear-to-br from-accent/90 to-accent/70 p-4 dark:from-accent/80 dark:to-accent/60 sm:p-8'>
          <div className='w-full space-y-4 text-left sm:space-y-5'>
            <div className='flex justify-end'>
              <Button
                variant='secondary'
                size='icon'
                onClick={event => {
                  event.stopPropagation();
                  void handlePlayPronunciation();
                }}
                disabled={isPlaying || isWordAudioPlaying}
                aria-label={t('learning_pronunciation')}
                title={t('learning_pronunciation')}>
                {isPlaying || isWordAudioPlaying ? (
                  <Icons.LoaderCircleIcon className='h-4 w-4 animate-spin' />
                ) : (
                  <Icons.Volume2 className='h-4 w-4' />
                )}
              </Button>
            </div>

            <div>
              <p className='mb-2 text-xs text-accent-foreground/80 sm:mb-3 sm:text-sm'>
                {t('meaning')}
              </p>
              <p className='text-lg font-semibold text-accent-foreground sm:text-2xl'>
                {vocabulary.meaning}
              </p>
            </div>

            {vocabulary.meaningVi ? (
              <div>
                <p className='mb-2 text-xs text-accent-foreground/80 sm:mb-3 sm:text-sm'>
                  Meaning (VI)
                </p>
                <p className='text-sm text-accent-foreground/95 sm:text-base'>
                  {vocabulary.meaningVi}
                </p>
              </div>
            ) : null}

            <div>
              <p className='mb-2 text-xs text-accent-foreground/80 sm:mb-3 sm:text-sm'>
                {t('learning_example')}:
              </p>
              <p className='text-sm italic text-accent-foreground/90 sm:text-base'>
                {vocabulary.example || '-'}
              </p>
            </div>

            {vocabulary.exampleVi ? (
              <div>
                <p className='mb-2 text-xs text-accent-foreground/80 sm:mb-3 sm:text-sm'>
                  Example (VI):
                </p>
                <p className='text-sm text-accent-foreground/95'>{vocabulary.exampleVi}</p>
              </div>
            ) : null}

            {vocabulary.pos || vocabulary.cefr ? (
              <div className='flex gap-2 items-center'>
                {vocabulary.pos ? <Badge variant='secondary'>{vocabulary.pos}</Badge> : null}
                {vocabulary.cefr ? <Badge variant='secondary'>{vocabulary.cefr}</Badge> : null}
              </div>
            ) : null}
          </div>
        </FlipCard.Back>
      </FlipCard.Root>

      <Button onClick={handleComplete} className='h-10 w-full sm:w-auto'>
        {t('learning_continue')}
      </Button>
    </div>
  );
}
