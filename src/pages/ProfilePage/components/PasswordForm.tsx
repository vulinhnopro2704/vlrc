import { changePassword } from '@/api/auth-management';
import { FormInput } from '@/components/Form/Form';

export const PasswordForm: FC = () => {
  const { t } = useTranslation();

  const form = useForm<Auth.ChangePasswordPayload & { confirmPassword?: string }>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success(t('auth_password_changed', 'Đổi mật khẩu thành công'));
      form.reset();
    },
    onError: () => {
      toast.error(t('auth_password_change_failed', 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.'));
    }
  });

  const onSubmit = (values: Auth.ChangePasswordPayload & { confirmPassword?: string }) => {
    mutation.mutate({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword
    });
  };

  return (
    <Card className="border-none shadow-none md:border-solid md:shadow-sm">
      <CardHeader>
        <CardTitle>Đổi mật khẩu</CardTitle>
        <CardDescription>
          Đảm bảo tài khoản của bạn đang sử dụng một mật khẩu dài và an toàn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
            <FormInput
              control={form.control}
              name="oldPassword"
              label="Mật khẩu hiện tại"
              htmlType="password"
              placeholder="••••••••"
              rules={{ required: 'Vui lòng nhập mật khẩu cũ' }}
            />

            <FormInput
              control={form.control}
              name="newPassword"
              label="Mật khẩu mới"
              htmlType="password"
              placeholder="••••••••"
              rules={{ 
                required: 'Vui lòng nhập mật khẩu mới',
                minLength: { value: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên' }
              }}
            />

            <FormInput
              control={form.control}
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              htmlType="password"
              placeholder="••••••••"
              rules={{ 
                required: 'Vui lòng xác nhận mật khẩu mới',
                validate: (val, formValues) => {
                  if (val !== formValues.newPassword) {
                    return 'Mật khẩu xác nhận không khớp';
                  }
                  return true;
                }
              }}
            />

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Đang lưu...' : 'Lưu mật khẩu'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PasswordForm;
