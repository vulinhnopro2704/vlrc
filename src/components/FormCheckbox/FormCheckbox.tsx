import type { ReactNode } from 'react';
import type {
  Control,
  FieldPath,
  FieldPathValue,
  FieldValues,
  RegisterOptions
} from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export interface FormCheckboxProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  value?: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>;
  label?: ReactNode;
  disabled?: boolean;
  indeterminate?: boolean;
  size?: 'large' | 'middle' | 'small';
  onChange?: (value?: boolean) => void;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
  hideErrorMessage?: boolean;
  className?: string;
}

export function FormCheckbox<TFieldValues extends FieldValues>({
  name,
  control,
  value,
  label = '',
  disabled = false,
  indeterminate = false,
  size = 'large',
  onChange,
  rules = {},
  hideErrorMessage = false,
  className
}: FormCheckboxProps<TFieldValues>) {
  const isRequired = rules.required !== undefined && rules.required !== false;

  const enhancedRules = useMemo(() => {
    const newRules = { ...rules };
    if (
      isRequired &&
      typeof newRules.required !== 'string' &&
      typeof newRules.required !== 'object'
    ) {
      newRules.required = 'Trường này là bắt buộc';
    } else if (typeof newRules.required === 'object' && !newRules.required.message) {
      newRules.required = {
        ...newRules.required,
        message: 'Trường này là bắt buộc'
      };
    }
    return newRules;
  }, [rules, isRequired]);

  const sizeClasses = {
    large: 'size-5',
    middle: 'size-4',
    small: 'size-3.5'
  };

  return (
    <FormField
      control={control}
      name={name}
      rules={enhancedRules}
      render={({ field }) => (
        <FormItem className={className}>
          <div className='flex items-center gap-2'>
            <FormControl>
              <Checkbox
                checked={value !== undefined ? Boolean(value) : Boolean(field.value)}
                onCheckedChange={checked => {
                  const newValue = checked === 'indeterminate' ? false : checked;
                  field.onChange(newValue);
                  onChange?.(newValue);
                }}
                disabled={disabled}
                // @ts-expect-error - indeterminate is not in the type definition but is supported
                indeterminate={indeterminate}
                className={sizeClasses[size]}
              />
            </FormControl>
            {label && (
              <FormLabel
                className='mt-0! cursor-pointer'
                onClick={() => {
                  if (!disabled) {
                    const newValue = !(value !== undefined ? Boolean(value) : Boolean(field.value));
                    field.onChange(newValue);
                    onChange?.(newValue);
                  }
                }}>
                {label}
                {isRequired && <span className='text-destructive ml-1'>*</span>}
              </FormLabel>
            )}
          </div>
          {!hideErrorMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
