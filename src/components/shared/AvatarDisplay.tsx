import React, { useRef, useLayoutEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import getColorAvatar from '@/lib/getColorAvatar';
import getInitials from '@/lib/getInitials';

interface AvatarDisplayProps {
  avatarUrl?: string | null;
  displayName: string;
  className?: string;
  style?: React.CSSProperties;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatarUrl,
  displayName,
  className,
  style,
}) => {
  const hasAvatar = !!avatarUrl;
  const initial = getInitials(displayName);
  const bgColor = getColorAvatar(displayName);

  const avatarRef = useRef<HTMLDivElement>(null);
  const [avatarSize, setAvatarSize] = useState(0);

  useLayoutEffect(() => {
    const measureAvatarSize = () => {
      if (avatarRef.current) {
        const size = avatarRef.current.getBoundingClientRect().width;
        setAvatarSize(size);
      }
    };
    measureAvatarSize();

    window.addEventListener('resize', measureAvatarSize);

    return () => {
      window.removeEventListener('resize', measureAvatarSize);
    };
  }, [className, style]);
  const fontSizeCalc = avatarSize > 0 ? `${avatarSize * 0.4}px` : '1rem';

  return (
    <div
      ref={avatarRef}
      className={cn(
        'flex-center aspect-square flex-shrink-0 overflow-hidden rounded-full object-contain',
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
          className='flex-center size-full font-semibold text-white uppercase'
          style={{
            backgroundColor: bgColor,
            fontSize: fontSizeCalc,
            lineHeight: 1,
          }}
        >
          {initial}
        </div>
      )}
    </div>
  );
};

export default AvatarDisplay;
