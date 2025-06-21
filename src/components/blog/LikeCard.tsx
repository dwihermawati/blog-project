import React from 'react';
import { LikedByUser } from '@/types/blog';
import AvatarDisplay from '@/components/shared/AvatarDisplay';
import capitalizeName from '@/lib/capitalizeName';
import { Link } from 'react-router-dom';
import useGetUserProfileById from '@/hooks/useGetUserProfileById';
import { BeatLoader } from 'react-spinners';

interface LikeCardProps {
  user: LikedByUser;
}

const LikeCard: React.FC<LikeCardProps> = ({ user }) => {
  const { data: userId } = useGetUserProfileById({
    id: user.id,
    enabled: !!user.id,
  });

  return (
    <Link
      to={`/profile/${user.id}`}
      className='flex items-center gap-3 rounded-md border-b border-neutral-300 p-2 pb-3 transition-colors last:border-b-0 last:pb-0 hover:bg-neutral-100'
    >
      <AvatarDisplay
        avatarUrl={userId?.avatarUrl}
        displayName={user.name}
        className='size-10 flex-shrink-0 md:size-12'
      />
      <div className='flex flex-col'>
        <span className='text-sm-semibold md:text-md-semibold text-neutral-900'>
          {userId?.name ? (
            capitalizeName(userId.name)
          ) : (
            <BeatLoader size={8} color='#0093DD' />
          )}
        </span>
        {user.headline && (
          <span className='text-xs-regular md:text-sm-regular text-neutral-600'>
            {userId ? (
              userId.headline ? (
                <span className='text-xs-regular md:text-sm-regular text-neutral-600'>
                  {capitalizeName(userId.headline)}
                </span>
              ) : null
            ) : (
              <span className='text-xs-regular md:text-sm-regular text-neutral-400 italic'>
                Loading...
              </span>
            )}
          </span>
        )}
      </div>
    </Link>
  );
};

export default LikeCard;
