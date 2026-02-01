import { create } from 'zustand';
import createSelectors from '@stores/create-selector';
import initialState from './state';
import createAction from './actions';
import type { State, Actions } from './types';

const useCountStore = createSelectors(
  create<
    State & {
      action: Actions;
    }
  >()(set => ({
    ...initialState,
    action: createAction(set)
  }))
);

export default useCountStore;
