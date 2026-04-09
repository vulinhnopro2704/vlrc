import {
  useDictionarySearchQuery,
  useSaveWordFromDictionaryMutation
} from '@/api/dictionary-management';
import Icons from '@/components/Icons';

const MOCHI_AUDIO_BASE_URL = 'https://mochien-server.mochidemy.com/audios/question/';
const MAX_SELECTION_LENGTH = 80;
const DESKTOP_MEDIA_QUERY = '(hover: hover) and (pointer: fine)';
const TRIGGER_SIZE = 36;
const VIEWPORT_PADDING = 12;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const normalizeSelectedText = (value: string) => value.replace(/\s+/g, ' ').trim();

const buildAudioUrl = (audioPath?: string | null) => {
  const value = (audioPath || '').trim();
  if (!value) {
    return '';
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedPath = value.startsWith('/') ? value.slice(1) : value;
  return `${MOCHI_AUDIO_BASE_URL}/${normalizedPath}`;
};

const getSelectionElement = (selection: Selection) => {
  const anchorNode = selection.anchorNode;
  if (!anchorNode) {
    return null;
  }

  return anchorNode instanceof Element ? anchorNode : anchorNode.parentElement;
};

const getSelectionSnapshot = () => {
  const selection = window.getSelection();

  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }

  const selectionElement = getSelectionElement(selection);
  if (
    !selectionElement ||
    selectionElement.closest(
      'input, textarea, [contenteditable="true"], [data-selection-dictionary-root="true"]'
    )
  ) {
    return null;
  }

  const selectedText = normalizeSelectedText(selection.toString());

  if (!selectedText || selectedText.length > MAX_SELECTION_LENGTH) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  if (!rect.width && !rect.height) {
    return null;
  }

  const x = clamp(
    rect.right + 8,
    VIEWPORT_PADDING,
    window.innerWidth - TRIGGER_SIZE - VIEWPORT_PADDING
  );
  const y = clamp(
    rect.top - TRIGGER_SIZE - 6,
    VIEWPORT_PADDING,
    window.innerHeight - TRIGGER_SIZE - VIEWPORT_PADDING
  );

  return {
    word: selectedText,
    x,
    y
  };
};

