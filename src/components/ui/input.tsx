import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'text-sm-regular h-12 w-full rounded-xl border border-neutral-300 px-4 py-2 outline-none placeholder:text-neutral-500',
        'focus:border-primary-300 focus:border-[1px]',
        className
      )}
      {...props}
    />
  );
}

export { Input };
