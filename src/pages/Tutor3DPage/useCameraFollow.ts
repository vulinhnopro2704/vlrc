import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export const useCameraFollow = (
  controlsRef: React.RefObject<OrbitControlsImpl | null>,
  cameraDistance: number
) => {
  const { camera } = useThree();
  const lookTarget = new Vector3(0, 1.45, 0);
  const tempDirection = new Vector3();

  useEffect(() => {
    tempDirection.copy(camera.position).sub(lookTarget);

    if (tempDirection.lengthSq() < 1e-6) {
      tempDirection.set(0, 0.5, 1);
    }

    tempDirection.normalize().multiplyScalar(cameraDistance);
    camera.position.copy(lookTarget).add(tempDirection);
    camera.lookAt(lookTarget);
    if (controlsRef.current) {
        controlsRef.current.target.copy(lookTarget);
        controlsRef.current.update();
    }
  }, [camera, cameraDistance, lookTarget, tempDirection, controlsRef]);

  return { lookTarget };
};
