'use client';

import { useCreateLessonMutation } from '@/api/lesson-management';
import { Modal } from './Modal';
import Icons from '@/components/Icons';
import ShadcnFileUploader from '@/components/ShadcnFileUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

interface CreateLessonModalProps extends App.ModalProps {}

interface CreateLessonFormData {
  title: string;
  description?: string;
}

export const CreateLessonModal = ({ open, onCancel }: CreateLessonModalProps) => {
  const { t } = useTranslation();
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { control, handleSubmit, reset } = useForm<CreateLessonFormData>({
    defaultValues: {
      title: '',
      description: ''
    }
  });

  const createLessonMutation = useCreateLessonMutation();

  const onSubmit = async (data: CreateLessonFormData) => {
    try {
      const payload: LearningManagement.CreateLessonPayload = {
        title: data.title,
        description: data.description || undefined,
        order: undefined
      };

      await createLessonMutation.mutateAsync(payload);

      // Reset form
      reset();
      setImageFiles([]);

      // Close modal
      onCancel();
    } catch (error) {
      console.error('[v0] Error creating lesson:', error);
    }
  };

  const handleCancel = () => {
    reset();
    setImageFiles([]);
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title={t('create_lesson_modal_title')}
      confirmText={t('create_lesson_submit')}
      cancelText={t('common_cancel')}
      isLoading={createLessonMutation.isPending}
      width={600}
      onConfirm={handleSubmit(onSubmit)}>
      <form className='space-y-5'>
        {/* Title */}
        <div className='space-y-2'>
          <label htmlFor='title' className='text-sm font-medium'>
            {t('create_lesson_title_label')} *
          </label>
          <Input
            id='title'
            placeholder={t('create_lesson_title_placeholder')}
            {...control.register('title', { required: true })}
            disabled={createLessonMutation.isPending}
          />
        </div>

        {/* Description */}
        <div className='space-y-2'>
          <label htmlFor='description' className='text-sm font-medium'>
            {t('create_lesson_description_label')}
          </label>
          <Textarea
            id='description'
            placeholder={t('create_lesson_description_placeholder')}
            rows={3}
            {...control.register('description')}
            disabled={createLessonMutation.isPending}
          />
        </div>

        {/* Image Upload */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>{t('create_lesson_image_label')}</label>
          <ShadcnFileUploader
            value={imageFiles}
            onChange={setImageFiles}
            maxFiles={1}
            accept='image/*'
            disabled={createLessonMutation.isPending}
          />
        </div>
      </form>
    </Modal>
  );
};

export default CreateLessonModal;
