import {
  useDictionarySearchQuery,
  useSaveWordFromDictionaryMutation
} from '@/api/dictionary-management';
import Icons from '@/components/Icons';
import { NotebookTabState } from './NotebookTabState';

const MOCHI_AUDIO_BASE_URL = 'https://mochien-server.mochidemy.com/audios/question/';

export const DictionaryLookupTab: FC = () => {
  const { t } = useTranslation();
  const [word, setWord] = useState('');
  const [searchedWord, setSearchedWord] = useState('');
  const [savingWord, setSavingWord] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'dictionary' | 'ielts'>('dictionary');

  const handleSearch = useCallback(() => {
    setSearchedWord(word.trim());
  }, [word]);

  useEffect(() => {
    setActiveSubTab('dictionary');
  }, [searchedWord]);

  const dictionaryQuery = useDictionarySearchQuery({ word: searchedWord });
  const saveMutation = useSaveWordFromDictionaryMutation();

  const entries = (get(dictionaryQuery.data, 'data', []) as DictionaryManagement.Entry[]) ?? [];
  const ieltsItems =
    (get(dictionaryQuery.data, 'dataIelts', []) as DictionaryManagement.IeltsReference[]) ?? [];
  const normalizedKeyword = searchedWord.trim().toLowerCase();
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

  const buildAudioUrl = useCallback((audioPath?: string | null) => {
    const value = (audioPath || '').trim();
    if (!value) {
      return '';
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    const normalizedPath = value.startsWith('/') ? value.slice(1) : value;

    return `${MOCHI_AUDIO_BASE_URL}/${normalizedPath}`;
  }, []);

  const handlePlayAudio = useCallback((audioUrl: string) => {
    if (!audioUrl) {
      return;
    }
    const audio = new Audio(audioUrl);
    void audio.play().catch(() => undefined);
  }, []);

  const errorDetail =
    (dictionaryQuery.error instanceof Error
      ? dictionaryQuery.error.message
      : get(dictionaryQuery.error, 'message')) || '';
  const searchErrorMessage = errorDetail
    ? `${t('dictionary_search_error')}: ${errorDetail}`
    : t('dictionary_search_error');

  const handleSave = (
    entry: DictionaryManagement.Entry,
    detail: DictionaryManagement.WordDetail,
    detailIndex: number
  ) => {
    const savingKey = `${entry.id}-${entry.position || 'unknown'}-${detailIndex}`;

    setSavingWord(savingKey);
    const audioUs = buildAudioUrl(entry.audioUs);
    const audioUk = buildAudioUrl(entry.audioUk);

    saveMutation.mutate(
      {
        word: entry.content,
        definition: detail.definition || detail.definitionGpt || '',
        cefrLevel: detail.cefrLevel || undefined,
        translation: detail.trans || undefined,
        definitionGpt: detail.definitionGpt || undefined,
        phoneticUs: entry.phoneticUs || undefined,
        phoneticUk: entry.phoneticUk || undefined,
        audioUs: audioUs || undefined,
        audioUk: audioUk || undefined,
        phonetic: entry.phoneticUs || entry.phoneticUk || undefined,
        audio: audioUs || audioUk || undefined,
        example: get(detail, 'sentenceAudio[0].key') || undefined,
        exampleTranslation: get(detail, 'sentenceAudio[0].trans') || undefined,
        partOfSpeech: entry.position || undefined,
        examples: map(detail.sentenceAudio ?? [], (item, index) => ({
          example: item.key,
          exampleVi: item.trans || undefined,
          exampleAudio: buildAudioUrl(item.audio) || undefined,
          order: index
        }))
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
      <div className='rounded-2xl border bg-card/50 p-3.5 sm:p-5'>
        <div className='space-y-2'>
          <label className='text-xs font-medium sm:text-sm'>{t('dictionary_search_label')}</label>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <Input
              placeholder={t('dictionary_search_placeholder')}
              value={word}
              onChange={event => setWord(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button type='button' className='h-10 gap-2 sm:w-auto' onClick={handleSearch}>
              <Icons.Search className='h-4 w-4' />
              {t('dictionary_search_action')}
            </Button>
          </div>
        </div>
      </div>

      <NotebookTabState
        isLoading={dictionaryQuery.isLoading}
        isError={dictionaryQuery.isError}
        isEmpty={
          !dictionaryQuery.isLoading &&
          !dictionaryQuery.isError &&
          !!searchedWord &&
          size(entries) === 0 &&
          size(ieltsItems) === 0
        }
        loadingText={t('dictionary_loading')}
        errorMessage={searchErrorMessage}
        emptyText={t('dictionary_empty')}
      />

      {!searchedWord && (
        <Card className='p-6'>
          <p className='text-center text-sm text-muted-foreground'>{t('dictionary_hint')}</p>
        </Card>
      )}

      {!dictionaryQuery.isLoading &&
        !dictionaryQuery.isError &&
        !!searchedWord &&
        (size(entries) > 0 || size(ieltsItems) > 0) && (
          <div className='space-y-4'>
            <div className='overflow-x-auto pb-1'>
              <div className='inline-flex min-w-max rounded-xl border bg-card/50 p-1'>
                <Button
                  type='button'
                  variant='ghost'
                  className={cn(
                    'h-8 shrink-0 gap-2 rounded-lg px-2.5 text-xs sm:h-9 sm:px-3 sm:text-sm',
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
                    'h-8 shrink-0 gap-2 rounded-lg px-2.5 text-xs sm:h-9 sm:px-3 sm:text-sm',
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
                  const usAudioUrl = buildAudioUrl(entry.audioUs);
                  const ukAudioUrl = buildAudioUrl(entry.audioUk);

                  return (
                    <Card key={entryKey} className='border-border/70'>
                      <CardHeader className='space-y-3 pb-4'>
                        <div className='space-y-2'>
                          <div className='space-y-2'>
                            <div className='flex flex-wrap items-center gap-2'>
                              <CardTitle className='text-lg sm:text-xl'>{entry.content}</CardTitle>
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
                              {ukAudioUrl && (
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  className='h-8 gap-1.5'
                                  onClick={() => handlePlayAudio(ukAudioUrl)}
                                  title='Anh-Anh (UK)'>
                                  <Icons.Volume2 className='h-3.5 w-3.5' />
                                  UK
                                </Button>
                              )}
                              {usAudioUrl && (
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  className='h-8 gap-1.5'
                                  onClick={() => handlePlayAudio(usAudioUrl)}
                                  title='Anh-My (US)'>
                                  <Icons.Volume2 className='h-3.5 w-3.5' />
                                  US
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className='space-y-3 sm:space-y-4'>
                        {map(entry.words, (detail, detailIndex) => {
                          const examples = detail.sentenceAudio ?? [];
                          const detailTitle = `${t('dictionary_sense_label')} ${detailIndex + 1}`;
                          const displayCefr = detail.cefrLevel
                            ? detail.cefrLevel.toUpperCase()
                            : t('dictionary_cefr_unknown');

                          return (
                            <div
                              key={`${entryKey}-${detailIndex}`}
                              className='space-y-3 rounded-xl border bg-muted/20 p-3 sm:p-4'>
                              <div className='flex flex-wrap items-center gap-2'>
                                <h4 className='text-sm font-semibold'>{detailTitle}</h4>
                                <Badge variant='secondary'>{displayCefr}</Badge>
                                <Button
                                  type='button'
                                  className='h-8 gap-1.5 ml-auto'
                                  size='sm'
                                  variant='outline'
                                  disabled={
                                    saveMutation.isPending &&
                                    savingWord ===
                                      `${entry.id}-${entry.position || 'unknown'}-${detailIndex}`
                                  }
                                  onClick={() => handleSave(entry, detail, detailIndex)}>
                                  {saveMutation.isPending &&
                                  savingWord ===
                                    `${entry.id}-${entry.position || 'unknown'}-${detailIndex}` ? (
                                    <Icons.LoaderCircleIcon className='h-4 w-4 animate-spin' />
                                  ) : (
                                    <Icons.Plus className='h-4 w-4' />
                                  )}
                                  {t('dictionary_save_word')}
                                </Button>
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
