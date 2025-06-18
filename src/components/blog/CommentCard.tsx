import React from 'react';
import { Comment } from '@/types/blog';
import { formatDateTime } from '@/lib/formatDateTime';
import AvatarDisplay from '@/components/shared/AvatarDisplay';
import capitalizeName from '@/lib/capitalizeName';
import { Link } from 'react-router-dom';

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  return (
    <div className='flex flex-col gap-2 border-b border-neutral-300 pb-3 last:border-b-0 last:pb-0'>
      <Link
        to={`/profile/${comment.author.id}`}
        className='group flex cursor-pointer items-center gap-2 md:gap-3'
      >
        <AvatarDisplay
          avatarUrl={comment.author.avatarUrl}
          displayName={comment.author.name}
          className='size-10 group-hover:scale-105 md:size-12'
        />
        <div className='flex flex-col gap-[-4px]'>
          <span className='text-xs-semibold md:text-sm-semibold group-hover:text-primary-300 text-neutral-900'>
            {capitalizeName(comment.author.name)}
          </span>
          <span className='text-xs-regular md:text-sm-regular text-neutral-600'>
            {formatDateTime(comment.createdAt, false)}
          </span>
        </div>
      </Link>
      <p className='text-xs-regular md:text-sm-regular text-neutral-900'>
        {comment.content}
      </p>
    </div>
  );
};

export default CommentCard;
