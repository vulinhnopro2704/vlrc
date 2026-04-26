import type { FC } from 'react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTutor3DStore } from '@/stores/tutor-3d';

export const Tutor3DActionDock: FC = () => {
  const autoRotate = useTutor3DStore(s => s.autoRotate);
  const { setAutoRotate } = useTutor3DStore(s => s.actions);

  return (
    <div className='pointer-events-none absolute inset-0 z-20'>
      <div className='pointer-events-auto absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-2'>
        <Button
          size='icon'
          variant='outline'
          onClick={() => setAutoRotate(value => !value)}
          className='h-11 w-11 rounded-xl border-white/35 bg-slate-900/70 text-slate-100 shadow-xl hover:bg-white/15'
          aria-label='Toggle auto rotate'>
          <RotateCw size={18} className={cn(autoRotate && 'text-sky-300')} />
        </Button>
      </div>
    </div>
  );
};
