'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icons from '@/components/Icons';

interface SidebarProps {
  courses: LearningManagement.Course[];
  selectedCourse: LearningManagement.Course | null;
  onSelectCourse: (course: LearningManagement.Course) => void;
}

export const Sidebar = ({ courses, selectedCourse, onSelectCourse }: SidebarProps) => {
  const { t } = useTranslation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = get(sidebarRef, 'current');
      if (!container) {
        return;
      }

      const items = container.querySelectorAll('.course-item');
      forEach(items, (item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4, delay: index * 0.1 }
        );
      });
    },
    { scope: sidebarRef }
  );

  return (
    <div
      ref={sidebarRef}
      className='w-64 bg-card border-r border-border rounded-2xl h-screen sticky top-0 overflow-hidden flex flex-col glass-card'>
      <div className='p-6 border-b border-border'>
        <h2 className='text-lg font-bold text-foreground flex items-center gap-2'>
          <Icons.BookOpen className='h-5 w-5 text-primary' />
          {t('learning_my_courses')}
        </h2>
      </div>

      <ScrollArea className='flex-1'>
        <div className='p-4 space-y-2'>
          {map(courses, course => (
            <div key={course.id} className='course-item'>
              {(() => {
                const progressPercent =
                  typeof course.progress === 'number'
                    ? course.progress
                    : (get(
                          course,
                          'progress.totalLessons',
                          get(course, 'totalLessons', get(course, '_count.lessons', 0))
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
                              get(course, 'totalLessons', get(course, '_count.lessons', 1))
                            ) as number)) *
                            100
                        )
                      : 0;

                return (
                  <Button
                    variant={get(selectedCourse, 'id') === course.id ? 'default' : 'ghost'}
                    className='w-full justify-start text-left h-auto py-3 px-4 rounded-xl transition-all duration-300'
                    onClick={() => onSelectCourse(course)}>
                    <div className='flex-1'>
                      <p className='font-semibold text-sm mb-1'>{course.title}</p>
                      <div className='w-full bg-muted rounded-full h-1.5'>
                        <div
                          className='bg-primary h-1.5 rounded-full transition-all duration-500'
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>{progressPercent}%</p>
                    </div>
                  </Button>
                );
              })()}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className='p-4 border-t border-border'>
        <Button className='w-full rounded-lg gap-2' variant='outline'>
          <Icons.Plus className='h-4 w-4' />
          {t('learning_add_course')}
        </Button>
      </div>
    </div>
  );
};
