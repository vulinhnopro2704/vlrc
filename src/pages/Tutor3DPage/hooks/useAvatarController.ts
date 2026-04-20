import { useFrame } from '@react-three/fiber';
import { MathUtils, Vector3, Object3D } from 'three';
import { Tutor3DFacialExpression } from '@/enums/tutor-3d';
import { FACIAL_EXPRESSION_TARGETS } from '@/constants/moded-3d-config';
import { VISEMES } from 'wawa-lipsync';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface UseAvatarControllerProps {
  faceAnchorRef: React.MutableRefObject<Object3D | null>;
  lookTarget: Vector3;
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  expressionBindingsRef: React.MutableRefObject<Record<Tutor3DFacialExpression, Tutor3DManagement.ExpressionMorphBinding[]>>;
  visemeBindingsRef: React.MutableRefObject<Record<VISEMES, Tutor3DManagement.MorphBinding[]>>;
  runtimeFacialExpression: Tutor3DFacialExpression;
  expressionIntensity: number;
  visemeStrength: number;
  visemeSmoothing: number;
  isPlaying: boolean;
  liveVisemeRef: React.MutableRefObject<VISEMES>;
}

export const useAvatarController = ({
  faceAnchorRef,
  lookTarget,
  controlsRef,
  expressionBindingsRef,
  visemeBindingsRef,
  runtimeFacialExpression,
  expressionIntensity,
  visemeStrength,
  visemeSmoothing,
  isPlaying,
  liveVisemeRef
}: UseAvatarControllerProps) => {
  const desiredLookTarget = new Vector3(0, 1.45, 0);
  const worldFacePosition = new Vector3();

  useFrame((_, delta) => {
    if (faceAnchorRef.current) {
      faceAnchorRef.current.getWorldPosition(worldFacePosition);
      worldFacePosition.y += 0.06;
      desiredLookTarget.copy(worldFacePosition);
      lookTarget.lerp(desiredLookTarget, 1 - Math.exp(-8 * delta));
      if (controlsRef.current) {
        controlsRef.current.target.copy(lookTarget);
      }
    }

    const expressionTargets = FACIAL_EXPRESSION_TARGETS[runtimeFacialExpression] as Record<string, number> | undefined;

    (
      Object.values(expressionBindingsRef.current) as Tutor3DManagement.ExpressionMorphBinding[][]
    ).forEach(bindings => {
      bindings.forEach(binding => {
        const currentValue = binding.influences[binding.index] ?? 0;
        binding.influences[binding.index] = MathUtils.damp(currentValue, 0, 14, delta);
      });
    });

    if (runtimeFacialExpression && runtimeFacialExpression !== Tutor3DFacialExpression.Default && expressionTargets) {
      expressionBindingsRef.current[runtimeFacialExpression]?.forEach((binding: Tutor3DManagement.ExpressionMorphBinding) => {
        const targetWeight = (expressionTargets[binding.morphName] ?? 0) * expressionIntensity;
        const currentValue = binding.influences[binding.index] ?? 0;
        binding.influences[binding.index] = MathUtils.damp(currentValue, targetWeight, 12, delta);
      });
    }

    (Object.values(visemeBindingsRef.current) as Tutor3DManagement.MorphBinding[][]).forEach(
      bindings => {
        bindings.forEach(binding => {
          const currentValue = binding.influences[binding.index] ?? 0;
          binding.influences[binding.index] = MathUtils.damp(
            currentValue,
            0,
            visemeSmoothing,
            delta
          );
        });
      }
    );

    const activeViseme = isPlaying ? liveVisemeRef.current : VISEMES.sil;
    if (visemeBindingsRef.current[activeViseme]) {
       visemeBindingsRef.current[activeViseme].forEach((binding: Tutor3DManagement.MorphBinding) => {
        const currentValue = binding.influences[binding.index] ?? 0;
        binding.influences[binding.index] = MathUtils.damp(
          currentValue,
          activeViseme === VISEMES.sil ? 0 : visemeStrength,
          visemeSmoothing,
          delta
        );
      });
    }
  });
};
