# Types and Imports Examples

## Import Hygiene

GOOD

```tsx
const DashboardHeader: FC = () => {
  const [open, setOpen] = useState(false);
  return <Button onClick={() => setOpen(!open)}>{String(open)}</Button>;
};
```

BAD

```tsx
import { useState } from 'react';
import type { FC } from 'react';
```

## Local Props Typing

GOOD

```tsx
const WordReviewPopover: FC<{
  word: DomainEntity;
  isCorrect: boolean;
  open?: boolean;
}> = ({ word, isCorrect, open = false }) => <div>{word.label}</div>;
```

BAD

```tsx
interface WordReviewPopoverProps {
  word: DomainEntity;
  isCorrect: boolean;
  open?: boolean;
}

const WordReviewPopover: FC<WordReviewPopoverProps> = props => <div>{props.word.label}</div>;
```

## Namespace Payload Modeling

GOOD

```ts
declare namespace DomainManagement {
  type CreateItemPayload = Pick<Item, 'title'> &
    Partial<Pick<Item, 'description' | 'image' | 'order'>>;
}
```

BAD

```ts
export interface CreateItemPayload {
  title: string;
  description?: string;
  image?: string;
  order?: number;
}
```

Note: Replace placeholder names (`DomainEntity`, `DomainManagement`, `Item`) with your workspace domain types.
