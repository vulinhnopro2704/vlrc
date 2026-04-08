'use client';

import { useCourseQuery, useCourseMutation } from '@/api/course-management';
import { FormInput, FormTextarea } from '@/components/Form';
import ShadcnFileUploader from '@/components/ShadcnFileUploader';
import { Modal } from './Modal';

export const CreateCourseModal = ({ id, open, onCancel }: App.ModalProps) => {
  const { t } = useTranslation();
  const isEditMode = id != null;
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { control, handleSubmit, reset } = useForm<LearningManagement.Course>();

  const { data: courseDetail, isLoading: isCourseLoading } = useCourseQuery(id);
  const courseMutation = useCourseMutation({
    onSuccess: () => {
      reset();
      setImageFiles([]);
      onCancel();
    }
  });
  const isSubmitting = courseMutation.isPending;
  const isFormLoading = isSubmitting || isCourseLoading;

  useUpdateEffect(() => {
    if (courseDetail) {
      reset(pick(courseDetail, ['title', 'enTitle', 'description', 'icon']));
    }
  }, [courseDetail]);

  const onSubmit = handleSubmit(data => {
    const payload: LearningManagement.Course = {
      title: data.title,
      enTitle: data.enTitle || undefined,
      description: data.description || undefined,
      icon: data.icon || undefined,
      isPublished: isEditMode ? (courseDetail?.isPublished ?? false) : false
    };
    courseMutation.mutate({ id, payload });
  });

  const handleCancel = () => {
    reset();
    setImageFiles([]);
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title={isEditMode ? t('edit_course_modal_title') : t('create_course_modal_title')}
      confirmText={isEditMode ? t('edit_course_submit') : t('create_course_submit')}
      cancelText={t('common_cancel')}
      isLoading={isFormLoading}
      width={600}
      onConfirm={onSubmit}>
      <form className='space-y-5'>
        <FormInput
          control={control}
          name='title'
          label={t('create_course_title_label')}
          placeholder={t('create_course_title_placeholder')}
          disabled={isFormLoading}
          rules={{ required: true }}
        />
        <FormInput
          control={control}
          name='enTitle'
          label={t('create_course_en_title_label')}
          placeholder={t('create_course_en_title_placeholder')}
          disabled={isFormLoading}
        />
        <FormTextarea
          control={control}
          name='description'
          label={t('create_course_description_label')}
        />
        <FormInput
          control={control}
          name='icon'
          label={t('create_course_icon_label')}
          placeholder={t('create_course_icon_placeholder')}
          disabled={isFormLoading}
        />
        <div className='space-y-2'>
          <label className='text-sm font-medium'>{t('create_course_image_label')}</label>
          <ShadcnFileUploader
            value={imageFiles}
            onChange={setImageFiles}
            maxFiles={1}
            accept='image/*'
            disabled={isFormLoading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default CreateCourseModal;
