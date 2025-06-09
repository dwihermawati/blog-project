import React from 'react';
import { cn } from '@/lib/utils';
import getColorAvatar from '@/lib/getColorAvatar';
import getInitials from '@/lib/getInitials';

interface AvatarDisplayProps {
  avatarUrl?: string | null;
  displayName: string;
  sizeClass?: string;
  className?: string;
  style?: React.CSSProperties;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatarUrl,
  displayName,
  sizeClass = 'size-10',
  className,
  style,
}) => {
  const hasAvatar = !!avatarUrl;
  const initial = getInitials(displayName);
  const bgColor = getColorAvatar(displayName);

  return (
    <div
      className={cn(
        'flex-center flex-shrink-0 overflow-hidden rounded-full object-contain',
        sizeClass,
        className
      )}
      style={style}
    >
      {hasAvatar ? (
        <img
          src={avatarUrl as string}
          alt={displayName}
          className='size-full rounded-full object-cover'
        />
      ) : (
        <div
          className='flex-center size-full text-sm font-semibold text-white uppercase'
          style={{ backgroundColor: bgColor }}
        >
          {initial}
        </div>
      )}
    </div>
  );
};

export default AvatarDisplay;
