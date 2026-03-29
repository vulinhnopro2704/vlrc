'use client';

import useAudioSynthesis from '@/hooks/useAudioSynthesis';
import Icons from '@/components/Icons';

export default function ListenAndFillExercise({
  vocabulary,
  onComplete
}: {
  vocabulary: LearningManagement.Word;
  onComplete?: (result: LearningManagement.ActivityResult) => void;
}) {
  const { t } = useTranslation();
  const { speak, isPlaying } = useAudioSynthesis();
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    speak(vocabulary.word, { lang: 'en-US', rate: 0.8 });
  }, [vocabulary, speak]);

  const handleSubmit = () => {
    const isCorrect = userInput.toLowerCase().trim() === vocabulary.word.toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    const currentAttempts = attempts + 1;
    setAttempts(currentAttempts);

    if (isCorrect && onComplete) {
      setTimeout(() => {
        onComplete({
          wordId: vocabulary.id,
          activityType: 'listen-fill',
          isCorrect: true,
          timeSpent: Date.now() - startTime,
          attempts: currentAttempts,
          timestamp: new Date().toISOString()
        });
      }, 1500);
    }
  };

  return (
    <div className='w-full max-w-2xl mx-auto flex flex-col gap-6'>
      <div className='glass-card rounded-2xl p-8'>
        <div className='text-center mb-8'>
          <p className='text-sm text-muted-foreground mb-4'>
            {t('listen_to_pronunciation_and_fill_in_the_blank')}
          </p>
          <Button
            onClick={() => speak(vocabulary.word, { lang: 'en-US', rate: 0.8 })}
            disabled={isPlaying}>
            <Icons.Volume2 className='h-5 w-5' />
            {isPlaying ? t('playing') : t('play_sound')}
          </Button>
        </div>

        <Input
          type='text'
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={t('type_the_word_here')}
          className='mb-4'
        />

        {feedback === 'correct' && (
          <div className='p-3 rounded-lg bg-green-500/20 text-green-700 dark:text-green-400 flex items-center gap-2'>
            <Icons.CheckCircle2 className='h-5 w-5' />
            {t('correct')}
          </div>
        )}
        {feedback === 'incorrect' && (
          <div className='p-3 rounded-lg bg-red-500/20 text-red-700 dark:text-red-400 flex items-center gap-2'>
            <Icons.X className='h-5 w-5' />
            Try again! The word is: {vocabulary.word}
          </div>
        )}

        <Button
          variant='accent'
          onClick={handleSubmit}
          disabled={!userInput || feedback === 'correct'}
          className='w-full mt-4'>
          {t('check_answer')}
        </Button>
      </div>

      <div className='text-center text-sm text-muted-foreground'>
        <p>{t('attempts', { count: attempts })}</p>
        <p className='text-xs'>{t('cefr_level', { level: vocabulary.cefr })}</p>
      </div>
    </div>
  );
}
