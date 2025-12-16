import React from 'react';
import type { ChangeEvent } from 'react';
import type { FieldValues, RegisterOptions } from 'react-hook-form';
import { cn } from '@/lib/utils';
import type { FormInputProps, InputSize } from './types';

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8 text-xs px-2.5',
  md: 'h-9 text-sm px-3',
  lg: 'h-10 text-base px-4',
  xl: 'h-12 text-lg px-5'
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

export function useFormInput<T extends FieldValues>(props: FormInputProps<T>) {
  const { name, type = 'text', rules, size = 'md', value, onChange } = props;

  const [showPassword, setShowPassword] = React.useState(false);

  const processedRules = (() => {
    const autoRules: RegisterOptions<T> = { ...rules };
    if (type === 'email' && !rules?.pattern) {
      autoRules.pattern = {
        value: EMAIL_PATTERN,
        message: 'Email không hợp lệ'
      };
    }
    if (type === 'tel' && !rules?.pattern) {
      autoRules.pattern = {
        value: PHONE_PATTERN,
        message: 'Số điện thoại không hợp lệ'
      };
    }

    if (rules?.required !== undefined && rules.required !== false) {
      if (typeof rules.required === 'string') {
        autoRules.required = rules.required;
      } else if (typeof rules.required === 'object') {
        if (!rules.required.message) {
          autoRules.required = {
            ...rules.required,
            message: 'Trường này là bắt buộc'
          };
        }
      } else {
        autoRules.required = 'Trường này là bắt buộc';
      }
    }

    return autoRules;
  })();

  const inputId = `input-${name}`;

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const isRequired = !!rules?.required;

  const buildInputClass = (hasError: boolean) =>
    cn(
      sizeClasses[size],
      hasError && 'border-destructive ring-destructive/20 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]',
      type === 'password' && 'pr-10'
    );

  const getInputValue = (fieldValue: unknown) =>
    value !== undefined ? value : ((fieldValue as string | undefined) ?? '');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldOnChange: (event: ChangeEvent<HTMLInputElement>) => void
  ) => {
    if (value === undefined) {
      fieldOnChange(e);
    }
    onChange?.(e.target.value);
  };

  const togglePassword = () => setShowPassword(v => !v);

  return {
    processedRules,
    inputId,
    inputType,
    isRequired,
    buildInputClass,
    getInputValue,
    handleChange,
    togglePassword,
    showPassword
  } as const;
}
