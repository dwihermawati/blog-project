import React from 'react';
import { LikedByUser } from '@/types/blog';
import AvatarDisplay from '@/components/shared/AvatarDisplay';
import capitalizeName from '@/lib/capitalizeName';
import { Link } from 'react-router-dom';

interface LikeCardProps {
  user: LikedByUser;
}

const LikeCard: React.FC<LikeCardProps> = ({ user }) => {
  return (
    <Link
      to={`/profile/${user.id}`}
      className='flex items-center gap-3 rounded-md border-b border-neutral-300 p-2 pb-3 transition-colors last:border-b-0 last:pb-0 hover:bg-neutral-100'
    >
      <AvatarDisplay
        avatarUrl={user.avatarUrl}
        displayName={user.name}
        className='size-10 flex-shrink-0 md:size-12'
      />
      <div className='flex flex-col'>
        <span className='text-sm-semibold md:text-md-semibold text-neutral-900'>
          {capitalizeName(user.name)}
        </span>
        {user.headline && (
          <span className='text-xs-regular md:text-sm-regular text-neutral-600'>
            {user.headline}
          </span>
        )}
      </div>
    </Link>
  );
};

export default LikeCard;
