import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import createSelectors from '../create-selector';
import { initialState } from './state';
import { createActions } from './actions';
import type { Tutor3DStore } from './types';

const useTutor3DStoreBase = create<Tutor3DStore>()(
  devtools(
    (...a) => ({
      ...initialState,
      ...createActions(...a)
    }),
    { name: 'tutor-3d-store' }
  )
);

export const useTutor3DStore = createSelectors(useTutor3DStoreBase);
