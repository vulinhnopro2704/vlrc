# Performance and Quality Checklist

## Performance

- Avoid unnecessary rerenders from unstable props and inline closures passed deep into trees.
- Keep expensive derivations outside render path when possible.
- Prefer selector-style usage for Zustand stores when reading small slices.

GOOD

```tsx
const isSidebarOpen = useLayoutStore.use.isSidebarOpen();
```

BAD

```tsx
const store = useLayoutStore();
const isSidebarOpen = store.isSidebarOpen;
```

## Query and Data Layer

- TanStack Query owns server state lifecycle.
- Keep query keys stable and close to the API module.
- Avoid inline fetch logic in large presentation components.

GOOD

```tsx
const courseQuery = useQuery({ queryKey: ['courses'], queryFn: getCourses });
```

BAD

```tsx
const courseQuery = useQuery({
  queryKey: ['courses', Date.now()],
  queryFn: async () => ky.get('/courses').json()
});
```

## Import and Type Hygiene

- Check your auto-import declaration source before adding imports (for example `[AUTO_IMPORT_MANIFEST_PATH]`).
- Keep local component props inline.

GOOD

```tsx
const Example: FC<{ open?: boolean }> = ({ open = false }) => <div>{String(open)}</div>;
```

BAD

```tsx
import { useState } from 'react';
interface Props {
  open?: boolean;
}
const Example: FC<Props> = ({ open = false }) => <div>{String(open)}</div>;
```
