import { updateProfile } from '@/api/auth-management';
import { uploadFile } from '@/api/storage-management';
import { useState } from 'react';
import { AUTH_ME_QUERY_KEY, useAuthSession } from '@/hooks/useAuthSession';
import { FormInput, FormSimpleSelect, FormTextarea } from '@/components/Form/Form';
import FormDatePicker from '@/components/Form/FormDatePicker';
import FormFileUpload from '@/components/Form/FormFileUpload';

export const ProfileForm: FC = () => {
  const { t } = useTranslation();
  const { data: me } = useAuthSession();
  const queryClient = useQueryClient();

  // dateOfBirth: Date (DatePicker) thay vì string (API)
  // hobbies: string comma-separated (Textarea) thay vì string[] (API)
  type FormValues = Omit<Auth.UpdateProfilePayload, 'dateOfBirth' | 'hobbies' | 'avatar'> & {
    dateOfBirth?: Date;
    hobbies?: string;
    avatar?: File | string | null;
  };

  const form = useForm<FormValues>({
    defaultValues: {
      name: me?.name,
      phoneNumber: me?.phoneNumber,
      dateOfBirth: me?.dateOfBirth ? new Date(me.dateOfBirth) : undefined,
      gender: me?.gender ?? 'PREFER_NOT_TO_SAY',
      hobbies: me?.hobbies?.join(', '),
      funFact: me?.funFact,
      avatar: me?.avatar
    }
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: updatedUser => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, updatedUser);
      toast.success(t('auth_profile_updated', 'Profile updated successfully'));
    },
    onError: () => {
      toast.error(t('auth_profile_update_failed', 'Failed to update profile'));
    }
  });

  const [isUploading, setIsUploading] = useState(false);

  const onSubmit = async ({ dateOfBirth, hobbies, avatar, ...values }: FormValues) => {
    try {
      let avatarUrl = avatar;

      // Nếu người dùng chọn file mới, thực hiện upload trước
      if (avatar instanceof File) {
        setIsUploading(true);
        const res = await uploadFile(avatar);
        avatarUrl = res.url;
      }

      mutation.mutate({
        ...values,
        avatar: typeof avatarUrl === 'string' ? avatarUrl : undefined,
        dateOfBirth: dateOfBirth?.toISOString().split('T')[0],
        hobbies: hobbies?.trim()
          ? hobbies
              .split(',')
              .map(h => h.trim())
              .filter(Boolean)
          : undefined
      });
    } catch {
      toast.error(t('auth_profile_upload_failed', 'Failed to upload avatar. Please try again.'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className='border-none shadow-none md:border-solid md:shadow-sm'>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
        <CardDescription>
          Cập nhật thông tin chi tiết của bạn để chúng tôi có thể cá nhân hóa trải nghiệm học tập.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Họ và Tên */}
            <FormInput
              control={form.control}
              name='name'
              label='Họ và Tên'
              placeholder='Nguyễn Văn A'
              rules={{ required: true, minLength: { value: 2, message: 'Tên quá ngắn' } }}
            />

            {/* Số điện thoại — htmlType="tel" kích hoạt auto-validate pattern VN */}
            <FormInput
              control={form.control}
              name='phoneNumber'
              label='Số điện thoại'
              placeholder='0987654321'
              htmlType='tel'
            />

            {/* Ngày sinh — DatePicker thay vì input[type=date] thô */}
            <FormDatePicker
              control={form.control}
              name='dateOfBirth'
              label='Ngày sinh'
              pickerType='date'
              placeholder='Chọn ngày sinh'
              allowClear
            />

            {/* Giới tính */}
            <FormSimpleSelect control={form.control} name='gender' label='Giới tính'>
              <SelectItem value='MALE'>Nam</SelectItem>
              <SelectItem value='FEMALE'>Nữ</SelectItem>
              <SelectItem value='OTHER'>Khác</SelectItem>
              <SelectItem value='PREFER_NOT_TO_SAY'>Không tiết lộ</SelectItem>
            </FormSimpleSelect>

            {/* Sở thích — Textarea để nhập tự do, ngăn cách bằng dấu phẩy */}
            <FormTextarea
              control={form.control}
              name='hobbies'
              className='md:col-span-2'
              label='Sở thích'
              description='Nhập các sở thích, ngăn cách bằng dấu phẩy. VD: Đọc sách, Lập trình, Thể thao'
            />

            {/* Fun fact */}
            <FormTextarea
              control={form.control}
              name='funFact'
              className='md:col-span-2'
              label='Fun fact về bản thân'
            />

            {/* Avatar — FileUpload thay vì nhập URL thô */}
            <FormFileUpload
              control={form.control}
              name='avatar'
              label='Ảnh đại diện'
              description='Chọn ảnh từ máy tính. Upload sẽ diễn ra khi bạn lưu.'
              className='md:col-span-2'
              accept='image/*'
              maxSize={2 * 1024 * 1024}
            />
          </div>

          <Button type='submit' disabled={mutation.isPending || isUploading}>
            {mutation.isPending || isUploading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
