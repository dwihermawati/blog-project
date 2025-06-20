import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import getColorAvatar from '@/lib/getColorAvatar';
import getInitials from '@/lib/getInitials';

interface AvatarDisplayProps {
  avatarUrl?: string | null;
  displayName: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const getFullAvatarUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  return url.startsWith('http') || url.startsWith('blob:')
    ? url
    : `${API_BASE_URL}${url}`;
};

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatarUrl,
  displayName,
  className,
  style,
  onClick,
}) => {
  const hasAvatar = !!avatarUrl;
  const initial = getInitials(displayName);
  const bgColor = getColorAvatar(displayName);
  const [imageError, setImageError] = useState(false);

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

  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  return (
    <div
      ref={avatarRef}
      className={cn(
        'flex-center aspect-square flex-shrink-0 overflow-hidden rounded-full object-contain',
        className
      )}
      style={style}
      onClick={onClick}
    >
      {hasAvatar && !imageError ? (
        <img
          src={getFullAvatarUrl(avatarUrl)}
          alt={displayName}
          className='size-full rounded-full border border-neutral-300 object-cover'
          onError={() => setImageError(true)}
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
