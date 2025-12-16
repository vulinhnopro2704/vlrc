import type { ChangeEvent } from 'react';
import type { FieldValues } from 'react-hook-form';

import type { FormTextareaProps } from './types';

export function useFormTextarea<TFieldValues extends FieldValues>(
  props: FormTextareaProps<TFieldValues>
) {
  const { rules, value, autoHeightMax, showEmpty = false, onChange } = props;

  const isRequired = rules?.required !== undefined && rules.required !== false;

  const enhancedRules = (() => {
    if (!rules) return rules;

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
  })();

  const textareaStyle = autoHeightMax ? { maxHeight: `${autoHeightMax}px` } : undefined;

  const getValue = (fieldValue: unknown) =>
    value !== undefined
      ? value
      : ((fieldValue as string | undefined) ?? (showEmpty ? '' : undefined));

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    fieldOnChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  ) => {
    fieldOnChange(e);
    onChange?.(e);
  };

  return {
    isRequired,
    enhancedRules,
    textareaStyle,
    getValue,
    handleChange
  } as const;
}
