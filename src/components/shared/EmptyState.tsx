import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import emptyBlog from '@/assets/images/empty-blog.png';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  button?: boolean;
  buttonIcon?: React.ReactNode;
  buttonText?: string;
  buttonLink?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  button = false,
  buttonIcon,
  buttonText,
  buttonLink,
  className,
}) => {
  const shouldShowButton = button && buttonText && buttonLink;

  return (
    <div
      className={cn(
        'flex-center custom-container max-w-93 flex-col gap-6 text-center',
        className
      )}
    >
      <img src={emptyBlog} alt='empty blog' className='h-33.75 w-[118.12px]' />
      <div>
        <h3 className='text-sm-semibold mb-1 text-neutral-950'>{title}</h3>
        <p className='text-sm-regular text-neutral-950'>{description}</p>
      </div>
      {shouldShowButton && (
        <Link to={buttonLink}>
          <Button>
            {buttonIcon && <span className='mr-2'>{buttonIcon}</span>}
            {buttonText}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
