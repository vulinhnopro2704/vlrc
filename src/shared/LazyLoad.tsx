import { lazy, Suspense } from 'react';

export default function lazyLoad<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  Fallback: React.ReactNode = null
) {
  const Component = lazy(factory);

  return function LazyComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={Fallback}>
        <Component {...props} />
      </Suspense>
    );
  };
}
