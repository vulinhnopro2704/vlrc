import type { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RangeDatePicker } from './RangeDatePicker';
import { SingleDatePicker } from './SingleDatePicker';
import type { FormDatePickerProps } from './types';
import { useFormDatePicker } from './useFormDatePicker';

function FormDatePicker<TFieldValues extends FieldValues>(
  props: FormDatePickerProps<TFieldValues>
) {
  const {
    control,
    name,
    label,
    placeholder,
    status,
    size = 'large',
    width = 'auto',
    pickerType = 'date',
    dateFormat: customFormat,
    showTime,
    disabled = false,
    hideValue = false,
    allowClear = false,
    isRangePicker = false,
    onChangeDate,
    onChangeRange,
    rules = {},
    hideErrorMessage = false,
    suffixIcon,
    className,
    disabledDate,
    disabledTime
  } = props;

  const { dateFormat, isRequired, processedRules, handleRangeChange, handleSingleChange } =
    useFormDatePicker({
      pickerType,
      showTime,
      dateFormat: customFormat,
      rules,
      onChangeDate,
      onChangeRange
    });

  const renderRangePicker = (
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>
  ) => (
    <RangeDatePicker
      value={field.value || [undefined, undefined]}
      onChange={dates => handleRangeChange(field, dates)}
      placeholder={placeholder}
      dateFormat={dateFormat}
      showTime={showTime}
      size={size}
      status={status}
      width={width}
      disabled={disabled}
      allowClear={allowClear}
      hideValue={hideValue}
      suffixIcon={suffixIcon}
      className={className}
      disabledDate={disabledDate}
    />
  );

  const renderSinglePicker = (
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>
  ) => (
    <SingleDatePicker
      value={field.value}
      onChange={date => handleSingleChange(field, date)}
      placeholder={placeholder}
      pickerType={pickerType}
      dateFormat={dateFormat}
      showTime={showTime}
      size={size}
      status={status}
      width={width}
      disabled={disabled}
      allowClear={allowClear}
      hideValue={hideValue}
      suffixIcon={suffixIcon}
      className={className}
      disabledDate={disabledDate}
      disabledTime={disabledTime}
    />
  );

  return (
    <FormField
      control={control}
      name={name}
      rules={processedRules}
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          {label && (
            <FormLabel>
              {label}
              {isRequired && <span className='text-destructive ml-1'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            {isRangePicker ? renderRangePicker(field) : renderSinglePicker(field)}
          </FormControl>
          {!hideErrorMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
}

export default FormDatePicker;
