import type React from 'react';
import type {
  Control,
  FieldPath,
  FieldPathValue,
  FieldValues,
  RegisterOptions
} from 'react-hook-form';

export interface FormTextareaProps<TFieldValues extends FieldValues> extends Omit<
  React.ComponentProps<'textarea'>,
  'name' | 'defaultValue'
> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
  description?: string;
  value?: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>;
  autoHeightMax?: number;
  showEmpty?: boolean;
  hideErrorMessage?: boolean;
  className?: string;
}
