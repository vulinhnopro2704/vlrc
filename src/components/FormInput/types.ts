import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';

export type InputSize = 'sm' | 'md' | 'lg' | 'xl';

export interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  rules?: RegisterOptions<T, Path<T>>;
  label?: string;
  size?: InputSize;
  className?: string;
  disabled?: boolean;
}
