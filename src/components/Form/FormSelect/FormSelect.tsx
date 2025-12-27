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

import { BaseSelect } from './BaseSelect';
import type { FormMultiSelectProps, FormSingleSelectProps, SelectValue } from './types';
import { useFormSelect } from './useFormSelect';

export function FormSelect<TFieldValues extends FieldValues, T extends SelectValue = SelectValue>(
  props: FormMultiSelectProps<TFieldValues, T>
): React.ReactElement;
export function FormSelect<TFieldValues extends FieldValues, T extends SelectValue = SelectValue>(
  props: FormSingleSelectProps<TFieldValues, T>
): React.ReactElement;
export function FormSelect<TFieldValues extends FieldValues, T extends SelectValue = SelectValue>(
  props: FormMultiSelectProps<TFieldValues, T> | FormSingleSelectProps<TFieldValues, T>
): React.ReactElement {
  const { control, name, label, description } = props;
  const { isRequired, enhancedRules, baseSelectProps, isMulti, createChangeHandlers } =
    useFormSelect(props);

  return (
    <FormField
      control={control}
      name={name}
      rules={enhancedRules}
      render={({ field }) => {
        const { onChangeMulti, onChangeSingle } = createChangeHandlers(field);

        return (
          <FormItem>
            {label && (
              <FormLabel>
                {label}
                {isRequired && <span className='text-destructive ml-1'>*</span>}
              </FormLabel>
            )}
            <FormControl>
              {isMulti ? (
                <BaseSelect<T>
                  {...baseSelectProps}
                  value={field.value as T[]}
                  onChange={onChangeMulti}
                  isMulti={true}
                />
              ) : (
                <BaseSelect<T>
                  {...baseSelectProps}
                  value={field.value as T | null}
                  onChange={onChangeSingle}
                  isMulti={false}
                />
              )}
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
