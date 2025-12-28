import type { FieldPath, FieldValues } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import { FormBase } from '../Form';
import { StepperControls } from './StepperControls';
import type { FormNumberInputProps } from './types';
import { useFormNumberInput } from './useFormNumberInput';
import { cn } from '@/lib/utils';

export function FormNumberInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>({
  control,
  name,
  label,
  stepper = 1,
  min = '0',
  max = '100',
  minValue = Number.NEGATIVE_INFINITY,
  maxValue = Number.POSITIVE_INFINITY,
  thousandSeparator,
  placeholder,
  fixedDecimalScale = false,
  decimalScale = 0,
  suffix,
  prefix,
  inputClassName,
  onChange,
  rules,
  description,
  horizontal,
  controlFirst,
  ...props
}: FormNumberInputProps<TFieldValues, TName, TTransformedValues>) {
  const { enhancedRules, numericClass, getHandlers } = useFormNumberInput<TFieldValues, TName>({
    min: minValue,
    max: maxValue,
    rules,
    inputClassName,
    stepper,
    onChange,
    passthroughProps: props
  });

  return (
    <FormBase
      control={control}
      name={name}
      label={label}
      description={description}
      rules={enhancedRules}
      horizontal={horizontal}
      controlFirst={controlFirst}>
      {({ id, 'aria-invalid': ariaInvalid, ...field }) => {
        const currentValue = field.value as number | undefined;
        const {
          handleIncrement,
          handleDecrement,
          handleKeyDown,
          handleBlur,
          numericOnValueChange
        } = getHandlers({ currentValue, field });

        return (
          <div className='flex items-center'>
            <NumericFormat
              min={min}
              max={max}
              aria-invalid={ariaInvalid}
              value={currentValue ?? ''}
              onValueChange={numericOnValueChange}
              thousandSeparator={thousandSeparator}
              decimalScale={decimalScale}
              fixedDecimalScale={fixedDecimalScale}
              allowNegative={minValue < 0}
              valueIsNumericString={false}
              onBlur={handleBlur}
              suffix={suffix}
              prefix={prefix}
              placeholder={placeholder || '0'}
              getInputRef={field.ref}
              onKeyDown={handleKeyDown}
              name={field.name}
              {...props}
              id={id}
              className={cn(numericClass, props.className)}
            />
            <StepperControls
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              disableIncrement={currentValue !== undefined && currentValue >= maxValue}
              disableDecrement={currentValue !== undefined && currentValue <= minValue}
            />
          </div>
        );
      }}
    </FormBase>
  );
}
