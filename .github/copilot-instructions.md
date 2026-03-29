# Copilot Instructions

## Component Prop Typing

- For local React components, inline prop types directly in the function parameter.
- Do not create separate `type XxxProps` or `interface XxxProps` unless the prop type is reused in multiple files.
- Keep parent-to-child props minimal; derive display labels and simple UI state in child components when practical.
