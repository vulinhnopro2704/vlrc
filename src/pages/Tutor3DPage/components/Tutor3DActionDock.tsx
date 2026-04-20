import type { FC } from 'react';
import { Play, RotateCw, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTutor3DStore } from '@/stores/tutor-3d';
import { toast } from 'sonner';

export const Tutor3DActionDock: FC<{
  selectedFileName: string;
  playAudio: () => void;
  stopPlayback: () => void;
}> = ({ selectedFileName, playAudio, stopPlayback }) => {
  const autoRotate = useTutor3DStore(s => s.autoRotate);
  const setAutoRotate = useTutor3DStore(s => s.setAutoRotate);

  const handlePlay = () => {
    if (!selectedFileName) {
      toast.error('Please select an audio file first.');
      return;
    }
    playAudio();
  };

  return (
    <div className='pointer-events-none absolute inset-0 z-20'>
      <div className='pointer-events-auto absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-2'>
        <Button
          size='icon'
          onClick={handlePlay}
          className='h-11 w-11 rounded-xl bg-sky-500 text-white shadow-xl hover:bg-sky-600'
          aria-label='Play audio'>
          <Play size={18} />
        </Button>
        <Button
          size='icon'
          variant='outline'
          onClick={stopPlayback}
          className='h-11 w-11 rounded-xl border-white/35 bg-slate-900/70 text-slate-100 shadow-xl hover:bg-white/15'
          aria-label='Stop audio'>
          <Square size={18} />
        </Button>
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
