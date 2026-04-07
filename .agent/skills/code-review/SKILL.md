---
name: code-review-guardrails
description: >
  Use for structured code reviews before completion. Focuses on correctness,
  regressions, architecture compliance, import hygiene, and performance risks.
---

# Objective

Run a final review pass that detects bugs, regressions, and rule violations before a task is marked done.

## Inputs Expected

1. `changed_files` or `diff_scope`.
2. `workspace_architecture_rules`.
3. `coding_conventions` (imports, typing, state boundaries, i18n, etc.).

## Steps

1. Inspect diffs and classify files by concern area.
2. Review in severity order: correctness, regressions, architecture, performance, maintainability.
3. Validate against workspace conventions and declared constraints.
4. Report findings with concrete remediation guidance.

## Constraints

1. Findings first; summary second.
2. Include precise file/line references for each finding.
3. If no issues exist, explicitly state that and list residual risk/testing gaps.
4. Do not hardcode project names or fixed directory layouts in the skill body.

## Few-Shot Examples

- `references/review-rules.md`
- `references/performance-and-quality.md`
