import { Environment, OrbitControls, useAnimations, useFBX, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { VISEMES } from 'wawa-lipsync';
import { AnimationClip, Group, MathUtils, Vector3, type Object3D } from 'three';
import type { GLTF, OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { SkeletonUtils } from 'three-stdlib';
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
  onCameraDistanceChange: (value: number) => void;
  animationFadeDuration: number;
  expressionIntensity: number;
  visemeStrength: number;
  visemeSmoothing: number;
  liveVisemeRef: { current: VISEMES };
}> = ({
  runtimeState,
  autoRotate,
  cameraDistance,
  onCameraDistanceChange,
  animationFadeDuration,
  expressionIntensity,
  visemeStrength,
  visemeSmoothing,
  liveVisemeRef
}) => {
  const groupRef = useRef<Group>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const currentActionRef = useRef<Tutor3DAnimation | null>(null);
  const visemeBindingsRef = useRef(createEmptyVisemeBindings());
  const expressionBindingsRef = useRef(createEmptyExpressionBindings());
  const faceAnchorRef = useRef<Object3D | null>(null);
  const { camera } = useThree();

  const lookTarget = useMemo(() => new Vector3(0, 1.45, 0), []);
  const desiredLookTarget = useMemo(() => new Vector3(0, 1.45, 0), []);
  const worldFacePosition = useMemo(() => new Vector3(), []);
  const tempDirection = useMemo(() => new Vector3(), []);

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
    const actionByState = actions[runtimeState.animation];
    const idleAction = actions[Tutor3DAnimation.Idle];
    const fallbackAction = Object.values(actions).find(Boolean);
    const nextAction = actionByState ?? idleAction ?? fallbackAction;

    if (!nextAction) return;

    if (previousAction && previousAction !== nextAction) {
      previousAction.fadeOut(animationFadeDuration);
    }

    nextAction.reset().fadeIn(animationFadeDuration).play();
    currentActionRef.current = runtimeState.animation;

    return () => {
      nextAction.fadeOut(animationFadeDuration);
    };
  }, [actions, animationFadeDuration, runtimeState.animation]);

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

  useFrame((_, delta) => {
    if (faceAnchorRef.current) {
      faceAnchorRef.current.getWorldPosition(worldFacePosition);
      worldFacePosition.y += 0.06;
      desiredLookTarget.copy(worldFacePosition);
      lookTarget.lerp(desiredLookTarget, 1 - Math.exp(-8 * delta));
      controlsRef.current?.target.copy(lookTarget);
    }

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
        const targetWeight = (expressionTargets[binding.morphName] ?? 0) * expressionIntensity;
        const currentValue = binding.influences[binding.index] ?? 0;
        binding.influences[binding.index] = MathUtils.damp(currentValue, targetWeight, 12, delta);
      });
    }

    (Object.values(visemeBindingsRef.current) as Tutor3DManagement.MorphBinding[][]).forEach(
      bindings => {
        bindings.forEach(binding => {
          const currentValue = binding.influences[binding.index] ?? 0;
          binding.influences[binding.index] = MathUtils.damp(currentValue, 0, visemeSmoothing, delta);
        });
      }
    );

    const activeViseme = runtimeState.isPlaying ? liveVisemeRef.current : VISEMES.sil;
    visemeBindingsRef.current[activeViseme].forEach((binding: Tutor3DManagement.MorphBinding) => {
      const currentValue = binding.influences[binding.index] ?? 0;
      binding.influences[binding.index] = MathUtils.damp(
        currentValue,
        activeViseme === VISEMES.sil ? 0 : visemeStrength,
        visemeSmoothing,
        delta
      );
    });
  });

  useEffect(() => {
    tempDirection.copy(camera.position).sub(lookTarget);

    if (tempDirection.lengthSq() < 1e-6) {
      tempDirection.set(0, 0.5, 1);
    }

    tempDirection.normalize().multiplyScalar(cameraDistance);
    camera.position.copy(lookTarget).add(tempDirection);
    camera.lookAt(lookTarget);
    controlsRef.current?.target.copy(lookTarget);
    controlsRef.current?.update();
  }, [camera, cameraDistance, lookTarget, tempDirection]);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        enablePan={false}
        dampingFactor={0.08}
        target={[lookTarget.x, lookTarget.y, lookTarget.z]}
        minDistance={2}
        maxDistance={5}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 1.9}
        zoomSpeed={0.9}
        autoRotate={autoRotate}
        autoRotateSpeed={0.8}
        onChange={event => {
          if (!event) return;
          const distance = event.target.object.position.distanceTo(event.target.target);
          if (Math.abs(distance - cameraDistance) > 0.015) {
            onCameraDistanceChange(Number(distance.toFixed(2)));
          }
        }}
      />
      <Environment preset='studio' />
      <ambientLight intensity={0.45} />
      <directionalLight position={[2, 3, 2]} intensity={1.2} castShadow />
      <directionalLight position={[-2, 2, -1]} intensity={0.55} />
      <group ref={groupRef} position={[0, -1.2, 0]} scale={1.18}>
        {avatarScene ? <primitive object={avatarScene} /> : null}
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.24, 0]} receiveShadow>
        <circleGeometry args={[cameraDistance * 1.4, 64]} />
        <shadowMaterial transparent opacity={0.18} />
      </mesh>
    </>
  );
};

export default TutorAvatarRig;
