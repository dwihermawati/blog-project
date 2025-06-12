import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import blogService from '@/services/blogService';
import {
  Comment,
  CreateCommentPayload,
  CreateCommentSuccessResponse,
  BlogPost,
  PostCommentsResponse,
} from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';

interface UseCreateCommentOptions {
  onSuccess?: (newComment: CreateCommentSuccessResponse) => void;
  onError?: (error: Error) => void;
}

interface CreateCommentContext {
  previousComments?: Array<[QueryKey, PostCommentsResponse | undefined]>;
  previousPostDetail?: BlogPost | undefined;
}

const useCreateComment = (options?: UseCreateCommentOptions) => {
  const queryClient = useQueryClient();
  const { token, user: authUser } = useAuth();

  return useMutation<
    CreateCommentSuccessResponse,
    Error,
    { postId: number; content: string },
    CreateCommentContext
  >({
    mutationFn: async ({ postId, content }) => {
      if (!token) throw new Error('You must be logged in to leave a comment.');

      const payload: CreateCommentPayload = { content };
      return blogService.createComment(postId, payload, token);
    },
    onMutate: async ({ postId, content }) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });
      await queryClient.cancelQueries({ queryKey: ['postDetail', postId] });

      const previousComments = queryClient.getQueriesData<PostCommentsResponse>(
        { queryKey: ['comments', postId] }
      );
      const previousPostDetail = queryClient.getQueryData<BlogPost>([
        'postDetail',
        postId,
      ]);

      queryClient.setQueryData<PostCommentsResponse | undefined>(
        ['comments', postId],
        (old) => {
          const newComment: Comment = {
            id: Date.now(),
            content: content,
            createdAt: new Date().toISOString(),
            author: {
              id: authUser?.id || 0,
              name: authUser?.name || authUser?.email || 'Guest',
              email: authUser?.email || 'guest@example.com',
              avatarUrl: authUser?.avatarUrl || null,
              headline: authUser?.headline || null,
            },
          };
          return old ? [newComment, ...old] : [newComment];
        }
      );

      queryClient.setQueryData<BlogPost | undefined>(
        ['postDetail', postId],
        (old) => {
          if (old) {
            return { ...old, comments: old.comments + 1 };
          }
          return old;
        }
      );

      return { previousComments, previousPostDetail };
    },
    onError: (err, { postId }, context) => {
      queryClient.setQueryData(
        ['postDetail', postId],
        context?.previousPostDetail
      );
      if (context?.previousComments) {
        context.previousComments.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      options?.onError?.(err);
    },
    onSettled: (data, error, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['postDetail', postId] });
      if (!error) {
        options?.onSuccess?.(data as CreateCommentSuccessResponse);
      }
    },
  });
};

export default useCreateComment;
