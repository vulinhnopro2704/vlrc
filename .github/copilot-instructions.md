# Copilot Instructions

## Project Context

- This project is a React 19 + TypeScript + Vite app.
- Routing uses TanStack Router (file-based routes in `src/routes`).
- Server/API state uses TanStack Query.
- Client UI state uses Zustand stores in `src/stores`.
- i18n uses i18next + react-i18next with locale files in `src/i18n/locales`.
- Auto-import is enabled by Vite + unplugin-auto-import and generated at `src/types/auto-imports.d.ts`.

## Import Rules (Critical)

- Do not add imports for symbols already covered by auto-import config and generated globals.
- Before adding a new import, check whether the symbol is available in `src/types/auto-imports.d.ts`.
- Keep imports minimal and explicit only for symbols that are not auto-imported.
- Avoid duplicate imports and alias noise.

## Component Prop Typing (Critical)

- For local React components, inline prop types directly in the component declaration.
- Do not create separate `type XxxProps` or `interface XxxProps` for local-only component props.
- Only extract a shared props type if it is reused across multiple files/components.
- Preferred style example:

```tsx
const WordReviewPopover: FC<{
  word: LearningManagement.Word;
  isCorrect: boolean;
  open?: boolean;
  attempts?: number;
  onNext?: () => void;
  nextLabel?: string;
  className?: string;
}> = ({ word, isCorrect, open = false, attempts, onNext, nextLabel, className }) => {
  return <div />;
};
```

## Type System Rules

- Prefer domain namespaces in `src/types/*.d.ts`.
- Use namespace names that end with `Management` for domain models and payloads.
- Do not create unnecessary standalone type/interface files for one-off local component props.
- Reuse existing namespace entities with `Pick`, `Partial`, `Omit`, and intersections when creating payload/query types.

## State Management Boundaries

- Use Zustand (store/state/context pattern) for client-only UI/app state.
- Use TanStack Query for server/API state, caching, invalidation, and async lifecycle.
- Do not duplicate server state into Zustand unless there is a clear UX-driven reason.
- Keep query/mutation logic near API modules/hooks, not in UI-only stores.

## TanStack Rules

- TanStack Router files in `src/routes` are for route wiring, not full page UI implementation.
- Keep page UI in `src/pages` and import it into route files.
- Use stable and intentional query keys; avoid scattering ad-hoc query keys in unrelated components.
- Prefer API hooks/modules as query function sources, not inline fetch logic in presentation components.

## Store Pattern (4 Files)

- Standard store module layout:
  - `types.ts`: state/action/type contracts.
  - `state.ts`: initial state.
  - `actions.ts`: action creators and mutations.
  - `index.ts`: store creation + selector helpers + exported hook.
- Follow this pattern when creating or refactoring stores.

## i18n Rules

- Keep translation keys flat (single-level object), no nested key objects.
- Use snake_case keys such as `day_la_key`, `auth_login_title`.
- Keep keys stable across locales (`vi.json`, `en.json`) and update both files together.
- Prefer `t('key_name')` usage with existing key style.

## Folder Structure & Routing

- Keep route definitions in `src/routes`.
- Keep page UI implementations in `src/pages`.
- Continue separating `pages` from `routes` to reduce auto-import conflicts and keep router files focused on route wiring.
- Keep shared/reusable UI in `src/components`, API clients in `src/api`, and domain types in `src/types`.

## Completion Checklist

Before confirming completion, always do a lightweight self-review:

1. Remove unnecessary imports and verify auto-import usage.
2. Ensure local component props are inline typed.
3. Validate state placement (Zustand for client state, TanStack Query for server state).
4. Verify i18n keys follow flat snake_case conventions.
5. Check folder placement follows current project architecture.

## GOOD/BAD Examples

### Props Typing

GOOD

```tsx
const WordReviewPopover: FC<{
  word: LearningManagement.Word;
  isCorrect: boolean;
  open?: boolean;
}> = ({ word, isCorrect, open = false }) => <div>{word.word}</div>;
```

BAD

```tsx
interface Props {
  word: LearningManagement.Word;
  isCorrect: boolean;
  open?: boolean;
}

const WordReviewPopover: FC<Props> = props => <div>{props.word.word}</div>;
```

### Server State vs Client State

GOOD

```tsx
const lessonQuery = useQuery({
  queryKey: ['lesson', lessonId],
  queryFn: () => getLesson(lessonId)
});
const activeTab = useUiStore.use.activeTab();
```

BAD

```tsx
const useLessonStore = create(() => ({ lesson: null as LearningManagement.Lesson | null }));
// then manually fetch API and mirror into Zustand by default
```
