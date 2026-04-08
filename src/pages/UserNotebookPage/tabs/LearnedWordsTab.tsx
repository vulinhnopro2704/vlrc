import { useMyWordsQuery } from '@/api/progress-management';
import { NotebookTabState } from '../components/NotebookTabState';
import { NotebookWordCard } from '../components/NotebookWordCard';

export const LearnedWordsTab: FC<{
  onEditWord: (id?: App.ID) => void;
}> = ({ onEditWord }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const debouncedSetSearch = useCallback(
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

  return (
    <div className='space-y-4'>
      <div className='rounded-2xl border bg-card/50 p-4 sm:p-5'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div className='flex-1 space-y-2'>
            <label className='text-sm font-medium'>{t('notebook_search_placeholder')}</label>
            <Input
              placeholder={t('notebook_search_placeholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='h-10'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>{t('notebook_filter_level')}</label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className='w-full md:w-40'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('notebook_filter_all')}</SelectItem>
                <SelectItem value='A1'>A1</SelectItem>
                <SelectItem value='A2'>A2</SelectItem>
                <SelectItem value='B1'>B1</SelectItem>
                <SelectItem value='B2'>B2</SelectItem>
                <SelectItem value='C1'>C1</SelectItem>
                <SelectItem value='C2'>C2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <NotebookTabState
        isLoading={isLoading}
        isError={isError}
        isEmpty={!isLoading && !isError && size(items) === 0}
        loadingText={t('notebook_loading')}
        errorMessage={`${t('error_loading_notes')}: ${(error as Error).message}`}
        emptyText={t('notebook_empty')}
      />

      {!isLoading && !isError && size(items) > 0 && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {map(items, item => (
            <NotebookWordCard
              key={item.id}
              word={item.word}
              lessonTitle={get(item, 'word.lesson.title')}
              createdAt={item.createdAt}
              onEdit={() => onEditWord(get(item, 'word.id'))}
            />
          ))}
        </div>
      )}
    </div>
  );
};
