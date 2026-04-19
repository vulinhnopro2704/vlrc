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
}
