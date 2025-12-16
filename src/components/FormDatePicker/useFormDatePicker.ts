import { format, isValid } from 'date-fns';
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form';

import type {
  ConfigType,
  DatePickerSize,
  DatePickerStatus,
  DisabledTime,
  FormDatePickerProps,
  PickerType,
  TimeConfig
} from './types';

export type UseFormDatePickerParams<TFieldValues extends FieldValues> = Pick<
  FormDatePickerProps<TFieldValues>,
  'pickerType' | 'showTime' | 'dateFormat' | 'rules' | 'onChangeDate' | 'onChangeRange'
>;

export function useFormDatePicker<TFieldValues extends FieldValues>(
  params: UseFormDatePickerParams<TFieldValues>
) {
  const {
    pickerType = 'date',
    showTime,
    dateFormat: customFormat,
    rules = {},
    onChangeDate,
    onChangeRange
  } = params;

  const dateFormat = customFormat || getDefaultFormat(pickerType, showTime);
  const isRequired = rules.required !== undefined && rules.required !== false;
  const processedRules = buildEnhancedRules(rules, isRequired);

  const handleRangeChange = (
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>,
    dates: [Date | undefined, Date | undefined]
  ) => {
    field.onChange(dates);
    if (onChangeRange) {
      const dateStrings: [string, string] = [
        dates[0] ? formatDateValue(dates[0], dateFormat) : '',
        dates[1] ? formatDateValue(dates[1], dateFormat) : ''
      ];
      onChangeRange(dates as [ConfigType, ConfigType], dateStrings);
    }
  };

  const handleSingleChange = (
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>,
    date: Date | undefined
  ) => {
    field.onChange(date);
    if (onChangeDate) {
      onChangeDate(date as ConfigType, date ? formatDateValue(date, dateFormat) : '');
    }
  };

  return {
    dateFormat,
    isRequired,
    processedRules,
    handleRangeChange,
    handleSingleChange
  };
}

export const buildTimeConfig = (
  showTime: boolean | TimeConfig | undefined,
  pickerType: PickerType
): TimeConfig | undefined => {
  if (typeof showTime === 'object') return showTime;
  if (showTime === true) return { showSecond: true };
  if (pickerType === 'time') return { showSecond: true };
  return undefined;
};

export const buildDisabledTime = (
  value: Date | undefined,
  disabledTime?: DisabledTime | ((date: Date) => DisabledTime)
): DisabledTime | undefined => {
  if (!disabledTime) return undefined;
  if (typeof disabledTime === 'function' && value) {
    return disabledTime(value);
  }
  return disabledTime as DisabledTime;
};

export const buildRangeDisplayValue = (
  startDate: Date | undefined,
  endDate: Date | undefined,
  dateFormat: string
): string => {
  if (!startDate && !endDate) return '';
  const start = startDate ? formatDateValue(startDate, dateFormat) : '';
  const end = endDate ? formatDateValue(endDate, dateFormat) : '';
  if (start && end) return `${start} ~ ${end}`;
  if (start) return start;
  return '';
};

export const getSizeClassName = (size?: DatePickerSize): string => {
  switch (size) {
    case 'small':
      return 'h-8 text-xs';
    case 'large':
      return 'h-12 text-base';
    case 'medium':
    default:
      return 'h-10 text-sm';
  }
};

export const getStatusClassName = (status?: DatePickerStatus): string => {
  switch (status) {
    case 'error':
      return 'border-destructive focus-visible:ring-destructive';
    case 'warning':
      return 'border-yellow-500 focus-visible:ring-yellow-500';
    default:
      return '';
  }
};

export const getDefaultFormat = (
  pickerType: PickerType,
  showTime?: boolean | TimeConfig
): string => {
  if (pickerType === 'time') {
    if (typeof showTime === 'object' && showTime.format) {
      return showTime.format;
    }
    return 'HH:mm:ss';
  }
  if (pickerType === 'month') return 'MM/yyyy';
  if (pickerType === 'year') return 'yyyy';
  if (pickerType === 'datetime' || showTime) {
    if (typeof showTime === 'object' && showTime.format) {
      return `dd/MM/yyyy ${showTime.format}`;
    }
    return 'dd/MM/yyyy HH:mm:ss';
  }
  return 'dd/MM/yyyy';
};

export const formatDateValue = (date: Date | null | undefined, formatStr: string): string => {
  if (!date || !isValid(date)) return '';
  try {
    return format(date, formatStr);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return '';
  }
};

function buildEnhancedRules<TFieldValues extends FieldValues>(
  rules: RegisterOptions<TFieldValues, FieldPath<TFieldValues>> = {},
  isRequired: boolean
) {
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
}
