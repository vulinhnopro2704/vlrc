'use client';

import Icons from '@/components/Icons';
import { CourseGrid } from './CourseGrid';
import { FlashcardViewer } from './FlashcardViewer';
import { StatsCard } from './StatsCard';
import { Leaderboard } from './Leaderboard';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const mockCourses: LearningManagement.Course[] = [
  {
    id: 1,
    title: 'Daily Vocabulary',
    description: 'Build your vocabulary with 50 essential words per day',
    icon: '📘',
    progress: 65,
    lessons: [
      {
        id: 101,
        title: 'Common Verbs',
        wordCount: 20,
        completed: true,
        words: [
          {
            id: 1001,
            word: 'Perseverance',
            meaning: 'Persistence, perseverance',
            pronunciation: 'pɜːsɪvɪərəns',
            example: 'Her perseverance led to success',
            cefr: 'B1'
          },
          {
            id: 1002,
            word: 'Serendipity',
            meaning: 'Finding good things by luck',
            pronunciation: 'serəndɪpɪti',
            example: 'It was serendipity to meet her at the cafe',
            cefr: 'B2'
          },
          {
            id: 1003,
            word: 'Eloquent',
            meaning: 'Speaking fluently and persuasively',
            pronunciation: 'eləkwənt',
            example: 'The speaker gave an eloquent speech',
            cefr: 'B2'
          }
        ]
      },
      {
        id: 102,
        title: 'Advanced Adjectives',
        wordCount: 25,
        completed: false,
        words: [
          {
            id: 1004,
            word: 'Diligent',
            meaning: 'Showing careful effort in work',
            pronunciation: 'dɪlɪdʒənt',
            example: 'The diligent student finished all homework',
            cefr: 'B1'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Business English',
    description: 'Professional vocabulary for workplace communication',
    icon: '💼',
    progress: 40,
    lessons: [
      {
        id: 201,
        title: 'Meeting Vocabulary',
        wordCount: 30,
        completed: false,
        words: []
      }
    ]
  }
];

const mockLeaderboard = [
  { rank: 1, name: 'Nguyen Linh', points: 2850, streak: 45, avatar: '👑' },
  { rank: 2, name: 'Tran Minh', points: 2720, streak: 38, avatar: '🥈' },
  { rank: 3, name: 'Hoang Nam', points: 2650, streak: 42, avatar: '🥉' },
  { rank: 4, name: 'You', points: 1890, streak: 12, avatar: '😊' },
  { rank: 5, name: 'Lan Phuong', points: 1750, streak: 25, avatar: '📚' }
];

const DashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectedCourse = mockCourses[0] ?? null;
  const [selectedLesson, setSelectedLesson] = useState<LearningManagement.Lesson | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const handleSelectLesson = (lesson: LearningManagement.Lesson) => {
    setSelectedLesson(lesson);
  };

  useGSAP(
    () => {
      // Animate stats cards on load
      const statsCards = mainContentRef.current?.querySelectorAll('[class*="stats-card"]');
      statsCards?.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1 }
        );
      });

      // Animate main content sections on scroll
      const sections = dashboardRef.current?.querySelectorAll('[class*="content-section"]');
      sections?.forEach(section => {
        gsap.fromTo(
          section,
          { opacity: 0.8 },
          {
            opacity: 1,
            duration: 0.4,
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 0.5
            }
          }
        );
      });
    },
    { scope: dashboardRef }
  );

  return (
    <div ref={dashboardRef} className='w-full px-4 py-6 sm:px-6 lg:px-8'>
      <div ref={mainContentRef} className='space-y-6'>
        <div className='rounded-2xl border bg-card/50 p-4 sm:p-5'>
          <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate({ to: '/' })}
              className='h-auto p-0 text-primary hover:bg-transparent'>
              <Icons.ChevronLeft className='h-4 w-4 mr-1' />
              {t('header_home')}
            </Button>
            <span>/</span>
            <span className='font-medium text-foreground'>{t('learning_dashboard')}</span>
            {selectedCourse && (
              <>
                <span>/</span>
                <span className='font-medium text-foreground'>{selectedCourse.title}</span>
              </>
            )}
            {selectedLesson && (
              <>
                <span>/</span>
                <span className='font-medium text-foreground'>{selectedLesson.title}</span>
              </>
            )}
          </div>

          <div className='mt-4 flex flex-wrap gap-2'>
            <Button size='sm' onClick={() => navigate({ to: '/practice' })} className='gap-2'>
              <Icons.Play className='h-4 w-4' />
              {t('dashboard_start_practice')}
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                setSelectedLesson(null);
                navigate({ to: '/courses' });
              }}>
              {t('dashboard_browse_courses')}
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 content-section'>
          <div className='stats-card'>
            <StatsCard
              icon={<Icons.Brain className='h-5 w-5' />}
              label={t('learning_memory_strength')}
              value='78'
              unit='%'
              color='primary'
            />
          </div>
          <div className='stats-card'>
            <StatsCard
              icon={<Icons.Flame className='h-5 w-5' />}
              label={t('learning_streak')}
              value='12'
              unit={t('days')}
              color='accent'
            />
          </div>
          <div className='stats-card'>
            <StatsCard
              icon={<Icons.CheckCircle2 className='h-5 w-5' />}
              label={t('words_learned_stat')}
              value='284'
              color='success'
            />
          </div>
          <div className='stats-card'>
            <StatsCard
              icon={<Icons.BarChart3 className='h-5 w-5' />}
              label={t('learning_today')}
              value='28'
              unit={t('learning_cards')}
              color='primary'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 content-section'>
          <div className='lg:col-span-2 space-y-6'>
            {selectedLesson && (
              <div className='flex items-center gap-2 text-sm text-muted-foreground mb-4'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setSelectedLesson(null)}
                  className='h-auto p-0 text-primary hover:underline hover:bg-transparent font-medium flex items-center gap-1'>
                  <Icons.ChevronLeft className='h-4 w-4' />
                  {selectedCourse?.title}
                </Button>
                <span>/</span>
                <span className='font-medium text-foreground'>{selectedLesson.title}</span>
              </div>
            )}

            {selectedLesson ? (
              <FlashcardViewer
                words={selectedLesson.words ?? []}
                lessonTitle={selectedLesson.title}
              />
            ) : (
              <CourseGrid course={selectedCourse} onSelectLesson={handleSelectLesson} />
            )}
          </div>

          <Leaderboard users={mockLeaderboard} currentUserRank={4} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
