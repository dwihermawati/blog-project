import React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './button';

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className='relative'>
        <input
          type={showPassword ? 'text' : 'password'}
          ref={ref}
          className={cn(
            'text-sm-regular h-12 w-full rounded-xl border border-neutral-300 px-4 py-2 pr-12 outline-none placeholder:text-neutral-500',
            'focus:border-primary-300 focus:border-[1px]',
            'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
            className
          )}
          {...props}
        />
        <Button
          type='button'
          variant='icon'
          size='icon'
          onClick={() => setShowPassword((prev) => !prev)}
          className='absolute top-1/2 right-[3.97%] -translate-y-1/2 text-neutral-950 hover:text-neutral-700'
          tabIndex={-1}
        >
          {showPassword ? (
            <Eye className='h-5 w-5' />
          ) : (
            <EyeOff className='h-5 w-5' />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
