import type { StateCreator } from 'zustand';
import type { Tutor3DActions, Tutor3DStore } from './types';

export const createActions: StateCreator<Tutor3DStore, [], [], { actions: Tutor3DActions }> = set => ({
  actions: {
    setAutoRotate: value => set(state => ({
      autoRotate: typeof value === 'function' ? value(state.autoRotate) : value
    })),
    setCameraDistance: value => set({ cameraDistance: value }),
    setAnimationFadeDuration: value => set({ animationFadeDuration: value }),
    setExpressionIntensity: value => set({ expressionIntensity: value }),
    setVisemeStrength: value => set({ visemeStrength: value }),
    setVisemeSmoothing: value => set({ visemeSmoothing: value }),
    setSelectedAnimation: animation => set({ selectedAnimation: animation }),
    setSelectedExpression: expression => set({ selectedExpression: expression }),
    setIsControlPanelOpen: value => set(state => ({
      isControlPanelOpen: typeof value === 'function' ? value(state.isControlPanelOpen) : value
    }))
  }
});
