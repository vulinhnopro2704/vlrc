'use client';

import VocabCard from '@/components/VocabCard';
import Icons from '@/components/Icons';

export const FlashcardViewer = ({
  words,
  lessonTitle
}: {
  words: LearningManagement.Word[];
  lessonTitle: string;
}) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentWord = words[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (words.length === 0) {
    return (
      <div className='flex items-center justify-center h-96'>
        <p className='text-muted-foreground'>{t('learning_select_lesson')}</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold mb-2'>{lessonTitle}</h2>
        <p className='text-muted-foreground'>
          {currentIndex + 1} / {words.length}
        </p>
      </div>

      <VocabCard
        vocabulary={currentWord}
        width='min(90vw, 32rem)'
        height='20rem'
        className='flex justify-center'
        labels={{
          pronunciation: t('learning_pronunciation'),
          flipToReveal: t('learning_flip_to_reveal'),
          meaning: t('meaning'),
          example: t('learning_example')
        }}
      />

      <div className='flex items-center justify-between gap-4'>
        <Button
          variant='outline'
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className='rounded-lg'>
          <Icons.ChevronLeft className='h-5 w-5' />
        </Button>

        <div className='flex-1 flex gap-2'>
          <Button variant='ghost' className='flex-1 rounded-lg'>
            <Icons.Undo2 className='h-4 w-4 mr-2' />
            Forgot
          </Button>
          <Button variant='ghost' className='flex-1 rounded-lg'>
            <Icons.Clock className='h-4 w-4 mr-2' />
            Hard
          </Button>
          <Button variant='default' className='flex-1 rounded-lg'>
            <Icons.CheckCircle2 className='h-4 w-4 mr-2' />
            Good
          </Button>
        </div>

        <Button
          variant='outline'
          onClick={handleNext}
          disabled={currentIndex === words.length - 1}
          className='rounded-lg'>
          <Icons.ChevronRight className='h-5 w-5' />
        </Button>
      </div>
    </div>
  );
};
