import { useState, useRef, type FC } from 'react';
import { MessageCircle, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const Tutor3DChatPanel: FC<{
  chatMessages: Tutor3DManagement.ChatMessage[];
  onSendMessage: (text: string) => void;
  setAudioFile: (file: File | null) => void;
  selectedFileName: string;
}> = ({ chatMessages, onSendMessage, setAudioFile, selectedFileName }) => {
  const [chatInput, setChatInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setChatInput('');
    onSendMessage(trimmed);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setAudioFile(file);
  };

  return (
    <div className='pointer-events-none absolute inset-0 z-20'>
      <div className='pointer-events-auto absolute bottom-24 left-4 flex w-[min(90vw,420px)] flex-col gap-2'>
        {chatMessages.slice(-3).map(message => (
          <div
            key={message.id}
            className={cn(
              'rounded-xl border px-3 py-2 text-sm shadow-xl backdrop-blur',
              message.role === 'You'
                ? 'ml-8 border-sky-300/30 bg-sky-500/20 text-sky-50'
                : 'mr-8 border-white/20 bg-slate-900/70 text-slate-100'
            )}>
            <p className='mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] opacity-80'>
              {message.role}
            </p>
            <p className='leading-relaxed'>{message.text}</p>
          </div>
        ))}
      </div>

      <div className='pointer-events-auto absolute bottom-4 left-1/2 flex w-[min(94vw,760px)] -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/20 bg-slate-900/72 p-2 shadow-2xl backdrop-blur-xl'>
        <div className='grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-slate-100'>
          <MessageCircle size={18} />
        </div>
        <Input
          value={chatInput}
          onChange={event => setChatInput(event.target.value)}
          onKeyDown={event => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            handleSendMessage();
          }}
          placeholder='Type transcript or guidance...'
          className='mr-2 h-10 flex-1 border-white/20 bg-white/10 text-slate-100 placeholder:text-slate-300/70'
        />
        
        <input
          type='file'
          accept='audio/*'
          className='hidden'
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button
          variant='outline'
          title={selectedFileName || 'Upload Audio'}
          onClick={() => fileInputRef.current?.click()}
          className='h-10 border-white/20 bg-white/10 text-slate-100 hover:bg-white/20 hover:text-white shrink-0 px-3'
        >
          <UploadCloud size={18} className='mr-2' />
          <span className='max-w-[100px] truncate'>{selectedFileName || 'Audio'}</span>
        </Button>
        <Button
          onClick={handleSendMessage}
          disabled={!chatInput.trim()}
          className='h-10 min-w-24 shrink-0 bg-sky-500 text-white hover:bg-sky-600 disabled:bg-slate-700'>
          Send
        </Button>
      </div>
    </div>
  );
};
