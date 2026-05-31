import { lazy, Suspense, type ComponentProps, type ComponentType, type ReactNode } from 'react';

// The helper mirrors React.lazy and needs to preserve any component prop shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: ReactNode = <div>Loading...</div>
) {
  const LazyComponent = lazy(importFunc);

  return function LazyLoadedComponent(props: ComponentProps<T>) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
