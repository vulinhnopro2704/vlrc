import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const cardVariants = cva('bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm', {
  variants: {
    variant: {
      default: 'gap-6 py-6',
      glass: 'gap-6 py-6 bg-card/80 backdrop-blur-sm dark:bg-card/40 dark:border-white/10',
      'glass-strong':
        'gap-6 py-6 bg-card/60 backdrop-blur-md dark:bg-card/60 dark:backdrop-blur-md dark:border dark:border-white/10',
      elevated: 'gap-6 py-6 border-0 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all',
      'elevated-glass':
        'gap-6 py-6 border-0 shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all dark:bg-card/60 dark:backdrop-blur-md dark:border dark:border-white/10',
      auth: 'w-full max-w-md mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl backdrop-saturate-150 border-white/50 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

function Card({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot='card'
      data-variant={variant}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-header'
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-title'
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-description'
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-action'
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='card-content' className={cn('px-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-footer'
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants
};
