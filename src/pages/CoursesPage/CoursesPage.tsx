'use client';

import { AppLayout } from '@/components/shared';
import Icons from '@/components/Icons';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Mock data - replace with API call
const mockCourses: LearningManagement.Course[] = [
  {
    id: 1,
    title: 'Daily Vocabulary',
    description: 'Build your vocabulary with 50 essential words per day',
    icon: '📘',
    progress: 65,
    lessons: []
  },
  {
    id: 2,
    title: 'Business English',
    description: 'Professional vocabulary for workplace communication',
    icon: '💼',
    progress: 40,
    lessons: []
  }
];

const CoursesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = pageRef.current?.querySelectorAll('.course-card');
      cards?.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1 }
        );
      });
    },
    { scope: pageRef }
  );

  return (
    <AppLayout>
      <main ref={pageRef} className='w-full bg-background px-4 py-6 sm:px-6 lg:px-8'>
        <div className='space-y-6'>
          <div className='rounded-2xl border bg-card/50 p-4 sm:p-5'>
            <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => navigate({ to: '/dashboard' })}
                className='h-auto p-0 text-primary hover:bg-transparent'>
                <Icons.ChevronLeft className='h-4 w-4 mr-1' />
                Dashboard
              </Button>
              <span>/</span>
              <span className='font-medium text-foreground'>{t('learning_courses')}</span>
            </div>
            <h1 className='mt-3 text-3xl font-bold'>{t('learning_courses')}</h1>
            <p className='text-muted-foreground'>{t('learning_select_course')}</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {mockCourses.map(course => (
              <div key={course.id} className='course-card'>
                <Card className='glass-card h-full flex flex-col cursor-pointer hover:shadow-lg hover:glow-primary transition-all duration-300 hover:border-primary/50 overflow-hidden'>
                  <div className='p-6 flex-1 flex flex-col'>
                    <div className='text-4xl mb-4'>{course.icon}</div>
                    <h2 className='text-xl font-bold mb-2'>{course.title}</h2>
                    <p className='text-sm text-muted-foreground flex-1'>{course.description}</p>
                    <div className='mt-6'>
                      <div className='flex justify-between mb-2'>
                        <span className='text-xs font-semibold'>{t('learning_progress')}</span>
                        <span className='text-xs font-semibold text-primary'>
                          {course.progress ?? 0}%
                        </span>
                      </div>
                      <div className='w-full h-2 bg-primary/20 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-gradient-to-r from-primary to-accent transition-all duration-300'
                          style={{ width: `${course.progress ?? 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='p-4 border-t border-primary/20'>
                    <Button
                      className='w-full'
                      onClick={() =>
                        navigate({
                          to: '/courses/$courseId',
                          params: { courseId: String(course.id) }
                        })
                      }>
                      {(course.progress ?? 0) > 0
                        ? t('learning_continue')
                        : t('learning_start_course')}
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default CoursesPage;
