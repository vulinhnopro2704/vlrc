'use client';

import { createContext, use, useId, useState } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import type {
  FlipCardContextValue,
  FlipCardFaceProps,
  FlipCardRootProps,
  FlipCardTriggerProps
} from './types';

// ============================================================================
// Context (React 19 pattern)
// ============================================================================

const FlipCardContext = createContext<FlipCardContextValue | null>(null);

/**
 * Hook to access FlipCard context using React 19's `use()` hook
 * @throws Error if used outside of FlipCard.Root
 */
function useFlipCardContext() {
  const context = use(FlipCardContext);
  if (!context) {
    throw new Error('FlipCard compound components must be used within FlipCard.Root');
  }
  return context;
}

// Export hook for external use
export { useFlipCardContext };

// ============================================================================
// Root Component
// ============================================================================

function Root({
  children,
  className,
  classNames,
  ref,
  width,
  height,
  style,
  // Controlled mode
  isFlipped: controlledFlipped,
  defaultFlipped = false,
  onFlipChange,
  // Behavior
  flipOnHover = true,
  flipOnClick = false,
  disabled = false,
  // Animation
  direction = 'horizontal',
  animation = { duration: 700, easing: 'ease' },
  // Rest props
  ...props
}: FlipCardRootProps) {
  const id = useId();
  const [internalFlipped, setInternalFlipped] = useState(defaultFlipped);

  // ---- Derived State ----
  const isControlled = controlledFlipped !== undefined;
  const isFlipped = isControlled ? controlledFlipped : internalFlipped;

  // ---- Actions ----
  function setFlipped(value: boolean | ((prev: boolean) => boolean)) {
    if (disabled) return;

    const newValue = typeof value === 'function' ? value(isFlipped) : value;

    if (!isControlled) {
      setInternalFlipped(newValue);
    }
    onFlipChange?.(newValue);
  }

  function toggle() {
    setFlipped(prev => !prev);
  }

  function flip() {
    setFlipped(true);
  }

  function unflip() {
    setFlipped(false);
  }

  // ---- Event Handlers ----
  function handleClick() {
    if (flipOnClick && !disabled) {
      toggle();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!flipOnClick || disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  }

  // ---- Computed Values ----
  const contextValue: FlipCardContextValue = { isFlipped, direction, toggle, flip, unflip };

  const animationStyle = {
    '--flip-duration': `${animation.duration}ms`,
    '--flip-easing': animation.easing
  } as React.CSSProperties;
  const sceneStyle = {
    ...animationStyle,
    ...style,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {})
  } as React.CSSProperties;

  const rotationClass =
    direction === 'horizontal'
      ? isFlipped
        ? 'rotate-y-180'
        : ''
      : isFlipped
        ? 'rotate-x-180'
        : '';

  const hoverRotationClass =
    !isFlipped && flipOnHover && !disabled
      ? direction === 'horizontal'
        ? 'group-hover:rotate-y-180'
        : 'group-hover:rotate-x-180'
      : '';

  const sceneClassName = cn(
    'scene perspective-[1000px] relative group',
    classNames?.scene,
    className
  );

  const cardClassName = cn(
    'card transform-3d w-full h-full transition-transform grid [&>*]:[grid-area:1/1]',
    'duration-(--flip-duration) ease-(--flip-easing)',
    rotationClass,
    hoverRotationClass,
    classNames?.card
  );

  // ---- Render ----
  return (
    <FlipCardContext value={contextValue}>
      <div
        ref={ref}
        className={sceneClassName}
        style={sceneStyle}
        data-flipped={isFlipped}
        data-disabled={disabled}
        aria-labelledby={`flip-card-${id}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={flipOnClick && !disabled ? 0 : undefined}
        role={flipOnClick ? 'button' : undefined}
        {...props}>
        <div className={cardClassName}>{children}</div>
      </div>
    </FlipCardContext>
  );
}

Root.displayName = 'FlipCard.Root';

// ============================================================================
// Front Component
// ============================================================================

function Front({ children, className, classNames, ref, ...props }: FlipCardFaceProps) {
  const { isFlipped } = useFlipCardContext();

  const faceClassName = cn(
    'face front w-full h-full backface-hidden translate-z-5',
    classNames?.face,
    className
  );

  return (
    <div ref={ref} className={faceClassName} aria-hidden={isFlipped} {...props}>
      {children}
    </div>
  );
}

Front.displayName = 'FlipCard.Front';

// ============================================================================
// Back Component
// ============================================================================

function Back({ children, className, classNames, ref, ...props }: FlipCardFaceProps) {
  const { isFlipped, direction } = useFlipCardContext();

  const rotationClass = direction === 'horizontal' ? 'rotate-y-180' : 'rotate-x-180';

  const faceClassName = cn(
    'face back w-full h-full backface-hidden translate-z-5',
    rotationClass,
    classNames?.face,
    className
  );

  return (
    <div ref={ref} className={faceClassName} aria-hidden={!isFlipped} {...props}>
      {children}
    </div>
  );
}

Back.displayName = 'FlipCard.Back';

// ============================================================================
// Trigger Component
// ============================================================================

function Trigger({ children, className, asChild = false, ref, ...props }: FlipCardTriggerProps) {
  const { toggle, isFlipped } = useFlipCardContext();

  // ---- Event Handlers ----
  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    toggle();
  }

  // ---- Computed Values ----
  const Comp = asChild ? Slot : 'button';
  const ariaLabel = isFlipped ? 'Unflip card' : 'Flip card';

  // ---- Render ----
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : 'button'}
      className={className}
      onClick={handleClick}
      aria-pressed={isFlipped}
      aria-label={ariaLabel}
      {...props}>
      {children}
    </Comp>
  );
}

Trigger.displayName = 'FlipCard.Trigger';

// ============================================================================
// Compound Component Export
// ============================================================================

const FlipCard = {
  Root,
  Front,
  Back,
  Trigger
};

// Named exports for tree-shaking
export { Root as FlipCardRoot };
export { Front as FlipCardFront };
export { Back as FlipCardBack };
export { Trigger as FlipCardTrigger };

export default FlipCard;
