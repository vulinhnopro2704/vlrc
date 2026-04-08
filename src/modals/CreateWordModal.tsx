'use client';

import { useLessonsQuery } from '@/api/lesson-management';
import { useWordMutation, useWordQuery } from '@/api/word-management';
import { FormInput, FormSelect, FormTextarea } from '@/components/Form';
import ShadcnFileUploader from '@/components/ShadcnFileUploader';
import { Modal } from './Modal';

export const CreateWordModal = ({ id, open, onCancel }: App.ModalProps) => {
  const { t } = useTranslation();
  const isEditMode = id != null;
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [audioFiles, setAudioFiles] = useState<File[]>([]);

  const { control, handleSubmit, reset } = useForm<LearningManagement.Word>();

  const { data: lessonsResponse, isLoading: isLessonsLoading } = useLessonsQuery({
    createdByMe: true,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    take: 100
  });
  const lessons = (get(lessonsResponse, 'data', []) as LearningManagement.Lesson[]) ?? [];
  const lessonOptions = map(lessons, lesson => ({
    value: Number(lesson.id),
    label: lesson.title
  }));

  const { data: wordDetail, isLoading: isWordLoading } = useWordQuery(id);
  const wordMutation = useWordMutation({
    onSuccess: () => {
      reset();
      setImageFiles([]);
      setAudioFiles([]);
      onCancel();
    }
  });
  const isSubmitting = wordMutation.isPending;
  const isFormLoading = isSubmitting || (isEditMode && isWordLoading);

  useUpdateEffect(() => {
    if (wordDetail) {
      reset(pick(wordDetail, ['word', 'meaning', 'pronunciation', 'example', 'lessonId']));
    }
  }, [wordDetail]);

  const onSubmit = handleSubmit((data: LearningManagement.Word) =>
    wordMutation.mutate({ id, payload: data })
  );

  const handleCancel = () => {
    reset();
    setImageFiles([]);
    setAudioFiles([]);
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title={isEditMode ? t('edit_word_modal_title') : t('create_word_modal_title')}
      confirmText={isEditMode ? t('edit_word_submit') : t('create_word_submit')}
      cancelText={t('common_cancel')}
      isLoading={isFormLoading}
      width={600}
      onConfirm={onSubmit}>
      <form className='space-y-5'>
        <FormSelect
          control={control}
          name='lessonId'
          label={t('create_word_lesson_label')}
          options={lessonOptions}
          placeholder={t('create_word_lesson_placeholder')}
          disabled={isFormLoading || isLessonsLoading}
          rules={{ required: t('create_word_lesson_required') }}
        />
        <FormInput
          control={control}
          name='word'
          label={t('create_word_word_label')}
          placeholder='e.g., English'
          disabled={isFormLoading}
          rules={{ required: true }}
        />
        <FormTextarea
          control={control}
          name='meaning'
          label={t('create_word_meaning_label')}
          rules={{ required: true }}
        />
        <FormInput
          control={control}
          name='pronunciation'
          label={t('create_word_pronunciation_label')}
          placeholder={t('create_word_pronunciation_placeholder')}
          disabled={isFormLoading}
        />
        <FormTextarea control={control} name='example' label={t('create_word_example_label')} />
        {/* Image Upload */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>{t('create_word_image_label')}</label>
          <ShadcnFileUploader
            value={imageFiles}
            onChange={setImageFiles}
            maxFiles={1}
            accept='image/*'
            disabled={isFormLoading}
          />
        </div>
        {/* Audio Upload */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>{t('create_word_audio_label')}</label>
          <ShadcnFileUploader
            value={audioFiles}
            onChange={setAudioFiles}
            maxFiles={1}
            accept={['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm']}
            disabled={isFormLoading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default CreateWordModal;
