export interface State {
  count: number;
}

export interface Actions {
  increment(): void;
  decrement(): void;
}

export type SetState<T extends State> = {
  _(
    partial: T | Partial<T> | ((state: T) => T | Partial<T>),
    replace?: boolean | undefined,
    actionName?: string
  ): void;
}['_'];
