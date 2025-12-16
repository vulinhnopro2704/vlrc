import type { FieldValues } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import { StepperControls } from './StepperControls';
import type { FormNumberInputProps } from './types';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormNumberInput } from './useFormNumberInput';

export function FormNumberInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  stepper = 1,
  thousandSeparator,
  placeholder,
  min = -Infinity,
  max = Infinity,
  fixedDecimalScale = false,
  decimalScale = 0,
  suffix,
  prefix,
  inputClassName,
  onChange,
  rules,
  description,
  ...props
}: FormNumberInputProps<TFieldValues>) {
  const { enhancedRules, numericClass, getHandlers } = useFormNumberInput({
    rules,
    inputClassName,
    stepper,
    min,
    max,
    onChange,
    passthroughProps: props
  });

  return (
    <FormField
      control={control}
      name={name}
      rules={enhancedRules}
      render={({ field, fieldState }) => {
        const currentValue = field.value as number | undefined;
        const error = fieldState.error;

        const {
          handleIncrement,
          handleDecrement,
          handleKeyDown,
          handleBlur,
          numericOnValueChange
        } = getHandlers({ currentValue, field });

        const isRequired = !!rules?.required;

        return (
          <FormItem>
            {label && (
              <FormLabel>
                {label}
                {isRequired && <span className='text-red-500 ml-1'>*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div className='flex items-center'>
                <NumericFormat
                  value={currentValue ?? ''}
                  onValueChange={numericOnValueChange}
                  thousandSeparator={thousandSeparator}
                  decimalScale={decimalScale}
                  fixedDecimalScale={fixedDecimalScale}
                  allowNegative={min < 0}
                  valueIsNumericString={false}
                  onBlur={handleBlur}
                  max={max}
                  min={min}
                  suffix={suffix}
                  prefix={prefix}
                  customInput={Input}
                  placeholder={placeholder}
                  className={numericClass}
                  getInputRef={field.ref}
                  onKeyDown={handleKeyDown}
                  name={field.name}
                  {...(props as any)}
                />
                <StepperControls
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  disableIncrement={currentValue !== undefined && currentValue >= max}
                  disableDecrement={currentValue !== undefined && currentValue <= min}
                />
              </div>
            </FormControl>
            {description && !error && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
