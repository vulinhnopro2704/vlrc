# AGENTS - VLRC Project Knowledge

This file is the source of truth for agent behavior in this repository.
It is shared knowledge for Copilot/Claude/other coding agents.

## Core Conventions

1. Import hygiene

- Auto-import is enabled via Vite config and generated declarations in `src/types/auto-imports.d.ts`.
- Do not add unnecessary imports for symbols already auto-imported.

2. Props typing

- For local components, declare props inline in the component signature.
- Do not create separate `type Props` / `interface Props` for local-only components.

3. Type architecture

- Prefer domain namespace declarations in `src/types/*.d.ts`.
- Use namespace names with `Management` suffix for management domains.
- Avoid creating standalone types/interfaces unless reused.

4. State architecture

- Client State: Zustand (stores in `src/stores`).
- Server/API State: TanStack Query (`useQuery`, `useMutation`, cache invalidation).
- Do not mirror API state into Zustand unless truly necessary.

5. i18n

- Locale keys are single-level and snake_case (example: `day_la_key`).
- Keep key parity between `src/i18n/locales/vi.json` and `src/i18n/locales/en.json`.

6. Routing/folder architecture

- Route wiring stays in `src/routes`.
- Page implementation stays in `src/pages`.
- This separation is intentional to avoid auto-import confusion and keep route modules lean.

7. TanStack conventions

- TanStack Router files in `src/routes` should focus on route wiring, guards, and loaders.
- TanStack Query is the default for API state (`useQuery`, `useMutation`, invalidation).
- Keep query key ownership close to API modules and avoid ad-hoc keys spread across UI components.

8. Store structure (4 files)

- `types.ts`, `state.ts`, `actions.ts`, `index.ts`.

9. Review gate before completion

- Always run a code-review pass against changed files before confirming done.

## GOOD/BAD Examples

### Import Hygiene

GOOD

```tsx
// useState, useQuery, FC are auto-imported; no extra imports needed
const Example: FC = () => {
  const [open, setOpen] = useState(false);
  const query = useQuery({ queryKey: ['courses'], queryFn: fetchCourses });
  return <Button onClick={() => setOpen(!open)}>{query.data?.length ?? 0}</Button>;
};
```

BAD

```tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';
```

### Local Component Props

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
interface WordReviewPopoverProps {
  word: LearningManagement.Word;
  isCorrect: boolean;
  open?: boolean;
}

const WordReviewPopover: FC<WordReviewPopoverProps> = props => <div>{props.word.word}</div>;
```

### Server State vs Client State

GOOD

```tsx
const courseQuery = useQuery({ queryKey: ['courses'], queryFn: getCourses });
const isSidebarOpen = useLayoutStore.use.isSidebarOpen();
```

BAD

```tsx
// storing API response tree in Zustand without clear UX need
const useCourseStore = create(() => ({ courses: [] as LearningManagement.Course[] }));
```

## Tech Stack Snapshot

- React 19, TypeScript, Vite
- TanStack Router, TanStack Query
- Zustand
- React Hook Form
- Tailwind CSS + Radix UI + shadcn-based UI
- i18next + react-i18next
- ky, zod, lodash-es, lucide-react

<!-- intent-skills:start -->

# Skill mappings - when working in these areas, load the linked skill file into context.

skills:

- task: "Form, input, validation, React Hook Form with UI wrappers"
  load: ".agent/skills/ui-shadcn-form/SKILL.md"
- task: "Code review before complete, detect import noise, bugs, performance and architecture issues"
  load: ".agent/skills/code-review/SKILL.md"
- task: "Type conventions, inline component props, and import hygiene"
  load: ".agent/skills/typescript-types-and-import-hygiene/SKILL.md"
- task: "Client state vs server state boundaries and store structure"
  load: ".agent/skills/client-server-state-boundary/SKILL.md"
- task: "i18n flat-key management and locale parity"
  load: ".agent/skills/i18n-flat-key-management/SKILL.md"
- task: "Route/page separation and module placement governance"
  load: ".agent/skills/route-page-structure-governance/SKILL.md"

<!-- intent-skills:end -->
