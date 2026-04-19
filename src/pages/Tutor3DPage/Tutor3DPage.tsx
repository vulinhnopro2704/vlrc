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
import {
  createTutorSession,
  interactTutorSession,
  interactVoiceTutorSession
} from '@/api/tutor-3d-management';
import { getErrorMessage } from '@/api/api-error';

const DEFAULT_TUTOR_SESSION_PAYLOAD: Tutor3DManagement.CreateTutorSessionPayload = {
  cefrLevel: 'A2',
  focusTopics: ['daily_conversation', 'pronunciation']
};

const fileToBase64 = async (file: File) => {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Invalid audio payload format'));
    };

    reader.onerror = () => reject(new Error('Failed to read audio payload'));
    reader.readAsDataURL(file);
  });

  const payload = dataUrl.split(',')[1];
  if (!payload) {
    throw new Error('Invalid audio payload format');
  }

  return payload;
};

const dataUrlToAudioFile = (dataUrl: string, fileName: string) => {
  const [meta, data] = dataUrl.split(',');
  if (!meta || !data) {
    return null;
  }

  const mimeMatch = /data:(.*?);base64/.exec(meta);
  const mimeType = mimeMatch?.[1] ?? 'audio/mpeg';

  const binary = window.atob(data);
  const length = binary.length;
  const bytes = new Uint8Array(length);
  for (let index = 0; index < length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new File([bytes], fileName, { type: mimeType });
};

const toSupportedMimeType = (
  mimeType: string
): Tutor3DManagement.InteractVoiceTutorPayload['mimeType'] => {
  const allowedMimeTypes: NonNullable<Tutor3DManagement.InteractVoiceTutorPayload['mimeType']>[] = [
    'audio/webm',
    'audio/wav',
    'audio/mpeg',
    'audio/mp4',
    'audio/ogg'
  ];

  if (allowedMimeTypes.includes(mimeType as (typeof allowedMimeTypes)[number])) {
    return mimeType as (typeof allowedMimeTypes)[number];
  }

  return 'audio/webm';
};

const Tutor3DPage: FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const sessionPromiseRef = useRef<Promise<string> | null>(null);
  const [chatMessages, setChatMessages] = useState<Tutor3DManagement.ChatMessage[]>([
    {
      id: 1,
      role: 'Tutor',
      text: 'Welcome. Type a sentence or upload voice and I will answer as your AI English tutor.'
    }
  ]);

  const cameraDistance = useTutor3DStore(s => s.cameraDistance);

  const { isPlaying, selectedFileName, liveVisemeRef, playAudio, stopPlayback, setAudioFile } =
    useTutor3DLipsync();

  const createSessionMutation = useMutation({
    mutationFn: createTutorSession,
    onSuccess: response => {
      setSessionId(response.sessionId);
    }
  });

  const interactTextMutation = useMutation({
    mutationFn: ({
      targetSessionId,
      payload
    }: {
      targetSessionId: string;
      payload: Tutor3DManagement.InteractTutorPayload;
    }) => interactTutorSession(targetSessionId, payload)
  });

  const interactVoiceMutation = useMutation({
    mutationFn: ({
      targetSessionId,
      payload
    }: {
      targetSessionId: string;
      payload: Tutor3DManagement.InteractVoiceTutorPayload;
    }) => interactVoiceTutorSession(targetSessionId, payload)
  });

  const appendTutorMessage = (text: string) => {
    setChatMessages(prev => [...prev, { id: Date.now(), role: 'Tutor', text }]);
  };

  const hydrateAudioFromResponse = (response: Tutor3DManagement.TutorInteractionResponse) => {
    if (!response.audio.url || response.audio.status !== 'completed') {
      return;
    }

    const outputFile = dataUrlToAudioFile(response.audio.url, `tutor-${response.turnId}.mp3`);
    if (outputFile) {
      setAudioFile(outputFile);
    }
  };

  const ensureSession = async () => {
    if (sessionId) {
      return sessionId;
    }

    if (!sessionPromiseRef.current) {
      sessionPromiseRef.current = createSessionMutation
        .mutateAsync(DEFAULT_TUTOR_SESSION_PAYLOAD)
        .then(response => response.sessionId)
        .finally(() => {
          sessionPromiseRef.current = null;
        });
    }

    return sessionPromiseRef.current;
  };

  const handleSendMessage = async (text: string) => {
    setChatMessages(prev => [...prev, { id: Date.now(), role: 'You', text }]);

    try {
      const targetSessionId = await ensureSession();
      const response = await interactTextMutation.mutateAsync({
        targetSessionId,
        payload: {
          userInput: text,
          inputMode: 'text',
          clientTurnId: `text-${Date.now()}`
        }
      });

      appendTutorMessage(response.tutorText);
      hydrateAudioFromResponse(response);
    } catch (error) {
      appendTutorMessage('I could not answer right now. Please try again in a moment.');
      toast.error(getErrorMessage(error, 'Failed to send tutor message'));
    }
  };

  const handleAudioUpload = async (file: File) => {
    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        role: 'You',
        text: `Uploaded audio: ${file.name}`
      }
    ]);

    try {
      const targetSessionId = await ensureSession();
      const audioBase64 = await fileToBase64(file);
      const response = await interactVoiceMutation.mutateAsync({
        targetSessionId,
        payload: {
          audioBase64,
          mimeType: toSupportedMimeType(file.type),
          languageCode: 'eng',
          clientTurnId: `voice-${Date.now()}`
        }
      });

      const transcriptText = response.transcript?.text
        ? `Transcript: ${response.transcript.text}`
        : 'Transcript processed.';
      appendTutorMessage(`${transcriptText}\n${response.tutorText}`);
      hydrateAudioFromResponse(response);
    } catch (error) {
      appendTutorMessage('I could not process your voice input. Please upload again.');
      toast.error(getErrorMessage(error, 'Failed to process voice interaction'));
    }
  };

  const isGenerating =
    createSessionMutation.isPending ||
    interactTextMutation.isPending ||
    interactVoiceMutation.isPending;

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
            <TutorAvatarRig liveVisemeRef={liveVisemeRef} isPlaying={isPlaying} />
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
        onAudioSelected={handleAudioUpload}
        isSending={isGenerating}
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
