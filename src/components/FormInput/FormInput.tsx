import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import type { FieldValues } from 'react-hook-form';

import type { FormInputProps } from './types';
import { useFormInput } from './useFormInput';

export function FormInput<T extends FieldValues>(props: FormInputProps<T>) {
  const { control, name, placeholder, label, className, disabled = false, type = 'text' } = props;

  const {
    processedRules,
    inputId,
    inputType,
    isRequired,
    buildInputClass,
    getInputValue,
    handleChange,
    togglePassword,
    showPassword
  } = useFormInput(props);

  return (
    <FormField
      control={control}
      name={name}
      rules={processedRules}
      render={({ field, fieldState }) => {
        const inputValue = getInputValue(field.value);
        const hasError = !!fieldState.error;

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel htmlFor={inputId}>
                {label}
                {isRequired && <span className='text-red-500 ml-1'>*</span>}
              </FormLabel>
            )}

            <FormControl>
              <div className='relative'>
                <Input
                  id={inputId}
                  placeholder={placeholder}
                  type={inputType}
                  value={inputValue}
                  onChange={e => handleChange(e, field.onChange)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  disabled={disabled || field.disabled}
                  aria-invalid={hasError}
                  className={buildInputClass(hasError)}
                />
                {type === 'password' && (
                  <button
                    type='button'
                    onClick={togglePassword}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                    tabIndex={-1}>
                    {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
