# Code Review Rules

## Components and UI

- Prefer shared components and wrappers from `[SHARED_COMPONENTS_DIRECTORY]`.
- Use Tailwind utility classes for layout and spacing.
- Keep route files in `[ROUTES_DIRECTORY]` lean; full page UI belongs in `[PAGES_DIRECTORY]`.

GOOD

```tsx
// [ROUTES_DIRECTORY]/login.tsx
import LoginPage from '[PAGES_DIRECTORY]/LoginPage';
export const Route = createFileRoute('/login')({ component: LoginPage });
```

BAD

```tsx
// [ROUTES_DIRECTORY]/login.tsx
export const Route = createFileRoute('/login')({
  component: () => <section>{/* full page implementation here */}</section>
});
```

## Types and Props

- Local component props must be inline.
- Domain contracts should live under `[TYPES_DIRECTORY]` using workspace type conventions.

GOOD

```tsx
const Card: FC<{ title: string; onClick?: () => void }> = ({ title, onClick }) => (
  <button onClick={onClick}>{title}</button>
);
```

BAD

```tsx
interface CardProps {
  title: string;
  onClick?: () => void;
}
const Card: FC<CardProps> = ({ title, onClick }) => <button onClick={onClick}>{title}</button>;
```

## State and Data Fetching

- Server/API state: TanStack Query.
- Client UI state: Zustand.
- Do not fetch API directly inside Zustand store by default.

GOOD

```tsx
const dashboardQuery = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard });
```

BAD

```tsx
const useDashboardStore = create(() => ({
  dashboard: null,
  async fetchDashboard() {
    this.dashboard = await ky.get('/dashboard').json();
  }
}));
```
