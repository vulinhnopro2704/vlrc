'use client';

import { useLessonMutation, useLessonQuery } from '@/api/lesson-management';
import { useCoursesQuery } from '@/api/course-management';
import { FormInput, FormSelect, FormTextarea } from '@/components/Form';
import { Modal } from './Modal';

export const CreateLessonModal = ({ id, open, onCancel }: App.ModalProps) => {
  const { t } = useTranslation();
  const isEditMode = id != null;

  const { control, handleSubmit, reset } = useForm<LearningManagement.Lesson>();

  const { data: coursesResponse, isLoading: isCoursesLoading } = useCoursesQuery({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    take: 100
  });
  const userCourses = (
    (get(coursesResponse, 'data', []) as LearningManagement.Course[]) ?? []
  ).filter(course => course.isUserCreated);
  const courseOptions = userCourses.map(course => ({
    value: Number(course.id),
    label: course.title
  }));

  const { data: lessonDetail, isLoading: isLessonLoading } = useLessonQuery(id);
  const lessonMutation = useLessonMutation({
    onSuccess: () => {
      reset();
      onCancel();
    }
  });
  const isSubmitting = lessonMutation.isPending;
  const isFormLoading = isSubmitting || (isEditMode && isLessonLoading);

  useUpdateEffect(() => {
    if (lessonDetail) {
      reset(pick(lessonDetail, ['title', 'description', 'courseId']));
    }
  }, [lessonDetail]);

  const onSubmit = handleSubmit((data: LearningManagement.Lesson) =>
    lessonMutation.mutate({ id, payload: data })
  );

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title={isEditMode ? t('edit_lesson_modal_title') : t('create_lesson_modal_title')}
      confirmText={isEditMode ? t('edit_lesson_submit') : t('create_lesson_submit')}
      cancelText={t('common_cancel')}
      isLoading={isFormLoading}
      width={600}
      onConfirm={onSubmit}>
      <form className='space-y-5'>
        <FormInput
          control={control}
          name='title'
          label={t('create_lesson_title_label')}
          placeholder={t('create_lesson_title_placeholder')}
          disabled={isFormLoading}
          rules={{ required: true }}
        />
        <FormTextarea
          control={control}
          name='description'
          label={t('create_lesson_description_label')}
        />
        <FormSelect
          control={control}
          name='courseId'
          label={t('create_lesson_course_label')}
          options={courseOptions}
          placeholder={t('create_lesson_course_placeholder')}
          disabled={isFormLoading || isCoursesLoading}
        />
      </form>
    </Modal>
  );
};

export default CreateLessonModal;
