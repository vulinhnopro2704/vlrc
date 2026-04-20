import { VISEMES } from 'wawa-lipsync';
import type { Object3D } from 'three';
import { Tutor3DFacialExpression } from '@/enums/tutor-3d';

type MorphMeshObject = Object3D & {
  isSkinnedMesh: boolean;
  morphTargetDictionary: Record<string, number>;
  morphTargetInfluences: number[];
};

export const isMorphMesh = (object: Object3D): object is MorphMeshObject => {
  const withMorphTargets = object as Partial<MorphMeshObject>;

  return (
    withMorphTargets.isSkinnedMesh === true &&
    !!withMorphTargets.morphTargetDictionary &&
    Array.isArray(withMorphTargets.morphTargetInfluences)
  );
};

export const createEmptyVisemeBindings = (): Record<VISEMES, Tutor3DManagement.MorphBinding[]> => ({
  [VISEMES.sil]: [],
  [VISEMES.PP]: [],
  [VISEMES.FF]: [],
  [VISEMES.TH]: [],
  [VISEMES.DD]: [],
  [VISEMES.kk]: [],
  [VISEMES.CH]: [],
  [VISEMES.SS]: [],
  [VISEMES.nn]: [],
  [VISEMES.RR]: [],
  [VISEMES.aa]: [],
  [VISEMES.E]: [],
  [VISEMES.I]: [],
  [VISEMES.O]: [],
  [VISEMES.U]: []
});

export const createEmptyExpressionBindings = (): Record<
  Tutor3DFacialExpression,
  Tutor3DManagement.ExpressionMorphBinding[]
> => ({
  [Tutor3DFacialExpression.Default]: [],
  [Tutor3DFacialExpression.Smile]: [],
  [Tutor3DFacialExpression.Thinking]: [],
  [Tutor3DFacialExpression.Sad]: [],
  [Tutor3DFacialExpression.Angry]: [],
  [Tutor3DFacialExpression.Surprised]: []
});
