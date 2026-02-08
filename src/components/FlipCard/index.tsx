// Main component
export {
  default as FlipCard,
  FlipCardRoot,
  FlipCardFront,
  FlipCardBack,
  FlipCardTrigger,
  useFlipCardContext
} from './FlipCard';

// Types
export type {
  FlipCardContextValue,
  FlipDirection,
  AnimationConfig,
  FlipCardRootClassNames,
  FlipCardFaceClassNames,
  FlipCardRootProps,
  FlipCardFaceProps,
  FlipCardTriggerProps
} from './types';
