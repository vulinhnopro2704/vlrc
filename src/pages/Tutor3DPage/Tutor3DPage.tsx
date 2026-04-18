import { Canvas } from '@react-three/fiber';
import { useFBX, useGLTF } from '@react-three/drei';
import { Tutor3DAnimation, Tutor3DFacialExpression } from '@/enums/tutor-3d';
import { ANIMATION_LIBRARY_PATH, AVATAR_MODEL_PATH, EXTRA_ANIMATION_FILES } from './constants';
import SceneLoader from './SceneLoader';
import TutorAvatarRig from './TutorAvatarRig';
import TutorControlPanel from './TutorControlPanel';
import useTutor3DLipsync from './useTutor3DLipsync';

const Tutor3DPage = () => {
  const [text, setText] = useState('Attach real audio and run lipsync QA.');
  const [selectedAnimation, setSelectedAnimation] = useState<Tutor3DManagement.AvatarAnimation>(
    Tutor3DAnimation.Talking0
  );
  const [selectedExpression, setSelectedExpression] = useState<Tutor3DManagement.FacialExpression>(
    Tutor3DFacialExpression.Smile
  );
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraDistance, setCameraDistance] = useState(1.9);
  const [runtimeState, setRuntimeState] = useState<Tutor3DManagement.RuntimeState>({
    animation: Tutor3DAnimation.Idle,
    facialExpression: Tutor3DFacialExpression.Default,
    isPlaying: false
  });

  const { isPlaying, selectedFileName, liveVisemeRef, playAudio, stopPlayback, setAudioFile } =
    useTutor3DLipsync();

  useEffect(() => {
    setRuntimeState(prev => ({ ...prev, isPlaying }));

    if (!isPlaying) {
      setRuntimeState(prev => ({
        ...prev,
        animation: Tutor3DAnimation.Idle,
        facialExpression: Tutor3DFacialExpression.Default
      }));
    }
  }, [isPlaying]);

  const handlePlay = () => {
    if (!selectedFileName) {
      toast.error('Please select an audio file first.');
      return;
    }

    setRuntimeState({
      animation: selectedAnimation,
      facialExpression: selectedExpression,
      isPlaying: true
    });

    playAudio();
  };

  const handleStop = () => {
    stopPlayback();
    setRuntimeState({
      animation: Tutor3DAnimation.Idle,
      facialExpression: Tutor3DFacialExpression.Default,
      isPlaying: false
    });
  };

  return (
    <div className='min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8'>
      <div className='mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[380px_minmax(0,1fr)]'>
        <TutorControlPanel
          text={text}
          selectedAnimation={selectedAnimation}
          selectedExpression={selectedExpression}
          autoRotate={autoRotate}
          cameraDistance={cameraDistance}
          runtimeState={runtimeState}
          currentViseme={liveVisemeRef.current}
          selectedFileName={selectedFileName}
          onTextChange={setText}
          onAnimationChange={setSelectedAnimation}
          onExpressionChange={setSelectedExpression}
          onCameraDistanceChange={setCameraDistance}
          onAutoRotateToggle={() => setAutoRotate(!autoRotate)}
          onFileChange={setAudioFile}
          onPlay={handlePlay}
          onStop={handleStop}
        />

        <section className='relative min-h-[58vh] overflow-hidden rounded-2xl border bg-linear-to-b from-slate-50 to-slate-200 shadow-sm dark:from-zinc-900 dark:to-zinc-800 lg:min-h-[74vh]'>
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 1.5, cameraDistance], fov: 32, near: 0.1, far: 100 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
            <Suspense fallback={<SceneLoader />}>
              <TutorAvatarRig
                runtimeState={runtimeState}
                autoRotate={autoRotate}
                cameraDistance={cameraDistance}
                liveVisemeRef={liveVisemeRef}
              />
            </Suspense>
          </Canvas>
        </section>
      </div>
    </div>
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
