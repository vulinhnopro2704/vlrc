import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface StepperControlsProps {
  onIncrement: () => void;
  onDecrement: () => void;
  disableIncrement: boolean;
  disableDecrement: boolean;
}

export function StepperControls({
  onIncrement,
  onDecrement,
  disableIncrement,
  disableDecrement
}: StepperControlsProps) {
  return (
    <div className='flex flex-col ml-1'>
      <Button
        aria-label='Increase value'
        className='px-2 h-5 rounded-l-none rounded-br-none border-input border-l-0 border-b-[0.5px] focus-visible:relative'
        variant='outline'
        onClick={onIncrement}
        disabled={disableIncrement}
        type='button'>
        <ChevronUp size={15} />
      </Button>
      <Button
        aria-label='Decrease value'
        className='px-2 h-5 rounded-l-none rounded-tr-none border-input border-l-0 border-t-[0.5px] focus-visible:relative'
        variant='outline'
        onClick={onDecrement}
        disabled={disableDecrement}
        type='button'>
        <ChevronDown size={15} />
      </Button>
    </div>
  );
}
