import React, { useEffect } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BeatLoader } from 'react-spinners';
import { XIcon } from 'lucide-react';
import CommentCard from './CommentCard';
import useComments from '@/hooks/useComments';
import useCreateComment from '@/hooks/useCreateComment';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const commentSchema = z.object({
  content: z.string().min(3, 'Comments cannot be empty.'),
});

type CommentDialogProps = {
  postId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CommentDialog: React.FC<CommentDialogProps> = ({
  postId,
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (open && !isAuthenticated) {
      toast.info('You must be logged in to comment.');
      onOpenChange(false);
      navigate('/login');
    }
  }, [open, isAuthenticated, onOpenChange, navigate]);

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
  } = useComments({ postId, enabled: open });

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
      toast.info('You must be logged in to comment.');
      navigate('/login');
      return;
    }
    createComment({ postId, content: data.content });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-225.5 max-w-153.25'>
        <DialogHeader>
          <DialogTitle>Comments ({commentsData?.length})</DialogTitle>
          <DialogClose>
            <XIcon className='size-6 cursor-pointer text-neutral-950 hover:text-neutral-500' />
          </DialogClose>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCommentSubmit)}
            className='flex flex-col gap-3'
          >
            <FormField
              control={form.control}
              name='content'
              render={({ field, fieldState }) => (
                <FormItem>
                  <Label>Leave a Comment</Label>
                  <Textarea
                    className='py-2'
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
              disabled={isCreatingComment}
              className='w-full self-end md:w-51'
            >
              {isCreatingComment ? (
                <BeatLoader size={8} color='#fff' />
              ) : (
                'Send'
              )}
            </Button>
            <div className='h-[1px] w-full bg-neutral-300' />
          </form>
        </Form>
        <div className='mt-4 flex max-h-[300px] flex-col gap-3 overflow-y-auto md:mt-5'>
          {isCommentsLoading ? (
            <p className='text-center'>Loading comments...</p>
          ) : isCommentsError ? (
            <p className='text-center text-[#EE1D52]'>
              Error loading comments: {commentsError?.message}
            </p>
          ) : commentsData && commentsData.length > 0 ? (
            [...commentsData]
              .reverse()
              .map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))
          ) : (
            <p className='text-muted-foreground text-center'>
              No comments yet.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
