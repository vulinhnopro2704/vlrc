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

## Few-Shot Examples

- `references/examples.md`
