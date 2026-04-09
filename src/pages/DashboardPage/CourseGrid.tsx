'use client';

import Icons from '@/components/Icons';
import { ScrollArea } from '@/components/ui/scroll-area';

export const CourseGrid = ({
  course,
  onSelectLesson,
  maxVisibleLessons = 6
}: {
  course: LearningManagement.Course | null;
  onSelectLesson: (lesson: LearningManagement.Lesson) => void;
  maxVisibleLessons?: number;
}) => {
  const { t } = useTranslation();
  const gridRef = useRef<HTMLDivElement>(null);
  const lessons = get(course, 'lessons', []) as LearningManagement.Lesson[];
  const limitedLessons = lessons.slice(0, maxVisibleLessons);

  useGSAP(
    () => {
      const container = get(gridRef, 'current');
      if (!container) {
        return;
      }

      const cards = container.querySelectorAll('.lesson-card');
      forEach(cards, (card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1 }
        );
      });
    },
    { scope: gridRef }
  );

  if (!course) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center'>
          <Icons.BookOpen className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <p className='text-muted-foreground'>{t('learning_select_course')}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={gridRef} className='space-y-3.5'>
      <div>
        <h2 className='mb-1 text-lg font-bold sm:text-xl'>{course.title}</h2>
        <p className='line-clamp-2 text-xs text-muted-foreground sm:text-sm'>
          {course.description}
        </p>
      </div>

      <ScrollArea className='max-h-96 pr-2'>
        <div className='grid grid-cols-1 gap-3 pb-1 md:grid-cols-2 lg:grid-cols-3'>
          {map(limitedLessons, lesson => (
            <div
              key={lesson.id}
              className='lesson-card group cursor-pointer'
              onClick={() => onSelectLesson(lesson)}>
              {(() => {
                const isLearned = lesson.isLearned ?? lesson.completed ?? false;
                const wordCount = get(
                  lesson,
                  '_count.words',
                  get(lesson, 'wordCount', 0)
                ) as number;

                return (
                  <Card className='glass-card h-full border-primary/20 p-3.5 transition-all duration-300 hover:border-primary/50 hover:shadow-md'>
                    <div className='mb-3 flex items-start justify-between'>
                      <div className='min-w-0 flex-1'>
                        <h3 className='mb-1 line-clamp-2 text-sm font-semibold group-hover:text-primary sm:text-base'>
                          {lesson.title}
                        </h3>
                        <p className='flex items-center gap-1 text-xs text-muted-foreground'>
                          <Icons.Brain className='h-3.5 w-3.5' />
                          {wordCount} {t('learning_vocabulary')}
                        </p>
                      </div>
                      {isLearned ? (
                        <Icons.CheckCircle2 className='ml-2 h-5 w-5 shrink-0 text-primary' />
                      ) : null}
                    </div>

                    <div className='mb-3'>
                      <div className='h-1.5 w-full rounded-full bg-muted'>
                        <div
                          className='h-1.5 rounded-full bg-primary'
                          style={{ width: isLearned ? '100%' : '0%' }}
                        />
                      </div>
                    </div>

                    <Button
                      size='sm'
                      className='h-8 w-full rounded-lg gap-1.5 text-xs sm:text-sm'
                      variant={isLearned ? 'outline' : 'default'}>
                      <Icons.Play className='h-3.5 w-3.5' />
                      {isLearned ? t('learning_continue') : t('learning_start_course')}
                    </Button>
                  </Card>
                );
              })()}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
