import { Controller } from 'react-hook-form';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@components/ui/field';
import type { FormBaseProps } from './types';
import type { FieldPath } from 'react-hook-form';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

export default function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>({
  children,
  label,
  control,
  name,
  htmlType,
  description,
  controlFirst,
  horizontal,
  rules
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  const processedRules = (() => {
    const autoRules: RegisterOptions<TFieldValues, TName> = { ...rules };
    if (htmlType === 'email' && !rules?.pattern) {
      autoRules.pattern = {
        value: EMAIL_PATTERN,
        message: 'Email không hợp lệ'
      };
    }
    if (htmlType === 'tel' && !rules?.pattern) {
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

  return (
    <Controller
      control={control}
      name={name}
      rules={processedRules}
      render={({ field, fieldState }) => {
        const labelElement = (
          <>
            {label && (
              <FieldLabel htmlFor={field.name}>
                {label}
                {rules?.required && <span className='text-red-500 ml-1'>*</span>}
              </FieldLabel>
            )}
            {description && <FieldDescription>{description}</FieldDescription>}
          </>
        );
        const control = children({
          ...field,
          id: field.name,
          'aria-invalid': fieldState.invalid
        });
        const errorElem = fieldState.invalid && <FieldError errors={[fieldState.error]} />;

        return (
          <Field
            data-invalid={fieldState.invalid}
            orientation={horizontal ? 'horizontal' : undefined}>
            {controlFirst ? (
              <>
                {control}
                <FieldContent>
                  {labelElement}
                  {errorElem}
                </FieldContent>
              </>
            ) : (
              <>
                <FieldContent>{labelElement}</FieldContent>
                {control}
                {errorElem}
              </>
            )}
          </Field>
        );
      }}
    />
  );
}
