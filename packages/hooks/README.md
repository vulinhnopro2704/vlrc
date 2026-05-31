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

## 🚀 AI & Developer Reference

> [!IMPORTANT]
> **AUTO-IMPORT CONVENTION**: In the main web application (`src/`), **do not write explicit import statements** for any hooks in this package. They are dynamically parsed and registered by Vite into `src/types/auto-imports.d.ts`.
> **EXPLICIT PACKAGE IMPORTS**: Inside independent packages (like `packages/components` or `packages/hooks`), **always** write explicit imports because packages are compiled standalone using `tsc`.

---

## 📦 Core Hook Specs & API

Here is the exact API documentation for the custom hooks:

### 1. `useModalState`
A highly utility-oriented hook to manage opening, closing, and data-binding state for modals/popups. 
It cleanly decouples trigger buttons from modal dialogs and handles transition parameters.

#### Hook Signature
```typescript
function useModalState<T = any>(defaultOpen?: boolean): {
  isOpen: boolean;
  data: T | null;
  openModal: (modalData?: T) => void;
  closeModal: () => void;
  toggleModal: (modalData?: T) => void;
}
```

#### API Return Structure
| Return Field | Type | Description |
| :--- | :--- | :--- |
| `isOpen` | `boolean` | Current visibility state of the modal. |
| `data` | `T \| null` | Context data bound to the modal (e.g. course ID to edit). |
| `openModal` | `(modalData?: T) => void` | Opens the modal and optionally binds context data. |
| `closeModal` | `() => void` | Closes the modal and flushes the bound data. |
| `toggleModal` | `(modalData?: T) => void` | Toggles the visibility state. |

```tsx
// Example Usage
const { isOpen, data: editWordId, openModal, closeModal } = useModalState<number>();

return (
  <>
    <Button onClick={() => openModal(12)}>Sửa bài học #12</Button>
    
    <EditWordModal
      open={isOpen}
      wordId={editWordId}
      onCancel={closeModal}
    />
  </>
);
```

---

## 🛠 Package Scripts

Managed by Lerna and PNPM Workspaces:
- Build package: `pnpm build`
- Version package: `pnpm version:packages`
- Publish package: `pnpm publish:packages`
