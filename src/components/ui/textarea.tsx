import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'text-sm-regular h-35 w-full resize-none rounded-xl border border-neutral-300 px-4 py-3 outline-none placeholder:text-neutral-500',
        'focus:border-primary-300 focus:border-[1px]',
        'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',

        className
      )}
      {...props}
    />
  );
}

export { Textarea };
