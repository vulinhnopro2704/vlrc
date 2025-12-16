import type { Control, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import type { NumericFormatProps } from 'react-number-format';

export interface FormNumberInputProps<TFieldValues extends FieldValues> extends Partial<
  Omit<
    NumericFormatProps<HTMLInputElement>,
    'value' | 'onValueChange' | 'placeholder' | 'max' | 'min' | 'name' | 'onChange'
  >
> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  stepper?: number;
  thousandSeparator?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  suffix?: string;
  prefix?: string;
  fixedDecimalScale?: boolean;
  decimalScale?: number;
  inputClassName?: string;
  onChange?: (value: number | undefined) => void;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
  description?: string;
}
