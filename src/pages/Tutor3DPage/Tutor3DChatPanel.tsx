import Icons from '@/components/Icons';

export const Tutor3DChatPanel: FC<{
  chatMessages: Tutor3DManagement.ChatMessage[];
  onSendMessage: (text: string) => Promise<void> | void;
  onSendVoice: (audioBase64: string, mimeType: string) => Promise<void> | void;
  isSending?: boolean;
}> = ({ chatMessages, onSendMessage, onSendVoice, isSending = false }) => {
  const [chatInput, setChatInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setChatInput('');
    void onSendMessage(trimmed);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = '';
      }

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(',')[1];
          const exactMimeType = (mediaRecorder.mimeType || 'audio/webm').split(';')[0].trim();
          void onSendVoice(base64data, exactMimeType);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
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

      <div className="pointer-events-auto absolute bottom-20 left-1/2 flex w-[min(94vw,760px)] -translate-x-1/2 justify-end px-2">
        <span className="text-[10px] text-white/60 bg-black/40 px-2 py-1 rounded-md backdrop-blur-md shadow-sm border border-white/10">
          Voice by <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-2">elevenlabs.io</a>
        </span>
      </div>

      <div className='pointer-events-auto absolute bottom-4 left-1/2 flex w-[min(94vw,760px)] -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/20 bg-slate-900/72 p-2 shadow-2xl backdrop-blur-xl'>
        <div className='grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-slate-100'>
          <Icons.MessageCircle size={18} />
        </div>
        <Input
          value={chatInput}
          onChange={event => setChatInput(event.target.value)}
          onKeyDown={event => {
            if (event.key !== 'Enter') return;
            if (event.nativeEvent.isComposing || event.keyCode === 229) return;
            event.preventDefault();
            handleSendMessage();
          }}
          placeholder='Type transcript or guidance...'
          disabled={isSending || isRecording}
          className='mr-2 h-10 flex-1 border-white/20 bg-white/10 text-slate-100 placeholder:text-slate-300/70'
        />
        
        {chatInput.trim() ? (
          <Button
            onClick={handleSendMessage}
            disabled={isSending}
            className='h-10 min-w-24 shrink-0 bg-sky-500 text-white hover:bg-sky-600 disabled:bg-slate-700'>
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        ) : (
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isSending && !isRecording}
            className={cn(
               'h-10 min-w-24 shrink-0 transition-colors',
               isRecording 
                 ? 'bg-red-500 text-white hover:bg-red-600' 
                 : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
             )}>
            {isRecording ? (
              <span className="flex items-center gap-2 animate-pulse"><Icons.Square size={14} fill="currentColor" /> Stop</span>
            ) : (
              <span className="flex items-center gap-1.5"><Icons.Mic size={16} /> Voice</span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
