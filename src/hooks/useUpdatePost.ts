import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import blogService from '@/services/blogService';
import { BlogPost, UpdatePostPayload, BlogListResponse } from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';

interface UseUpdatePostOptions {
  onSuccess?: (updatedPost: BlogPost) => void;
  onError?: (error: Error) => void;
}

interface UpdatePostContext {
  previousPostDetail?: BlogPost | undefined;
  previousBlogLists?: Array<[QueryKey, BlogListResponse | undefined]>;
}

const useUpdatePost = (options?: UseUpdatePostOptions) => {
  const queryClient = useQueryClient();
  const { token, user: authUser } = useAuth();

  return useMutation<
    BlogPost,
    Error,
    { postId: number; payload: UpdatePostPayload },
    UpdatePostContext
  >({
    mutationFn: async ({ postId, payload }) => {
      if (!token) throw new Error('You must be logged in to update posts.');
      return blogService.updatePost(postId, payload, token);
    },
    onMutate: async ({ postId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['postDetail', postId] });
      await queryClient.cancelQueries({ queryKey: ['blogPosts'] });
      await queryClient.cancelQueries({
        queryKey: ['myPosts', authUser?.id?.toString()],
      });

      const previousPostDetail = queryClient.getQueryData<BlogPost>([
        'postDetail',
        postId,
      ]);
      const previousBlogLists = queryClient.getQueriesData<BlogListResponse>({
        queryKey: ['blogPosts'],
      });

      queryClient.setQueryData<BlogPost | undefined>(
        ['postDetail', postId],
        (old) => {
          if (old) {
            return {
              ...old,
              title: payload.title !== undefined ? payload.title : old.title,
              content:
                payload.content !== undefined ? payload.content : old.content,
              tags: payload.tags !== undefined ? payload.tags : old.tags,
            };
          }
          return old;
        }
      );

      queryClient.setQueriesData<BlogListResponse | undefined>(
        { queryKey: ['blogPosts'] },
        (oldQueryData) => {
          if (oldQueryData) {
            const updatedData = oldQueryData.data.map((postItem) => {
              if (postItem.id === postId) {
                return {
                  ...postItem,
                  title:
                    payload.title !== undefined
                      ? payload.title
                      : postItem.title,
                  content:
                    payload.content !== undefined
                      ? payload.content
                      : postItem.content,
                  tags:
                    payload.tags !== undefined ? payload.tags : postItem.tags,
                };
              }
              return postItem;
            });
            return { ...oldQueryData, data: updatedData };
          }
          return undefined;
        }
      );

      return { previousPostDetail, previousBlogLists };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ['postDetail', variables.postId],
        context?.previousPostDetail
      );
      if (context?.previousBlogLists) {
        context.previousBlogLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      options?.onError?.(err);
    },
    onSettled: (updatedPost, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['postDetail', variables.postId],
      });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({
        queryKey: ['myPosts', authUser?.id?.toString()],
      });

      if (!error) {
        options?.onSuccess?.(updatedPost as BlogPost);
      }
    },
  });
};

export default useUpdatePost;
