import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BeatLoader } from 'react-spinners';
import { Link, useNavigate } from 'react-router-dom';
import AvatarDisplay from '@/components/shared/AvatarDisplay';
import CommentCard from './CommentCard';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import useCreateComment from '@/hooks/useCreateComment';
import useComments from '@/hooks/useComments';
import { useAuth } from '@/contexts/AuthContext';
import capitalizeName from '@/lib/capitalizeName';
import { toast } from 'react-toastify';
import useGetUserByEmail from '@/hooks/useGetUserByEmail';

const commentSchema = z.object({
  content: z.string().min(3, 'Comments cannot be empty.'),
});

type PostCommentsProps = {
  postId: number;
  onOpenDialog?: () => void;
};

const CommentForm: React.FC<PostCommentsProps> = ({ postId, onOpenDialog }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user: authUser, token } = useAuth();
  const { data: userData, isLoading: isUserLoading } = useGetUserByEmail();

  const currentUserAvatarUrl = userData?.avatarUrl;
  const currentUserDisplayName = userData?.name || authUser?.email || 'User';

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
  } = useComments({ postId, enabled: !!postId });

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  const { mutate: createComment, isPending: isCreatingComment } =
    useCreateComment({
      onSuccess: () => {
        form.reset();
        toast.success('Comment submitted successfully!');
      },
      onError: (err) => {
        toast.error(`Failed to post comment:\n${err.message}`);
      },
    });

  const handleCommentSubmit = (data: z.infer<typeof commentSchema>) => {
    if (!isAuthenticated || !token) {
      toast.info('You must be logged in to post a comment.');
      navigate('/login');
      return;
    }
    createComment({ postId, content: data.content });
  };

  return (
    <>
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
          {[...commentsData]
            .reverse()
            .slice(0, 3)
            .map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
        </div>
      ) : (
        <p className='text-muted-foreground text-center'>No comments yet.</p>
      )}

      {commentsData && commentsData.length > 3 && (
        <p
          className='text-sm-semibold text-primary-300 origin-left transform cursor-pointer underline underline-offset-3 hover:scale-101'
          onClick={() => onOpenDialog?.()}
        >
          See All Comments
        </p>
      )}
    </>
  );
};

export default CommentForm;
