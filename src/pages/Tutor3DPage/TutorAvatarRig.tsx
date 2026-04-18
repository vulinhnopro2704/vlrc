import { Environment, OrbitControls, useAnimations, useFBX, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { VISEMES } from 'wawa-lipsync';
import { AnimationClip, Group, MathUtils, type Object3D } from 'three';
import type { GLTF } from 'three-stdlib';
import { Tutor3DAnimation, Tutor3DFacialExpression } from '@/enums/tutor-3d';
import {
  ANIMATION_LIBRARY_PATH,
  AVATAR_MODEL_PATH,
  EXTRA_ANIMATION_FILES,
  FACIAL_EXPRESSION_TARGETS,
  VISEME_TO_MORPH_TARGET
} from './constants';
import {
  createEmptyExpressionBindings,
  createEmptyVisemeBindings,
  isMorphMesh
} from './avatar-utils';

type AnimationAsset = Group & {
  animations: AnimationClip[];
};

const TutorAvatarRig: FC<{
  runtimeState: Tutor3DManagement.RuntimeState;
  autoRotate: boolean;
  cameraDistance: number;
  liveVisemeRef: { current: VISEMES };
}> = ({ runtimeState, autoRotate, cameraDistance, liveVisemeRef }) => {
  const groupRef = useRef<Group>(null);
  const currentActionRef = useRef<Tutor3DAnimation | null>(null);
  const visemeBindingsRef = useRef(createEmptyVisemeBindings());
  const expressionBindingsRef = useRef(createEmptyExpressionBindings());

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
    setAvatarScene(scene.clone(true));
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

  const { actions } = useAnimations(mergedClips, groupRef);

  useEffect(() => {
    const previousKey = currentActionRef.current;
    const previousAction = previousKey ? actions[previousKey] : undefined;
    const nextAction = actions[runtimeState.animation] ?? actions[Tutor3DAnimation.Idle];

    if (!nextAction) return;

    if (previousAction && previousAction !== nextAction) {
      previousAction.fadeOut(0.2);
    }

    nextAction.reset().fadeIn(0.2).play();
    currentActionRef.current = runtimeState.animation;

    return () => {
      nextAction.fadeOut(0.2);
    };
  }, [actions, runtimeState.animation]);

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
  }, [avatarScene]);

  useFrame((_, delta) => {
    const expressionTargets = FACIAL_EXPRESSION_TARGETS[runtimeState.facialExpression];

    (
      Object.values(expressionBindingsRef.current) as Tutor3DManagement.ExpressionMorphBinding[][]
    ).forEach(bindings => {
      bindings.forEach(binding => {
        const currentValue = binding.influences[binding.index] ?? 0;
        binding.influences[binding.index] = MathUtils.damp(currentValue, 0, 14, delta);
      });
    });

    if (runtimeState.facialExpression !== Tutor3DFacialExpression.Default) {
      expressionBindingsRef.current[runtimeState.facialExpression].forEach(binding => {
        const targetWeight = expressionTargets[binding.morphName] ?? 0;
        const currentValue = binding.influences[binding.index] ?? 0;
        binding.influences[binding.index] = MathUtils.damp(currentValue, targetWeight, 12, delta);
      });
    }

    (Object.values(visemeBindingsRef.current) as Tutor3DManagement.MorphBinding[][]).forEach(
      bindings => {
        bindings.forEach(binding => {
          const currentValue = binding.influences[binding.index] ?? 0;
          binding.influences[binding.index] = MathUtils.damp(currentValue, 0, 20, delta);
        });
      }
    );

    const activeViseme = runtimeState.isPlaying ? liveVisemeRef.current : VISEMES.sil;
    visemeBindingsRef.current[activeViseme].forEach((binding: Tutor3DManagement.MorphBinding) => {
      const currentValue = binding.influences[binding.index] ?? 0;
      binding.influences[binding.index] = MathUtils.damp(currentValue, 1, 16, delta);
    });
  });

  return (
    <>
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={1.25}
        maxDistance={2.8}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.75}
        autoRotate={autoRotate}
        autoRotateSpeed={0.8}
      />
      <Environment preset='studio' />
      <ambientLight intensity={0.45} />
      <directionalLight position={[2, 3, 2]} intensity={1.2} castShadow />
      <directionalLight position={[-2, 2, -1]} intensity={0.55} />
      <group ref={groupRef} position={[0, -1.55, 0]} scale={1.5}>
        {avatarScene ? <primitive object={avatarScene} /> : null}
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.62, 0]} receiveShadow>
        <circleGeometry args={[cameraDistance * 1.5, 64]} />
        <shadowMaterial transparent opacity={0.18} />
      </mesh>
    </>
  );
};

export default TutorAvatarRig;
