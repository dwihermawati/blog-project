import { Footer } from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import AvatarDisplay from '@/components/shared/AvatarDisplay';
import { generateClamp } from '@/function/generate-clamp';
import usePostDetail from '@/hooks/usePostDetail';
import capitalizeName from '@/lib/capitalizeName';
import { formatDateTime } from '@/lib/formatDateTime';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import useComments from '@/hooks/useComments';
import { renderSafeHTML } from '@/lib/renderSafeHTML';
import CommentForm from '@/components/blog/CommentForm';
import CommentDialog from '@/components/blog/CommentDialog';
import BlogCard from '@/components/blog/BlogCard';
import useBlogPosts from '@/hooks/useBlogPosts';
import useUserProfileByEmail from '@/hooks/useUserProfileByEmail';
import PostLikeButton from '@/components/blog/PostLikeButton';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = id ? parseInt(id) : undefined;

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = usePostDetail({
    postId: postId as number,
    enabled: !!postId,
  });

  const { data: otherPosts } = useBlogPosts({
    page: 1,
    limit: 3,
    enabled: !!post?.id,
    sortBy: 'recommended',
  });

  const { data: commentsData } = useComments({
    postId: post?.id as number,
    enabled: !!post?.id,
  });

  const [isCommentDialogOpen, setCommentDialogOpen] = useState(false);

  const { data: userProfile } = useUserProfileByEmail({
    email: post?.author?.email ?? '',
    enabled: !!post?.author?.email,
  });

  return (
    <>
      <Navbar />
      <main
        className='custom-container flex max-w-200 flex-col gap-3 md:gap-4'
        style={{
          marginBlockStart: generateClamp(88, 128, 1248),
          marginBlockEnd: generateClamp(24, 156, 1248),
        }}
      >
        {isLoading ? (
          <BeatLoader size={30} color='#0093DD' className='mx-auto' />
        ) : isError || !post ? (
          <p className='text-center text-[#EE1D52]'>
            Error: {error?.message || 'Blog post not found.'}
          </p>
        ) : (
          <>
            <h1 className='md:display-lg-bold display-sm-bold text-neutral-900'>
              {post.title}
            </h1>
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
            <div className='flex items-center gap-3'>
              <Link
                to={`/profile/${post.author.email}`}
                className='group flex-start flex-shrink-0 cursor-pointer gap-2'
              >
                <AvatarDisplay
                  avatarUrl={userProfile?.avatarUrl}
                  displayName={post.author.name}
                  className='size-10 group-hover:scale-105 group-hover:brightness-110'
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
            <div className='h-[1px] w-full bg-neutral-300' />
            <div className='flex items-center gap-3 md:gap-5'>
              <PostLikeButton post={post} />
              <div
                className='group flex cursor-pointer items-center gap-1.5'
                onClick={() => setCommentDialogOpen(true)}
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
            <div className='h-[1px] w-full bg-neutral-300' />
            <div className='h-auto w-full rounded-sm'>
              <img
                src={post.imageUrl}
                alt={post.title}
                className='size-full rounded-sm object-cover'
              />
            </div>
            <div
              className='prose-sm md:prose-base break-words text-neutral-950'
              dangerouslySetInnerHTML={renderSafeHTML(post.content)}
            />
            <div className='h-[1px] w-full bg-neutral-300' />
            <div className='flex flex-col gap-3'>
              <CommentForm
                postId={post.id}
                onOpenDialog={() => setCommentDialogOpen(true)}
              />
              <div className='h-[1px] w-full bg-neutral-300' />
              <h2 className='md:display-xs-bold text-xl-bold text-neutral-900'>
                Another Post
              </h2>
              {otherPosts?.data?.filter((p) => p.id !== post.id)?.length ? (
                otherPosts.data
                  .filter((p) => p.id !== post.id)
                  .slice(0, 1)
                  .map((p) => <BlogCard key={p.id} post={p} />)
              ) : (
                <p className='text-sm-regular text-neutral-500'>
                  No other posts to show.
                </p>
              )}
            </div>
          </>
        )}
      </main>
      {post && (
        <CommentDialog
          postId={post.id}
          open={isCommentDialogOpen}
          onOpenChange={setCommentDialogOpen}
        />
      )}
      <Footer />
    </>
  );
};

export default PostDetailPage;
