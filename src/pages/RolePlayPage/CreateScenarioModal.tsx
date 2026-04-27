'use client';

import { useGenerateScenarioMutation } from '@/api/roleplay-management';
import { FormInput } from '@/components/Form';
import { Modal } from '@/modals/Modal';

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
      isPublic: true
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
        <FormInput
          control={control}
          name='level'
          label={t('roleplay_level_label')}
          placeholder={t('roleplay_level_placeholder')}
          disabled={isFormLoading}
          rules={{ required: true }}
        />
      </form>
    </Modal>
  );
};

export default CreateScenarioModal;
