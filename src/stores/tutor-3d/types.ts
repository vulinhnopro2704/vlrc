export interface Tutor3DState {
  autoRotate: boolean;
  cameraDistance: number;
  animationFadeDuration: number;
  expressionIntensity: number;
  visemeStrength: number;
  visemeSmoothing: number;
  selectedAnimation: Tutor3DManagement.AvatarAnimation;
  selectedExpression: Tutor3DManagement.FacialExpression;
  isControlPanelOpen: boolean;
}

export interface Tutor3DActions {
  setAutoRotate: (value: boolean | ((prev: boolean) => boolean)) => void;
  setCameraDistance: (value: number) => void;
  setAnimationFadeDuration: (value: number) => void;
  setExpressionIntensity: (value: number) => void;
  setVisemeStrength: (value: number) => void;
  setVisemeSmoothing: (value: number) => void;
  setSelectedAnimation: (animation: Tutor3DManagement.AvatarAnimation) => void;
  setSelectedExpression: (expression: Tutor3DManagement.FacialExpression) => void;
  setIsControlPanelOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export interface Tutor3DStore extends Tutor3DState {
  actions: Tutor3DActions;
}
