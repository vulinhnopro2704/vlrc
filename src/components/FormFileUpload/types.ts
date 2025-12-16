import type React from 'react';
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';

export interface FormFileUploadProps<T extends FieldValues> extends Omit<
  React.ComponentProps<'div'>,
  'defaultValue' | 'onChange'
> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
  label?: string;
  description?: string;
  onAccept?: (files: File[]) => void;
  onFileAccept?: (file: File) => void;
  onFileValidate?: (file: File) => string | null | undefined;
  onUpload?: (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    }
  ) => Promise<void> | void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  dir?: 'ltr' | 'rtl';
  asChild?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  multiple?: boolean;
  required?: boolean;
  children?: React.ReactNode;
  dropzoneClassName?: string;
  onFileReject?: (file: File, message: string) => void;
}
