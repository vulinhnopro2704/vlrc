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

Reusable, optimized, and tree-shaken UI components built on top of **React 19**, **Tailwind CSS**, and **Radix UI/Shadcn** primitives for the VLRC project monorepo.

> [!IMPORTANT]
> **AUTO-IMPORT CONVENTION**: In the main web application (`src/`), **do not write explicit import statements** for any components in this package. They are dynamically parsed and registered by Vite into `src/types/auto-imports.d.ts`.
> **EXPLICIT PACKAGE IMPORTS**: Inside independent packages (like `packages/components` or `packages/hooks`), **always** write explicit imports because packages are compiled standalone using `tsc`.

---

## 📚 Agent & Codex Skill Reference

This package is fully mapped and integrated with the custom **[platform-core-components Agent Skill](file:///Users/lvtruong/personal/vlrc/.agent/skills/platform-core-components/SKILL.md)**. When working inside this package or utilizing these components, refer to these segmented reference files:
1. **[Shadcn + TanStack DataTable Composition Guide](file:///Users/lvtruong/personal/vlrc/.agent/skills/platform-core-components/references/datatable.md)**
2. **[Form Containers & FormItem/FormBase Layouts Specification](file:///Users/lvtruong/personal/vlrc/.agent/skills/platform-core-components/references/forms.md)**
3. **[Custom Form Fields & Inputs API Manual](file:///Users/lvtruong/personal/vlrc/.agent/skills/platform-core-components/references/form-fields.md)**
4. **[Dialogs, ConfirmModal & useModalState Bindings](file:///Users/lvtruong/personal/vlrc/.agent/skills/platform-core-components/references/modals.md)**
5. **[Unified Graphic Icons Registry Guidelines](file:///Users/lvtruong/personal/vlrc/.agent/skills/platform-core-components/references/icons.md)**

---

## 📝 1. Shadcn Form Item & RHF Integration (`FormBase` & `FormItem`)

Form fields inside this repository inherit a highly structured validation wrapper component called `FormBase`. It bridges the standard **react-hook-form** controller with custom-wrapped **Shadcn UI Form Item** layouts.

### 1.1 Structural Layout & Features
When a field is rendered, `FormBase` automatically builds the following Shadcn structure:
1. **`<FormItem>` Container**: The primary layout block handling spacing. Supports:
   - **Vertical (Default)**: Normal form inputs stacked sequentially.
   - **Horizontal (`horizontal={true}`)**: Arranges labels and inputs side-by-side using unified grid properties. Perfect for dense settings panels.
   - **Control First (`controlFirst={true}`)**: Renders the input control widget *before* the text label (used automatically by `FormCheckbox` and `FormRadioGroup` options).
2. **`<FieldLabel>`**: Displays the text label tied to the input via `htmlFor`.
   - **Automatic required asterisk**: If the field rules specify `required: true` (or a string), `FormBase` automatically appends a red asterisk `<span className="text-red-500">*</span>` to the label.
3. **`<FieldDescription>`**: Displays supplementary description nodes or helper text.
4. **`<FieldError>`**: Listens to active RHF validation errors. If a field fails validation checks, the error message is instantly rendered below the input with appropriate red typography, omitting the need for developers to manually write error flags.

### 1.2 How `<Form>` Works

`<Form>` is literally `FormProvider` from `react-hook-form`. It provides form context so child components can use `useFormContext()`.

**Pattern**: Call `useForm()` → spread into `<Form {...form}>` → wrap a native `<form>` → fields receive `form.control`.

**Validation**: Done exclusively via `rules` prop on each field (standard RHF `RegisterOptions`). No Zod schemas.

```tsx
const { control, handleSubmit, reset } = useForm<LearningManagement.Course>();

return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    <FormInput control={control} name="title" label="Tiêu đề" rules={{ required: true }} />
    <FormCheckbox control={control} name="isActive" label="Hoạt động" />
    <Button type="submit">Lưu</Button>
  </form>
);
```

When splitting into child components, wrap with `<Form {...form}>` and use `useFormContext()` inside children to access `control` without prop drilling.

---

## 📊 2. DataTable (Shadcn + TanStack Table v8)

The `DataTable` component provides a rich, responsive, and performance-optimized data grid built on top of **Shadcn table structures** and **TanStack Table**.

### 2.1 API Definition
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `ColumnDef<T>[]` | - | **(Required)** TanStack-compliant column definitions. |
| `data` | `T[]` | - | **(Required)** Row data source array. |
| `isLoading` | `boolean` | `false` | Renders a custom glass-effect loader spinner overlay. |
| `pageSize` | `number` | `10` | Rows displayed per page. |
| `searchPlaceholder` | `string` | `'Tìm kiếm...'` | Search input placeholder. |
| `searchKey` | `string` | - | Accessor key for client-side search filtering. |

### 2.2 Standard Column Creators
To maintain UI consistency and eliminate copy-paste boilerplate, use the built-in column creators:
- **Checkbox Row Selection**: `createSelectionColumn<T>()` - Automatically inserts checkbox controls in headers and rows to select records.
- **Expandable Children Row caret**: `createExpanderColumn<T>()` - Inserts caret icons to toggle nested layouts.
- **Actions Panel Column**: `createRowActionsColumn<T>({ renderActions })` - Standardizes spacing for edit, view, and delete row action buttons.

```tsx
const columns = useMemo(() => [
  createSelectionColumn<CourseRow>(),
  {
    accessorKey: 'name',
    header: 'Tên bài học',
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>
  },
  createRowActionsColumn<CourseRow>({
    renderActions: ({ row }) => <Button onClick={() => handleEdit(row.original)}>Sửa</Button>
  })
], []);
```

---

## 📦 3. Specialized Custom Form Widgets

These pre-wrapped components are fully integrated with `FormBase` and automatically wire up under a `<Form>` container:

### 3.1 `FormSelect` (Single & Multi Mode)
Popover-based select box featuring real-time searchable keyword filters and custom item templates.
```tsx
<FormSelect
  control={control}
  name="level"
  label="Trình độ"
  options={[
    { value: 'A1', label: 'Cơ bản (A1)' },
    { value: 'B2', label: 'Nâng cao (B2)' }
  ]}
/>
```

### 3.2 `FormMultiSelect`
A checkbox popover panel that renders selected elements as removable tag pills inside the trigger button.
```tsx
<FormMultiSelect
  control={control}
  name="topics"
  label="Chủ đề chính"
  options={[{ value: 'grammar', label: 'Ngữ pháp' }]}
  showSelectAll
/>
```

### 3.3 `FormDatePicker`
Calendar selector supporting single date picking, time picking (`showTime`), month selection, and full date range queries (`isRangePicker: true`).
```tsx
<FormDatePicker
  control={control}
  name="schedule"
  label="Lịch khai giảng"
  isRangePicker={true}
/>
```

### 3.4 `FormNumberInput`
Renders currency and number masks using `react-number-format`. Features increment/decrement steppers.
```tsx
<FormNumberInput
  control={control}
  name="price"
  label="Học phí"
  thousandSeparator=","
  suffix=" VND"
/>
```

### 3.5 `FormFileUpload`
Advanced file dropzone and uploader supporting avatar rendering (`variant="avatar"`) and S3-based immediate uploading with progress bars.
```tsx
<FormFileUpload
  control={control}
  name="avatar"
  label="Ảnh đại diện"
  variant="avatar"
  autoUpload
  uploadFile={async (file) => uploadToS3(file)}
/>
```

---

## 🎨 4. Direct Wrappers & Design Tokens

Outside of active form contexts, you can directly import these components:
- **`Select` & `MultiSelect`**: Standard dropdown triggers.
- **`ConfirmModal` & `Modal`**: Dialog boxes.
- **`Icons`**: High-performance graphic library wrapper (Lucide React registry). Banned from importing directly in `src/` to prevent weight overheads.
- **`Button` / `Card` / `Badge`**: Semantic shadcn styling elements under standard Tailwind tokens.

---

## 🛠 Package Scripts

Managed by Lerna and PNPM Workspaces:
- Build package: `pnpm build`
- Version package: `pnpm version:packages`
- Publish package: `pnpm publish:packages`
