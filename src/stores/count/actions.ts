import type { SetState, Actions, State } from './types';

const createAction = (setState: SetState<State>): Actions => ({
  increment: () => {
    setState(state => ({ count: state.count + 1 }), false, 'increment');
  },
  decrement: () => {
    setState(state => ({ count: state.count - 1 }), false, 'decrement');
  }
});

export default createAction;
