import { Icon } from '@iconify/react';
import { ThumbsUp } from 'lucide-react';
import usePostLikeState from '@/hooks/usePostLikeState';
import { BlogPost } from '@/types/blog';

type Props = {
  post: BlogPost;
};

const PostLikeButton: React.FC<Props> = ({ post }) => {
  const { isLiked, likesCount, handleLikeClick } = usePostLikeState(post);

  return (
    <div
      className='group flex cursor-pointer items-center gap-1.5'
      onClick={handleLikeClick}
    >
      {isLiked ? (
        <Icon
          icon='mdi:like'
          className='text-primary-300 size-5 group-hover:scale-105'
        />
      ) : (
        <ThumbsUp className='group-hover:text-primary-300 size-5 text-neutral-600 group-hover:scale-105' />
      )}
      <span className='md:text-sm-regular text-xs-regular group-hover:text-primary-300 text-neutral-600'>
        {likesCount}
      </span>
    </div>
  );
};

export default PostLikeButton;
