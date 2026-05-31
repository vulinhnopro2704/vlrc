---
name: platform-core-components
description: Use this skill whenever you are creating, building, or refactoring pages, forms, modals, tables, selections, or icons in the workspace. It enforces the reuse of high-level wrappers from @platform-core/components and @platform-core/hooks (such as DataTable, Form inputs, Select, MultiSelect, ConfirmModal, and Icons) and explains the zero explicit imports rules in the main web app. Always trigger this skill even if the user just asks to "add a new field to a form", "create a popup", "use a checkbox", or "display an icon".
---

# Objective

Safely compose, build, or refactor layouts using `@platform-core/components` and `@platform-core/hooks` in a monorepo workspace.

## Inputs Expected

1. `web_app_src_path`: absolute path to the main application's `src/` folder.
2. `packages_components_path`: absolute path to `@platform-core/components` package source.
3. `target_features`: list of UI structures needed (e.g. DataTable, Form Select, Icons, Modal).

## Steps

1. **Auto-Import Discovery**: Do NOT write manual imports for `@platform-core/*` or target libraries (like react, react-query, ahooks, etc.) inside the main web application `src/` directory. They are auto-imported.
2. **Wrapper-First Usage**: Always use the highly integrated platform-core components (like `Select`, `MultiSelect`, `Form`, `ConfirmModal`) instead of importing raw Radix UI or Shadcn primitives.
3. **Icons Compliance**: Never import icons directly from `lucide-react` in the main web app. Always use `Icons.<IconName>` which is a fully unified icon wrapper.
4. **DataTable Setup**: Build and configure the `DataTable` using standard columns and operations rather than writing custom table grids.
5. **Form Integration**: Map inputs to target form fields (`FormDatePicker`, `FormSelect`, `FormNumberInput`, etc.) inside the unified `Form` wrapper.

## Constraints

1. **Zero Explicit Imports in `src/`**: Under no circumstances should you add explicit imports of `@platform-core/*` or Lucide icons to files in the `src/` directory (excluding `src/routes/`).
2. **Inline Props Convention**: Declare all props inline in the component signature for local-only components.
3. **No Duplicate Components**: Never download or download shadcn primitives locally to `src/components/ui`. Everything must come from the platform packages.

## 📚 Reference Documentation & Segmented Examples

To keep instructions concise and prevent context bloat, the platform-core design guidelines and copy-pasteable examples have been segmented into focused relative markdown files. Load and read the specific file depending on your active task:

1. **[Shadcn + TanStack DataTable Composition](file:///Users/lvtruong/personal/vlrc/.agent/skills/platform-core-components/references/datatable.md)**
   - *Use when*: Building or refactoring lists, data grids, column structures, selection rows, expanders, or paginated lists.
2. **[Form Containers & FormItem/FormBase Layouts](file:///Users/lvtruong/personal/vlrc/.agent/skills/platform-core-components/references/forms.md)**
   - *Use when*: Constructing RHF form states, Zod schema validations, handling vertical/horizontal alignments, or understanding the internal Shadcn `FormItem` controller bindings.
3. **[Custom Form Fields & Inputs API Manual](file:///Users/lvtruong/personal/vlrc/.agent/skills/platform-core-components/references/form-fields.md)**
   - *Use when*: Implementing individual form widgets (like `FormInput`, `FormTextarea`, `FormCheckbox`, `FormSimpleSelect`, `FormSelect`, `FormMultiSelect`, `FormDatePicker`, `FormNumberInput`, `FormRadioGroup`, or `FormFileUpload`).
4. **[Dialogs, ConfirmModal & useModalState Bindings](file:///Users/lvtruong/personal/vlrc/.agent/skills/platform-core-components/references/modals.md)**
   - *Use when*: Handling modal open/close lifecycles, binding dynamic contextual data to modals, or writing destructive confirm dialog alerts.
5. **[Unified Graphic Icons Registry Guidelines](file:///Users/lvtruong/personal/vlrc/.agent/skills/platform-core-components/references/icons.md)**
   - *Use when*: Displaying SVG icons or adding missing graphic items to the public components package.

