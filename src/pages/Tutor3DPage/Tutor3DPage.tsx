import { Canvas } from '@react-three/fiber';
import { useFBX, useGLTF } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import { MessageCircle, PanelRightClose, PanelRightOpen, Play, RotateCw, Square } from 'lucide-react';
import { Tutor3DAnimation, Tutor3DFacialExpression } from '@/enums/tutor-3d';
import { cn } from '@/lib/utils';
import {
  ANIMATION_LIBRARY_PATH,
  ANIMATION_OPTIONS,
  AVATAR_MODEL_PATH,
  EXPRESSION_OPTIONS,
  EXTRA_ANIMATION_FILES
} from './constants';
import SceneLoader from './SceneLoader';
import TutorAvatarRig from './TutorAvatarRig';
import TutorControlPanel from './TutorControlPanel';
import useTutor3DLipsync from './useTutor3DLipsync';

type ChatMessage = {
  id: number;
  role: 'You' | 'Tutor';
  text: string;
};

const Tutor3DPage = () => {
  const [text, setText] = useState('Attach real audio and run lipsync QA.');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'Tutor',
      text: 'Welcome to Tutor 3D Studio. Upload audio, then press Play to run lipsync QA.'
    }
  ]);
  const [selectedAnimation, setSelectedAnimation] = useState<Tutor3DManagement.AvatarAnimation>(
    Tutor3DAnimation.Talking0
  );
  const [selectedExpression, setSelectedExpression] = useState<Tutor3DManagement.FacialExpression>(
    Tutor3DFacialExpression.Smile
  );
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraDistance, setCameraDistance] = useState(3.2);
  const [animationFadeDuration, setAnimationFadeDuration] = useState(0.25);
  const [expressionIntensity, setExpressionIntensity] = useState(1);
  const [visemeStrength, setVisemeStrength] = useState(1);
  const [visemeSmoothing, setVisemeSmoothing] = useState(16);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(true);
  const [runtimeState, setRuntimeState] = useState<Tutor3DManagement.RuntimeState>({
    animation: selectedAnimation,
    facialExpression: selectedExpression,
    isPlaying: false
  });

  const { isPlaying, selectedFileName, liveVisemeRef, playAudio, stopPlayback, setAudioFile } =
    useTutor3DLipsync();

  useEffect(() => {
    setRuntimeState(prev => ({ ...prev, isPlaying }));
  }, [isPlaying]);

  useEffect(() => {
    setRuntimeState(prev => ({
      ...prev,
      animation: selectedAnimation,
      facialExpression: selectedExpression
    }));
  }, [selectedAnimation, selectedExpression]);

  const handlePlay = () => {
    if (!selectedFileName) {
      toast.error('Please select an audio file first.');
      return;
    }

    playAudio();
  };

  const handleStop = () => {
    stopPlayback();
  };

  const [, setLevaControls] = useControls(
    'Tutor Debug',
    () => ({
      autoRotate: {
        value: autoRotate,
        onChange: (value: boolean) => setAutoRotate(value)
      },
      cameraDistance: {
        value: cameraDistance,
        min: 2,
        max: 5,
        step: 0.05,
        onChange: (value: number) => setCameraDistance(value)
      },
      animationFadeDuration: {
        value: animationFadeDuration,
        min: 0.05,
        max: 0.8,
        step: 0.05,
        onChange: (value: number) => setAnimationFadeDuration(value)
      },
      expressionIntensity: {
        value: expressionIntensity,
        min: 0,
        max: 1.5,
        step: 0.05,
        onChange: (value: number) => setExpressionIntensity(value)
      },
      visemeStrength: {
        value: visemeStrength,
        min: 0.1,
        max: 1.8,
        step: 0.05,
        onChange: (value: number) => setVisemeStrength(value)
      },
      visemeSmoothing: {
        value: visemeSmoothing,
        min: 8,
        max: 28,
        step: 1,
        onChange: (value: number) => setVisemeSmoothing(value)
      },
      animation: {
        value: selectedAnimation,
        options: [...ANIMATION_OPTIONS],
        onChange: (value: string) =>
          setSelectedAnimation(value as Tutor3DManagement.AvatarAnimation)
      },
      expression: {
        value: selectedExpression,
        options: [...EXPRESSION_OPTIONS],
        onChange: (value: string) =>
          setSelectedExpression(value as Tutor3DManagement.FacialExpression)
      },
      settingsPanel: {
        value: isControlPanelOpen,
        onChange: (value: boolean) => setIsControlPanelOpen(value)
      }
    }),
    []
  );

  useEffect(() => {
    setLevaControls({
      autoRotate,
      cameraDistance,
      animationFadeDuration,
      expressionIntensity,
      visemeStrength,
      visemeSmoothing,
      animation: selectedAnimation,
      expression: selectedExpression,
      settingsPanel: isControlPanelOpen
    });
  }, [
    autoRotate,
    cameraDistance,
    animationFadeDuration,
    expressionIntensity,
    visemeStrength,
    visemeSmoothing,
    isControlPanelOpen,
    selectedAnimation,
    selectedExpression,
    setLevaControls
  ]);

  const handleSendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    setText(trimmed);
    setChatInput('');

    setChatMessages(prev => [
      ...prev,
      { id: Date.now(), role: 'You', text: trimmed },
      {
        id: Date.now() + 1,
        role: 'Tutor',
        text: selectedFileName
          ? 'Message captured. Press Play when you are ready to test the current lipsync setup.'
          : 'Message captured. Please upload an audio file first to run lipsync playback.'
      }
    ]);
  };

  return (
    <section className='relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950'>
      <Leva hidden={false} collapsed />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.22),transparent_35%),radial-gradient(circle_at_75%_10%,rgba(99,102,241,0.2),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(15,23,42,0.9),rgba(2,6,23,1))]' />
      <section className='relative h-full w-full'>
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 2.1, cameraDistance], fov: 30, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
          <Suspense fallback={<SceneLoader />}>
            <TutorAvatarRig
              runtimeState={runtimeState}
              autoRotate={autoRotate}
              cameraDistance={cameraDistance}
              onCameraDistanceChange={setCameraDistance}
              animationFadeDuration={animationFadeDuration}
              expressionIntensity={expressionIntensity}
              visemeStrength={visemeStrength}
              visemeSmoothing={visemeSmoothing}
              liveVisemeRef={liveVisemeRef}
            />
          </Suspense>
        </Canvas>
      </section>

      <div className='pointer-events-none absolute inset-0 z-20'>
        <div className='pointer-events-auto absolute left-4 top-4 w-[min(90vw,400px)] rounded-2xl border border-white/20 bg-slate-900/70 p-4 text-slate-100 shadow-2xl backdrop-blur-xl'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-300'>Tutor 3D</p>
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
              <p className='mt-1 font-medium text-white'>{runtimeState.animation}</p>
            </div>
            <div className='rounded-lg border border-white/15 bg-black/25 p-2'>
              <p className='text-[11px] uppercase tracking-[0.14em] text-slate-300/90'>Viseme</p>
              <p className='mt-1 font-medium text-white'>{liveVisemeRef.current}</p>
            </div>
          </div>
        </div>

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
            onClick={handleStop}
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

        <aside
          className={cn(
            'pointer-events-auto absolute right-4 top-4 h-[calc(100%-11rem)] w-[min(92vw,360px)] transition-all duration-300',
            isControlPanelOpen ? 'translate-x-0 opacity-100' : 'translate-x-[calc(100%+2rem)] opacity-0'
          )}>
          <TutorControlPanel
            text={text}
            selectedAnimation={selectedAnimation}
            selectedExpression={selectedExpression}
            autoRotate={autoRotate}
            cameraDistance={cameraDistance}
            animationFadeDuration={animationFadeDuration}
            expressionIntensity={expressionIntensity}
            visemeStrength={visemeStrength}
            visemeSmoothing={visemeSmoothing}
            runtimeState={runtimeState}
            currentViseme={liveVisemeRef.current}
            selectedFileName={selectedFileName}
            onTextChange={setText}
            onAnimationChange={setSelectedAnimation}
            onExpressionChange={setSelectedExpression}
            onCameraDistanceChange={setCameraDistance}
            onAnimationFadeDurationChange={setAnimationFadeDuration}
            onExpressionIntensityChange={setExpressionIntensity}
            onVisemeStrengthChange={setVisemeStrength}
            onVisemeSmoothingChange={setVisemeSmoothing}
            onAutoRotateToggle={() => setAutoRotate(!autoRotate)}
            onFileChange={setAudioFile}
            onPlay={handlePlay}
            onStop={handleStop}
            className='h-full overflow-y-auto'
          />
        </aside>

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
          <div className='grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-slate-100'>
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
            placeholder='Type transcript or guidance for the tutor...'
            className='h-10 border-white/20 bg-white/10 text-slate-100 placeholder:text-slate-300/70'
          />
          <Button
            onClick={handleSendMessage}
            disabled={!chatInput.trim()}
            className='h-10 min-w-24 bg-sky-500 text-white hover:bg-sky-600 disabled:bg-slate-700'>
            Send
          </Button>
        </div>
      </div>
    </section>
  );
};

useGLTF.preload(AVATAR_MODEL_PATH);
useGLTF.preload(ANIMATION_LIBRARY_PATH);
useFBX.preload(EXTRA_ANIMATION_FILES[Tutor3DAnimation.Angry]);
useFBX.preload(EXTRA_ANIMATION_FILES[Tutor3DAnimation.Crying]);
useFBX.preload(EXTRA_ANIMATION_FILES[Tutor3DAnimation.Laughing]);
useFBX.preload(EXTRA_ANIMATION_FILES[Tutor3DAnimation.Terrified]);
useFBX.preload(EXTRA_ANIMATION_FILES[Tutor3DAnimation.RumbaDancing]);

export default Tutor3DPage;
