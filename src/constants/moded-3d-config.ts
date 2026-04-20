import { VISEMES } from 'wawa-lipsync';
import { Tutor3DAnimation, Tutor3DFacialExpression } from '@/enums/tutor-3d';

export const AVATAR_MODEL_PATH = '/models/tutor_girl.glb';
export const ANIMATION_LIBRARY_PATH = '/models/animations.glb';

export const EXTRA_ANIMATION_FILES: Record<
  Exclude<Tutor3DManagement.AvatarAnimation, 'Idle' | 'Talking_0' | 'Talking_1' | 'Talking_2'>,
  string
> = {
  [Tutor3DAnimation.Angry]: '/animations/Angry.fbx',
  [Tutor3DAnimation.Crying]: '/animations/Crying.fbx',
  [Tutor3DAnimation.Laughing]: '/animations/Laughing.fbx',
  [Tutor3DAnimation.Terrified]: '/animations/Terrified.fbx',
  [Tutor3DAnimation.RumbaDancing]: '/animations/Rumba Dancing.fbx'
};

export const ANIMATION_OPTIONS: readonly Tutor3DAnimation[] = [
  Tutor3DAnimation.Idle,
  Tutor3DAnimation.Talking0,
  Tutor3DAnimation.Talking1,
  Tutor3DAnimation.Talking2,
  Tutor3DAnimation.Angry,
  Tutor3DAnimation.Crying,
  Tutor3DAnimation.Laughing,
  Tutor3DAnimation.Terrified,
  Tutor3DAnimation.RumbaDancing
];

export const EXPRESSION_OPTIONS: readonly Tutor3DFacialExpression[] = [
  Tutor3DFacialExpression.Default,
  Tutor3DFacialExpression.Smile,
  Tutor3DFacialExpression.Thinking,
  Tutor3DFacialExpression.Sad,
  Tutor3DFacialExpression.Angry,
  Tutor3DFacialExpression.Surprised
];

export const TALKING_ANIMATIONS: readonly Tutor3DAnimation[] = [
  Tutor3DAnimation.Talking0,
  Tutor3DAnimation.Talking1,
  Tutor3DAnimation.Talking2
];

export const FACIAL_EXPRESSION_TARGETS: Record<Tutor3DFacialExpression, Record<string, number>> = {
  [Tutor3DFacialExpression.Default]: {},
  [Tutor3DFacialExpression.Smile]: {
    mouthSmileLeft: 0.45,
    mouthSmileRight: 0.45,
    cheekSquintLeft: 0.25,
    cheekSquintRight: 0.25
  },
  [Tutor3DFacialExpression.Thinking]: {
    browInnerUp: 0.32,
    eyeSquintLeft: 0.2,
    eyeSquintRight: 0.2
  },
  [Tutor3DFacialExpression.Sad]: {
    mouthFrownLeft: 0.6,
    mouthFrownRight: 0.6,
    browInnerUp: 0.38
  },
  [Tutor3DFacialExpression.Angry]: {
    browDownLeft: 0.8,
    browDownRight: 0.8,
    noseSneerLeft: 0.45,
    noseSneerRight: 0.45,
    mouthPressLeft: 0.3,
    mouthPressRight: 0.3
  },
  [Tutor3DFacialExpression.Surprised]: {
    eyeWideLeft: 0.5,
    eyeWideRight: 0.5,
    jawOpen: 0.45,
    browInnerUp: 0.48
  }
};

export const VISEME_TO_MORPH_TARGET: Record<VISEMES, string> = {
  [VISEMES.sil]: 'viseme_PP',
  [VISEMES.PP]: 'viseme_PP',
  [VISEMES.FF]: 'viseme_FF',
  [VISEMES.TH]: 'viseme_TH',
  [VISEMES.DD]: 'viseme_kk',
  [VISEMES.kk]: 'viseme_kk',
  [VISEMES.CH]: 'viseme_kk',
  [VISEMES.SS]: 'viseme_kk',
  [VISEMES.nn]: 'viseme_kk',
  [VISEMES.RR]: 'viseme_O',
  [VISEMES.aa]: 'viseme_AA',
  [VISEMES.E]: 'viseme_I',
  [VISEMES.I]: 'viseme_I',
  [VISEMES.O]: 'viseme_O',
  [VISEMES.U]: 'viseme_U'
};
