---
name: client-server-state-boundary
description: Use when adding or refactoring state management. Enforces clear boundaries between client/UI state and server/API state.
---

# Objective

Prevent mixed responsibilities between client state and server state.

## Inputs Expected

1. `client_state_tooling` (for UI-only state).
2. `server_state_tooling` (for fetch/cache/invalidation lifecycle).
3. `store_module_pattern` (if your workspace uses a multi-file store pattern).

## Steps

1. Classify each state value as client/UI or server/API.
2. Place server/API state in query/mutation tooling.
3. Place client/UI state in local state store/context.
4. Apply the workspace store module pattern consistently.

## Constraints

1. Do not mirror server response trees into client store by default.
2. Keep fetch/cache logic out of pure UI stores.
3. Do not hardcode project-specific folders in guidance.

## Few-Shot Examples

- `references/examples.md`
