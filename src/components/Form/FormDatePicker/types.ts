import type { ReactNode } from 'react';
import type {
  Control,
  FieldPath,
  FieldPathValue,
  FieldValues,
  RegisterOptions
} from 'react-hook-form';

export type PickerType = 'date' | 'time' | 'datetime' | 'month' | 'year';

export type DatePickerSize = 'small' | 'medium' | 'large';

export type DatePickerStatus = 'error' | 'warning' | undefined;

export type ConfigType = Date | null | undefined;

export type TimeConfig = {
  showHour?: boolean;
  showMinute?: boolean;
  showSecond?: boolean;
  format?: string;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  defaultValue?: Date;
};

export interface DisabledTime {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
}

export interface DatePickerBaseProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: ReactNode;
  placeholder?: string;
  status?: DatePickerStatus;
  size?: DatePickerSize;
  width?: string;
  pickerType?: PickerType;
  dateFormat?: string;
  showTime?: boolean | TimeConfig;
  disabled?: boolean;
  multiple?: boolean;
  hideValue?: boolean;
  allowClear?: boolean;
  onBlur?: () => void;
  value?: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
  hideErrorMessage?: boolean;
  suffixIcon?: ReactNode;
  className?: string;
  disabledDate?: (date: Date) => boolean;
  cellRender?: (date: Date) => ReactNode;
  disabledTime?: DisabledTime | ((date: Date) => DisabledTime);
}

export interface SingleDatePickerProps<
  TFieldValues extends FieldValues
> extends DatePickerBaseProps<TFieldValues> {
  isRangePicker?: false;
  onChangeDate?: (date: ConfigType, dateString: string) => void;
  onChangeRange?: never;
}

export interface RangeDatePickerProps<
  TFieldValues extends FieldValues
> extends DatePickerBaseProps<TFieldValues> {
  isRangePicker: true;
  onChangeDate?: never;
  onChangeRange?: (dates: [ConfigType, ConfigType], dateStrings: [string, string]) => void;
}

export type FormDatePickerProps<TFieldValues extends FieldValues> =
  | SingleDatePickerProps<TFieldValues>
  | RangeDatePickerProps<TFieldValues>;
