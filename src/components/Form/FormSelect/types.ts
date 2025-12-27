import React from 'react';
import type { Control, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';

/**
 * Base value types supported by select components
 */
export type SelectValue = string | number;

/**
 * Option structure for select components
 */
export interface BaseSelectOption<T extends SelectValue = SelectValue> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

/**
 * Common props shared by all select variants
 */
export interface BaseSelectCommonProps<T extends SelectValue = SelectValue> {
  options: BaseSelectOption<T>[];
  injectOptions?: BaseSelectOption<T>[];
  placeholder?: string;
  isClearable?: boolean;
  isSearchable?: boolean;
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
  onSearchTextChange?: (searchText: string) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  maxTagCount?: number | 'responsive';
  tagRender?: (option: BaseSelectOption<T>, onRemove: () => void) => React.ReactNode;
  showSelectAll?: boolean;
  allowClear?: boolean;
}

/**
 * Props for multi-select (BaseSelect)
 */
export interface BaseMultiSelectProps<
  T extends SelectValue = SelectValue
> extends BaseSelectCommonProps<T> {
  value?: T[];
  onChange?: (value: T[]) => void;
  isMulti: true;
}

/**
 * Props for single-select (BaseSelect)
 */
export interface BaseSingleSelectProps<
  T extends SelectValue = SelectValue
> extends BaseSelectCommonProps<T> {
  value?: T | null;
  onChange?: (value: T | null) => void;
  isMulti?: false;
}

/**
 * Union type for BaseSelect props
 */
export type BaseSelectProps<T extends SelectValue = SelectValue> =
  | BaseMultiSelectProps<T>
  | BaseSingleSelectProps<T>;

/**
 * Shared subset passed from FormSelect into BaseSelect to avoid repeating prop lists
 */
export type BaseSelectPassThroughProps<T extends SelectValue = SelectValue> = Pick<
  BaseSelectCommonProps<T>,
  | 'options'
  | 'injectOptions'
  | 'placeholder'
  | 'isClearable'
  | 'isSearchable'
  | 'isLoading'
  | 'className'
  | 'disabled'
  | 'onSearchTextChange'
  | 'hasNextPage'
  | 'isFetchingNextPage'
  | 'fetchNextPage'
  | 'maxTagCount'
  | 'tagRender'
  | 'showSelectAll'
>;

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
