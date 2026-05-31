import type {
  Control,
  FieldPath,
  FieldPathValue,
  FieldValues,
  RegisterOptions
} from 'react-hook-form';

export type RadioSize = 'large' | 'middle' | 'small';

export type RadioOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

export interface FormRadioProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  size?: RadioSize;
  options?: RadioOption[];
  onChange?: (value?: string) => void;
  value?: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
  disabled?: boolean;
  optionType?: 'default' | 'button';
  buttonStyle?: 'outline' | 'solid';
  autoHeightMax?: number;
  showEmpty?: boolean;
  hideErrorMessage?: boolean;
  className?: string;
}
