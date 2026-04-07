---
name: react-form-wrapper-patterns
description: Use when creating or refactoring React forms with wrapper components and React Hook Form. Focuses on wrapper-first usage, validation placement, and import hygiene.
---

# Objective

Create or refactor form UIs using existing form wrapper components with clear React Hook Form integration.

## Inputs Expected

1. `wrapper_module_path`: where shared form wrappers live.
2. `available_wrappers`: list of wrapper components available in the workspace.
3. `form_model_type`: target form data type.
4. `validation_requirements`: required fields and validation rules.

## Steps

1. Discover existing wrappers first and map each field to a wrapper.
2. Use React Hook Form as the state/validation owner.
3. Keep validation close to wrapper usage (`rules`, resolver, or project-specific convention).
4. Use native `<form>` submission with `handleSubmit`.
5. Only introduce custom field wrappers when no existing wrapper can support the behavior.

## Constraints

1. Single responsibility: this skill only handles form composition patterns.
2. Do not hardcode project-specific paths; use the provided inputs.
3. Keep local component props inline unless a shared props type is required.
4. Keep import hygiene: avoid imports that are globally auto-provided.
5. Keep layout simple and consistent with the workspace styling system.

## Few-Shot Examples

- `references/examples.md`
