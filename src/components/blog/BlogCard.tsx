import { generateClamp } from '@/function/generate-clamp';
import capitalizeName from '@/lib/capitalizeName';
import { formatDateTime } from '@/lib/formatDateTime';
import { cn } from '@/lib/utils';
import { BlogPost } from '@/types/blog';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThumbsUp, XIcon } from 'lucide-react';
import { Icon } from '@iconify/react';
import AvatarDisplay from '../shared/AvatarDisplay';
import useDeletePost from '@/hooks/useDeletePost';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { BeatLoader } from 'react-spinners';
import { useAuth } from '@/contexts/AuthContext';
import useLikePost from '@/hooks/useLikePost';
import { renderSafeHTML } from '@/lib/renderSafeHTML';
import useComments from '@/hooks/useComments';
import StatisticDialog from './StatisticDialog';
import { toast } from 'react-toastify';
import CommentDialog from './CommentDialog';
import useUserProfileByEmail from '@/hooks/useUserProfileByEmail';

type BlogCardProps = {
  variant?: 'blogpost' | 'most-liked' | 'user-blogpost';
  post: BlogPost;
  isLastItem?: boolean;
};

const BlogCard: React.FC<BlogCardProps> = ({
  post,
  variant = 'blogpost',
  isLastItem,
}) => {
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost({
    onSuccess: () => {
      toast.success('Post successfully deleted!');
    },
    onError: (error) => {
      toast.error(`Failed to delete post: ${error.message}`);
    },
  });

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { mutate } = useLikePost({ post });

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      toast.info('You must be logged in to give a like!');
      navigate('/login');
      return;
    }
    mutate(post.id);
  };

  const { data: commentsData } = useComments({
    postId: post?.id as number,
    enabled: !!post?.id,
  });

  const [isStatisticDialogOpen, setIsStatisticDialogOpen] = useState(false);
  const [isCommentDialogOpen, setCommentDialogOpen] = useState(false);

  const handleCommentClick = () => {
    setCommentDialogOpen(true);
  };

  const { data: userProfile } = useUserProfileByEmail({
    email: post.author.email,
    enabled: !!post.author.email,
  });

  return (
    <div
      className={cn(
        'flex w-full items-center gap-6 pb-4',
        variant === 'blogpost' ? 'md:pb-6' : 'md:pb-5',
        !isLastItem && 'border-b border-b-neutral-300'
      )}
    >
      {(variant === 'blogpost' || variant === 'user-blogpost') && (
        <Link
          to={`/posts/${post.id}`}
          className='h-64.5 w-85 shrink-0 cursor-pointer overflow-hidden rounded-sm border border-neutral-200 hover:scale-101 max-md:hidden'
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            className='size-full object-cover'
          />
        </Link>
      )}
      <div className='flex flex-1 flex-col gap-3 md:gap-4'>
        <div
          className={cn(
            'flex flex-col',
            variant === 'most-liked' ? 'gap-1' : 'gap-2 md:gap-3'
          )}
        >
          <Link to={`/posts/${post.id}`}>
            <h2
              className={cn(
                'hover:text-primary-300 cursor-pointer break-words text-neutral-900',
                variant === 'most-liked'
                  ? 'text-md-bold'
                  : 'text-md-bold md:text-xl-bold'
              )}
            >
              {post.title}
            </h2>
          </Link>
          {(variant === 'blogpost' || variant === 'user-blogpost') && (
            <div className='flex items-center gap-2'>
              {post.tags.map((tag, idx) => (
                <div
                  key={idx}
                  className='text-xs-regular flex-center h-7 w-fit rounded-md border border-neutral-300 bg-white p-2 text-neutral-900'
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
          <p
            className='text-xs-regular md:text-sm-regular line-clamp-2 break-words text-neutral-900'
            dangerouslySetInnerHTML={renderSafeHTML(post.content)}
          />
          {variant === 'user-blogpost' && (
            <>
              <div className='flex items-center gap-3'>
                <p className='text-xs-regular text-neutral-700'>
                  Created {formatDateTime(post.createdAt)}
                </p>
                <div className='h-4 w-[1px] flex-shrink-0 bg-neutral-300' />
                <p className='text-xs-regular text-neutral-700'>
                  Last updated{' '}
                  {formatDateTime(post.updatedAt ?? post.createdAt)}
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <span
                  className='text-sm-semibold text-primary-300 cursor-pointer underline underline-offset-3 hover:scale-105'
                  onClick={() => setIsStatisticDialogOpen(true)}
                >
                  Statistic
                </span>
                <div className='h-6 w-[1px] flex-shrink-0 bg-neutral-300' />
                <Link
                  to={`/edit-post/${post.id}`}
                  className='text-sm-semibold text-primary-300 underline underline-offset-3 hover:scale-105'
                >
                  Edit
                </Link>
                <div className='h-6 w-[1px] flex-shrink-0 bg-neutral-300' />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <span className='text-sm-semibold cursor-pointer text-[#EE1D52] underline underline-offset-3 hover:scale-105'>
                      Delete
                    </span>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete</AlertDialogTitle>
                      <AlertDialogCancel>
                        <XIcon className='size-6 hover:text-neutral-400' />
                      </AlertDialogCancel>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      Are you sure to delete?
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        <div className='text-sm-semibold w-30 text-center text-neutral-950 max-sm:w-20'>
                          Cancel
                        </div>
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deletePost(post.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <BeatLoader size={10} color='#fff' />
                        ) : (
                          'Delete'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </div>
        {variant === 'blogpost' && (
          <div className='flex items-center gap-3'>
            <Link
              to={`/profile/${post.author.email}`}
              className='group flex-start flex-shrink-0 cursor-pointer gap-2'
            >
              <AvatarDisplay
                avatarUrl={userProfile?.avatarUrl}
                displayName={post.author.name}
                style={{ width: generateClamp(30, 40, 1248) }}
                className='aspect-square h-auto group-hover:scale-105 group-hover:brightness-110'
              />
              <span className='md:text-sm-medium text-xs-regular group-hover:text-primary-300 text-neutral-900'>
                {capitalizeName(post.author.name)}
              </span>
            </Link>
            <div className='size-1 flex-shrink-0 rounded-full bg-neutral-400' />
            <span className='md:text-sm-regular text-xs-regular text-neutral-600'>
              {formatDateTime(post.createdAt, false)}
            </span>
          </div>
        )}
        {(variant === 'blogpost' || variant === 'most-liked') && (
          <div className='flex items-center gap-3 md:gap-5'>
            <div className='group flex cursor-pointer items-center gap-1.5'>
              {post?.likedByUser ? (
                <Icon
                  icon='mdi:like'
                  className='text-primary-300 size-5 scale-105'
                  onClick={handleLikeClick}
                />
              ) : (
                <ThumbsUp
                  className='hover:text-primary-300 size-5 text-neutral-600 hover:scale-105'
                  onClick={handleLikeClick}
                />
              )}
              <span className='md:text-sm-regular text-xs-regular group-hover:text-primary-300 text-neutral-600'>
                {post.likes}
              </span>
            </div>
            <div
              className='group flex cursor-pointer items-center gap-1.5'
              onClick={handleCommentClick}
            >
              <Icon
                icon='proicons:comment'
                className='group-hover:text-primary-300 size-5 text-neutral-600 group-hover:scale-105'
              />
              <span className='md:text-sm-regular text-xs-regular group-hover:text-primary-300 text-neutral-600'>
                {commentsData?.length}
              </span>
            </div>
          </div>
        )}
      </div>
      <StatisticDialog
        postId={post.id}
        isOpen={isStatisticDialogOpen}
        onClose={() => setIsStatisticDialogOpen(false)}
        postLikesCount={post.likes}
      />
      <CommentDialog
        postId={post.id}
        open={isCommentDialogOpen}
        onOpenChange={setCommentDialogOpen}
      />
    </div>
  );
};

export default BlogCard;
