'use client';

import { useWordsQuery } from '@/api/word-management';
import { Modal } from './Modal';
import Icons from '@/components/Icons';
import { useLessonQuery } from '@/api/lesson-management';

export const LessonWordsModal = ({ id, open, onCancel }: App.ModalProps) => {
  const { t } = useTranslation();
  const { data: lesson, isLoading: isLessonLoading } = useLessonQuery(id as number);
  const {
    data: wordsResponse,
    isLoading: isWordsLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useWordsQuery({
    lessonId: id as number,
    sortBy: 'word',
    sortOrder: 'asc',
    take: 20
  });

  const words = (get(wordsResponse, 'data', []) as LearningManagement.Word[]) ?? [];

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={t('lesson_review_modal_title', { title: get(lesson, 'title') })}
      description={t('lesson_review_modal_description', { count: size(words) })}
      width={820}>
      {isLessonLoading || isWordsLoading || isFetching ? (
        <div className='flex items-center justify-center py-12 text-muted-foreground'>
          <Icons.LoaderCircleIcon className='mr-2 h-4 w-4 animate-spin' />
          {t('lesson_review_loading_words')}
        </div>
      ) : null}

      {isError ? (
        <div className='rounded-lg border border-destructive/30 bg-destructive/5 p-4'>
          <p className='text-sm text-destructive'>
            {`${t('mutation_error_create', { entity: t('entity_word') })}: ${(error as Error).message}`}
          </p>
          <Button variant='outline' size='sm' className='mt-3' onClick={() => refetch()}>
            {t('lesson_retry_submit')}
          </Button>
        </div>
      ) : null}

      {!isLessonLoading && !isWordsLoading && !isError && size(words) === 0 ? (
        <p className='text-sm text-muted-foreground'>{t('lesson_review_empty_words')}</p>
      ) : null}

      {!isLessonLoading && !isWordsLoading && !isError && size(words) > 0 ? (
        <div className='space-y-3'>
          {map(words, word => (
            <div key={word.id ?? word.word} className='rounded-lg border bg-card/40 p-4'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <h4 className='text-base font-semibold'>{word.word}</h4>
                {word.cefr ? (
                  <span className='rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
                    {word.cefr}
                  </span>
                ) : null}
              </div>
              {word.pronunciation ? (
                <p className='mt-1 text-sm text-muted-foreground'>/{word.pronunciation}/</p>
              ) : null}
              {word.meaning ? <p className='mt-2 text-sm'>{word.meaning}</p> : null}
              {word.example ? (
                <p className='mt-2 text-sm text-muted-foreground italic'>"{word.example}"</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </Modal>
  );
};

export default LessonWordsModal;
