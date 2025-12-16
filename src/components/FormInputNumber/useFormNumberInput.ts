import type { KeyboardEvent } from 'react';
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form';
import type { NumericFormatProps } from 'react-number-format';

import { cn } from '@/lib/utils';

const numericInputBaseClass = [
  '[appearance:textfield]',
  '[&::-webkit-outer-spin-button]:appearance-none',
  '[&::-webkit-inner-spin-button]:appearance-none',
  'rounded-r-none',
  'relative'
];

type PassthroughProps = Partial<
  Omit<
    NumericFormatProps<HTMLInputElement>,
    'value' | 'onValueChange' | 'placeholder' | 'max' | 'min' | 'name' | 'onChange'
  >
>;

type HandlerArgs<TFieldValues extends FieldValues> = {
  currentValue: number | undefined;
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
};

type UseFormNumberInputParams<TFieldValues extends FieldValues> = {
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
  inputClassName?: string;
  stepper: number;
  min: number;
  max: number;
  onChange?: (value: number | undefined) => void;
  passthroughProps: PassthroughProps;
};

export function useFormNumberInput<TFieldValues extends FieldValues>({
  rules,
  inputClassName,
  stepper,
  min,
  max,
  onChange,
  passthroughProps
}: UseFormNumberInputParams<TFieldValues>) {
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

  const numericClass = cn(numericInputBaseClass, inputClassName);

  const getHandlers = ({ currentValue, field }: HandlerArgs<TFieldValues>) => {
    const handleIncrement = () => {
      const base = currentValue ?? 0;
      const next = Math.min(base + stepper, max);
      field.onChange(next);
      onChange?.(next);
    };

    const handleDecrement = () => {
      const base = currentValue ?? 0;
      const next = Math.max(base - stepper, min);
      field.onChange(next);
      onChange?.(next);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleIncrement();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleDecrement();
      }

      if (passthroughProps.onKeyDown) {
        (passthroughProps.onKeyDown as any)(e);
      }
    };

    const handleBlur = () => {
      const cur = currentValue;
      if (cur !== undefined) {
        if (cur < min) {
          field.onChange(min);
          onChange?.(min);
        } else if (cur > max) {
          field.onChange(max);
          onChange?.(max);
        }
      }
      field.onBlur();
      if (passthroughProps.onBlur) (passthroughProps.onBlur as any)();
    };

    const numericOnValueChange = (values: { value: string; floatValue: number | undefined }) => {
      const newValue = values.floatValue === undefined ? undefined : values.floatValue;
      field.onChange(newValue);
      onChange?.(newValue);
    };

    return {
      handleIncrement,
      handleDecrement,
      handleKeyDown,
      handleBlur,
      numericOnValueChange
    };
  };

  return {
    isRequired,
    enhancedRules,
    numericClass,
    getHandlers
  };
}
