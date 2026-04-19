import { Suspense, useState, type FC } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFBX, useGLTF } from '@react-three/drei';
import { Tutor3DAnimation } from '@/enums/tutor-3d';
import SceneLoader from './SceneLoader';
import TutorAvatarRig from './TutorAvatarRig';
import useTutor3DLipsync from './useTutor3DLipsync';
import {
  ANIMATION_LIBRARY_PATH,
  AVATAR_MODEL_PATH,
  EXTRA_ANIMATION_FILES
} from '@/constants/moded-3d-config';
import { Tutor3DHeader } from './components/Tutor3DHeader';
import { Tutor3DActionDock } from './components/Tutor3DActionDock';
import { Tutor3DChatPanel } from './components/Tutor3DChatPanel';
import { Tutor3DDebugControls } from './components/Tutor3DDebugControls';
import { useTutor3DStore } from '@/stores/tutor-3d';

const Tutor3DPage: FC = () => {
  const [chatMessages, setChatMessages] = useState<Tutor3DManagement.ChatMessage[]>([
    {
      id: 1,
      role: 'Tutor',
      text: 'Welcome to Tutor 3D Studio. Upload audio, then press Play to run lipsync QA.'
    }
  ]);

  const cameraDistance = useTutor3DStore(s => s.cameraDistance);

  const { isPlaying, selectedFileName, liveVisemeRef, playAudio, stopPlayback, setAudioFile } =
    useTutor3DLipsync();

  const handleSendMessage = (text: string) => {
    setChatMessages(prev => [
      ...prev,
      { id: Date.now(), role: 'You', text },
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
      <Tutor3DDebugControls />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.22),transparent_35%),radial-gradient(circle_at_75%_10%,rgba(99,102,241,0.2),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(15,23,42,0.9),rgba(2,6,23,1))]' />
      <section className='relative h-full w-full'>
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 2.1, cameraDistance], fov: 30, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
          <Suspense fallback={<SceneLoader />}>
            <TutorAvatarRig
              liveVisemeRef={liveVisemeRef}
              isPlaying={isPlaying}
            />
          </Suspense>
        </Canvas>
      </section>

      <Tutor3DHeader liveVisemeRef={liveVisemeRef} />
      
      <Tutor3DActionDock
        selectedFileName={selectedFileName}
        playAudio={playAudio}
        stopPlayback={stopPlayback}
      />
      
      <Tutor3DChatPanel
        chatMessages={chatMessages}
        onSendMessage={handleSendMessage}
        setAudioFile={setAudioFile}
        selectedFileName={selectedFileName}
      />
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
