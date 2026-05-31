import { useMyWordsQuery } from '@/api/progress-management';
import { NotebookTabState } from './NotebookTabState';
import { NotebookWordCard } from './NotebookWordCard';

export const LearnedWordsTab: FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSetSearch(search);
  }, [search, debouncedSetSearch]);

  const { data, isLoading, isError, error } = useMyWordsQuery({
    search: debouncedSearch || undefined,
    cefr: level !== 'all' ? level : undefined,
    sortBy: 'lastReviewedAt',
    sortOrder: 'desc',
    take: 50
  });

  const items = (get(data, 'data', []) as Progress.WordProgress[]) ?? [];
  const errorDetail = (error instanceof Error ? error.message : get(error, 'message')) || '';
  const errorMessage = errorDetail
    ? `${t('error_loading_notes')}: ${errorDetail}`
    : t('error_loading_notes');

  return (
    <div className='space-y-4'>
      <div className='rounded-2xl border bg-card/50 p-3.5 sm:p-5'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div className='flex-1 space-y-2'>
            <label className='text-xs font-medium sm:text-sm'>
              {t('notebook_search_placeholder')}
            </label>
            <Input
              placeholder={t('notebook_search_placeholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='h-10 text-sm'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-xs font-medium sm:text-sm'>{t('notebook_filter_level')}</label>
            <Select
              value={level}
              onChange={val => val && setLevel(val)}
              options={[
                { value: 'all', label: t('notebook_filter_all') },
                { value: 'A1', label: 'A1' },
                { value: 'A2', label: 'A2' },
                { value: 'B1', label: 'B1' },
                { value: 'B2', label: 'B2' },
                { value: 'C1', label: 'C1' },
                { value: 'C2', label: 'C2' }
              ]}
              isClearable={false}
              isSearchable={false}
              className='w-full md:w-40'
            />
          </div>
        </div>
      </div>

      <NotebookTabState
        isLoading={isLoading}
        isError={isError}
        isEmpty={!isLoading && !isError && size(items) === 0}
        loadingText={t('notebook_loading')}
        errorMessage={errorMessage}
        emptyText={t('notebook_empty')}
      />

      {!isLoading && !isError && size(items) > 0 && (
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {map(items, item => (
            <NotebookWordCard
              key={item.id}
              word={item.word}
              lessonTitle={get(item, 'word.lesson.title')}
              createdAt={item.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
};
