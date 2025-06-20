import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'flex justify-center items-center shrink-0 disabled:pointer-events-none disabled:opacity-50 cursor-pointer outline-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary-300 text-sm-semibold text-neutral-25 rounded-full hover:shadow-[0_0_17px_rgba(0,147,221,0.6)]',
        secondary:
          'bg-[#EE1D52] text-sm-semibold text-neutral-25 rounded-full hover:shadow-[0_0_17px_rgba(238, 29, 82, 0.6)]',
        icon: 'rounded-full border-none',
        outline: 'border border-neutral-300 rounded-sm',
      },
      size: {
        default: 'h-11 px-14.5',
        outline: 'h-8 px-2',
        icon: 'size-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
