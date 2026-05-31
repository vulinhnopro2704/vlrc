# @platform-core/components

---
ai_package_metadata:
  package_name: "@platform-core/components"
  version: "workspace:*"
  conventions:
    import_hygiene:
      main_app: "Do NOT manually import. Let Vite auto-import handle it (src/types/auto-imports.d.ts)."
      local_packages: "Always use explicit relative or workspace imports. Packages compile without auto-imports."
    component_rules:
      props_typing: "Always declare props inline in the component signature. Avoid standalone interface/type Props for local components."
      wrapper_preference: "Always prefer Select and MultiSelect wrapper components over Radix UI/Shadcn primitives."
---

Reusable, optimized, and tree-shaken UI components for the VLRC project monorepo.

## 🚀 AI & Developer Reference

> [!IMPORTANT]
> **AUTO-IMPORT CONVENTION**: In the main web application (`src/`), **do not write explicit import statements** for any components in this package. They are dynamically parsed and registered by Vite into `src/types/auto-imports.d.ts`.
> **EXPLICIT PACKAGE IMPORTS**: Inside independent packages (like `packages/components` or `packages/hooks`), **always** write explicit imports because packages are compiled standalone using `tsc`.

---

## 📦 Core Component Specs & API

Here is the exact API documentation for the custom-wrapped components. AI assistants should strictly use these formats:

### 1. `Select` (Props-driven Custom Wrapper)
A beautiful, popover-based single-select wrapper supporting filtering, pagination, and customized rendering.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `options` | `BaseSelectOption<T>[]` | `[]` | Array of options to select from. |
| `value` | `T` | `null` | Current selected value. |
| `onChange` | `(val: T \| null) => void` | - | Callback when selection changes. |
| `placeholder` | `string` | `'Chọn...'` | Placeholder text. |
| `isClearable` | `boolean` | `true` | Show clear button if value is selected. |
| `isSearchable` | `boolean` | `true` | Enable keyword searching. |
| `isLoading` | `boolean` | `false` | Displays loading spinner. |
| `disabled` | `boolean` | `false` | Disables interaction. |
| `className` | `string` | `''` | Class override for the button trigger. |

```tsx
// Example Usage
<Select
  value={level}
  onChange={val => val && setLevel(val)}
  options={[
    { value: 'all', label: 'All Levels' },
    { value: 'A1', label: 'A1 - Beginner' },
    { value: 'B2', label: 'B2 - Upper Intermediate' }
  ]}
  isClearable={false}
  isSearchable={false}
  className="w-40"
/>
```

---

### 2. `MultiSelect`
A gorgeous multiselect popover supporting tag rendering, search filtering, and select-all actions.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `options` | `BaseSelectOption<T>[]` | `[]` | Options to display. |
| `value` | `T[]` | `[]` | Selected values array. |
| `onChange` | `(val: T[]) => void` | - | Callback when array changes. |
| `placeholder` | `string` | `'Chọn...'` | Placeholder text. |
| `showSelectAll` | `boolean` | `false` | Show "Select All" toggle button. |
| `maxTagCount` | `number \| 'responsive'` | `'responsive'` | Maximum visible tags before displaying '+N'. |

```tsx
// Example Usage
<MultiSelect
  value={selectedLevels}
  onChange={setSelectedLevels}
  options={[
    { value: 'A1', label: 'A1' },
    { value: 'A2', label: 'A2' },
    { value: 'B1', label: 'B1' }
  ]}
  showSelectAll={true}
  placeholder="Select levels..."
/>
```

---

### 3. `ConfirmModal` & `ConfirmationDialog`
A customizable confirmation alert dialog that prompts the user for action.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `open` | `boolean` | `false` | Visibility state. |
| `title` | `ReactNode` | - | Dialog title. |
| `description` | `ReactNode` | - | Dialog message body. |
| `cancelText` | `string` | `'Hủy'` | Cancel button text. |
| `confirmText` | `string` | `'Xác nhận'` | Confirm button text. |
| `onCancel` | `() => void` | - | Fired when canceled. |
| `onConfirm` | `() => void` | - | Fired when confirmed (can be async). |
| `variant` | `'default' \| 'destructive'` | `'default'` | Theme of the confirm button. |

```tsx
// Example Usage
<ConfirmModal
  open={isOpen}
  title="Xóa bài học?"
  description="Hành động này không thể hoàn tác. Bài học sẽ bị xóa vĩnh viễn."
  confirmText="Xóa"
  variant="destructive"
  onCancel={() => setIsOpen(false)}
  onConfirm={handleDelete}
/>
```

---

### 4. `Icons` (Lucide Icons Registry)
A centralized registry wrapper exporting all common icons under a single object.
**Usage Rule**: Always use `Icons.<IconName>` instead of importing from `lucide-react` directly in the web app source.

```tsx
// Example Usage
<Icons.Sparkles className="h-4 w-4 text-yellow-500" />
<Icons.ArrowLeft className="mr-2 h-4 w-4" />
<Icons.Trash className="h-5 w-5 text-destructive" />
```
*Supported Icons include: Sparkles, ArrowLeft, Trash, Save, Edit, Home, Search, Loader2, Calendar, Shield, Phone, Mail, Clock, ChevronDown, ChevronUp, FileQuestion, RefreshCcw, and many more.*

---

### 5. `lazyLoad` (Dynamic Component Loader)
A lazy-loading helper with built-in suspense fallback and prefetching support.

```tsx
// Example Usage
const UserNotebookPage = lazyLoad(() => import('@/pages/UserNotebookPage/UserNotebookPage'));
```

---

## 🎨 Design Tokens & System

This package wraps all shadcn-based primitives styled with Tailwind CSS under the hood:
- **Buttons (`Button` / `buttonVariants`)**: Supports standard `variant` options (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `accent-cta`).
- **Cards (`Card`)**: Includes semantic helper layouts: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- **Badges (`Badge`)**: Layout badges with `variant` (`default`, `secondary`, `destructive`, `outline`).
- **Spinner (`Spinner`)**: Customizable size and spinner states.

---

## 🛠 Package Scripts

Managed by Lerna and PNPM Workspaces:
- Build package: `pnpm build`
- Version package: `pnpm version:packages`
- Publish package: `pnpm publish:packages`
