import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { TimeConfig } from './types';

interface TimeInputProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  timeConfig?: TimeConfig;
  className?: string;
}

export function TimeInput({ value, onChange, timeConfig, className }: TimeInputProps) {
  const showHour = timeConfig?.showHour !== false;
  const showMinute = timeConfig?.showMinute !== false;
  const showSecond = timeConfig?.showSecond ?? false;

  const currentDate = value || new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const [hourInput, setHourInput] = React.useState(hours.toString().padStart(2, '0'));
  const [minuteInput, setMinuteInput] = React.useState(minutes.toString().padStart(2, '0'));
  const [secondInput, setSecondInput] = React.useState(seconds.toString().padStart(2, '0'));

  React.useEffect(() => {
    setHourInput(hours.toString().padStart(2, '0'));
    setMinuteInput(minutes.toString().padStart(2, '0'));
    setSecondInput(seconds.toString().padStart(2, '0'));
  }, [hours, minutes, seconds]);

  const handleInputChange = (type: 'hour' | 'minute' | 'second', inputValue: string) => {
    const numValue = parseInt(inputValue, 10);
    if (Number.isNaN(numValue)) return;

    let max = 59;
    if (type === 'hour') max = 23;

    if (numValue < 0 || numValue > max) return;

    const newDate = new Date(currentDate);
    if (type === 'hour') newDate.setHours(numValue);
    else if (type === 'minute') newDate.setMinutes(numValue);
    else newDate.setSeconds(numValue);

    onChange(newDate);
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {showHour && (
        <>
          <Input
            type='number'
            min={0}
            max={23}
            value={hourInput}
            onChange={e => setHourInput(e.target.value)}
            onBlur={e => handleInputChange('hour', e.target.value)}
            className='w-14 text-center'
          />
          {(showMinute || showSecond) && <span>:</span>}
        </>
      )}
      {showMinute && (
        <>
          <Input
            type='number'
            min={0}
            max={59}
            value={minuteInput}
            onChange={e => setMinuteInput(e.target.value)}
            onBlur={e => handleInputChange('minute', e.target.value)}
            className='w-14 text-center'
          />
          {showSecond && <span>:</span>}
        </>
      )}
      {showSecond && (
        <Input
          type='number'
          min={0}
          max={59}
          value={secondInput}
          onChange={e => setSecondInput(e.target.value)}
          onBlur={e => handleInputChange('second', e.target.value)}
          className='w-14 text-center'
        />
      )}
    </div>
  );
}

export default TimeInput;
