import type { FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';

import type { FormRadioProps, RadioSize } from './types';

export type UseFormRadioParams<TFieldValues extends FieldValues> = Pick<
  FormRadioProps<TFieldValues>,
  'rules' | 'value' | 'onChange' | 'showEmpty'
>;

export function useFormRadio<TFieldValues extends FieldValues>(
  params: UseFormRadioParams<TFieldValues>
) {
  const { rules = {}, value, onChange, showEmpty } = params;

  const isRequired = rules.required !== undefined && rules.required !== false;
  const processedRules = buildEnhancedRules(rules, isRequired);

  const parseValue = (fieldValue: unknown) => {
    if (value !== undefined) return String(value);
    if (showEmpty) return '';
    return String(fieldValue ?? '');
  };

  const emitChange = (fieldOnChange: (value: unknown) => void, newValue: string) => {
    fieldOnChange(newValue);
    onChange?.(newValue);
  };

  return {
    isRequired,
    processedRules,
    parseValue,
    emitChange,
    sizeClasses: radioSizeClasses
  };
}

export const radioSizeClasses: Record<RadioSize, string> = {
  large: 'size-5',
  middle: 'size-4',
  small: 'size-3.5'
};

function buildEnhancedRules<TFieldValues extends FieldValues>(
  rules: RegisterOptions<TFieldValues, FieldPath<TFieldValues>> = {},
  isRequired: boolean
) {
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
}
