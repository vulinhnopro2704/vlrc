'use client';

import type { FieldValues, Path, RegisterOptions } from 'react-hook-form';

import type { FormFileUploadProps } from './types';

export function useFormFileUpload<T extends FieldValues>(props: FormFileUploadProps<T>) {
  const { rules } = props;

  const processedRules = (() => {
    const autoRules: RegisterOptions<T, Path<T>> = { ...rules };

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

  const isRequired = !!rules?.required;

  return {
    processedRules,
    isRequired
  } as const;
}
