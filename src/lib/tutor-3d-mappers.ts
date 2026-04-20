import { Tutor3DAnimation, Tutor3DFacialExpression } from '@/enums/tutor-3d';

const normalizeValue = (value?: string | null) => value?.trim().toLowerCase() ?? '';

const pickAnimationByKeyword = (
  value?: string | null
): Tutor3DManagement.AvatarAnimation | null => {
  const normalized = normalizeValue(value);
  if (!normalized) {
    return null;
  }

  if (normalized.includes('talk')) {
    return Tutor3DAnimation.Talking0;
  }

  if (normalized.includes('idle')) {
    return Tutor3DAnimation.Idle;
  }

  if (
    normalized.includes('angry') ||
    normalized.includes('mad') ||
    normalized.includes('corrective')
  ) {
    return Tutor3DAnimation.Angry;
  }

  if (normalized.includes('cry')) {
    return Tutor3DAnimation.Crying;
  }

  if (
    normalized.includes('laugh') ||
    normalized.includes('praise') ||
    normalized.includes('encourag')
  ) {
    return Tutor3DAnimation.Laughing;
  }

  if (normalized.includes('terrified') || normalized.includes('fear')) {
    return Tutor3DAnimation.Terrified;
  }

  if (normalized.includes('dance') || normalized.includes('rumba')) {
    return Tutor3DAnimation.RumbaDancing;
  }

  return null;
};

const pickExpressionByKeyword = (
  value?: string | null
): Tutor3DManagement.FacialExpression | null => {
  const normalized = normalizeValue(value);
  if (!normalized) {
    return null;
  }

  if (
    normalized.includes('smile') ||
    normalized.includes('happy') ||
    normalized.includes('encourag')
  ) {
    return Tutor3DFacialExpression.Smile;
  }

  if (normalized.includes('think') || normalized.includes('neutral')) {
    return Tutor3DFacialExpression.Thinking;
  }

  if (normalized.includes('sad') || normalized.includes('apolog')) {
    return Tutor3DFacialExpression.Sad;
  }

  if (normalized.includes('angry') || normalized.includes('mad') || normalized.includes('strict')) {
    return Tutor3DFacialExpression.Angry;
  }

  if (normalized.includes('surpris') || normalized.includes('shock')) {
    return Tutor3DFacialExpression.Surprised;
  }

  if (normalized.includes('default') || normalized.includes('normal')) {
    return Tutor3DFacialExpression.Default;
  }

  return null;
};

export const mapTutorAnimation = (
  response: Pick<Tutor3DManagement.TutorInteractionResponse, 'animation' | 'animationState'>
): Tutor3DManagement.AvatarAnimation => {
  const mappedFromAnimation = pickAnimationByKeyword(response.animation);
  if (mappedFromAnimation) {
    return mappedFromAnimation;
  }

  const mappedFromState = pickAnimationByKeyword(response.animationState);
  if (mappedFromState) {
    return mappedFromState;
  }

  return Tutor3DAnimation.Talking0;
};

export const mapTutorExpression = (
  response: Pick<Tutor3DManagement.TutorInteractionResponse, 'facialExpression' | 'emotionState'>
): Tutor3DManagement.FacialExpression => {
  const mappedFromExpression = pickExpressionByKeyword(response.facialExpression);
  if (mappedFromExpression) {
    return mappedFromExpression;
  }

  const mappedFromEmotion = pickExpressionByKeyword(response.emotionState);
  if (mappedFromEmotion) {
    return mappedFromEmotion;
  }

  return Tutor3DFacialExpression.Smile;
};
