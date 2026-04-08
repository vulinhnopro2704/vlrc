import { useCoursesQuery } from '@/api/course-management';
import Icons from '@/components/Icons';
import { NotebookTabState } from '../components/NotebookTabState';

export const UserCreatedCoursesTab: FC<{
  onEditCourse: (id?: App.ID) => void;
}> = ({ onEditCourse }) => {
  const { t } = useTranslation();

  const { data, isLoading, isError, error } = useCoursesQuery({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    take: 100
  });

  const courses = ((get(data, 'data', []) as LearningManagement.Course[]) ?? []).filter(
    course => course.isUserCreated
  );

  return (
    <div className='space-y-4'>
      <NotebookTabState
        isLoading={isLoading}
        isError={isError}
        isEmpty={!isLoading && !isError && size(courses) === 0}
        loadingText={t('notebook_loading')}
        errorMessage={`${t('error_loading_notes')}: ${(error as Error).message}`}
        emptyText={t('notebook_empty_courses')}
      />

      {!isLoading && !isError && size(courses) > 0 && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {map(courses, course => (
            <Card key={course.id} className='border bg-card/40 p-4'>
              <div className='mb-3 flex items-start justify-between gap-2'>
                <div className='min-w-0 flex-1'>
                  <h3 className='truncate text-lg font-semibold'>{course.title}</h3>
                  {course.description && (
                    <p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>
                      {course.description}
                    </p>
                  )}
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => onEditCourse(course.id)}>
                  <Icons.PenTool className='h-4 w-4' />
                </Button>
              </div>
              <div className='text-xs text-muted-foreground'>
                {new Date(course.createdAt ?? new Date().toISOString()).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
