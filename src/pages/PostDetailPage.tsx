import BlogList from '@/components/blog/BlogList';
import { Footer } from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import AvatarDisplay from '@/components/shared/AvatarDisplay';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { generateClamp } from '@/function/generate-clamp';
import usePostDetail from '@/hooks/usePostDetail';
import useUser from '@/hooks/useUser';
import capitalizeName from '@/lib/capitalizeName';
import { formatDateTime } from '@/lib/formatDateTime';
import { Icon } from '@iconify/react';
import { ThumbsUp } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import DOMPurify from 'dompurify';
import useLikePost from '@/hooks/useLikePost';
import { z } from 'zod';
import useComments from '@/hooks/useComments';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useCreateComment from '@/hooks/useCreateComment';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import CommentCard from '@/components/blog/CommentCard';

const commentSchema = z.object({
  content: z.string().min(3, 'Comments cannot be empty.'),
});

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

  const { isAuthenticated, user: authUser, token } = useAuth();
  const { data: userData, isLoading: isUserLoading } = useUser();

  const currentUserAvatarUrl = userData?.avatarUrl;
  const currentUserDisplayName = userData?.name || authUser?.email || 'User';

  const renderSafeHTML = (htmlContent: string) => {
    const cleanHtml = DOMPurify.sanitize(htmlContent, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['script'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick'],
    });
    return { __html: cleanHtml };
  };

  const likePost = useLikePost();
  const handleLikeClick = () => {
    if (!isAuthenticated) {
      alert('You must be logged in to give a like!');
      navigate('/login');
      return;
    }
    if (postId) {
      likePost.mutate(postId);
    }
  };

  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
  } = useComments({ postId: post?.id as number, enabled: !!post?.id });

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  const { mutate: createComment, isPending: isCreatingComment } =
    useCreateComment({
      onSuccess: () => {
        form.reset();
        alert('Comment submitted successfully!');
      },
      onError: (err) => {
        alert(`Failed to post comment:
 ${err.message}`);
      },
    });

  const handleCommentSubmit = (data: z.infer<typeof commentSchema>) => {
    if (!isAuthenticated || !token) {
      alert('You must be logged in to post a comment.');
      navigate('/login');
      return;
    }
    createComment({ postId: post!.id, content: data.content });
  };

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
          <p className='text-[#EE1D52]'>
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
              className='prose-sm md:prose-base text-neutral-950'
              dangerouslySetInnerHTML={renderSafeHTML(post.content)}
            />
            <div className='h-[1px] w-full bg-neutral-300' />
            <div className='flex flex-col gap-3'>
              <p className='md:display-xs-bold text-xl-bold text-neutral-900'>
                Comments({commentsData?.length})
              </p>
              {isAuthenticated ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleCommentSubmit)}
                    className='flex flex-col gap-3'
                  >
                    <Link
                      to='/profile'
                      className='group flex cursor-pointer items-center gap-3'
                    >
                      {isUserLoading ? (
                        <div className='flex-center size-10 animate-pulse rounded-full bg-gray-200'></div>
                      ) : (
                        <AvatarDisplay
                          avatarUrl={currentUserAvatarUrl}
                          displayName={currentUserDisplayName}
                          className='size-10 group-hover:scale-105 group-hover:brightness-110'
                        />
                      )}
                      <span className='text-sm-medium group-hover:text-primary-300 text-neutral-900'>
                        {isUserLoading
                          ? 'Loading...'
                          : capitalizeName(currentUserDisplayName)}
                      </span>
                    </Link>
                    <FormField
                      control={form.control}
                      name='content'
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <Label>Give your Comments</Label>
                          <Textarea
                            className='h-35 resize-none rounded-xl border border-neutral-300 px-4 py-2'
                            placeholder='Enter your comment'
                            disabled={isCreatingComment}
                            {...field}
                            aria-invalid={!!fieldState.error}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type='submit'
                      className='w-full self-end md:w-51'
                      disabled={isCreatingComment}
                    >
                      {isCreatingComment ? (
                        <BeatLoader size={8} color='#fff' />
                      ) : (
                        'Send'
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className='text-sm-regular flex items-center gap-2 text-neutral-600'>
                  <span>Login to leave a comment.</span>
                  <Link
                    to='/login'
                    className='text-sm-semibold text-primary-300 underline underline-offset-3 hover:scale-105'
                  >
                    Login
                  </Link>
                </div>
              )}
              <div className='h-[1px] w-full bg-neutral-300' />
              {isCommentsLoading ? (
                <div className='text-center'>Loading comments...</div>
              ) : isCommentsError ? (
                <div className='text-center text-[#EE1D52]'>
                  Error loading comments: {commentsError?.message}
                </div>
              ) : commentsData && commentsData.length > 0 ? (
                <div className='flex flex-col gap-4'>
                  {commentsData.slice(0, 3).map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))}
                </div>
              ) : (
                <p className='text-muted-foreground text-center'>
                  No comments yet.
                </p>
              )}
              {commentsData && commentsData.length > 3 && (
                <p
                  className='text-sm-semibold text-primary-300 origin-left transform cursor-pointer underline underline-offset-3 hover:scale-101'
                  onClick={() => setIsCommentsDialogOpen(true)}
                >
                  See All Comments
                </p>
              )}
              <div className='h-[1px] w-full bg-neutral-300' />
              <h2 className='md:display-xs-bold text-xl-bold text-neutral-900'>
                Another Post
              </h2>
              <BlogList
                itemsPerPage={1}
                showTitle={false}
                showPagination={false}
                sortBy='most-liked'
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
