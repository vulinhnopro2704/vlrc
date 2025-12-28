import type { Control, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import type { BaseSelectCommonProps, SelectValue } from '@components/Select/type';

/**
 * Common props for form select
 */
export interface FormSelectCommonProps<
  TFieldValues extends FieldValues,
  T extends SelectValue = SelectValue
> extends BaseSelectCommonProps<T> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
}

/**
 * Props for multi-select form field
 */
export interface FormMultiSelectProps<
  TFieldValues extends FieldValues,
  T extends SelectValue = SelectValue
> extends FormSelectCommonProps<TFieldValues, T> {
  isMulti: true;
  onChange?: (value: T[]) => void;
}

/**
 * Props for single-select form field
 */
export interface FormSingleSelectProps<
  TFieldValues extends FieldValues,
  T extends SelectValue = SelectValue
> extends FormSelectCommonProps<TFieldValues, T> {
  isMulti?: false;
  onChange?: (value: T | null) => void;
}

/**
 * Union type for FormSelect props
 */
export type FormSelectProps<
  TFieldValues extends FieldValues,
  T extends SelectValue = SelectValue
> = FormMultiSelectProps<TFieldValues, T> | FormSingleSelectProps<TFieldValues, T>;

/**
 * Props for wrapper components (omitting options since they fetch their own data)
 */
export type WrapperSelectProps<
  TFieldValues extends FieldValues,
  T extends SelectValue = SelectValue
> = Omit<FormSelectProps<TFieldValues, T>, 'options' | 'onSearchTextChange'>;

/**
 * Utility type to extract single select props for wrappers
 */
export type WrapperSingleSelectProps<
  TFieldValues extends FieldValues,
  T extends SelectValue = SelectValue
> = Omit<FormSingleSelectProps<TFieldValues, T>, 'options' | 'onSearchTextChange'>;

/**
 * Utility type to extract multi select props for wrappers
 */
export type WrapperMultiSelectProps<
  TFieldValues extends FieldValues,
  T extends SelectValue = SelectValue
> = Omit<FormMultiSelectProps<TFieldValues, T>, 'options' | 'onSearchTextChange'>;
