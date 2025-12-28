import { Controller } from 'react-hook-form';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@components/ui/field';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@components/ui/select';
import type { FormBaseProps, FormControlFunc } from './types';
import type { FieldPath } from 'react-hook-form';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

export function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>({
  children,
  label,
  control,
  name,
  htmlType,
  description,
  controlFirst,
  horizontal,
  rules
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  const processedRules = (() => {
    const autoRules: RegisterOptions<TFieldValues, TName> = { ...rules };
    if (htmlType === 'email' && !rules?.pattern) {
      autoRules.pattern = {
        value: EMAIL_PATTERN,
        message: 'Email không hợp lệ'
      };
    }
    if (htmlType === 'tel' && !rules?.pattern) {
      autoRules.pattern = {
        value: PHONE_PATTERN,
        message: 'Số điện thoại không hợp lệ'
      };
    }

    if (rules?.required !== undefined && rules.required !== false) {
      if (typeof rules.required === 'string') {
        autoRules.required = rules.required;
      } else if (typeof rules.required === 'object') {
        if (!rules.required.message) {
          autoRules.required = {
            ...rules.required,
            message: 'Trường này là bắt buộc'
          };
        }
      } else {
        autoRules.required = 'Trường này là bắt buộc';
      }
    }

    return autoRules;
  })();

  return (
    <Controller
      control={control}
      name={name}
      rules={processedRules}
      render={({ field, fieldState }) => {
        const labelElement = (
          <>
            {label && (
              <FieldLabel htmlFor={field.name}>
                {label}
                {rules?.required && <span className='text-red-500 ml-1'>*</span>}
              </FieldLabel>
            )}
            {description && <FieldDescription>{description}</FieldDescription>}
          </>
        );
        const control = children({
          ...field,
          id: field.name,
          'aria-invalid': fieldState.invalid
        });
        const errorElem = fieldState.invalid && <FieldError errors={[fieldState.error]} />;

        return (
          <Field
            data-invalid={fieldState.invalid}
            orientation={horizontal ? 'horizontal' : undefined}>
            {controlFirst ? (
              <>
                {control}
                <FieldContent>
                  {labelElement}
                  {errorElem}
                </FieldContent>
              </>
            ) : (
              <>
                <FieldContent>{labelElement}</FieldContent>
                {control}
                {errorElem}
              </>
            )}
          </Field>
        );
      }}
    />
  );
}

export const FormInput: FormControlFunc = props => {
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

export const FormTextarea: FormControlFunc = props => {
  return <FormBase {...props}>{field => <Textarea {...field} />}</FormBase>;
};

export const FormSimpleSelect: FormControlFunc<{ children: ReactNode }> = ({
  children,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {({ onChange, onBlur, ...field }) => (
        <Select {...field} onValueChange={onChange}>
          <SelectTrigger aria-invalid={field['aria-invalid']} id={field.id} onBlur={onBlur}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
    </FormBase>
  );
};

export const FormCheckbox: FormControlFunc = props => {
  return (
    <FormBase {...props} horizontal controlFirst>
      {({ onChange, value, ...field }) => (
        <Checkbox {...field} checked={value} onCheckedChange={onChange} />
      )}
    </FormBase>
  );
};
