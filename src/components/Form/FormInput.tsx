import FormBase from './FormBase';
import type { FormControlFunc } from './types';

const FormInput: FormControlFunc = props => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormBase {...props}>
      {field => (
        <div className='relative'>
          <Input {...field} type={showPassword ? 'text' : props.htmlType} />
          {props.htmlType === 'password' && (
            <Button
              type='button'
              onClick={() => setShowPassword(v => !v)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
              tabIndex={-1}>
              {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </Button>
          )}
        </div>
      )}
    </FormBase>
  );
};

export default FormInput;
