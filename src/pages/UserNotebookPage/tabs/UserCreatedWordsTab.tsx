import { useLessonsQuery } from '@/api/lesson-management';
import { useWordsQuery } from '@/api/word-management';
import { NotebookTabState } from '../components/NotebookTabState';
import { NotebookWordCard } from '../components/NotebookWordCard';

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

  const lessons = (get(lessonsQuery.data, 'data', []) as LearningManagement.Lesson[]) ?? [];

  useEffect(() => {
    if (!selectedLessonId && size(lessons) > 0) {
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

  return (
    <div className='space-y-4'>
      <div className='rounded-2xl border bg-card/50 p-4 sm:p-5'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>{t('notebook_filter_lesson')}</label>
          <Select value={selectedLessonId} onValueChange={setSelectedLessonId}>
            <SelectTrigger className='w-full md:w-72'>
              <SelectValue placeholder={t('notebook_filter_lesson_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {map(lessons, lesson => (
                <SelectItem key={String(lesson.id)} value={String(lesson.id)}>
                  {lesson.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <NotebookTabState
        isLoading={lessonsQuery.isLoading || wordsQuery.isLoading}
        isError={lessonsQuery.isError || wordsQuery.isError}
        isEmpty={!lessonsQuery.isLoading && !lessonsQuery.isError && size(lessons) === 0}
        loadingText={t('notebook_loading')}
        errorMessage={`${t('error_loading_notes')}: ${
          ((lessonsQuery.error ?? wordsQuery.error) as Error)?.message ?? ''
        }`}
        emptyText={t('notebook_empty_user_words')}
      />

      {!lessonsQuery.isLoading && !lessonsQuery.isError && size(lessons) > 0 && (
        <>
          <NotebookTabState
            isLoading={wordsQuery.isLoading}
            isError={wordsQuery.isError}
            isEmpty={!wordsQuery.isLoading && !wordsQuery.isError && size(words) === 0}
            loadingText={t('notebook_loading')}
            errorMessage={`${t('error_loading_notes')}: ${(wordsQuery.error as Error)?.message ?? ''}`}
            emptyText={t('notebook_empty_user_words')}
          />

          {!wordsQuery.isLoading && !wordsQuery.isError && size(words) > 0 && (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
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
