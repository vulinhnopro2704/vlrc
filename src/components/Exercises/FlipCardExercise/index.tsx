'use client';

import { FlipCard } from '@/components/FlipCard';

export default function FlipCardExercise({
  vocabulary,
  onComplete
}: {
  vocabulary: LearningManagement.Word;
  onComplete?: (result: LearningManagement.ActivityResult) => void;
}) {
  const { t } = useTranslation();
  const [startTime] = useState(Date.now());

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
        flipOnClick
        direction='horizontal'
        animation={{ duration: 700, easing: 'ease' }}>
        <FlipCard.Front className='bg-gradient-to-br from-primary/90 to-primary/70 dark:from-primary/80 dark:to-primary/60 rounded-2xl p-12 min-h-96 flex flex-col items-center justify-center border border-primary/40'>
          <div className='text-center space-y-6'>
            <div>
              <p className='text-sm text-primary-foreground/80 mb-4'>
                {t('learning_pronunciation')}
              </p>
              <p className='text-5xl font-bold text-primary-foreground mb-4'>{vocabulary.word}</p>
              <p className='text-xl text-primary-foreground/90 font-medium italic'>
                /{vocabulary.pronunciation}/
              </p>
            </div>
            <p className='text-primary-foreground/70 text-sm'>{t('learning_flip_to_reveal')}</p>
          </div>
        </FlipCard.Front>

        <FlipCard.Back className='bg-gradient-to-br from-accent/90 to-accent/70 dark:from-accent/80 dark:to-accent/60 rounded-2xl p-12 min-h-96 flex flex-col items-center justify-center border border-accent/40'>
          <div className='space-y-6 text-left w-full'>
            <div>
              <p className='text-sm text-accent-foreground/80 mb-3'>Meaning:</p>
              <p className='text-2xl font-semibold text-accent-foreground'>{vocabulary.meaning}</p>
            </div>
            <div>
              <p className='text-sm text-accent-foreground/80 mb-3'>{t('learning_example')}:</p>
              <p className='text-base italic text-accent-foreground/90'>{vocabulary.example}</p>
            </div>
            <div className='flex gap-2 items-center'>
              <Badge variant='secondary'>{vocabulary.cefr}</Badge>
            </div>
          </div>
        </FlipCard.Back>
      </FlipCard.Root>

      <Button onClick={handleComplete}>{t('learning_continue')}</Button>
    </div>
  );
}
