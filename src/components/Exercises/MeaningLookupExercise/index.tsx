'use client';

import { useState, useEffect } from 'react';
import Icons from '@/components/Icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function MeaningLookupExercise({
  vocabulary,
  allVocabularies,
  onComplete
}: {
  vocabulary: LearningManagement.Word;
  allVocabularies: LearningManagement.Word[];
  onComplete?: (result: LearningManagement.ActivityResult) => void;
}) {
  const [options, setOptions] = useState<LearningManagement.Word[]>([]);
  const [selected, setSelected] = useState<App.ID>();
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const wrongAnswers = allVocabularies
      .filter(w => w.id !== vocabulary.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const shuffled = [vocabulary, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setOptions(shuffled);
  }, [vocabulary, allVocabularies]);

  const handleSelect = (selectedId?: App.ID) => {
    setSelected(selectedId);
    const isCorrect = selectedId === vocabulary.id;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setAttempts(attempts + 1);

    if (isCorrect && onComplete) {
      setTimeout(() => {
        onComplete({
          wordId: vocabulary.id,
          activityType: 'meaning-lookup',
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
            Select the correct word for this meaning:
          </p>
          <div className='bg-primary/10 rounded-lg p-6 text-center'>
            <p className='text-lg font-semibold text-foreground'>{vocabulary.meaning}</p>
            <p className='text-sm text-muted-foreground mt-2'>CEFR Level: {vocabulary.cefr}</p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 mb-6'>
          {options.map(option => (
            <Button
              key={option.id}
              variant='outline'
              onClick={() => handleSelect(option.id)}
              disabled={feedback !== 'idle'}
              className={cn(
                'h-auto p-4 justify-between text-left font-medium',
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
            Correct! {vocabulary.word} means {vocabulary.meaning}
          </div>
        )}
        {feedback === 'incorrect' && (
          <div className='p-3 rounded-lg bg-red-500/20 text-red-700 dark:text-red-400'>
            <p className='flex items-center gap-2 mb-2'>
              <Icons.X className='h-5 w-5' />
              Try again!
            </p>
            <p className='text-sm'>
              The correct answer is: <span className='font-semibold'>{vocabulary.word}</span>
            </p>
          </div>
        )}
      </div>

      <div className='text-center text-sm text-muted-foreground'>
        <p>Attempts: {attempts}</p>
      </div>
    </div>
  );
}
