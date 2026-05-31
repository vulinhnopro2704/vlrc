import { useLessonsQuery } from '@/api/lesson-management';
import { useWordsQuery } from '@/api/word-management';
import { NotebookTabState } from './NotebookTabState';
import { NotebookWordCard } from './NotebookWordCard';

export const UserCreatedWordsTab: FC<{
  onEditWord: (id?: App.ID) => void;
}> = ({ onEditWord }) => {
  const { t } = useTranslation();
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');

  const lessonsQuery = useLessonsQuery({
    createdByMe: true,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    take: 100
  });

  const lessons = useMemo(() => {
    return (get(lessonsQuery.data, 'data', []) as LearningManagement.Lesson[]) ?? [];
  }, [lessonsQuery.data]);

  useEffect(() => {
    if (!selectedLessonId && size(lessons) > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedLessonId(String(lessons[0]?.id ?? ''));
    }
  }, [lessons, selectedLessonId]);

  const lessonId = selectedLessonId ? Number(selectedLessonId) : -1;
  const wordsQuery = useWordsQuery({
    lessonId,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    take: 100
  });

  const words = (get(wordsQuery.data, 'data', []) as LearningManagement.Word[]) ?? [];
  const selectedLessonTitle =
    lessons.find(item => Number(item.id) === lessonId)?.title ?? t('notebook_unknown_lesson');
  const mergedError = lessonsQuery.error ?? wordsQuery.error;
  const errorDetail =
    (mergedError instanceof Error ? mergedError.message : get(mergedError, 'message')) || '';
  const errorMessage = errorDetail
    ? `${t('error_loading_notes')}: ${errorDetail}`
    : t('error_loading_notes');

  return (
    <div className='space-y-4'>
      <div className='rounded-2xl border bg-card/50 p-3.5 sm:p-5'>
        <div className='space-y-2'>
          <label className='text-xs font-medium sm:text-sm'>{t('notebook_filter_lesson')}</label>
          <Select
            value={selectedLessonId}
            onChange={val => val && setSelectedLessonId(val)}
            options={map(lessons, lesson => ({
              value: String(lesson.id ?? ''),
              label: lesson.title ?? ''
            }))}
            placeholder={t('notebook_filter_lesson_placeholder')}
            isClearable={false}
            isSearchable={true}
            className='w-full md:w-72'
          />
        </div>
      </div>

      <NotebookTabState
        isLoading={lessonsQuery.isLoading || wordsQuery.isLoading}
        isError={lessonsQuery.isError || wordsQuery.isError}
        isEmpty={!lessonsQuery.isLoading && !lessonsQuery.isError && size(lessons) === 0}
        loadingText={t('notebook_loading')}
        errorMessage={errorMessage}
        emptyText={t('notebook_empty_user_words')}
      />

      {!lessonsQuery.isLoading && !lessonsQuery.isError && size(lessons) > 0 && (
        <>
          <NotebookTabState
            isLoading={wordsQuery.isLoading}
            isError={wordsQuery.isError}
            isEmpty={!wordsQuery.isLoading && !wordsQuery.isError && size(words) === 0}
            loadingText={t('notebook_loading')}
            errorMessage={errorMessage}
            emptyText={t('notebook_empty_user_words')}
          />

          {!wordsQuery.isLoading && !wordsQuery.isError && size(words) > 0 && (
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {map(words, word => (
                <NotebookWordCard
                  key={word.id}
                  word={word}
                  lessonTitle={selectedLessonTitle}
                  createdAt={word.createdAt}
                  onEdit={() => onEditWord(word.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
