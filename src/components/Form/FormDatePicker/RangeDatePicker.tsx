import React from 'react';
import Icons from '@/components/Icons';
import { vi } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { DatePickerSize, DatePickerStatus, TimeConfig } from './types';
import { buildRangeDisplayValue, getSizeClassName, getStatusClassName } from './useFormDatePicker';

interface RangeDatePickerProps {
  value: [Date | undefined, Date | undefined];
  onChange: (dates: [Date | undefined, Date | undefined]) => void;
  placeholder?: string;
  dateFormat: string;
  showTime?: boolean | TimeConfig;
  size?: DatePickerSize;
  status?: DatePickerStatus;
  width?: string;
  disabled?: boolean;
  allowClear?: boolean;
  hideValue?: boolean;
  suffixIcon?: React.ReactNode;
  className?: string;
  disabledDate?: (date: Date) => boolean;
}

export function RangeDatePicker({
  value,
  onChange,
  placeholder = 'Select Date Range',
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
  disabledDate
}: RangeDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectingEnd, setSelectingEnd] = React.useState(false);

  const [startDate, endDate] = value;

  const displayValue = buildRangeDisplayValue(startDate, endDate, dateFormat);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!startDate || selectingEnd) {
      if (!startDate) {
        onChange([date, undefined]);
        setSelectingEnd(true);
      } else {
        const newEndDate = date < startDate ? startDate : date;
        const newStartDate = date < startDate ? date : startDate;
        onChange([newStartDate, newEndDate]);
        if (!showTime) {
          setOpen(false);
          setSelectingEnd(false);
        }
      }
    } else {
      const newEndDate = date < startDate ? startDate : date;
      const newStartDate = date < startDate ? date : startDate;
      onChange([newStartDate, newEndDate]);
      if (!showTime) {
        setOpen(false);
        setSelectingEnd(false);
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([undefined, undefined]);
    setSelectingEnd(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectingEnd(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          disabled={disabled}
          className={cn(
            'justify-between font-normal',
            getSizeClassName(size),
            getStatusClassName(status),
            !displayValue && 'text-muted-foreground',
            width === 'auto' ? 'w-full' : '',
            className
          )}
          style={width !== 'auto' ? { width } : undefined}>
          {!hideValue && displayValue ? displayValue : <span>{placeholder}</span>}
          <div className='ml-auto flex items-center gap-1'>
            {allowClear && (startDate || endDate) && (
              <span onClick={handleClear} className='hover:text-destructive cursor-pointer'>
                ×
              </span>
            )}
            {suffixIcon || <Icons.CalendarIcon className='h-4 w-4 opacity-50' />}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={selectingEnd ? endDate : startDate}
          onSelect={handleDateSelect}
          disabled={disabledDate}
          captionLayout='dropdown'
          hidden={{
            after: new Date(new Date().getFullYear() + 50, 11, 31)
          }}
          locale={vi}
        />
      </PopoverContent>
    </Popover>
  );
}

export default RangeDatePicker;
