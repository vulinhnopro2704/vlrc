import React from 'react';
import { CalendarIcon, Clock } from 'lucide-react';
import { vi } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type {
  DatePickerSize,
  DatePickerStatus,
  DisabledTime,
  PickerType,
  TimeConfig
} from './types';
import { TimeInput } from './TimeInput';
import { TimePicker } from './TimePicker';
import {
  buildDisabledTime,
  buildTimeConfig,
  formatDateValue,
  getSizeClassName,
  getStatusClassName
} from './useFormDatePicker';

interface SingleDatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  pickerType: PickerType;
  dateFormat: string;
  showTime?: boolean | TimeConfig;
  size?: DatePickerSize;
  status?: DatePickerStatus;
  width?: string;
  disabled?: boolean;
  allowClear?: boolean;
  hideValue?: boolean;
  suffixIcon?: ReactNode;
  className?: string;
  disabledDate?: (date: Date) => boolean;
  disabledTime?: DisabledTime | ((date: Date) => DisabledTime);
}

export function SingleDatePicker({
  value,
  onChange,
  placeholder = 'Select Date',
  pickerType,
  dateFormat,
  showTime,
  size = 'large',
  status,
  width = 'auto',
  disabled,
  allowClear,
  hideValue,
  suffixIcon,
  className,
  disabledDate,
  disabledTime
}: SingleDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const timeConfig = buildTimeConfig(showTime, pickerType);

  const displayValue = value ? formatDateValue(value, dateFormat) : '';

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined);
      if (pickerType === 'date' || !showTime) {
        setOpen(false);
      }
      return;
    }

    let newDate = date;

    if (showTime && value) {
      newDate = new Date(date);
      newDate.setHours(value.getHours(), value.getMinutes(), value.getSeconds());
    }

    onChange(newDate);

    if (pickerType === 'date' && !showTime) {
      setOpen(false);
    }
  };

  const handleTimeChange = (date: Date) => {
    onChange(date);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  const renderIcon = () => {
    if (suffixIcon) return suffixIcon;
    if (pickerType === 'time') return <Clock className='h-4 w-4 opacity-50' />;
    return <CalendarIcon className='h-4 w-4 opacity-50' />;
  };

  const renderContent = () => {
    if (pickerType === 'time') {
      return (
        <div className='p-2'>
          <TimePicker
            value={value}
            onChange={handleTimeChange}
            timeConfig={timeConfig}
            disabledTime={buildDisabledTime(value, disabledTime)}
          />
          <div className='mt-2 pt-2 border-t'>
            <TimeInput value={value} onChange={handleTimeChange} timeConfig={timeConfig} />
          </div>
        </div>
      );
    }

    return (
      <div className='flex'>
        <Calendar
          mode='single'
          selected={value}
          onSelect={handleDateSelect}
          disabled={disabledDate}
          captionLayout='dropdown'
          locale={vi}
          month={value}
          hidden={{
            after: new Date(new Date().getFullYear() + 50, 11, 31)
          }}
          onMonthChange={month => {
            if (pickerType === 'month') {
              onChange(month);
              setOpen(false);
            }
          }}
        />
        {showTime && (
          <TimePicker
            value={value}
            onChange={handleTimeChange}
            timeConfig={timeConfig}
            disabledTime={buildDisabledTime(value, disabledTime)}
          />
        )}
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          disabled={disabled}
          className={cn(
            'justify-between font-normal',
            getSizeClassName(size),
            getStatusClassName(status),
            !value && 'text-muted-foreground',
            width === 'auto' ? 'w-full' : '',
            className
          )}
          style={width !== 'auto' ? { width } : undefined}>
          {!hideValue && displayValue ? displayValue : <span>{placeholder}</span>}
          <div className='ml-auto flex items-center gap-1'>
            {allowClear && value && (
              <span onClick={handleClear} className='hover:text-destructive cursor-pointer'>
                ×
              </span>
            )}
            {renderIcon()}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        {renderContent()}
      </PopoverContent>
    </Popover>
  );
}

export default SingleDatePicker;
