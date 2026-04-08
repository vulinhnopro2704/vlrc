import {
  useDictionarySearchQuery,
  useSaveWordFromDictionaryMutation
} from '@/api/dictionary-management';
import Icons from '@/components/Icons';
import { NotebookTabState } from '../components/NotebookTabState';

export const DictionaryLookupTab: FC = () => {
  const { t } = useTranslation();
  const [word, setWord] = useState('');
  const [debouncedWord, setDebouncedWord] = useState('');
  const [savingWord, setSavingWord] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'dictionary' | 'ielts'>('dictionary');

  const debouncedSetWord = useCallback(
    debounce((value: string) => {
      setDebouncedWord(value.trim());
    }, 350),
    []
  );

  useEffect(() => {
    debouncedSetWord(word);
  }, [word, debouncedSetWord]);

  useEffect(() => {
    setActiveSubTab('dictionary');
  }, [debouncedWord]);

  const dictionaryQuery = useDictionarySearchQuery({ word: debouncedWord });
  const saveMutation = useSaveWordFromDictionaryMutation();

  const entries = (get(dictionaryQuery.data, 'data', []) as DictionaryManagement.Entry[]) ?? [];
  const ieltsItems =
    (get(dictionaryQuery.data, 'dataIelts', []) as DictionaryManagement.IeltsReference[]) ?? [];
  const normalizedKeyword = debouncedWord.trim().toLowerCase();
  const highlightRegex = useMemo(() => {
    if (!normalizedKeyword) {
      return null;
    }

    const escapedKeyword = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(${escapedKeyword})`, 'gi');
  }, [normalizedKeyword]);

  const renderHighlightedText = useCallback(
    (text?: string | null) => {
      const value = text || '';
      if (!value || !highlightRegex) {
        return value;
      }

      const parts = value.split(highlightRegex);

      return map(parts, (part, index) =>
        part.toLowerCase() === normalizedKeyword ? (
          <mark key={`${part}-${index}`} className='rounded bg-amber-200/70 px-0.5 text-foreground'>
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      );
    },
    [highlightRegex, normalizedKeyword]
  );

  const errorDetail =
    (dictionaryQuery.error instanceof Error
      ? dictionaryQuery.error.message
      : get(dictionaryQuery.error, 'message')) || '';
  const searchErrorMessage = errorDetail
    ? `${t('dictionary_search_error')}: ${errorDetail}`
    : t('dictionary_search_error');

  const handleSave = (entry: DictionaryManagement.Entry) => {
    const details = get(entry, 'words[0]') as DictionaryManagement.WordDetail | undefined;
    const savingKey = `${entry.id}-${entry.position || 'unknown'}`;

    setSavingWord(savingKey);
    saveMutation.mutate(
      {
        word: entry.content,
        definition: details?.definition || details?.definitionGpt || '',
        cefrLevel: details?.cefrLevel || undefined,
        translation: details?.trans || undefined,
        phonetic: entry.phoneticUs || entry.phoneticUk || undefined,
        audio: entry.audioUs || entry.audioUk || undefined,
        example: get(details, 'sentenceAudio[0].key') || undefined,
        exampleTranslation: get(details, 'sentenceAudio[0].trans') || undefined,
        partOfSpeech: entry.position || undefined
      },
      {
        onSettled: () => {
          setSavingWord(null);
        }
      }
    );
  };

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
          size(entries) === 0 &&
          size(ieltsItems) === 0
        }
        loadingText={t('dictionary_loading')}
        errorMessage={searchErrorMessage}
        emptyText={t('dictionary_empty')}
      />

      {!debouncedWord && (
        <Card className='p-6'>
          <p className='text-center text-sm text-muted-foreground'>{t('dictionary_hint')}</p>
        </Card>
      )}

      {!dictionaryQuery.isLoading &&
        !dictionaryQuery.isError &&
        !!debouncedWord &&
        (size(entries) > 0 || size(ieltsItems) > 0) && (
          <div className='space-y-4'>
            <div className='overflow-x-auto'>
              <div className='inline-flex rounded-xl border bg-card/50 p-1'>
                <Button
                  type='button'
                  variant='ghost'
                  className={cn(
                    'h-9 gap-2 rounded-lg px-3 text-xs sm:text-sm',
                    activeSubTab === 'dictionary' && 'bg-background shadow-sm text-primary'
                  )}
                  onClick={() => setActiveSubTab('dictionary')}>
                  <Icons.BookOpen className='h-4 w-4' />
                  {t('dictionary_results_tab_dictionary')}
                  <Badge variant='secondary' className='ml-1'>
                    {size(entries)}
                  </Badge>
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  className={cn(
                    'h-9 gap-2 rounded-lg px-3 text-xs sm:text-sm',
                    activeSubTab === 'ielts' && 'bg-background shadow-sm text-primary'
                  )}
                  onClick={() => setActiveSubTab('ielts')}>
                  <Icons.FileTextIcon className='h-4 w-4' />
                  {t('dictionary_results_tab_ielts')}
                  <Badge variant='secondary' className='ml-1'>
                    {size(ieltsItems)}
                  </Badge>
                </Button>
              </div>
            </div>

            {activeSubTab === 'dictionary' && (
              <div className='space-y-4'>
                {size(entries) === 0 && (
                  <Card className='p-5'>
                    <p className='text-sm text-muted-foreground'>
                      {t('dictionary_no_dictionary_entries')}
                    </p>
                  </Card>
                )}

                {map(entries, entry => {
                  const entryKey = `${entry.id}-${entry.position || 'unknown'}`;
                  const usAudio = entry.audioUs || '';
                  const ukAudio = entry.audioUk || '';

                  return (
                    <Card key={entryKey} className='border-border/70'>
                      <CardHeader className='space-y-3 pb-4'>
                        <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                          <div className='space-y-2'>
                            <div className='flex flex-wrap items-center gap-2'>
                              <CardTitle className='text-xl'>{entry.content}</CardTitle>
                              {entry.position && (
                                <Badge variant='outline' className='text-xs uppercase'>
                                  {entry.position}
                                </Badge>
                              )}
                            </div>
                            <div className='flex flex-wrap gap-2 text-sm text-muted-foreground'>
                              {entry.phoneticUs && (
                                <span className='rounded-md bg-muted px-2 py-1'>
                                  {`US ${entry.phoneticUs}`}
                                </span>
                              )}
                              {entry.phoneticUk && (
                                <span className='rounded-md bg-muted px-2 py-1'>
                                  {`UK ${entry.phoneticUk}`}
                                </span>
                              )}
                            </div>
                            <div className='flex flex-wrap gap-2 text-xs text-muted-foreground'>
                              {usAudio && (
                                <span className='rounded-md border px-2 py-1'>
                                  {`audio_us: ${usAudio}`}
                                </span>
                              )}
                              {ukAudio && (
                                <span className='rounded-md border px-2 py-1'>
                                  {`audio_uk: ${ukAudio}`}
                                </span>
                              )}
                            </div>
                          </div>

                          <Button
                            className='gap-2 md:min-w-44'
                            variant='outline'
                            disabled={saveMutation.isPending && savingWord === entryKey}
                            onClick={() => handleSave(entry)}>
                            {saveMutation.isPending && savingWord === entryKey ? (
                              <Icons.LoaderCircleIcon className='h-4 w-4 animate-spin' />
                            ) : (
                              <Icons.Plus className='h-4 w-4' />
                            )}
                            {t('dictionary_save_word')}
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className='space-y-4'>
                        {map(entry.words, (detail, detailIndex) => {
                          const examples = detail.sentenceAudio ?? [];
                          const detailTitle = `${t('dictionary_sense_label')} ${detailIndex + 1}`;
                          const displayCefr = detail.cefrLevel
                            ? detail.cefrLevel.toUpperCase()
                            : t('dictionary_cefr_unknown');

                          return (
                            <div
                              key={`${entryKey}-${detailIndex}`}
                              className='space-y-3 rounded-xl border bg-muted/20 p-4'>
                              <div className='flex flex-wrap items-center gap-2'>
                                <h4 className='text-sm font-semibold'>{detailTitle}</h4>
                                <Badge variant='secondary'>{displayCefr}</Badge>
                              </div>

                              {detail.trans && <p className='text-sm leading-6'>{detail.trans}</p>}

                              {detail.definition && (
                                <p className='text-sm text-muted-foreground leading-6'>
                                  {`${t('dictionary_definition_label')}: ${detail.definition}`}
                                </p>
                              )}

                              {detail.definitionGpt && (
                                <p className='text-sm text-muted-foreground leading-6'>
                                  {`${t('dictionary_definition_gpt_label')}: ${detail.definitionGpt}`}
                                </p>
                              )}

                              <div className='space-y-2'>
                                <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                                  {t('dictionary_examples_label')}
                                </p>

                                {size(examples) === 0 && (
                                  <p className='text-sm text-muted-foreground'>
                                    {t('dictionary_no_examples')}
                                  </p>
                                )}

                                <div className='space-y-2'>
                                  {map(examples, (example, exampleIndex) => (
                                    <div
                                      key={`${entryKey}-${detailIndex}-${exampleIndex}`}
                                      className='rounded-lg border bg-background p-3'>
                                      <p className='text-sm font-medium leading-6'>
                                        {renderHighlightedText(example.key)}
                                      </p>
                                      {!!example.trans && (
                                        <p className='mt-1 text-sm text-muted-foreground leading-6'>
                                          {renderHighlightedText(example.trans)}
                                        </p>
                                      )}
                                      {!!example.audio && (
                                        <p className='mt-2 text-xs text-muted-foreground'>
                                          {`audio: ${example.audio}`}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {activeSubTab === 'ielts' && (
              <div className='space-y-4'>
                {size(ieltsItems) === 0 && (
                  <Card className='p-5'>
                    <p className='text-sm text-muted-foreground'>
                      {t('dictionary_no_ielts_entries')}
                    </p>
                  </Card>
                )}

                {map(ieltsItems, (item, index) => (
                  <Card key={`${item.name}-${index}`} className='border-border/70'>
                    <CardHeader className='space-y-2'>
                      <CardDescription>{item.name}</CardDescription>
                      <CardTitle className='text-lg leading-6'>
                        {renderHighlightedText(item.title)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <details open={index === 0} className='group'>
                        <summary className='cursor-pointer list-none text-sm font-medium text-primary'>
                          {t('dictionary_show_full_content')}
                        </summary>
                        <div className='mt-3 whitespace-pre-line text-sm leading-6 text-foreground/90'>
                          {renderHighlightedText(item.content)}
                        </div>
                      </details>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
};
