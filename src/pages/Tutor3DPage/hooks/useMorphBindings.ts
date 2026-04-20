import { useEffect, useRef } from 'react';
import type { Object3D, Group } from 'three';
import { Tutor3DFacialExpression } from '@/enums/tutor-3d';
import {
  createEmptyExpressionBindings,
  createEmptyVisemeBindings,
  isMorphMesh
} from '@lib/avatar-utils';
import {
  FACIAL_EXPRESSION_TARGETS,
  VISEME_TO_MORPH_TARGET
} from '@/constants/moded-3d-config';
import type { VISEMES } from 'wawa-lipsync';

export const useMorphBindings = (avatarScene: Group | null) => {
  const visemeBindingsRef = useRef(createEmptyVisemeBindings());
  const expressionBindingsRef = useRef(createEmptyExpressionBindings());
  const faceAnchorRef = useRef<Object3D | null>(null);

  useEffect(() => {
    if (!avatarScene) return;

    avatarScene.traverse((object: Object3D) => {
      if ('castShadow' in object) {
        const shadowObject = object as Object3D & { castShadow: boolean; receiveShadow: boolean };
        shadowObject.castShadow = true;
        shadowObject.receiveShadow = true;
      }
    });
  }, [avatarScene]);

  useEffect(() => {
    if (!avatarScene) return;

    const visemeBindings = createEmptyVisemeBindings();
    const expressionBindings = createEmptyExpressionBindings();

    avatarScene.traverse((object: Object3D) => {
      if (!isMorphMesh(object)) return;

      const dictionary = object.morphTargetDictionary;
      const influences = object.morphTargetInfluences;

      (Object.entries(VISEME_TO_MORPH_TARGET) as Array<[VISEMES, string]>).forEach(
        ([viseme, morphName]) => {
          const index = dictionary[morphName];
          if (typeof index !== 'number') return;
          visemeBindings[viseme].push({ influences, index });
        }
      );

      (
        Object.entries(FACIAL_EXPRESSION_TARGETS) as Array<
          [Tutor3DFacialExpression, Record<string, number>]
        >
      ).forEach(([expression, targets]) => {
        Object.keys(targets).forEach(morphName => {
          const index = dictionary[morphName];
          if (typeof index !== 'number') return;
          expressionBindings[expression].push({ influences, index, morphName });
        });
      });
    });

    visemeBindingsRef.current = visemeBindings;
    expressionBindingsRef.current = expressionBindings;

    faceAnchorRef.current =
      avatarScene.getObjectByName('Head') ??
      avatarScene.getObjectByName('Wolf3D_Head') ??
      avatarScene.getObjectByName('EyeLeft') ??
      avatarScene.getObjectByName('EyeRight') ??
      null;
  }, [avatarScene]);

  return { visemeBindingsRef, expressionBindingsRef, faceAnchorRef };
};
