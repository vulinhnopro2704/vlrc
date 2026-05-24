import { updateProfile } from '@/api/auth-management';
import { AUTH_ME_QUERY_KEY, useAuthSession } from '@/hooks/useAuthSession';
import { FormInput, FormSimpleSelect, FormTextarea } from '@/components/Form/Form';

export const ProfileForm: FC = () => {
  const { t } = useTranslation();
  const { data: me } = useAuthSession();
  const queryClient = useQueryClient();

  const form = useForm<Auth.UpdateProfilePayload>({
    defaultValues: {
      name: me?.name || '',
      phoneNumber: me?.phoneNumber || '',
      dateOfBirth: me?.dateOfBirth ? me.dateOfBirth.split('T')[0] : '',
      gender: me?.gender || 'PREFER_NOT_TO_SAY',
      hobbies: (me?.hobbies || []).join(', '),
      funFact: me?.funFact || '',
      avatar: me?.avatar || ''
    }
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, updatedUser);
      toast.success(t('auth_profile_updated', 'Profile updated successfully'));
    },
    onError: () => {
      toast.error(t('auth_profile_update_failed', 'Failed to update profile'));
    }
  });

  const onSubmit = (values: Auth.UpdateProfilePayload) => {
    // Convert hobbies from string back to array before saving if needed
    const payload: Auth.UpdateProfilePayload = {
      ...values,
      hobbies: typeof values.hobbies === 'string' && values.hobbies.trim() !== '' 
        ? (values.hobbies as string).split(',').map(h => h.trim()).filter(Boolean) as any 
        : undefined,
      dateOfBirth: values.dateOfBirth || undefined,
      avatar: values.avatar || undefined
    };

    mutation.mutate(payload);
  };

  return (
    <Card className="border-none shadow-none md:border-solid md:shadow-sm">
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
        <CardDescription>
          Cập nhật thông tin chi tiết của bạn để chúng tôi có thể cá nhân hóa trải nghiệm học tập.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              control={form.control}
              name="name"
              label="Họ và Tên"
              placeholder="Nguyễn Văn A"
              rules={{ required: 'Tên không được để trống', minLength: { value: 2, message: 'Tên quá ngắn' } }}
            />

            <FormInput
              control={form.control}
              name="phoneNumber"
              label="Số điện thoại"
              placeholder="0987654321"
            />

            <FormInput
              control={form.control}
              name="dateOfBirth"
              label="Ngày sinh"
              htmlType="date"
            />

            <FormSimpleSelect
              control={form.control}
              name="gender"
              label="Giới tính"
            >
              <SelectItem value="MALE">Nam</SelectItem>
              <SelectItem value="FEMALE">Nữ</SelectItem>
              <SelectItem value="OTHER">Khác</SelectItem>
              <SelectItem value="PREFER_NOT_TO_SAY">Không tiết lộ</SelectItem>
            </FormSimpleSelect>

            <FormInput
              control={form.control}
              name="hobbies"
              className="md:col-span-2"
              label="Sở thích (ngăn cách bằng dấu phẩy)"
              placeholder="Đọc sách, Lập trình, Thể thao"
            />

            <FormTextarea
              control={form.control}
              name="funFact"
              className="md:col-span-2"
              label="Fun fact về bản thân"
              placeholder="Một điều thú vị về bạn..."
            />

            <FormInput
              control={form.control}
              name="avatar"
              className="md:col-span-2"
              label="Ảnh đại diện (URL)"
              placeholder="https://example.com/avatar.jpg"
              rules={{ 
                pattern: { 
                  value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))?$/i, 
                  message: 'URL không hợp lệ hoặc không phải định dạng hình ảnh' 
                } 
              }}
            />
          </div>

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
