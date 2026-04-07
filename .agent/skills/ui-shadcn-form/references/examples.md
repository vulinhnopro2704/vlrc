# Form Best Practices Examples

## Prefer existing wrappers

GOOD

```tsx
import { FormInput, FormSelect } from '[FORM_WRAPPER_MODULE]';

<FormInput control={form.control} name='email' label={t('auth_email')} />;
```

BAD

```tsx
<input value={value} onChange={e => setValue(e.target.value)} />
```

## RHF integration pattern

GOOD

```tsx
const form = useForm<Auth.LoginFormData>({
  defaultValues: { email: '', password: '' }
});

return (
  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
    <FormInput control={form.control} name='email' htmlType='email' rules={{ required: true }} />
    <FormInput
      control={form.control}
      name='password'
      htmlType='password'
      rules={{ required: true }}
    />
  </form>
);
```

Note: Replace `Auth.LoginFormData` with your workspace form model type.

BAD

```tsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

return (
  <form onSubmit={onSubmit}>
    <input value={email} onChange={e => setEmail(e.target.value)} />
    <input value={password} onChange={e => setPassword(e.target.value)} />
  </form>
);
```

## Keep local props inline

GOOD

```tsx
const LoginActions: FC<{ loading?: boolean; onSubmit: () => void }> = ({ loading, onSubmit }) => (
  <Button disabled={loading} onClick={onSubmit} />
);
```

BAD

```tsx
interface LoginActionsProps {
  loading?: boolean;
  onSubmit: () => void;
}
const LoginActions: FC<LoginActionsProps> = ({ loading, onSubmit }) => (
  <Button disabled={loading} onClick={onSubmit} />
);
```

## Keep imports clean

GOOD

```tsx
const form = useForm();
```

BAD

```tsx
import { useForm } from 'react-hook-form';
```

## When custom field is acceptable

GOOD

```tsx
// Use a custom component only when existing wrappers do not support the field behavior.
const FormAudioRecorder: FC<{ control: Control<any>; name: string }> = ({ control, name }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => <AudioRecorder {...field} />}
    />
  );
};
```

BAD

```tsx
// Rebuilding regular text input even though FormInput already exists.
const FormCustomText = () => <input className='border rounded px-2 py-1' />;
```
