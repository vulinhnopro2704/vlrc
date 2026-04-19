import { useEffect, useState, useRef } from 'react';
import { useAnimations, useFBX, useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import { AnimationClip, Group } from 'three';
import type { GLTF } from 'three-stdlib';
import { Tutor3DAnimation } from '@/enums/tutor-3d';
import {
  ANIMATION_LIBRARY_PATH,
  AVATAR_MODEL_PATH,
  EXTRA_ANIMATION_FILES
} from '@/constants/moded-3d-config';

type AnimationAsset = Group & {
  animations: AnimationClip[];
};

export const useAvatarAnimations = (
  runtimeAnimation: Tutor3DAnimation,
  animationFadeDuration: number
) => {
  const currentActionRef = useRef<Tutor3DAnimation | null>(null);
  const { scene } = useGLTF(AVATAR_MODEL_PATH) as GLTF;
  const animationLibrary = useGLTF(ANIMATION_LIBRARY_PATH) as GLTF;
  const angryFbx = useFBX(EXTRA_ANIMATION_FILES[Tutor3DAnimation.Angry]) as AnimationAsset;
  const cryingFbx = useFBX(EXTRA_ANIMATION_FILES[Tutor3DAnimation.Crying]) as AnimationAsset;
  const laughingFbx = useFBX(EXTRA_ANIMATION_FILES[Tutor3DAnimation.Laughing]) as AnimationAsset;
  const terrifiedFbx = useFBX(EXTRA_ANIMATION_FILES[Tutor3DAnimation.Terrified]) as AnimationAsset;
  const dancingFbx = useFBX(EXTRA_ANIMATION_FILES[Tutor3DAnimation.RumbaDancing]) as AnimationAsset;

  const [avatarScene, setAvatarScene] = useState<Group | null>(null);
  const [mergedClips, setMergedClips] = useState<AnimationClip[]>([]);

  useEffect(() => {
    setAvatarScene(SkeletonUtils.clone(scene) as Group);
  }, [scene]);

  useEffect(() => {
    const clipsByName = new Map<string, AnimationClip>();

    animationLibrary.animations.forEach(clip => {
      clipsByName.set(clip.name, clip.clone());
    });

    const fbxSources: Array<{ name: Tutor3DAnimation; source: AnimationAsset }> = [
      { name: Tutor3DAnimation.Angry, source: angryFbx },
      { name: Tutor3DAnimation.Crying, source: cryingFbx },
      { name: Tutor3DAnimation.Laughing, source: laughingFbx },
      { name: Tutor3DAnimation.Terrified, source: terrifiedFbx },
      { name: Tutor3DAnimation.RumbaDancing, source: dancingFbx }
    ];

    fbxSources.forEach(item => {
      const clip = item.source.animations.at(0);
      if (!clip) return;

      const normalizedClip = clip.clone();
      normalizedClip.name = item.name;
      clipsByName.set(item.name, normalizedClip);
    });

    setMergedClips([...clipsByName.values()]);
  }, [animationLibrary.animations, angryFbx, cryingFbx, laughingFbx, terrifiedFbx, dancingFbx]);

  const { actions } = useAnimations(mergedClips, avatarScene ?? undefined);

  useEffect(() => {
    const previousKey = currentActionRef.current;
    const previousAction = previousKey ? actions[previousKey] : undefined;
    const actionByState = actions[runtimeAnimation];
    const idleAction = actions[Tutor3DAnimation.Idle];
    const fallbackAction = Object.values(actions).find(Boolean);
    const nextAction = actionByState ?? idleAction ?? fallbackAction;

    if (!nextAction) return;

    if (previousAction && previousAction !== nextAction) {
      previousAction.fadeOut(animationFadeDuration);
    }

    nextAction.reset().fadeIn(animationFadeDuration).play();
    currentActionRef.current = runtimeAnimation;

    return () => {
      nextAction.fadeOut(animationFadeDuration);
    };
  }, [actions, animationFadeDuration, runtimeAnimation]);

  return { avatarScene };
};
