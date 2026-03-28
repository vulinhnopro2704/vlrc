'use client';

import { useCourseQuery } from '@/api/course-management';
import { useLessonsQuery } from '@/api/lesson-management';
import Icons from '@/components/Icons';

gsap.registerPlugin(useGSAP);

const CourseDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { courseId } = useParams({ from: '/_app/courses/$courseId' });
  const pageRef = useRef<HTMLDivElement>(null);
  const numericCourseId = Number(courseId);

  const {
    data: course,
    isLoading: isCourseLoading,
    isError: isCourseError,
    error: courseError
  } = useCourseQuery(numericCourseId);

  const {
    data: lessonsResponse,
    isLoading: isLessonsLoading,
    isError: isLessonsError,
    error: lessonsError
  } = useLessonsQuery({
    courseId: numericCourseId,
    sortBy: 'order',
    sortOrder: 'asc',
    take: 100
  });

  const lessons =
    (get(lessonsResponse, 'data', null) as LearningManagement.Lesson[] | null) ??
    (get(course, 'lessons', []) as LearningManagement.Lesson[]) ??
    [];

  useGSAP(
    () => {
      const container = get(pageRef, 'current');
      if (!container) {
        return;
      }

      const items = container.querySelectorAll('.lesson-item');
      forEach(items, (item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5, delay: index * 0.1 }
        );
      });
    },
    { scope: pageRef }
  );

  if (Number.isNaN(numericCourseId)) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <p className='text-muted-foreground'>{t('learning_select_course')}</p>
        </div>
      </div>
    );
  }

  if (isCourseLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Icons.LoaderCircleIcon className='h-6 w-6 animate-spin text-primary' />
      </div>
    );
  }

  if (isCourseError || !course) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <p className='text-muted-foreground'>
            {`${t('mutation_error_create', { entity: t('entity_course') })}: ${get(courseError, 'message', '')}`}
          </p>
        </div>
      </div>
    );
  }

  const progressPercent =
    typeof course.progress === 'number'
      ? course.progress
      : (get(
            course,
            'progress.totalLessons',
            get(course, 'totalLessons', size(lessons))
          ) as number) > 0
        ? Math.round(
            ((get(
              course,
              'progress.completedLessons',
              get(course, 'completedLessons', 0)
            ) as number) /
              (get(
                course,
                'progress.totalLessons',
                get(course, 'totalLessons', size(lessons))
              ) as number)) *
              100
          )
        : 0;

  return (
    <main ref={pageRef} className='w-full bg-background px-4 py-6 sm:px-6 lg:px-8'>
      <div className='space-y-6'>
        <div className='rounded-2xl border bg-card/50 p-4 sm:p-5'>
          <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
            <Button
              variant='ghost'
              size='sm'
              className='h-auto p-0 text-primary hover:bg-transparent'
              onClick={() => navigate({ to: '/courses' })}>
              <Icons.ChevronLeft className='h-4 w-4 mr-1' />
              {t('learning_courses')}
            </Button>
            <span>/</span>
            <span className='font-medium text-foreground'>{course.title}</span>
          </div>

          <div className='mt-4'>
            <div className='flex items-start gap-4 mb-4'>
              <span className='text-5xl'>{course.icon}</span>
              <div>
                <h1 className='text-3xl font-bold'>{course.title}</h1>
                <p className='text-muted-foreground'>{course.description}</p>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex-1 max-w-xs'>
                <div className='flex justify-between mb-2'>
                  <span className='text-sm font-semibold'>{t('learning_completion')}</span>
                  <span className='text-sm font-semibold text-primary'>{progressPercent}%</span>
                </div>
                <div className='w-full h-3 bg-primary/20 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-primary to-accent'
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <div className='text-sm text-muted-foreground'>
                {size(lessons)} {t('learning_lessons')}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className='text-2xl font-bold mb-6'>{t('learning_lessons')}</h2>

          {isLessonsLoading && (
            <Card className='p-6 mb-4'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Icons.LoaderCircleIcon className='h-4 w-4 animate-spin' />
                {t('course_detail_loading_lessons')}
              </div>
            </Card>
          )}

          {isLessonsError && (
            <Card className='p-6 mb-4'>
              <p className='text-sm text-destructive'>
                {`${t('mutation_error_create', { entity: t('entity_lesson') })}: ${(lessonsError as Error).message}`}
              </p>
            </Card>
          )}

          {!isLessonsLoading && !isLessonsError && size(lessons) === 0 && (
            <Card className='p-6 mb-4'>
              <p className='text-sm text-muted-foreground'>{t('learning_select_lesson')}</p>
            </Card>
          )}

          <div className='space-y-4'>
            {map(lessons, lesson => (
              <div key={lesson.id} className='lesson-item'>
                {(() => {
                  const isLearned = lesson.isLearned ?? lesson.completed ?? false;
                  const wordCount = get(
                    lesson,
                    '_count.words',
                    get(lesson, 'wordCount', 0)
                  ) as number;

                  return (
                    <Card className='glass-card p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 group'>
                      <div className='flex items-center justify-between gap-4'>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2 mb-2'>
                            <h3 className='text-lg font-semibold'>{lesson.title}</h3>
                            {isLearned && <Icons.CheckCircle2 className='h-5 w-5 text-accent' />}
                          </div>
                          <p className='text-sm text-muted-foreground'>
                            {wordCount} {t('learning_vocabulary')}
                          </p>
                        </div>
                        <Button
                          onClick={() =>
                            navigate({
                              to: '/lessons/$lessonId',
                              params: { lessonId: String(lesson.id) }
                            })
                          }
                          className='group-hover:shadow-lg'>
                          {t('study')}
                        </Button>
                      </div>
                    </Card>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetailPage;
