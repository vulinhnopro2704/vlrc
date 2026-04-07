# Project Structure Examples

## Route and Page separation

GOOD

```tsx
// [ROUTES_DIRECTORY]/login.tsx
import LoginPage from '@/pages/LoginPage';

export const Route = createFileRoute('/login')({
  component: LoginPage
});
```

BAD

```tsx
// [ROUTES_DIRECTORY]/login.tsx
export const Route = createFileRoute('/login')({
  component: () => {
    // full page JSX + local feature logic here
    return <div>...</div>;
  }
});
```

## Domain placement

GOOD

```text
[API_DIRECTORY]/lesson-management.ts
[PAGES_DIRECTORY]/LessonPage/
[TYPES_DIRECTORY]/learning-management.d.ts
```

BAD

```text
[ROUTES_DIRECTORY]/lesson-api.ts      // API module in routes
[PAGES_DIRECTORY]/types.ts            // domain types in pages
```
