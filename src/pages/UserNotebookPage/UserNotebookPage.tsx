'use client';

import { useModalState } from '@/hooks/use-modal-state';
import { CreateWordModal } from '@/modals/CreateWordModal';
import { CreateLessonModal } from '@/modals/CreateLessonModal';
import { CreateCourseModal } from '@/modals/CreateCourseModal';
import { NotebookSegmentedTabs } from './components/NotebookSegmentedTabs';
import { LearnedWordsTab } from './tabs/LearnedWordsTab';
import { UserCreatedWordsTab } from './tabs/UserCreatedWordsTab';
import { UserCreatedLessonsTab } from './tabs/UserCreatedLessonsTab';
import { UserCreatedCoursesTab } from './tabs/UserCreatedCoursesTab';
import { DictionaryLookupTab } from './tabs/DictionaryLookupTab';
import Icons from '@/components/Icons';

export const UserNotebookPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('learned_words');
  const [editingWordId, setEditingWordId] = useState<App.ID | undefined>(undefined);
  const [editingLessonId, setEditingLessonId] = useState<App.ID | undefined>(undefined);
  const [editingCourseId, setEditingCourseId] = useState<App.ID | undefined>(undefined);

  const { modal, openModal, closeModal } = useModalState([
    'createWord',
    'createLesson',
    'createCourse'
  ]);

  const tabs = [
    { id: 'learned_words', label: t('notebook_tab_learned_words') },
    { id: 'user_words', label: t('notebook_tab_user_words') },
    { id: 'user_lessons', label: t('notebook_tab_user_lessons') },
    { id: 'user_courses', label: t('notebook_tab_user_courses') },
    { id: 'dictionary', label: t('notebook_tab_dictionary') }
  ];

  const renderActiveTab = () => {
    if (activeTab === 'learned_words') {
      return <LearnedWordsTab />;
    }

    if (activeTab === 'user_words') {
      return (
        <UserCreatedWordsTab
          onEditWord={id => {
            setEditingWordId(id);
            openModal('createWord');
          }}
        />
      );
    }

    if (activeTab === 'user_lessons') {
      return (
        <UserCreatedLessonsTab
          onEditLesson={id => {
            setEditingLessonId(id);
            openModal('createLesson');
          }}
        />
      );
    }

    if (activeTab === 'user_courses') {
      return (
        <UserCreatedCoursesTab
          onEditCourse={id => {
            setEditingCourseId(id);
            openModal('createCourse');
          }}
        />
      );
    }

    return <DictionaryLookupTab />;
  };

  return (
    <main className='w-full bg-background px-3 py-4 sm:px-6 sm:py-6 lg:px-8'>
      <div className='space-y-4 sm:space-y-6'>
        <div className='glass-card rounded-2xl border bg-card/50 p-3.5 sm:p-5'>
          <div className='flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:text-sm'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate({ to: '/dashboard' })}
              className='h-auto p-0 text-xs text-primary hover:bg-transparent sm:text-sm'>
              <Icons.ChevronLeft className='h-4 w-4 mr-1' />
              {t('learning_dashboard')}
            </Button>
            <span>/</span>
            <span className='font-medium text-foreground'>{t('notebook_title')}</span>
          </div>
          <h1 className='mt-2 text-2xl font-bold sm:mt-3 sm:text-3xl'>{t('notebook_title')}</h1>
          <p className='text-sm text-muted-foreground sm:text-base'>{t('notebook_description')}</p>
        </div>

        <div className='glass-card space-y-3 rounded-2xl border bg-card/50 p-3.5 sm:space-y-4 sm:p-5'>
          <NotebookSegmentedTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <div className='grid grid-cols-1 gap-2 sm:flex sm:flex-row sm:flex-wrap'>
            <Button
              onClick={() => {
                setEditingWordId(undefined);
                openModal('createWord');
              }}
              className='h-9 gap-2 sm:flex-initial'>
              <Icons.Plus className='h-4 w-4' />
              {t('notebook_create_word')}
            </Button>
            <Button
              onClick={() => {
                setEditingLessonId(undefined);
                openModal('createLesson');
              }}
              variant='outline'
              className='h-9 gap-2 sm:flex-initial'>
              <Icons.Plus className='h-4 w-4' />
              {t('notebook_create_lesson')}
            </Button>
            <Button
              onClick={() => {
                setEditingCourseId(undefined);
                openModal('createCourse');
              }}
              variant='outline'
              className='h-9 gap-2 sm:flex-initial'>
              <Icons.Plus className='h-4 w-4' />
              {t('notebook_create_course')}
            </Button>
          </div>
        </div>

        <div className='space-y-4'>{renderActiveTab()}</div>
      </div>

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
          id={editingLessonId}
          open={modal.createLesson.open}
          onCancel={() => {
            setEditingLessonId(undefined);
            closeModal('createLesson');
          }}
        />
      )}
      {modal.createCourse.load && (
        <CreateCourseModal
          id={editingCourseId}
          open={modal.createCourse.open}
          onCancel={() => {
            setEditingCourseId(undefined);
            closeModal('createCourse');
          }}
        />
      )}
    </main>
  );
};
