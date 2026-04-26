import type { FC } from 'react';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useTutor3DStore } from '@/stores/tutor-3d';
import { Button } from '@/components/ui/button';
import type { VISEMES } from 'wawa-lipsync';

export const Tutor3DHeader: FC<{
  liveVisemeRef: React.MutableRefObject<VISEMES>;
}> = ({ liveVisemeRef }) => {
  const isControlPanelOpen = useTutor3DStore(s => s.isControlPanelOpen);
  const { setIsControlPanelOpen } = useTutor3DStore(s => s.actions);
  const selectedAnimation = useTutor3DStore(s => s.selectedAnimation);

  return (
    <div className='pointer-events-none absolute inset-0 z-20'>
      <div className='pointer-events-auto absolute left-4 top-4 w-[min(90vw,400px)] rounded-2xl border border-white/20 bg-slate-900/70 p-4 text-slate-100 shadow-2xl backdrop-blur-xl'>
        <div className='flex items-center justify-between gap-3'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-300'>
              Tutor 3D
            </p>
            <h1 className='text-xl font-semibold'>Immersive QA</h1>
          </div>
          <Button
            size='icon'
            variant='ghost'
            onClick={() => setIsControlPanelOpen(value => !value)}
            className='text-slate-200 hover:bg-white/10 hover:text-white'
            aria-label={isControlPanelOpen ? 'Hide settings panel' : 'Show settings panel'}>
            {isControlPanelOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
          </Button>
        </div>
        <div className='mt-3 grid grid-cols-2 gap-2 text-xs text-slate-200/90'>
          <div className='rounded-lg border border-white/15 bg-black/25 p-2'>
            <p className='text-[11px] uppercase tracking-[0.14em] text-slate-300/90'>Animation</p>
            <p className='mt-1 font-medium text-white'>{selectedAnimation}</p>
          </div>
          <div className='rounded-lg border border-white/15 bg-black/25 p-2'>
            <p className='text-[11px] uppercase tracking-[0.14em] text-slate-300/90'>Viseme</p>
            <p className='mt-1 font-medium text-white'>{liveVisemeRef.current}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
