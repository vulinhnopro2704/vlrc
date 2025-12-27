import React from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { FormRadioProps } from './types';
import { useFormRadio } from './useFormRadio';

export function FormRadio<TFieldValues extends FieldValues>({
  name,
  control,
  label = '',
  size = 'middle',
  options = [],
  onChange,
  value,
  rules = {},
  disabled = false,
  optionType: _optionType = 'default',
  buttonStyle: _buttonStyle,
  autoHeightMax,
  showEmpty = false,
  hideErrorMessage = false,
  className
}: FormRadioProps<TFieldValues>) {
  const { isRequired, processedRules, parseValue, emitChange, sizeClasses } = useFormRadio({
    rules,
    value,
    onChange,
    showEmpty
  });

  const renderOptions = (
    fieldName: FieldPath<TFieldValues>,
    fieldValue: unknown,
    fieldOnChange: (value: unknown) => void
  ) => (
    <RadioGroup
      value={parseValue(fieldValue)}
      onValueChange={newValue => emitChange(fieldOnChange, newValue)}
      disabled={disabled}
      style={autoHeightMax ? { maxHeight: `${autoHeightMax}px`, overflowY: 'auto' } : undefined}>
      {options.map(option => (
        <div key={String(option.value)} className='flex items-center space-x-2'>
          <RadioGroupItem
            value={String(option.value)}
            id={`${fieldName}-${option.value}`}
            disabled={disabled || option.disabled}
            className={sizeClasses[size]}
          />
          <Label htmlFor={`${fieldName}-${option.value}`} className='cursor-pointer font-normal'>
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );

  return (
    <FormField
      control={control}
      name={name}
      rules={processedRules}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {isRequired && <span className='text-destructive ml-1'>*</span>}
            </FormLabel>
          )}
          <FormControl>{renderOptions(name, value ?? field.value, field.onChange)}</FormControl>
          {!hideErrorMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
