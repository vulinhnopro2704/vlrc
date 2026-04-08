import {
  useDictionarySearchQuery,
  useSaveWordFromDictionaryMutation
} from '@/api/dictionary-management';
import Icons from '@/components/Icons';
import { NotebookTabState } from '../components/NotebookTabState';
import { NotebookWordCard } from '../components/NotebookWordCard';

export const DictionaryLookupTab: FC = () => {
  const { t } = useTranslation();
  const [word, setWord] = useState('');
  const [debouncedWord, setDebouncedWord] = useState('');
  const [savingWord, setSavingWord] = useState<string | null>(null);

  const debouncedSetWord = useCallback(
    debounce((value: string) => {
      setDebouncedWord(value.trim());
    }, 350),
    []
  );

  useEffect(() => {
    debouncedSetWord(word);
  }, [word, debouncedSetWord]);

  const dictionaryQuery = useDictionarySearchQuery({ word: debouncedWord });
  const saveMutation = useSaveWordFromDictionaryMutation();

  const entries = (get(dictionaryQuery.data, 'data', []) as DictionaryManagement.Entry[]) ?? [];

  const handleSave = async (entry: DictionaryManagement.Entry) => {
    const details = get(entry, 'words[0]') as DictionaryManagement.WordDetail | undefined;

    setSavingWord(entry.content);
    await saveMutation.mutateAsync({
      word: entry.content,
      definition: details?.definition || details?.definitionGpt || '',
      cefrLevel: details?.cefrLevel || undefined,
      translation: details?.trans || undefined,
      phonetic: entry.phoneticUs || entry.phoneticUk || undefined,
      audio: entry.audioUs || entry.audioUk || undefined,
      example: get(details, 'sentenceAudio[0].key') || undefined,
      exampleTranslation: get(details, 'sentenceAudio[0].trans') || undefined,
      partOfSpeech: entry.position || undefined
    });
    setSavingWord(null);
  };

  const mappedWords: Array<Partial<LearningManagement.Word>> = map(entries, entry => ({
    word: entry.content,
    meaning:
      get(entry, 'words[0].trans') ||
      get(entry, 'words[0].definition') ||
      get(entry, 'words[0].definitionGpt') ||
      '',
    example: get(entry, 'words[0].sentenceAudio[0].key') || undefined,
    cefr: get(entry, 'words[0].cefrLevel') || undefined,
    pronunciation: entry.phoneticUs || entry.phoneticUk || undefined,
    audio: entry.audioUs || entry.audioUk || undefined,
    pos: entry.position || undefined
  }));

  return (
    <div className='space-y-4'>
      <div className='rounded-2xl border bg-card/50 p-4 sm:p-5'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>{t('dictionary_search_label')}</label>
          <Input
            placeholder={t('dictionary_search_placeholder')}
            value={word}
            onChange={event => setWord(event.target.value)}
          />
        </div>
      </div>

      <NotebookTabState
        isLoading={dictionaryQuery.isLoading}
        isError={dictionaryQuery.isError}
        isEmpty={
          !dictionaryQuery.isLoading &&
          !dictionaryQuery.isError &&
          !!debouncedWord &&
          size(entries) === 0
        }
        loadingText={t('dictionary_loading')}
        errorMessage={`${t('dictionary_search_error')}: ${(dictionaryQuery.error as Error)?.message ?? ''}`}
        emptyText={t('dictionary_empty')}
      />

      {!debouncedWord && (
        <Card className='p-6'>
          <p className='text-center text-sm text-muted-foreground'>{t('dictionary_hint')}</p>
        </Card>
      )}

      {!dictionaryQuery.isLoading && !dictionaryQuery.isError && size(entries) > 0 && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {map(entries, (entry, index) => (
            <div key={`${entry.content}-${index}`} className='space-y-2'>
              <NotebookWordCard word={mappedWords[index]} />
              <Button
                className='w-full gap-2'
                variant='outline'
                disabled={saveMutation.isPending && savingWord === entry.content}
                onClick={() => handleSave(entry)}>
                {saveMutation.isPending && savingWord === entry.content ? (
                  <Icons.LoaderCircleIcon className='h-4 w-4 animate-spin' />
                ) : (
                  <Icons.Plus className='h-4 w-4' />
                )}
                {t('dictionary_save_word')}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
