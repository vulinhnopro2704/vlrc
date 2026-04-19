import type { FC } from 'react';
import { useEffect } from 'react';
import { Leva, useControls } from 'leva';
import { useTutor3DStore } from '@/stores/tutor-3d';
import { ANIMATION_OPTIONS, EXPRESSION_OPTIONS } from '@/constants/moded-3d-config';

export const Tutor3DDebugControls: FC = () => {
  const autoRotate = useTutor3DStore(s => s.autoRotate);
  const setAutoRotate = useTutor3DStore(s => s.setAutoRotate);
  const cameraDistance = useTutor3DStore(s => s.cameraDistance);
  const setCameraDistance = useTutor3DStore(s => s.setCameraDistance);
  const animationFadeDuration = useTutor3DStore(s => s.animationFadeDuration);
  const setAnimationFadeDuration = useTutor3DStore(s => s.setAnimationFadeDuration);
  const expressionIntensity = useTutor3DStore(s => s.expressionIntensity);
  const setExpressionIntensity = useTutor3DStore(s => s.setExpressionIntensity);
  const visemeStrength = useTutor3DStore(s => s.visemeStrength);
  const setVisemeStrength = useTutor3DStore(s => s.setVisemeStrength);
  const visemeSmoothing = useTutor3DStore(s => s.visemeSmoothing);
  const setVisemeSmoothing = useTutor3DStore(s => s.setVisemeSmoothing);
  const selectedAnimation = useTutor3DStore(s => s.selectedAnimation);
  const setSelectedAnimation = useTutor3DStore(s => s.setSelectedAnimation);
  const selectedExpression = useTutor3DStore(s => s.selectedExpression);
  const setSelectedExpression = useTutor3DStore(s => s.setSelectedExpression);
  const isControlPanelOpen = useTutor3DStore(s => s.isControlPanelOpen);
  const setIsControlPanelOpen = useTutor3DStore(s => s.setIsControlPanelOpen);

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
