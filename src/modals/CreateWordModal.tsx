'use client';

import { useCreateWordMutation } from '@/api/word-management';
import { Modal } from './Modal';
import Icons from '@/components/Icons';
import ShadcnFileUploader from '@/components/ShadcnFileUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

interface CreateWordModalProps extends App.ModalProps {}

interface CreateWordFormData {
  word: string;
  meaning: string;
  pronunciation?: string;
  example?: string;
}

export const CreateWordModal = ({ open, onCancel }: CreateWordModalProps) => {
  const { t } = useTranslation();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [audioFiles, setAudioFiles] = useState<File[]>([]);

  const { control, handleSubmit, reset } = useForm<CreateWordFormData>({
    defaultValues: {
      word: '',
      meaning: '',
      pronunciation: '',
      example: ''
    }
  });

  const createWordMutation = useCreateWordMutation();

  const onSubmit = async (data: CreateWordFormData) => {
    try {
      const payload: LearningManagement.CreateWordPayload = {
        word: data.word,
        meaning: data.meaning,
        pronunciation: data.pronunciation || undefined,
        example: data.example || undefined
      };

      await createWordMutation.mutateAsync(payload);

      // Reset form
      reset();
      setImageFiles([]);
      setAudioFiles([]);

      // Close modal
      onCancel();
    } catch (error) {
      console.error('[v0] Error creating word:', error);
    }
  };

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
      title={t('create_word_modal_title')}
      confirmText={t('create_word_submit')}
      cancelText={t('common_cancel')}
      isLoading={createWordMutation.isPending}
      width={600}
      onConfirm={handleSubmit(onSubmit)}>
      <form className='space-y-5'>
        {/* Word */}
        <div className='space-y-2'>
          <label htmlFor='word' className='text-sm font-medium'>
            {t('create_word_word_label')} *
          </label>
          <Input
            id='word'
            placeholder='e.g., English'
            {...control.register('word', { required: true })}
            disabled={createWordMutation.isPending}
          />
        </div>

        {/* Meaning */}
        <div className='space-y-2'>
          <label htmlFor='meaning' className='text-sm font-medium'>
            {t('create_word_meaning_label')} *
          </label>
          <Textarea
            id='meaning'
            placeholder={t('create_word_meaning_placeholder')}
            rows={3}
            {...control.register('meaning', { required: true })}
            disabled={createWordMutation.isPending}
          />
        </div>

        {/* Pronunciation */}
        <div className='space-y-2'>
          <label htmlFor='pronunciation' className='text-sm font-medium'>
            {t('create_word_pronunciation_label')}
          </label>
          <Input
            id='pronunciation'
            placeholder={t('create_word_pronunciation_placeholder')}
            {...control.register('pronunciation')}
            disabled={createWordMutation.isPending}
          />
        </div>

        {/* Example */}
        <div className='space-y-2'>
          <label htmlFor='example' className='text-sm font-medium'>
            {t('create_word_example_label')}
          </label>
          <Textarea
            id='example'
            placeholder={t('create_word_example_placeholder')}
            rows={2}
            {...control.register('example')}
            disabled={createWordMutation.isPending}
          />
        </div>

        {/* Image Upload */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>{t('create_word_image_label')}</label>
          <ShadcnFileUploader
            value={imageFiles}
            onChange={setImageFiles}
            maxFiles={1}
            accept='image/*'
            disabled={createWordMutation.isPending}
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
            disabled={createWordMutation.isPending}
          />
        </div>
      </form>
    </Modal>
  );
};

export default CreateWordModal;
