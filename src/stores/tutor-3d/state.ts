import { Tutor3DAnimation, Tutor3DFacialExpression } from '@/enums/tutor-3d';
import type { Tutor3DState } from './types';

export const initialState: Tutor3DState = {
  autoRotate: true,
  cameraDistance: 3.2,
  animationFadeDuration: 0.25,
  expressionIntensity: 1,
  visemeStrength: 1,
  visemeSmoothing: 16,
  selectedAnimation: Tutor3DAnimation.Talking0,
  selectedExpression: Tutor3DFacialExpression.Smile,
  isControlPanelOpen: true
};
