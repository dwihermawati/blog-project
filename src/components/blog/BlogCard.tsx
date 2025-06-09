import { generateClamp } from '@/function/generate-clamp';
import capitalizeName from '@/lib/capitalizeName';
import { formatDateTime } from '@/lib/formatDateTime';
import getColorAvatar from '@/lib/getColorAvatar';
import getInitials from '@/lib/getInitials';
import { cn } from '@/lib/utils';
import { BlogPost } from '@/types/blog';
import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp } from 'lucide-react';
import { Icon } from '@iconify/react';

type BlogCardProps = {
  variant?: 'blogpost' | 'most-liked' | 'user-blogpost';
  post: BlogPost;
  avatarUrl?: string;
  displayName?: string;
  isLastItem?: boolean;
};

const BlogCard: React.FC<BlogCardProps> = ({
  post,
  avatarUrl,
  variant = 'blogpost',
  displayName = post.author.name,
  isLastItem,
}) => {
  const hasAvatar = !!avatarUrl;

  return (
    <div
      className={cn(
        'flex w-full items-center gap-6 pb-4',
        variant === 'blogpost' ? 'md:pb-6' : 'md:pb-5',
        !isLastItem && 'border-b border-b-neutral-300'
      )}
    >
      {(variant === 'blogpost' || variant === 'user-blogpost') && (
        <div className='h-64.5 w-85 overflow-hidden rounded-sm border border-neutral-200 max-md:hidden'>
          <img
            src={post.imageUrl}
            alt={post.title}
            className='size-full object-cover'
          />
        </div>
      )}
      <div className='flex flex-1 flex-col gap-3 md:gap-4'>
        <div
          className={cn(
            'flex flex-col',
            variant === 'most-liked' ? 'gap-1' : 'gap-2 md:gap-3'
          )}
        >
          <h2
            className={cn(
              'text-neutral-900',
              variant === 'most-liked'
                ? 'text-md-bold'
                : 'text-md-bold md:text-xl-bold'
            )}
          >
            {post.title}
          </h2>
          {(variant === 'blogpost' || variant === 'user-blogpost') && (
            <div className='flex items-center gap-2'>
              {post.tags.map((tag, idx) => (
                <div
                  key={idx}
                  className='text-xs-regular flex-center h-7 w-fit rounded-md border border-neutral-300 bg-white px-2 text-neutral-900'
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
          <p className='text-xs-regular md:text-sm-regular line-clamp-2 text-neutral-900'>
            {post.content}
          </p>
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
                <span className='text-sm-semibold text-primary-300 cursor-pointer underline underline-offset-3 hover:scale-105'>
                  Statistic
                </span>
                <div className='h-6 w-[1px] flex-shrink-0 bg-neutral-300' />
                <Link
                  to='/edit-post'
                  className='text-sm-semibold text-primary-300 underline underline-offset-3 hover:scale-105'
                >
                  Edit
                </Link>
                <div className='h-6 w-[1px] flex-shrink-0 bg-neutral-300' />
                <span className='text-sm-semibold cursor-pointer text-[#EE1D52] underline underline-offset-3 hover:scale-105'>
                  Delete
                </span>
              </div>
            </>
          )}
        </div>
        {variant === 'blogpost' && (
          <div className='flex items-center gap-3'>
            <div className='group flex-start flex-shrink-0 cursor-pointer gap-2'>
              {hasAvatar ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className='aspect-square h-auto rounded-full object-cover transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-110'
                  style={{ width: generateClamp(30, 40, 1248) }}
                />
              ) : (
                <div
                  className='flex-center text-md-semibold aspect-square h-auto rounded-full text-white uppercase transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-110'
                  style={{
                    width: generateClamp(30, 40, 1248),
                    backgroundColor: getColorAvatar(displayName),
                  }}
                >
                  {getInitials(displayName)}
                </div>
              )}
              <span className='md:text-sm-medium text-xs-regular group-hover:text-primary-300 text-neutral-900'>
                {capitalizeName(displayName)}
              </span>
            </div>
            <div className='size-1 flex-shrink-0 rounded-full bg-neutral-400' />
            <span className='md:text-sm-regular text-xs-regular text-neutral-600'>
              {formatDateTime(post.createdAt, false)}
            </span>
          </div>
        )}
        {(variant === 'blogpost' || variant === 'most-liked') && (
          <div className='flex items-center gap-3 md:gap-5'>
            <div className='group flex cursor-pointer items-center gap-1.5'>
              <ThumbsUp className='group-hover:text-primary-300 size-5 text-neutral-600 group-hover:scale-105' />
              <span className='md:text-sm-regular text-xs-regular group-hover:text-primary-300 text-neutral-600'>
                {post.likes}
              </span>
            </div>
            <div className='group flex cursor-pointer items-center gap-1.5'>
              <Icon
                icon='proicons:comment'
                className='group-hover:text-primary-300 size-5 text-neutral-600 group-hover:scale-105'
              />
              <span className='md:text-sm-regular text-xs-regular group-hover:text-primary-300 text-neutral-600'>
                {post.comments}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
