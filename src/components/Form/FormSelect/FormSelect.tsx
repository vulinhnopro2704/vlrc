import React from 'react';
import type { FieldValues } from 'react-hook-form';
import { FormBase } from '@/components/Form/Form';
import type { FormMultiSelectProps, FormSingleSelectProps } from './types';
import { useFormSelect } from './useFormSelect';
import BaseSelect from '@/components/Select';
import type { SelectValue } from '@/components/Select';

export function FormSelect<TFieldValues extends FieldValues, T extends SelectValue = SelectValue>(
  props: FormMultiSelectProps<TFieldValues, T>
): React.ReactElement;
export function FormSelect<TFieldValues extends FieldValues, T extends SelectValue = SelectValue>(
  props: FormSingleSelectProps<TFieldValues, T>
): React.ReactElement;
export function FormSelect<TFieldValues extends FieldValues, T extends SelectValue = SelectValue>(
  props: FormMultiSelectProps<TFieldValues, T> | FormSingleSelectProps<TFieldValues, T>
): React.ReactElement {
  const { baseSelectProps, isMulti, createChangeHandlers } = useFormSelect(props);

  return (
    <FormBase {...props}>
      {field => {
        const { onChangeMulti, onChangeSingle } = createChangeHandlers(field);
        return (
          <BaseSelect<T>
            {...baseSelectProps}
            isMulti={isMulti}
            value={field.value as any}
            onChange={(isMulti ? onChangeMulti : onChangeSingle) as any}
          />
        );
      }}
    </FormBase>
  );
}
