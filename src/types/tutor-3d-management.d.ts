declare namespace Tutor3DManagement {
  type FacialExpression = import('@/enums/tutor-3d').Tutor3DFacialExpression;
  type AvatarAnimation = import('@/enums/tutor-3d').Tutor3DAnimation;

  type RuntimeState = {
    animation: AvatarAnimation;
    facialExpression: FacialExpression;
    isPlaying: boolean;
  };

  type PreviewMessage = {
    text: string;
    animation: AvatarAnimation;
    facialExpression: FacialExpression;
  };

  type MorphBinding = {
    influences: number[];
    index: number;
  };

  type ExpressionMorphBinding = MorphBinding & {
    morphName: string;
  };

  type ChatMessage = {
    id: number;
    role: 'You' | 'Tutor';
    text: string;
  };

  type TutorSessionState = 'ACTIVE' | 'LISTENING' | 'COMPLETED';

  type TutorAudioStatus = 'completed' | 'skipped' | 'failed';

  type TutorSessionProfile = {
    cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    focusTopics: string[];
    voiceId?: string;
  };

  type CreateTutorSessionPayload = {
    cefrLevel: TutorSessionProfile['cefrLevel'];
    focusTopics?: string[];
    voiceId?: string;
  };

  type TutorSessionResponse = {
    sessionId: string;
    state: TutorSessionState;
    tutorProfile: TutorSessionProfile;
    createdAt: string;
    endedAt?: string;
    turnsCount: number;
  };

  type TutorCorrection = {
    hasError: boolean;
    correctedVersion?: string;
    shortReason?: string;
  };

  type TutorLipSyncCue = {
    start: number;
    end: number;
    value: string;
  };

  type TutorInteractionAudio = {
    url: string | null;
    mimeType: string;
    provider: string;
    status: TutorAudioStatus;
  };

  type TutorTranscript = {
    text: string;
    confidence: number | null;
    provider: string;
  };

  type TutorInteractionResponse = {
    turnId: string;
    sessionId: string;
    tutorText: string;
    emotionState: string;
    animationState: string;
    facialExpression: string;
    animation: string;
    lipSync: {
      mouthCues: TutorLipSyncCue[];
    };
    correction: TutorCorrection;
    audio: TutorInteractionAudio;
    transcript?: TutorTranscript;
    createdAt: string;
  };

  type InteractTutorPayload = {
    userInput: string;
    inputMode: 'text';
    clientTurnId?: string;
  };

  type InteractVoiceTutorPayload = {
    audioBase64?: string;
    audioUrl?: string;
    mimeType?: 'audio/webm' | 'audio/wav' | 'audio/mpeg' | 'audio/mp4' | 'audio/ogg';
    languageCode?: string;
    clientTurnId?: string;
  };

  type InterruptTutorSessionResponse = {
    sessionId: string;
    interruptedTurnId?: string;
    state: TutorSessionState;
  };

  type EndTutorSessionResponse = {
    sessionId: string;
    state: TutorSessionState;
    endedAt: string;
    summary: string;
  };
}
