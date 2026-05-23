import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Icons } from '@/components/Icons/Icons';
import TutorAvatarRig from '../../Tutor3DPage/TutorAvatarRig';
import SceneLoader from '../../Tutor3DPage/SceneLoader';
import { useTutor3DStore } from '@/stores/tutor-3d';

export const VoiceCallUI = ({
  activeSession,
  isRecording,
  isPlaying,
  liveVisemeRef,
  isVoicePending,
  showChatPopup,
  completedObjectivesCount,
  stopPlayback,
  setSelectedHistorySessionId,
  setActiveSession,
  setIsVoiceMode,
  stopRecording,
  startRecording,
  setShowChatPopup
}: {
  activeSession: RoleplayManagement.ActiveSession;
  isRecording: boolean;
  isPlaying: boolean;
  liveVisemeRef: RefObject<VISEMES>;
  isVoicePending: boolean;
  showChatPopup: boolean;
  completedObjectivesCount: number;
  stopPlayback: () => void;
  setSelectedHistorySessionId: (id: string | null) => void;
  setActiveSession: (
    val:
      | RoleplayManagement.ActiveSession
      | null
      | ((prev: RoleplayManagement.ActiveSession | null) => RoleplayManagement.ActiveSession | null)
  ) => void;
  setIsVoiceMode: (val: boolean) => void;
  stopRecording: () => void;
  startRecording: () => void;
  setShowChatPopup: (val: boolean) => void;
}) => {
  const cameraDistance = useTutor3DStore(s => s.cameraDistance);

  const renderTopLeftActions = () => (
    <div className='absolute top-4 left-4 z-10 flex items-center gap-3'>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => {
          stopPlayback();
          setSelectedHistorySessionId(null);
          setActiveSession(null);
        }}
        className='w-10 h-10 rounded-full bg-slate-900/70 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800/80'>
        <Icons.ArrowLeft size={18} />
      </Button>

      <div className='bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-2xl px-4 py-2.5 flex items-center gap-2.5'>
        {isRecording ? (
          <>
            <span className='w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]' />
            <span className='text-xs font-semibold text-red-400'>Đang ghi âm...</span>
          </>
        ) : isVoicePending ? (
          <>
            <Icons.Loader2 size={14} className='text-indigo-400 animate-spin' />
            <span className='text-xs font-semibold text-indigo-300'>Đang phân tích...</span>
          </>
        ) : isPlaying ? (
          <>
            <span className='w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]' />
            <span className='text-xs font-semibold text-emerald-300'>Tutor đang nói...</span>
          </>
        ) : (
          <>
            <span className='w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.4)]' />
            <span className='text-xs font-semibold text-slate-300'>Sẵn sàng lắng nghe</span>
          </>
        )}
      </div>
    </div>
  );

  const renderTopRightActions = () => (
    <div className='absolute top-4 right-4 z-10 flex items-center gap-2'>
      <div className='bg-slate-900/70 backdrop-blur-md border border-slate-700/50 p-0.5 rounded-xl flex shrink-0'>
        <button
          type='button'
          onClick={() => {
            stopPlayback();
            setIsVoiceMode(false);
          }}
          className='px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center gap-1 transition-all text-slate-400 hover:text-slate-200'>
          <Icons.MessageSquare size={12} />
          <span className='hidden sm:inline'>Chat</span>
        </button>
        <button
          type='button'
          className='px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center gap-1 transition-all bg-indigo-600 text-white shadow-sm'>
          <Icons.Phone size={12} />
          <span className='hidden sm:inline'>Gọi</span>
        </button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='w-9 h-9 rounded-full bg-slate-900/70 backdrop-blur-md border border-slate-700/50 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/80'>
            <Icons.BookOpen size={14} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-80 bg-slate-900/95 border border-slate-800 text-slate-100 p-5 rounded-2xl shadow-2xl backdrop-blur-md'>
          <h3 className='text-sm font-bold text-indigo-400 mb-2 flex items-center gap-1.5'>
            <Icons.BookOpen size={16} /> Ngữ Cảnh Nhập Vai
          </h3>
          <p className='text-xs text-slate-300 leading-relaxed italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/50 mb-3'>
            "{activeSession.scenario.description}"
          </p>
          <div className='grid grid-cols-2 gap-3'>
            <div className='bg-indigo-950/20 border border-indigo-900/30 p-2.5 rounded-xl'>
              <div className='text-[9px] font-bold text-indigo-400 uppercase tracking-wider'>
                AI đóng vai
              </div>
              <div className='text-xs font-semibold text-slate-100 mt-1'>
                {activeSession.scenario.aiPersona}
              </div>
            </div>
            <div className='bg-purple-950/20 border border-purple-900/30 p-2.5 rounded-xl'>
              <div className='text-[9px] font-bold text-purple-400 uppercase tracking-wider'>
                Bạn đóng vai
              </div>
              <div className='text-xs font-semibold text-slate-100 mt-1'>
                {activeSession.scenario.userPersona}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='w-9 h-9 rounded-full bg-slate-900/70 backdrop-blur-md border border-slate-700/50 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/80'>
            <Icons.Sparkles size={14} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-80 bg-slate-900/95 border border-slate-800 text-slate-100 p-5 rounded-2xl shadow-2xl backdrop-blur-md'>
          <h3 className='text-sm font-bold text-emerald-400 mb-3 flex items-center gap-1.5'>
            <Icons.Sparkles size={16} className='animate-pulse' /> Nhiệm Vụ (
            {completedObjectivesCount}/3)
          </h3>
          <div className='space-y-2.5'>
            {[0, 1, 2].map(i => {
              const completed =
                i === 0
                  ? activeSession.taskEvaluation.task_1_completed
                  : i === 1
                    ? activeSession.taskEvaluation.task_2_completed
                    : activeSession.taskEvaluation.task_3_completed;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${completed ? 'bg-emerald-950/15 border-emerald-900/30 text-emerald-100' : 'bg-slate-950/25 border-transparent text-slate-400'}`}>
                  {completed ? (
                    <Icons.CheckCircle2 size={16} className='text-emerald-400 shrink-0 mt-0.5' />
                  ) : (
                    <Icons.Circle size={16} className='text-slate-600 shrink-0 mt-0.5' />
                  )}
                  <span className='text-xs font-medium leading-relaxed'>
                    {activeSession.scenario.requiredTasks[i] || `Nhiệm vụ ${i + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant='ghost'
        size='icon'
        onClick={() => {
          if (confirm('Bạn có chắc muốn thoát phiên luyện tập này không?')) {
            stopPlayback();
            setActiveSession(null);
          }
        }}
        className='w-9 h-9 rounded-full bg-red-500/80 hover:bg-red-500 text-white border border-red-400/30'>
        <Icons.PhoneOff size={14} />
      </Button>
    </div>
  );

  const renderBottomCenterControls = () => (
    <div className='absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3'>
      {isRecording ? (
        <button
          type='button'
          onClick={stopRecording}
          className='w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.5)] animate-pulse transition-all active:scale-95'>
          <Icons.Square size={24} fill='currentColor' />
        </button>
      ) : isVoicePending ? (
        <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-800/80 border-2 border-indigo-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)]'>
          <Icons.Loader2 size={28} className='text-indigo-400 animate-spin' />
        </div>
      ) : (
        <button
          type='button'
          onClick={startRecording}
          className='w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_60px_rgba(99,102,241,0.6)]'>
          <Icons.Mic size={28} />
        </button>
      )}
      <span className='text-[10px] text-slate-400/80 font-medium'>
        {isRecording ? 'Nhấn để dừng' : isVoicePending ? 'Đang xử lý...' : 'Nhấn để nói'}
      </span>
    </div>
  );

  const renderRecentMessagesOverlay = () => {
    const conversationMsgs = activeSession.messages.filter(
      m => !m.id.startsWith('ai-intro-title-') && !m.id.startsWith('ai-intro-context-')
    );
    const recentMsgs = conversationMsgs.slice(-3);
    if (recentMsgs.length === 0) return null;

    return (
      <button
        type='button'
        onClick={() => setShowChatPopup(true)}
        className='absolute bottom-28 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-[340px] z-10 bg-slate-950/60 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-3 space-y-2 hover:bg-slate-900/70 transition-all cursor-pointer group'>
        <div className='flex items-center justify-between mb-1'>
          <span className='text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1'>
            <Icons.MessageCircle size={10} /> Cuộc hội thoại
          </span>
          <Icons.ChevronUp
            size={12}
            className='text-slate-500 group-hover:text-slate-300 transition-colors'
          />
        </div>
        {recentMsgs.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${msg.role === 'You' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 ${msg.role === 'You' ? 'bg-indigo-600/80 text-white' : 'bg-slate-700/80 text-indigo-300 border border-slate-600/50'}`}>
              {msg.role === 'You' ? 'ME' : 'AI'}
            </div>
            <div
              className={`text-[11px] leading-snug line-clamp-2 ${msg.role === 'You' ? 'text-right text-indigo-200/80' : 'text-slate-300/80'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </button>
    );
  };

  const renderCompletionOverlay = () => {
    if (!activeSession.scenarioCompleted) return null;
    return (
      <div className='absolute inset-0 bg-slate-950/90 backdrop-blur-lg z-30 flex flex-col items-center justify-center p-8 text-center animate-fade-in'>
        <div className='w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-pulse'>
          <Icons.Award size={48} />
        </div>
        <h3 className='text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300'>
          Kịch Bản Hoàn Thành!
        </h3>
        <p className='text-slate-300 max-w-md mt-3 mb-8 leading-relaxed'>
          Bạn đã xuất sắc hoàn thành tất cả 3 mục tiêu của kịch bản nhập vai{' '}
          <strong>{activeSession.scenario.title}</strong>!
        </p>
        <div className='flex gap-4'>
          <Button
            onClick={() =>
              setActiveSession(prev => (prev ? { ...prev, scenarioCompleted: false } : null))
            }
            variant='outline'
            className='bg-slate-900 border-slate-800 text-slate-300 rounded-full px-6'>
            Xem lại cuộc đối thoại
          </Button>
          <Button
            onClick={() => {
              stopPlayback();
              setActiveSession(null);
            }}
            className='bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full px-8 transition-all'>
            Quay lại kịch bản
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className='relative w-full h-full flex flex-col rounded-2xl overflow-hidden border border-slate-800/60 shadow-2xl bg-slate-950'>
      <div className='absolute inset-0 z-0'>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [0, 1.6, cameraDistance * 0.75], fov: 28, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className='w-full h-full'>
          <Suspense fallback={<SceneLoader />}>
            <TutorAvatarRig liveVisemeRef={liveVisemeRef} isPlaying={isPlaying} />
          </Suspense>
        </Canvas>
      </div>

      {renderTopLeftActions()}
      {renderTopRightActions()}
      {renderBottomCenterControls()}
      {renderRecentMessagesOverlay()}
      {renderCompletionOverlay()}

      <div className='absolute bottom-2 left-4 z-10 text-[9px] text-slate-600 font-medium'>
        Voice by{' '}
        <a
          href='https://elevenlabs.io'
          target='_blank'
          rel='noopener noreferrer'
          className='text-slate-500 hover:text-slate-300 underline'>
          elevenlabs.io
        </a>
      </div>

      <Dialog open={showChatPopup} onOpenChange={setShowChatPopup}>
        <DialogContent className='bg-slate-950/95 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl backdrop-blur-xl max-w-lg w-[90vw] h-[80vh] flex flex-col p-0'>
          <DialogHeader className='p-4 border-b border-slate-800'>
            <DialogTitle className='text-sm font-bold flex items-center gap-2 text-indigo-400'>
              <Icons.MessageCircle size={16} /> Lịch sử hội thoại
            </DialogTitle>
          </DialogHeader>
          <div className='flex-1 overflow-y-auto p-4 space-y-4'>
            {activeSession.messages
              .filter(m => !m.id.startsWith('ai-intro'))
              .map(msg => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'You' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${msg.role === 'You' ? 'bg-indigo-600 text-white' : 'bg-slate-800 border border-slate-700 text-indigo-300'}`}>
                    {msg.role === 'You' ? 'ME' : 'AI'}
                  </div>
                  <div
                    className={`p-3 rounded-xl text-xs leading-relaxed ${msg.role === 'You' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
