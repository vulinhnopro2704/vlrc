# CLAUDE - VLRC Project Guide

Use this file as high-priority project knowledge when working in this repository.

## Critical Rules

1. Import hygiene

- Auto-import is enabled in Vite and generated into `src/types/auto-imports.d.ts`.
- Do not add unnecessary imports for auto-imported symbols.

2. Props typing

- For local React components, define props inline in component declaration.
- Do not create local-only `type Props` / `interface Props`.

3. Type system

- Prefer namespace declarations in `src/types/*.d.ts`.
- For management/business domains, use namespace names ending with `Management`.
- Reuse domain entities with `Pick`/`Partial`/`Omit` instead of creating redundant types.

4. State boundaries

- Client-only state: Zustand.
- Server/API state: TanStack Query.
- Do not duplicate server state into Zustand without clear UX rationale.

5. Store structure

- Follow 4-file pattern in each store module:
  - `types.ts`
  - `state.ts`
  - `actions.ts`
  - `index.ts`

6. i18n

- Keys are flat one-level and snake_case.
- Maintain key parity between `src/i18n/locales/vi.json` and `src/i18n/locales/en.json`.

7. Folder architecture

- Keep route wiring in `src/routes`.
- Keep page UI implementations in `src/pages`.
- This split exists to avoid auto-import conflicts and keep route modules focused.

8. TanStack conventions

- Keep TanStack Router files focused on wiring/guards/loaders.
- Keep TanStack Query query keys intentional and close to API modules.
- Do not spread ad-hoc query keys across unrelated presentation components.

## Tech Snapshot

- React 19, TypeScript, Vite
- TanStack Router, TanStack Query
- Zustand
- React Hook Form
- Tailwind CSS + Radix UI + shadcn-based UI
- i18next + react-i18next
- ky, zod, lodash-es, lucide-react

## Mandatory Before Completion

- Run a code-review pass using `.agent/skills/code-review/SKILL.md` before confirming completion.

## GOOD/BAD Examples

GOOD

```tsx
const lessonQuery = useQuery({
  queryKey: ['lesson', lessonId],
  queryFn: () => getLesson(lessonId)
});
const open = useUiStore.use.open();
```

BAD

```tsx
const useLessonStore = create(() => ({ lesson: null as LearningManagement.Lesson | null }));
// then mirror API state into Zustand by default
```
