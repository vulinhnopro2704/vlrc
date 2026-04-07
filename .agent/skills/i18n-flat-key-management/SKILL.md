---
name: i18n-flat-key-management
description: Use when adding or editing translations. Enforces flat key structure, snake_case naming, and locale key parity.
---

# Objective

Maintain consistent translation key structure across locales.

## Inputs Expected

1. `locale_files` list.
2. `key_naming_convention` (for example snake_case).
3. `translation_access_pattern` (for example `t('...')`).

## Steps

1. Add or update keys using the chosen naming convention.
2. Keep keys flat unless workspace conventions explicitly allow nesting.
3. Apply key additions/changes to all active locale files.
4. Validate UI references use exact key strings.

## Constraints

1. Keep locale key parity.
2. Avoid unnecessary key renames.
3. Do not hardcode project-specific locale paths in instructions.

## Few-Shot Examples

- `references/examples.md`
