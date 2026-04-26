import { useTutor3DStore } from '@/stores/tutor-3d';
import { ANIMATION_OPTIONS, EXPRESSION_OPTIONS } from '@/constants/moded-3d-config';

export const Tutor3DDebugControls: FC = () => {
  const autoRotate = useTutor3DStore(s => s.autoRotate);
  const cameraDistance = useTutor3DStore(s => s.cameraDistance);
  const animationFadeDuration = useTutor3DStore(s => s.animationFadeDuration);
  const expressionIntensity = useTutor3DStore(s => s.expressionIntensity);
  const visemeStrength = useTutor3DStore(s => s.visemeStrength);
  const visemeSmoothing = useTutor3DStore(s => s.visemeSmoothing);
  const selectedAnimation = useTutor3DStore(s => s.selectedAnimation);
  const selectedExpression = useTutor3DStore(s => s.selectedExpression);
  const isControlPanelOpen = useTutor3DStore(s => s.isControlPanelOpen);

  const {
    setAutoRotate,
    setCameraDistance,
    setAnimationFadeDuration,
    setExpressionIntensity,
    setVisemeStrength,
    setVisemeSmoothing,
    setSelectedAnimation,
    setSelectedExpression,
    setIsControlPanelOpen
  } = useTutor3DStore(s => s.actions);

  const [, setLevaControls] = useControls(
    'Tutor Debug',
    () => ({
      autoRotate: {
        value: autoRotate,
        onChange: (value: boolean) => setAutoRotate(value)
      },
      cameraDistance: {
        value: cameraDistance,
        min: 2,
        max: 5,
        step: 0.05,
        onChange: (value: number) => setCameraDistance(value)
      },
      animationFadeDuration: {
        value: animationFadeDuration,
        min: 0.05,
        max: 0.8,
        step: 0.05,
        onChange: (value: number) => setAnimationFadeDuration(value)
      },
      expressionIntensity: {
        value: expressionIntensity,
        min: 0,
        max: 1.5,
        step: 0.05,
        onChange: (value: number) => setExpressionIntensity(value)
      },
      visemeStrength: {
        value: visemeStrength,
        min: 0.1,
        max: 1.8,
        step: 0.05,
        onChange: (value: number) => setVisemeStrength(value)
      },
      visemeSmoothing: {
        value: visemeSmoothing,
        min: 8,
        max: 28,
        step: 1,
        onChange: (value: number) => setVisemeSmoothing(value)
      },
      animation: {
        value: selectedAnimation,
        options: [...ANIMATION_OPTIONS],
        onChange: (value: string) => setSelectedAnimation(value as Tutor3DManagement.AvatarAnimation)
      },
      expression: {
        value: selectedExpression,
        options: [...EXPRESSION_OPTIONS],
        onChange: (value: string) => setSelectedExpression(value as Tutor3DManagement.FacialExpression)
      },
      settingsPanel: {
        value: isControlPanelOpen,
        onChange: (value: boolean) => setIsControlPanelOpen(value)
      }
    }),
    []
  );

  useEffect(() => {
    setLevaControls({
      autoRotate,
      cameraDistance,
      animationFadeDuration,
      expressionIntensity,
      visemeStrength,
      visemeSmoothing,
      animation: selectedAnimation,
      expression: selectedExpression,
      settingsPanel: isControlPanelOpen
    });
  }, [
    autoRotate,
    cameraDistance,
    animationFadeDuration,
    expressionIntensity,
    visemeStrength,
    visemeSmoothing,
    isControlPanelOpen,
    selectedAnimation,
    selectedExpression,
    setLevaControls
  ]);

  return <Leva hidden={!isControlPanelOpen} collapsed />;
};
