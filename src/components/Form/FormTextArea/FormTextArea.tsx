import React from 'react';
import type { FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import type { FormTextareaProps } from './types';
import { useFormTextarea } from './useFormTextarea';

export function FormTextarea<TFieldValues extends FieldValues>(
  props: FormTextareaProps<TFieldValues>
) {
  const {
    control,
    name,
    label,
    placeholder,
    description,
    hideErrorMessage = false,
    className,
    ...textareaProps
  } = props;

  const { isRequired, enhancedRules, textareaStyle, getValue, handleChange } =
    useFormTextarea(props);

  return (
    <FormField
      control={control}
      name={name}
      rules={enhancedRules}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {isRequired && <span className='text-destructive ml-1'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              onChange={e => handleChange(e, field.onChange)}
              value={getValue(field.value)}
              style={textareaStyle}
              {...textareaProps}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {!hideErrorMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
