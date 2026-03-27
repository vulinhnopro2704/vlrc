import { Controller } from 'react-hook-form';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@components/ui/field';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@components/ui/select';
import type { FormBaseProps, FormControlFunc, FormInputExtraProps } from './types';
import type { FieldPath } from 'react-hook-form';
import Icons from '../Icons';
import { cn } from '@/lib/utils';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

const getAutoComplete = (name: string, htmlType?: string) => {
  const normalizedName = name.toLowerCase();

  if (htmlType === 'password') {
    if (normalizedName.includes('confirm') || normalizedName.includes('new')) {
      return 'new-password';
    }

    return 'current-password';
  }

  if (htmlType === 'email' || normalizedName.includes('email')) {
    return 'email';
  }

  if (htmlType === 'tel' || normalizedName.includes('phone')) {
    return 'tel';
  }

  if (normalizedName.includes('name')) {
    return 'name';
  }

  if (normalizedName.includes('username')) {
    return 'username';
  }

  return undefined;
};

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
  rules,
  className
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
            className={className}
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

export const FormInput: FormControlFunc<FormInputExtraProps> = ({
  placeholder,
  inputClassName,
  leftIcon,
  rightIcon,
  disabled,
  autoComplete,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.htmlType === 'password';
  const resolvedAutoComplete = autoComplete ?? getAutoComplete(String(props.name), props.htmlType);

  return (
    <FormBase {...props}>
      {field => (
        <div className='relative'>
          {leftIcon && (
            <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none'>
              {leftIcon}
            </div>
          )}
          <Input
            {...field}
            type={isPassword && showPassword ? 'text' : props.htmlType}
            autoComplete={resolvedAutoComplete}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              leftIcon && 'pl-10',
              (isPassword || rightIcon) && 'pr-10',
              inputClassName
            )}
          />
          {isPassword && (
            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              onClick={() => setShowPassword(v => !v)}
              className='absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              tabIndex={-1}>
              {showPassword ? (
                <Icons.EyeOff className='h-4 w-4' />
              ) : (
                <Icons.Eye className='h-4 w-4' />
              )}
            </Button>
          )}
          {!isPassword && rightIcon && (
            <div className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none'>
              {rightIcon}
            </div>
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
