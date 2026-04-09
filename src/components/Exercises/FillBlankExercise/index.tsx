'use client';

import Icons from '@/components/Icons';

export default function FillBlankExercise({
  vocabulary: { id, example = '', word, pronunciation, meaning },
  onComplete
}: {
  vocabulary: LearningManagement.Word;
  onComplete?: (result: LearningManagement.ActivityResult) => void;
}) {
  const { t } = useTranslation();
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());

  const handleSubmit = () => {
    if (feedback !== 'idle') return;

    const isCorrect = userInput.toLowerCase().trim() === word.toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    const currentAttempts = attempts + 1;
    setAttempts(currentAttempts);

    onComplete?.({
      wordId: id,
      activityType: 'fill-blank',
      isCorrect,
      timeSpent: Date.now() - startTime,
      attempts: currentAttempts,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-4 sm:gap-6'>
      <div className='glass-card rounded-2xl p-4 sm:p-8'>
        <div className='mb-6 sm:mb-8'>
          <p className='mb-3 text-center text-xs text-muted-foreground sm:mb-4 sm:text-sm'>
            {t('fill_in_the_blank_with_correct_word')}
          </p>
          <div className='text-center text-base leading-relaxed sm:text-lg'>
            <p className='mb-4 sm:mb-6'>{example.replace(new RegExp(word, 'i'), ' _____ ')}</p>
            <div className='bg-primary/10 rounded-lg p-4 mb-4'>
              <p className='mb-2 text-xs text-muted-foreground sm:text-sm'>{t('hint')}</p>
              <p className='text-sm font-medium sm:text-base'>/{pronunciation}/</p>
            </div>
          </div>
        </div>

        <Input
          type='text'
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={t('type_the_missing_word')}
          className='mb-4 h-11 text-sm'
        />

        {feedback === 'correct' && (
          <div className='p-3 rounded-lg bg-green-500/20 text-green-700 dark:text-green-400 flex items-center gap-2'>
            <Icons.CheckCircle2 className='h-5 w-5' />
            {t('correct_answer', { word })}
          </div>
        )}
        {feedback === 'incorrect' && (
          <div className='p-3 rounded-lg bg-red-500/20 text-red-700 dark:text-red-400 flex items-center gap-2'>
            <Icons.X className='h-5 w-5' />
            {t('incorrect_answer')}
          </div>
        )}
        <Button
          variant='accent'
          onClick={handleSubmit}
          disabled={!userInput || feedback !== 'idle'}
          className='mt-4 h-10 w-full'>
          {t('check_answer')}
        </Button>
      </div>

      <div className='text-center text-xs text-muted-foreground sm:text-sm'>
        <p>{t('attempts', { count: attempts })}</p>
        <p className='text-xs'>{t('meaning', { meaning })}</p>
      </div>
    </div>
  );
}
