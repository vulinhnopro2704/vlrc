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
  const normalizeImageUrl = (imageUrl?: string) => {
    if (!imageUrl) {
      return null;
    }

    const trimmedImageUrl = imageUrl.trim();
    if (!trimmedImageUrl) {
      return null;
    }

    if (trimmedImageUrl.startsWith('http://') || trimmedImageUrl.startsWith('https://')) {
      return trimmedImageUrl;
    }

    const absoluteUrlStartIndex = Math.max(
      trimmedImageUrl.indexOf('https://'),
      trimmedImageUrl.indexOf('http://')
    );

    if (absoluteUrlStartIndex > -1) {
      return trimmedImageUrl.slice(absoluteUrlStartIndex);
    }

    return trimmedImageUrl;
  };

  const { t } = useTranslation();
  const { speak, isPlaying } = useAudioSynthesis();
  const [startTime] = useState(Date.now());
  const [isWordAudioPlaying, setIsWordAudioPlaying] = useState(false);
  const normalizedImageUrl = normalizeImageUrl(vocabulary.image);

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
    <div className='w-full flex flex-col items-center gap-6'>
      <FlipCard.Root
        flipOnHover={false}
        flipOnClick
        direction='horizontal'
        animation={{ duration: 700, easing: 'ease' }}>
        <FlipCard.Front className='bg-linear-to-br from-primary/90 to-primary/70 dark:from-primary/80 dark:to-primary/60 rounded-2xl p-8 min-h-96 flex flex-col items-center justify-center border border-primary/40'>
          <div className='text-center space-y-5 w-full'>
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

            {normalizedImageUrl ? (
              <div className='mx-auto w-32 h-32 overflow-hidden rounded-xl border border-primary-foreground/20 bg-background/20'>
                <img
                  src={normalizedImageUrl}
                  alt={vocabulary.word}
                  className='w-full h-full object-cover'
                  loading='lazy'
                />
              </div>
            ) : null}

            <div>
              <p className='text-sm text-primary-foreground/80 mb-4'>
                {t('learning_pronunciation')}
              </p>
              <p className='text-5xl font-bold text-primary-foreground mb-4'>{vocabulary.word}</p>
              {vocabulary.pronunciation ? (
                <p className='text-xl text-primary-foreground/90 font-medium italic'>
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

            <p className='text-primary-foreground/70 text-sm'>{t('learning_flip_to_reveal')}</p>
          </div>
        </FlipCard.Front>

        <FlipCard.Back className='bg-linear-to-br from-accent/90 to-accent/70 dark:from-accent/80 dark:to-accent/60 rounded-2xl p-8 min-h-96 flex flex-col items-center justify-center border border-accent/40'>
          <div className='space-y-5 text-left w-full'>
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
              <p className='text-sm text-accent-foreground/80 mb-3'>{t('meaning')}</p>
              <p className='text-2xl font-semibold text-accent-foreground'>{vocabulary.meaning}</p>
            </div>

            {vocabulary.meaningVi ? (
              <div>
                <p className='text-sm text-accent-foreground/80 mb-3'>Meaning (VI)</p>
                <p className='text-base text-accent-foreground/95'>{vocabulary.meaningVi}</p>
              </div>
            ) : null}

            <div>
              <p className='text-sm text-accent-foreground/80 mb-3'>{t('learning_example')}:</p>
              <p className='text-base italic text-accent-foreground/90'>
                {vocabulary.example || '-'}
              </p>
            </div>

            {vocabulary.exampleVi ? (
              <div>
                <p className='text-sm text-accent-foreground/80 mb-3'>Example (VI):</p>
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

      <Button onClick={handleComplete}>{t('learning_continue')}</Button>
    </div>
  );
}
