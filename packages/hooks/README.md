# @platform-core/hooks

---
ai_package_metadata:
  package_name: "@platform-core/hooks"
  version: "workspace:*"
  conventions:
    import_hygiene:
      main_app: "Do NOT manually import. Let Vite auto-import handle it (src/types/auto-imports.d.ts)."
      local_packages: "Always use explicit relative or workspace imports. Packages compile without auto-imports."
    hook_rules:
      state_boundaries: "Prefer TanStack Query for server state. Use Zustand stores inside packages/ or apps/ only for pure UI/client state."
      explicit_types: "Always declare explicit return types on hooks inside packages/ to avoid TS7056 / TS5088 serialization compilation limits."
---

Reusable, optimized, and tree-shaken React Hooks for the VLRC project monorepo.

> [!IMPORTANT]
> **AUTO-IMPORT CONVENTION**: In the main web application (`src/`), **do not write explicit import statements** for any hooks in this package. They are dynamically parsed and registered by Vite into `src/types/auto-imports.d.ts`.
> **EXPLICIT PACKAGE IMPORTS**: Inside independent packages (like `packages/components` or `packages/hooks`), **always** write explicit imports because packages are compiled standalone using `tsc`.

---

## 📚 Agent & Codex Skill Reference

This package is fully integrated with the **[platform-core-components Agent Skill](file:///Users/lvtruong/personal/vlrc/.agent/skills/platform-core-components/SKILL.md)**. For modal lifecycle patterns, data-binding examples, and `ConfirmModal` composition, see:
- **[Dialogs, ConfirmModal & useModalState Bindings](file:///Users/lvtruong/personal/vlrc/.agent/skills/platform-core-components/references/modals.md)**

---

## 📦 Core Hook: `useModalState`

A multi-key modal state manager that handles **open/close lifecycles**, **lazy mounting** (`load` flag), and **delayed DOM unmounting** (via `destroyDelay`) for smooth exit animations. It manages multiple independent modals from a single hook call using a typed key list.

### Hook Signature

```typescript
function useModalState<const T extends ReadonlyArray<string>>(
  keyList: T,
  options?: { destroyDelay?: number }
): {
  modal: Record<T[number], { load: boolean; open: boolean }>;
  openModal: (name: T[number]) => void;
  closeModal: (name: T[number]) => void;
}
```

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `keyList` | `ReadonlyArray<string>` | - | **(Required)** A tuple of string keys identifying each modal, e.g. `['edit', 'delete', 'detail']`. |
| `options.destroyDelay` | `number` | `300` | Milliseconds to wait after closing before setting `load: false` (unmounting the modal DOM). Set to `0` for instant unmount. |

### Return Value

| Field | Type | Description |
| :--- | :--- | :--- |
| `modal` | `Record<Key, { load: boolean; open: boolean }>` | State map. `load` controls whether the modal component mounts in the DOM. `open` controls its visible/animated state. |
| `openModal` | `(name: Key) => void` | Sets both `load: true` and `open: true` for the given key. Cancels any pending destroy timer. |
| `closeModal` | `(name: Key) => void` | Sets `open: false` immediately, then sets `load: false` after `destroyDelay` ms. This two-phase approach allows CSS exit animations to complete before the component unmounts. |

### Lifecycle Flow

```
openModal('edit')  →  { load: true, open: true }   // mount + animate in
closeModal('edit') →  { load: true, open: false }   // animate out (300ms)
                   →  { load: false, open: false }   // unmount from DOM
```

### Example: Managing Multiple Modals

```tsx
const CourseManager = () => {
  const { modal, openModal, closeModal } = useModalState(['edit', 'delete'] as const);

  return (
    <>
      <Button onClick={() => openModal('edit')}>Sửa khóa học</Button>
      <Button variant="destructive" onClick={() => openModal('delete')}>Xóa khóa học</Button>

      {/* Only mounts when modal.edit.load is true */}
      {modal.edit.load && (
        <Modal open={modal.edit.open} onOpenChange={() => closeModal('edit')}>
          <div className="p-6">
            <h3 className="text-lg font-bold">Chỉnh sửa khóa học</h3>
            {/* Edit form content */}
          </div>
        </Modal>
      )}

      {/* Destructive confirmation with lazy mount */}
      {modal.delete.load && (
        <ConfirmModal
          open={modal.delete.open}
          title="Xác nhận xóa?"
          description="Khóa học sẽ bị xóa vĩnh viễn."
          variant="destructive"
          onCancel={() => closeModal('delete')}
          onConfirm={async () => {
            await deleteCourseMutation.mutateAsync(courseId);
            closeModal('delete');
          }}
        />
      )}
    </>
  );
};
```

### Why Two-Phase Unmounting?

The `load` / `open` separation exists because:
- **`open: false`** triggers exit animations (e.g. Radix Dialog fade-out, scale-down transitions).
- **`load: false`** removes the component from the React tree entirely after the animation completes.
- Without this, closing a dialog would instantly unmount its DOM nodes, cutting off any exit animation mid-frame.

---

## 🛠 Package Scripts

Managed by Lerna and PNPM Workspaces:
- Build package: `pnpm build`
- Version package: `pnpm version:packages`
- Publish package: `pnpm publish:packages`
