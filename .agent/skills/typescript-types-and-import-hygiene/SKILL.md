---
name: typescript-types-and-import-hygiene
description: Use when creating or refactoring TypeScript types, component props, and imports. Focuses on import hygiene, inline props typing, and domain typing consistency.
---

# Objective

Apply consistent typing and import practices when writing TypeScript and component props.

## Inputs Expected

1. `auto_import_manifest_path` (if auto-import is enabled).
2. `domain_type_strategy` (namespace-based or module-based).
3. `props_reuse_scope` (local-only or shared across modules).

## Steps

1. Check whether symbols are auto-provided before adding imports.
2. Keep local component props inline when not reused.
3. For domain models/payloads, follow the workspace type strategy.
4. Reuse existing entities (`Pick`, `Partial`, `Omit`, intersections) before creating new shapes.

## Constraints

1. No project-name coupling in skill instructions.
2. No hardcoded paths; use provided input variables.
3. Avoid duplicate imports and local-only props interfaces.

## Few-Shot Examples

- `references/examples.md`
