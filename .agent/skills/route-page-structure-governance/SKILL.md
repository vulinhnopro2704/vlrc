---
name: route-page-structure-governance
description: Use when adding or moving files. Enforces route/page separation and consistent module placement conventions.
---

# Objective

Place files in the correct architectural layer and preserve route/page separation.

## Inputs Expected

1. `routes_directory`.
2. `pages_directory`.
3. `shared_components_directory`.
4. `api_directory`, `types_directory`, and `state_directory`.

## Steps

1. Identify whether requested change is route wiring, page UI, shared UI, API, type, or state.
2. Place code in the matching directory boundary.
3. Keep route modules focused on routing concerns.
4. Keep page modules focused on page composition/presentation.

## Constraints

1. Do not mix route wiring and full page implementation in the same module unless workspace explicitly permits.
2. Keep module placement aligned with workspace conventions.
3. Do not hardcode folder names in skill instructions; use input variables.

## Few-Shot Examples

- `references/examples.md`
