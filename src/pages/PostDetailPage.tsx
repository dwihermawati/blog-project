import BlogList from '@/components/blog/BlogList';
import { Footer } from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import AvatarDisplay from '@/components/shared/AvatarDisplay';
import { useAuth } from '@/contexts/AuthContext';
import { generateClamp } from '@/function/generate-clamp';
import usePostDetail from '@/hooks/usePostDetail';
import capitalizeName from '@/lib/capitalizeName';
import { formatDateTime } from '@/lib/formatDateTime';
import { Icon } from '@iconify/react';
import { ThumbsUp } from 'lucide-react';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import useLikePost from '@/hooks/useLikePost';
import useComments from '@/hooks/useComments';
import { renderSafeHTML } from '@/lib/renderSafeHTML';
import CommentForm from '@/components/blog/CommentForm';
import { toast } from 'react-toastify';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = id ? parseInt(id) : undefined;
  const navigate = useNavigate();

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = usePostDetail({
    postId: postId as number,
    enabled: !!postId,
  });

  const { isAuthenticated } = useAuth();

  const { mutate } = useLikePost({ post });

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      toast.info('You must be logged in to give a like!');
      navigate('/login');
      return;
    }
    if (post?.id) {
      mutate(post.id);
    }
  };

  const { data: commentsData } = useComments({
    postId: post?.id as number,
    enabled: !!post?.id,
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
                  avatarUrl={post.author.avatarUrl}
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
              <div
                className='group flex cursor-pointer items-center gap-1.5'
                onClick={handleLikeClick}
              >
                {post?.likedByUser ? (
                  <Icon
                    icon='mdi:like'
                    className='fill-primary-300 size-5 group-hover:scale-105'
                  />
                ) : (
                  <ThumbsUp className='group-hover:text-primary-300 size-5 text-neutral-600 group-hover:scale-105' />
                )}

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
              <CommentForm postId={post.id} />
              <div className='h-[1px] w-full bg-neutral-300' />
              <h2 className='md:display-xs-bold text-xl-bold text-neutral-900'>
                Another Post
              </h2>
              <BlogList
                itemsPerPage={1}
                showTitle={false}
                showPagination={false}
                sortBy='recommended'
              />
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default PostDetailPage;
