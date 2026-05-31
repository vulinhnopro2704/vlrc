'use client';

import { useGenerateScenarioMutation } from '@/api/roleplay-management';

const CEFR_OPTIONS = [
  { label: 'A1 - Beginner', value: 'A1' },
  { label: 'A2 - Elementary', value: 'A2' },
  { label: 'B1 - Intermediate', value: 'B1' },
  { label: 'B2 - Upper Intermediate', value: 'B2' },
  { label: 'C1 - Advanced', value: 'C1' },
  { label: 'C2 - Proficient', value: 'C2' }
];

export const CreateScenarioModal = ({ open, onCancel }: App.ModalProps) => {
  const { t } = useTranslation();

  const { control, handleSubmit, reset } = useForm<RoleplayManagement.GenerateScenarioPayload>();

  const generateMutation = useGenerateScenarioMutation({
    onSuccess: () => {
      reset();
      onCancel();
    }
  });
  
  const isFormLoading = generateMutation.isPending;

  const onSubmit = handleSubmit(data => {
    generateMutation.mutate({
      topic: data.topic,
      level: data.level,
      isPublic: true,
      generateImage: data.generateImage
    });
  });

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title={t('roleplay_modal_title')}
      description={t('roleplay_modal_desc')}
      confirmText={t('roleplay_submit')}
      cancelText={t('common_cancel')}
      isLoading={isFormLoading}
      width={600}
      onConfirm={onSubmit}>
      <form className='space-y-5'>
        <FormInput
          control={control}
          name='topic'
          label={t('roleplay_topic_label')}
          placeholder={t('roleplay_topic_placeholder')}
          disabled={isFormLoading}
          rules={{ required: true }}
        />
        <FormSelect
          control={control}
          name='level'
          label={t('roleplay_level_label')}
          placeholder={t('roleplay_level_placeholder')}
          options={CEFR_OPTIONS}
          disabled={isFormLoading}
          rules={{ required: true }}
        />
        <FormCheckbox
          control={control}
          name='generateImage'
          label='Tạo ảnh minh họa bằng AI (Sẽ mất thời gian hơn)'
          disabled={isFormLoading}
        />
      </form>
    </Modal>
  );
};

export default CreateScenarioModal;
