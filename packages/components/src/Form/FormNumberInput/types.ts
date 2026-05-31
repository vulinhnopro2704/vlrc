import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import type { NumericFormatProps } from 'react-number-format';

import type { FormControlProps } from '../types';

export type FormNumberInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = FormControlProps<TFieldValues, TName, TTransformedValues> &
  Omit<NumericFormatProps<HTMLInputElement>, 'value' | 'onValueChange' | 'name' | 'onChange'> & {
    stepper?: number;
    thousandSeparator?: string;
    placeholder?: string;
    suffix?: string;
    prefix?: string;
    minValue?: number;
    maxValue?: number;
    fixedDecimalScale?: boolean;
    decimalScale?: number;
    inputClassName?: string;
    onChange?: (value: number | undefined) => void;
    rules?: ControllerProps<TFieldValues, TName, TTransformedValues>['rules'];
    horizontal?: boolean;
    controlFirst?: boolean;
  };
