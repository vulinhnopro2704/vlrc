import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { DisabledTime, TimeConfig } from './types';

interface TimePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  timeConfig?: TimeConfig;
  disabledTime?: DisabledTime;
}

export function TimePicker({ value, onChange, timeConfig, disabledTime }: TimePickerProps) {
  const showHour = timeConfig?.showHour !== false;
  const showMinute = timeConfig?.showMinute !== false;
  const showSecond = timeConfig?.showSecond ?? false;
  const hourStep = timeConfig?.hourStep ?? 1;
  const minuteStep = timeConfig?.minuteStep ?? 1;
  const secondStep = timeConfig?.secondStep ?? 1;

  const currentDate = value || new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const disabledHours = disabledTime?.disabledHours?.() || [];
  const disabledMinutes = disabledTime?.disabledMinutes?.(hours) || [];
  const disabledSeconds = disabledTime?.disabledSeconds?.(hours, minutes) || [];

  const handleTimeChange = (type: 'hour' | 'minute' | 'second', newValue: number) => {
    const newDate = new Date(currentDate);
    if (type === 'hour') newDate.setHours(newValue);
    else if (type === 'minute') newDate.setMinutes(newValue);
    else newDate.setSeconds(newValue);
    onChange(newDate);
  };

  const renderTimeColumn = (
    type: 'hour' | 'minute' | 'second',
    max: number,
    step: number,
    current: number,
    disabledValues: number[]
  ) => {
    const values = [] as number[];
    for (let i = 0; i < max; i += step) {
      values.push(i);
    }

    return (
      <ScrollArea className='h-[240px] w-16'>
        <div className='flex flex-col'>
          {values.map(val => {
            const isDisabled = disabledValues.includes(val);
            return (
              <button
                key={val}
                type='button'
                disabled={isDisabled}
                onClick={() => handleTimeChange(type, val)}
                className={cn(
                  'px-2 py-1 text-center hover:bg-accent transition-colors',
                  current === val && 'bg-primary text-primary-foreground hover:bg-primary/90',
                  isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
                )}>
                {val.toString().padStart(2, '0')}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className='flex gap-1 p-1'>
      {showHour && (
        <div className='flex flex-col items-center'>
          <span className='text-xs font-medium mb-1'>Giờ</span>
          {renderTimeColumn('hour', 24, hourStep, hours, disabledHours)}
        </div>
      )}
      {showMinute && (
        <div className='flex flex-col items-center'>
          <span className='text-xs font-medium mb-1'>Phút</span>
          {renderTimeColumn('minute', 60, minuteStep, minutes, disabledMinutes)}
        </div>
      )}
      {showSecond && (
        <div className='flex flex-col items-center'>
          <span className='text-xs font-medium mb-1'>Giây</span>
          {renderTimeColumn('second', 60, secondStep, seconds, disabledSeconds)}
        </div>
      )}
    </div>
  );
}

export default TimePicker;
