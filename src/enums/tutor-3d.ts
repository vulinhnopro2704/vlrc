export const Tutor3DFacialExpression = {
  Default: 'default',
  Smile: 'smile',
  Thinking: 'thinking',
  Sad: 'sad',
  Angry: 'angry',
  Surprised: 'surprised'
} as const;

export type Tutor3DFacialExpression =
  (typeof Tutor3DFacialExpression)[keyof typeof Tutor3DFacialExpression];

export const Tutor3DAnimation = {
  Idle: 'Idle',
  Talking0: 'Talking_0',
  Talking1: 'Talking_1',
  Talking2: 'Talking_2',
  Angry: 'Angry',
  Crying: 'Crying',
  Laughing: 'Laughing',
  Terrified: 'Terrified',
  RumbaDancing: 'Rumba Dancing'
} as const;

export type Tutor3DAnimation = (typeof Tutor3DAnimation)[keyof typeof Tutor3DAnimation];
