'use client';

import { useMyNotesQuery } from '@/api/vocabulary-management';
import Icons from '@/components/Icons';
import { useModalState } from '@/hooks/use-modal-state';
import { CreateWordModal } from '@/modals/CreateWordModal';
import { CreateLessonModal } from '@/modals/CreateLessonModal';
import { CreateCourseModal } from '@/modals/CreateCourseModal';

export const UserNotebookPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLElement>(null);
  const [search, setSearch] = useState<string>('');
  const [level, setLevel] = useState<string>('all');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [editingWordId, setEditingWordId] = useState<App.ID | undefined>(undefined);

  const { modal, openModal, closeModal } = useModalState([
    'createWord',
    'createLesson',
    'createCourse'
  ]);

  // Debounced search
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSetSearch(search);
  }, [search, debouncedSetSearch]);

  // Fetch notes
  const {
    data: notesResponse,
    isLoading,
    isError,
    error
  } = useMyNotesQuery({
    search: debouncedSearch || undefined,
    cefr: level !== 'all' ? level : undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    take: 50
  });

  const notes = (get(notesResponse, 'data', []) as Vocabulary.Note[]) ?? [];

  // GSAP animation
  useGSAP(
    () => {
      if (isLoading) {
        return;
      }

      const container = get(pageRef, 'current');
      if (!container) {
        return;
      }

      const cards = container.querySelectorAll('.note-card');
      if (cards.length === 0) {
        return;
      }

      gsap.fromTo(cards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 });
    },
    {
      scope: pageRef,
      dependencies: [isLoading, notes.length, debouncedSearch, level],
      revertOnUpdate: true
    }
  );

  return (
    <main ref={pageRef} className='w-full bg-background px-4 py-6 sm:px-6 lg:px-8'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='rounded-2xl border bg-card/50 p-4 sm:p-5'>
          <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate({ to: '/dashboard' })}
              className='h-auto p-0 text-primary hover:bg-transparent'>
              <Icons.ChevronLeft className='h-4 w-4 mr-1' />
              {t('learning_dashboard')}
            </Button>
            <span>/</span>
            <span className='font-medium text-foreground'>{t('notebook_title')}</span>
          </div>
          <h1 className='mt-3 text-3xl font-bold'>{t('notebook_title')}</h1>
          <p className='text-muted-foreground'>{t('notebook_description')}</p>
        </div>

        {/* Controls */}
        <div className='rounded-2xl border bg-card/50 p-4 sm:p-5 space-y-4'>
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

          <div className='flex flex-col gap-2 sm:flex-row'>
            <Button
              onClick={() => {
                setEditingWordId(undefined);
                openModal('createWord');
              }}
              className='flex-1 sm:flex-initial gap-2'>
              <Icons.Plus className='h-4 w-4' />
              {t('notebook_create_word')}
            </Button>
            <Button
              onClick={() => openModal('createLesson')}
              variant='outline'
              className='flex-1 sm:flex-initial gap-2'>
              <Icons.Plus className='h-4 w-4' />
              {t('notebook_create_lesson')}
            </Button>
            <Button
              onClick={() => openModal('createCourse')}
              variant='outline'
              className='flex-1 sm:flex-initial gap-2'>
              <Icons.Plus className='h-4 w-4' />
              {t('notebook_create_course')}
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <div className='space-y-4'>
          {isLoading && (
            <div className='flex items-center justify-center py-12 text-muted-foreground'>
              <Icons.LoaderCircleIcon className='mr-2 h-4 w-4 animate-spin' />
              {t('notebook_loading')}
            </div>
          )}

          {isError && (
            <Card className='p-6 border border-destructive/30 bg-destructive/5'>
              <p className='text-sm text-destructive'>
                {`${t('error_loading_notes')}: ${(error as Error).message}`}
              </p>
            </Card>
          )}

          {!isLoading && !isError && size(notes) === 0 && (
            <Card className='p-6'>
              <p className='text-sm text-muted-foreground text-center'>{t('notebook_empty')}</p>
            </Card>
          )}

          {!isLoading && !isError && size(notes) > 0 && (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {map(notes, note => (
                <div
                  key={note.id}
                  className='note-card rounded-lg border bg-card/40 p-4 transition-colors'>
                  {/* Word & Level */}
                  <div className='flex items-start justify-between gap-2 mb-3'>
                    <div className='flex-1'>
                      <h3 className='text-lg font-semibold text-foreground transition-colors'>
                        {get(note, 'word.word', 'N/A')}
                      </h3>
                      {get(note, 'word.cefr') && (
                        <span className='inline-block mt-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
                          {get(note, 'word.cefr')}
                        </span>
                      )}
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      onClick={event => {
                        event.stopPropagation();
                        setEditingWordId(get(note, 'word.id'));
                        openModal('createWord');
                      }}>
                      <Icons.PenTool className='h-4 w-4' />
                    </Button>
                  </div>

                  {/* Meaning */}
                  {get(note, 'word.meaning') && (
                    <p className='text-sm text-muted-foreground mb-3 line-clamp-2'>
                      {get(note, 'word.meaning')}
                    </p>
                  )}

                  {/* Example */}
                  {get(note, 'word.example') && (
                    <p className='text-xs text-muted-foreground italic mb-3 line-clamp-2 border-l-2 border-primary/30 pl-2'>
                      "{get(note, 'word.example')}"
                    </p>
                  )}

                  {/* Lesson */}
                  {get(note, 'lesson') && (
                    <div className='text-xs text-muted-foreground mb-3 flex items-center gap-1'>
                      <Icons.BookOpen className='h-3 w-3' />
                      {get(note, 'lesson.title', 'N/A')}
                    </div>
                  )}

                  {/* Created Date */}
                  <div className='text-xs text-muted-foreground flex items-center gap-1 pt-3 border-t border-border/30'>
                    <Icons.Calendar className='h-3 w-3' />
                    {new Date(get(note, 'createdAt', new Date())).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Modals */}
      {modal.createWord.load && (
        <CreateWordModal
          id={editingWordId}
          open={modal.createWord.open}
          onCancel={() => {
            setEditingWordId(undefined);
            closeModal('createWord');
          }}
        />
      )}
      {modal.createLesson.load && (
        <CreateLessonModal
          open={modal.createLesson.open}
          onCancel={() => closeModal('createLesson')}
        />
      )}
      {modal.createCourse.load && (
        <CreateCourseModal
          open={modal.createCourse.open}
          onCancel={() => closeModal('createCourse')}
        />
      )}
    </main>
  );
};
