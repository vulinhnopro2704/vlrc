import { useRef, type FC } from 'react';
import { Environment, OrbitControls } from '@react-three/drei';
import { useTutor3DStore } from '@/stores/tutor-3d';
import { useAvatarAnimations } from './hooks/useAvatarAnimations';
import { useMorphBindings } from './hooks/useMorphBindings';
import { useAvatarController } from './hooks/useAvatarController';
import { useCameraFollow } from './hooks/useCameraFollow';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Group } from 'three';
import type { VISEMES } from 'wawa-lipsync';

const TutorAvatarRig: FC<{
  liveVisemeRef: React.MutableRefObject<VISEMES>;
  isPlaying: boolean;
}> = ({ liveVisemeRef, isPlaying }) => {
  const groupRef = useRef<Group>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const autoRotate = useTutor3DStore(s => s.autoRotate);
  const cameraDistance = useTutor3DStore(s => s.cameraDistance);
  const animationFadeDuration = useTutor3DStore(s => s.animationFadeDuration);
  const expressionIntensity = useTutor3DStore(s => s.expressionIntensity);
  const visemeStrength = useTutor3DStore(s => s.visemeStrength);
  const visemeSmoothing = useTutor3DStore(s => s.visemeSmoothing);
  const selectedAnimation = useTutor3DStore(s => s.selectedAnimation);
  const selectedExpression = useTutor3DStore(s => s.selectedExpression);
  const setCameraDistance = useTutor3DStore(s => s.setCameraDistance);

  const { avatarScene } = useAvatarAnimations(selectedAnimation, animationFadeDuration);
  const { visemeBindingsRef, expressionBindingsRef, faceAnchorRef } = useMorphBindings(avatarScene);
  const { lookTarget } = useCameraFollow(controlsRef, cameraDistance);

  useAvatarController({
    faceAnchorRef,
    lookTarget,
    controlsRef,
    expressionBindingsRef,
    visemeBindingsRef,
    runtimeFacialExpression: selectedExpression,
    expressionIntensity,
    visemeStrength,
    visemeSmoothing,
    isPlaying,
    liveVisemeRef
  });

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
            setCameraDistance(Number(distance.toFixed(2)));
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
