import type { HTMLAttributes, ReactNode } from 'react';

// Animation Types
export type FlipDirection = 'horizontal' | 'vertical';

// Context Types
export type FlipCardContextValue = {
  isFlipped: boolean;
  direction: FlipDirection;
  toggle: () => void;
  flip: () => void;
  unflip: () => void;
};

export type AnimationConfig = {
  duration?: number; // in ms
  easing?: string; // CSS easing function
};

export type FlipCardSize = number | string;

// ClassNames for customization
export type FlipCardRootClassNames = {
  /** Scene container (outer wrapper with perspective) */
  scene?: string;
  /** Card container (inner wrapper that rotates) */
  card?: string;
};

export type FlipCardFaceClassNames = {
  /** Face container */
  face?: string;
};

// Component Props
export type FlipCardRootProps = {
  children: ReactNode;
  className?: string;
  classNames?: FlipCardRootClassNames;
  ref?: React.Ref<HTMLDivElement>;

  // Controlled mode
  isFlipped?: boolean;
  defaultFlipped?: boolean;
  onFlipChange?: (isFlipped: boolean) => void;

  // Behavior
  flipOnHover?: boolean;
  flipOnClick?: boolean;
  disabled?: boolean;

  // Animation
  direction?: FlipDirection;
  animation?: AnimationConfig;

  width?: FlipCardSize;
  height?: FlipCardSize;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className'>;

export type FlipCardFaceProps = {
  children: ReactNode;
  className?: string;
  classNames?: FlipCardFaceClassNames;
  ref?: React.Ref<HTMLDivElement>;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className'>;

export type FlipCardTriggerProps = {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'children' | 'className'>;