export const SelectionDictionaryPopover: FC = () => {
  const { t } = useTranslation();
  const [isDesktop, setIsDesktop] = useState(false);
  const [trigger, setTrigger] = useState<{ word: string; x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [lookupWord, setLookupWord] = useState('');
  const [savedWords, setSavedWords] = useState<Record<string, boolean>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const saveMutation = useSaveWordFromDictionaryMutation();
  const dictionaryQuery = useDictionarySearchQuery({ word: open ? lookupWord : '' });

  const dictionaryEntries =
    (get(dictionaryQuery.data, 'data', []) as DictionaryManagement.Entry[]) ?? [];
  const showResults = size(dictionaryEntries) > 0;

  const buildSaveKey = useCallback(
    (entry: DictionaryManagement.Entry, detailIndex: number) =>
      `${lookupWord.trim().toLowerCase()}-${entry.id}-${entry.position || 'unknown'}-${detailIndex}`,
    [lookupWord]
  );

  const updateTriggerFromSelection = useCallback(() => {
    const snapshot = getSelectionSnapshot();

    if (!snapshot) {
      if (!open) {
        setTrigger(null);
      }
      return;
    }

    setTrigger(snapshot);
  }, [open]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const syncDesktopMode = () => {
      setIsDesktop(mediaQuery.matches);
      if (!mediaQuery.matches) {
        setOpen(false);
        setLookupWord('');
        setTrigger(null);
      }
    };

    syncDesktopMode();
    mediaQuery.addEventListener('change', syncDesktopMode);

    return () => {
      mediaQuery.removeEventListener('change', syncDesktopMode);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      return;
    }

    let rafId: number | null = null;

    const scheduleSelectionUpdate = () => {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateTriggerFromSelection();
      });
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      setOpen(false);
      setLookupWord('');
      setTrigger(null);
      window.getSelection()?.removeAllRanges();
    };

    window.addEventListener('mouseup', scheduleSelectionUpdate);
    window.addEventListener('keyup', scheduleSelectionUpdate);
    window.addEventListener('resize', scheduleSelectionUpdate);
    window.addEventListener('scroll', scheduleSelectionUpdate, true);
    window.addEventListener('keydown', handleEscape);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('mouseup', scheduleSelectionUpdate);
      window.removeEventListener('keyup', scheduleSelectionUpdate);
      window.removeEventListener('resize', scheduleSelectionUpdate);
      window.removeEventListener('scroll', scheduleSelectionUpdate, true);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isDesktop, updateTriggerFromSelection]);

  const handlePlayAudio = useCallback((audioUrl: string) => {
    if (!audioUrl) {
      return;
    }

    const audio = new Audio(audioUrl);
    void audio.play().catch(() => undefined);
  }, []);

  const handleSaveWord = useCallback(
    (
      entry: DictionaryManagement.Entry,
      detail: DictionaryManagement.WordDetail,
      detailIndex: number
    ) => {
      if (!entry || !detail) {
        return;
      }

      const audioUs = buildAudioUrl(entry.audioUs);
      const audioUk = buildAudioUrl(entry.audioUk);
      const nextSavingKey = buildSaveKey(entry, detailIndex);

      setSavingKey(nextSavingKey);

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
          onSuccess: () => {
            setSavedWords(prev => ({
              ...prev,
              [nextSavingKey]: true
            }));
          },
          onSettled: () => {
            setSavingKey(null);
          }
        }
      );
    },
    [buildSaveKey, saveMutation]
  );

  if (!isDesktop || !trigger) {
    return null;
  }

  return (
    <Popover
      open={open}
      onOpenChange={nextOpen => {
        setOpen(nextOpen);

        if (!nextOpen) {
          setLookupWord('');
          setTrigger(null);
          window.getSelection()?.removeAllRanges();
        }
      }}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          size='icon'
          variant='secondary'
          aria-label={t('dictionary_selection_trigger_aria')}
          className='fixed z-50 h-9 w-9 rounded-full border bg-card/95 shadow-lg backdrop-blur-sm'
          style={{ left: trigger.x, top: trigger.y }}
          onClick={() => {
            setLookupWord(trigger.word);
            setOpen(true);
          }}>
          <Icons.Search className='h-4 w-4' />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side='bottom'
        align='start'
        sideOffset={10}
        onOpenAutoFocus={event => event.preventDefault()}
        className='w-md max-w-[min(92vw,48rem)] p-0'>
        <div data-selection-dictionary-root='true' className='relative rounded-md bg-popover p-4'>
          <div
            aria-hidden='true'
            className='absolute -top-1.5 left-6 h-3 w-3 rotate-45 border-l border-t bg-popover'
          />

          <div className='max-h-[min(70vh,32rem)] space-y-3 overflow-y-auto overscroll-contain pr-1'>
            {dictionaryQuery.isLoading && (
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Icons.LoaderCircleIcon className='h-4 w-4 animate-spin' />
                <span>{t('dictionary_selection_loading')}</span>
              </div>
            )}

            {dictionaryQuery.isError && (
              <p className='rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive'>
                {t('dictionary_selection_error')}
              </p>
            )}

            {!dictionaryQuery.isLoading && !dictionaryQuery.isError && !showResults && (
              <p className='rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground'>
                {t('dictionary_selection_empty')}
              </p>
            )}

            {showResults && (
              <div className='space-y-4'>
                {map(dictionaryEntries, entry => {
                  const entryKey = `${entry.id}-${entry.position || 'unknown'}`;
                  const usAudioUrl = buildAudioUrl(entry.audioUs);
                  const ukAudioUrl = buildAudioUrl(entry.audioUk);

                  return (
                    <div key={entryKey} className='space-y-3'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <h5 className='text-base font-semibold leading-none'>{entry.content}</h5>
                        {entry.position && (
                          <Badge variant='outline' className='text-[10px] uppercase tracking-wide'>
                            {entry.position}
                          </Badge>
                        )}
                      </div>

                      {(entry.phoneticUs || entry.phoneticUk) && (
                        <div className='flex flex-wrap gap-2 text-xs'>
                          {entry.phoneticUs && (
                            <span className='rounded-md bg-muted px-2 py-1'>{`US ${entry.phoneticUs}`}</span>
                          )}
                          {entry.phoneticUk && (
                            <span className='rounded-md bg-muted px-2 py-1'>{`UK ${entry.phoneticUk}`}</span>
                          )}
                        </div>
                      )}

                      {(ukAudioUrl || usAudioUrl) && (
                        <div className='flex flex-wrap gap-2'>
                          {ukAudioUrl && (
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              className='h-8 gap-1.5'
                              onClick={() => handlePlayAudio(ukAudioUrl)}>
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
                              onClick={() => handlePlayAudio(usAudioUrl)}>
                              <Icons.Volume2 className='h-3.5 w-3.5' />
                              US
                            </Button>
                          )}
                        </div>
                      )}

                      <div className='space-y-3'>
                        {map(entry.words || [], (detail, detailIndex) => {
                          const saveKey = buildSaveKey(entry, detailIndex);
                          const isSaved = !!savedWords[saveKey];
                          const isSaving = saveMutation.isPending && savingKey === saveKey;

                          return (
                            <div
                              key={`${entryKey}-${detailIndex}`}
                              className='space-y-2 rounded-lg border bg-background/80 p-3'>
                              <div className='flex items-center justify-between gap-2'>
                                <p className='text-xs font-medium text-muted-foreground'>
                                  {`${t('dictionary_sense_label')} ${detailIndex + 1}`}
                                </p>
                                <Button
                                  type='button'
                                  className='h-8 gap-1.5 px-3'
                                  size='sm'
                                  variant='outline'
                                  disabled={isSaving || isSaved}
                                  onClick={() => handleSaveWord(entry, detail, detailIndex)}>
                                  {isSaving ? (
                                    <Icons.LoaderCircleIcon className='h-4 w-4 animate-spin' />
                                  ) : isSaved ? (
                                    <Icons.CheckIcon className='h-4 w-4' />
                                  ) : (
                                    <Icons.Plus className='h-4 w-4' />
                                  )}
                                  {isSaved
                                    ? t('dictionary_selection_saved')
                                    : t('dictionary_save_word')}
                                </Button>
                              </div>

                              {detail.trans && <p className='text-sm leading-6'>{detail.trans}</p>}

                              {detail.definition && (
                                <p className='text-xs leading-6 text-muted-foreground'>
                                  {`${t('dictionary_definition_label')}: ${detail.definition}`}
                                </p>
                              )}

                              {detail.definitionGpt && (
                                <p className='text-xs leading-6 text-muted-foreground'>
                                  {`${t('dictionary_definition_gpt_label')}: ${detail.definitionGpt}`}
                                </p>
                              )}

                              {size(detail.sentenceAudio || []) > 0 && (
                                <div className='space-y-2 rounded-lg border bg-muted/20 p-3 text-xs'>
                                  <p className='font-medium'>
                                    {t('dictionary_selection_example_label')}
                                  </p>
                                  {map(detail.sentenceAudio || [], (sentence, sentenceIndex) => (
                                    <div
                                      key={`${entryKey}-${detailIndex}-${sentenceIndex}`}
                                      className='space-y-1'>
                                      <p className='text-sm text-foreground'>{sentence.key}</p>
                                      {sentence.trans && (
                                        <p className='text-muted-foreground'>{sentence.trans}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
