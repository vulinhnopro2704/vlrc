'use client';

import Icons from '@/components/Icons';

interface FillBlankExerciseProps {
  vocabulary: LearningManagement.Word;
  onComplete?: (result: LearningManagement.ActivityResult) => void;
}

export default function FillBlankExercise({ vocabulary, onComplete }: FillBlankExerciseProps) {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());

  const handleSubmit = () => {
    const isCorrect = userInput.toLowerCase().trim() === vocabulary.word.toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setAttempts(attempts + 1);

    if (isCorrect && onComplete) {
      setTimeout(() => {
        onComplete({
          wordId: vocabulary.id,
          activityType: 'fill-blank',
          isCorrect: true,
          timeSpent: Date.now() - startTime,
          attempts,
          timestamp: new Date().toISOString()
        });
      }, 1500);
    }
  };

  return (
    <div className='w-full max-w-2xl mx-auto flex flex-col gap-6'>
      <div className='glass-card rounded-2xl p-8'>
        <div className='mb-8'>
          <p className='text-sm text-muted-foreground mb-4 text-center'>
            Fill in the blank with the correct word
          </p>
          <div className='text-lg leading-relaxed text-center'>
            <p className='mb-6'>
              {vocabulary.example?.replace(new RegExp(vocabulary.word, 'i'), ' _____ ')}
            </p>
            <div className='bg-primary/10 rounded-lg p-4 mb-4'>
              <p className='text-sm text-muted-foreground mb-2'>Hint:</p>
              <p className='text-base font-medium'>/{vocabulary.pronunciation}/</p>
            </div>
          </div>
        </div>

        <Input
          type='text'
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder='Type the missing word...'
          className='mb-4'
        />

        {feedback === 'correct' && (
          <div className='p-3 rounded-lg bg-green-500/20 text-green-700 dark:text-green-400 flex items-center gap-2'>
            <Icons.CheckCircle2 className='h-5 w-5' />
            Correct! The answer is: {vocabulary.word}
          </div>
        )}
        {feedback === 'incorrect' && (
          <div className='p-3 rounded-lg bg-red-500/20 text-red-700 dark:text-red-400 flex items-center gap-2'>
            <Icons.X className='h-5 w-5' />
            Incorrect. Try again!
          </div>
        )}

        <Button
          variant='accent'
          onClick={handleSubmit}
          disabled={!userInput || feedback === 'correct'}
          className='w-full mt-4'>
          Check Answer
        </Button>
      </div>

      <div className='text-center text-sm text-muted-foreground'>
        <p>Attempts: {attempts}</p>
        <p className='text-xs'>Meaning: {vocabulary.meaning}</p>
      </div>
    </div>
  );
}
