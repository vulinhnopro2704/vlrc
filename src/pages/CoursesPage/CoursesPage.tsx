'use client';

import { useCoursesQuery } from '@/api/course-management';
import { AppLayout } from '@/components/shared';
import Icons from '@/components/Icons';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CoursesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError, error } = useCoursesQuery({
    sortBy: 'order',
    sortOrder: 'asc',
    take: 50
  });

  const courses = get(data, 'data', []) as LearningManagement.Course[];

  const getCourseProgressPercent = (course: LearningManagement.Course) => {
    if (typeof course.progress === 'number') {
      return course.progress;
    }

    const completed = get(
      course,
      'progress.completedLessons',
      get(course, 'completedLessons', 0)
    ) as number;
    const total = get(
      course,
      'progress.totalLessons',
      get(course, 'totalLessons', get(course, '_count.lessons', 0))
    ) as number;
    if (total <= 0) {
      return 0;
    }

    return Math.round((completed / total) * 100);
  };

  useGSAP(
    () => {
      const container = get(pageRef, 'current');
      if (!container) {
        return;
      }

      const cards = container.querySelectorAll('.course-card');
      forEach(cards, (card, index) => {
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
            {isLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className='h-[260px] animate-pulse border bg-card/40' />
              ))}

            {isError && (
              <Card className='col-span-full p-6'>
                <p className='text-sm text-destructive'>
                  {`${t('mutation_error_create', { entity: t('entity_course') })}: ${(error as Error).message}`}
                </p>
              </Card>
            )}

            {!isLoading && !isError && size(courses) === 0 && (
              <Card className='col-span-full p-6'>
                <p className='text-sm text-muted-foreground'>{t('learning_select_course')}</p>
              </Card>
            )}

            {map(courses, course =>
              (() => {
                const progressPercent = getCourseProgressPercent(course);
                const hasStarted =
                  typeof course.progress === 'number'
                    ? progressPercent > 0
                    : (get(course, 'progress.isStarted', progressPercent > 0) as boolean);

                return (
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
                              {progressPercent}%
                            </span>
                          </div>
                          <div className='w-full h-2 bg-primary/20 rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-gradient-to-r from-primary to-accent transition-all duration-300'
                              style={{ width: `${progressPercent}%` }}
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
                          {hasStarted ? t('learning_continue') : t('learning_start_course')}
                        </Button>
                      </div>
                    </Card>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default CoursesPage;
