'use client';

import { useMount, useUpdateEffect } from 'ahooks';
import Icons from '@/components/Icons';

export default function MeaningLookupExercise({
  vocabulary,
  allVocabularies,
  onComplete
}: {
  vocabulary: LearningManagement.Word;
  allVocabularies: LearningManagement.Word[];
  onComplete?: (result: LearningManagement.ActivityResult) => void;
}) {
  const { t } = useTranslation();
  const [options, setOptions] = useState<LearningManagement.Word[]>([]);
  const [selected, setSelected] = useState<App.ID>();
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());

  const buildOptions = () => {
    const wrongAnswers = allVocabularies
      .filter(w => w.id !== vocabulary.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [vocabulary, ...wrongAnswers].sort(() => Math.random() - 0.5);
  };

  useMount(() => {
    setOptions(buildOptions());
  });

  useUpdateEffect(() => {
    setOptions(buildOptions());
    setSelected(undefined);
    setFeedback('idle');
    setAttempts(0);
  }, [vocabulary, allVocabularies]);

  const handleSelect = (selectedId?: App.ID) => {
    if (feedback !== 'idle') return;

    setSelected(selectedId);
    const isCorrect = selectedId === vocabulary.id;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    const currentAttempts = attempts + 1;
    setAttempts(currentAttempts);

    onComplete?.({
      wordId: vocabulary.id,
      activityType: 'meaning-lookup',
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
            {t('select_correct_word_for_meaning')}
          </p>
          <div className='rounded-lg bg-primary/10 p-4 text-center sm:p-6'>
            <p className='text-base font-semibold text-foreground sm:text-lg'>
              {vocabulary.meaning}
            </p>
            <p className='mt-2 text-xs text-muted-foreground sm:text-sm'>
              CEFR Level: {vocabulary.cefr}
            </p>
          </div>
        </div>

        <div className='mb-6 grid grid-cols-1 gap-2.5 sm:gap-3'>
          {options.map(option => (
            <Button
              key={option.id}
              variant='outline'
              onClick={() => handleSelect(option.id)}
              disabled={feedback !== 'idle'}
              className={cn(
                'h-auto justify-between p-3.5 text-left text-sm font-medium sm:p-4 sm:text-base',
                selected === option.id &&
                  (feedback === 'correct'
                    ? 'border-green-500 bg-green-500/10 hover:bg-green-500/10'
                    : 'border-red-500 bg-red-500/10 hover:bg-red-500/10')
              )}>
              <span>{option.word}</span>
              {selected === option.id &&
                (feedback === 'correct' ? (
                  <Icons.CheckCircle2 className='h-5 w-5 text-green-500' />
                ) : (
                  <Icons.X className='h-5 w-5 text-red-500' />
                ))}
            </Button>
          ))}
        </div>

        {feedback === 'correct' && (
          <div className='p-3 rounded-lg bg-green-500/20 text-green-700 dark:text-green-400 flex items-center gap-2'>
            <Icons.CheckCircle2 className='h-5 w-5' />
            {t('correct_word_and_meaning', { word: vocabulary.word, meaning: vocabulary.meaning })}
          </div>
        )}
        {feedback === 'incorrect' && (
          <div className='p-3 rounded-lg bg-red-500/20 text-red-700 dark:text-red-400'>
            <p className='flex items-center gap-2 mb-2'>
              <Icons.X className='h-5 w-5' />
              {t('try_again')}
            </p>
            <p className='text-sm'>{t('correct_answer_is', { word: vocabulary.word })}</p>
          </div>
        )}
      </div>

      <div className='text-center text-xs text-muted-foreground sm:text-sm'>
        <p>{t('attempts', { count: attempts })}</p>
      </div>
    </div>
  );
}
