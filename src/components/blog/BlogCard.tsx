import { generateClamp } from '@/function/generate-clamp';
import capitalizeName from '@/lib/capitalizeName';
import { formatDateTime } from '@/lib/formatDateTime';
import { cn } from '@/lib/utils';
import { BlogPost } from '@/types/blog';
import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp } from 'lucide-react';
import { Icon } from '@iconify/react';
import AvatarDisplay from '../shared/AvatarDisplay';
import DOMPurify from 'dompurify';

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
  const renderSafeHTML = (htmlContent: string) => {
    const cleanHtml = DOMPurify.sanitize(htmlContent, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['script'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick'],
    });
    return { __html: cleanHtml };
  };

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
          className='h-64.5 w-85 cursor-pointer overflow-hidden rounded-sm border border-neutral-200 hover:scale-101 max-md:hidden'
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
                'hover:text-primary-300 cursor-pointer text-neutral-900',
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
            className='text-xs-regular md:text-sm-regular line-clamp-2 text-neutral-900'
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
              <AvatarDisplay
                avatarUrl={post.author.avatarUrl}
                displayName={post.author.name}
                sizeClass='size-10'
                style={{ width: generateClamp(30, 40, 1248) }}
                className='group-hover:scale-105 group-hover:brightness-110'
              />
              <span className='md:text-sm-medium text-xs-regular group-hover:text-primary-300 text-neutral-900'>
                {capitalizeName(post.author.name)}
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
