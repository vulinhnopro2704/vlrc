# State Architecture Examples

## Server vs Client State

GOOD

```tsx
const lessonQuery = useQuery({
  queryKey: ['lesson', lessonId],
  queryFn: () => getLesson(lessonId)
});

const sidebarCollapsed = useLayoutStore.use.sidebarCollapsed();
```

BAD

```tsx
const useLessonStore = create(() => ({
  lesson: null as LearningManagement.Lesson | null,
  async fetchLesson(id: App.ID) {
    this.lesson = await ky.get(`lessons/${id}`).json();
  }
}));
```

## Store 4-file Pattern

GOOD

```text
[STATE_DIRECTORY]/[feature]/
- types.ts
- state.ts
- actions.ts
- index.ts
```

BAD

```text
[STATE_DIRECTORY]/[feature].ts  // mixed state, actions, side effects in one file
```
