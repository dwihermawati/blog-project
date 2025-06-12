import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from '@/services/blogService';
import { BlogListResponse, BlogPost } from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';

interface UseLikePostOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface LikePostContext {
  previousPostDetail?: BlogPost | undefined;
  previousBlogLists?: Array<[QueryKey, BlogListResponse | undefined]>;
}

const useLikePost = (options?: UseLikePostOptions) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation<BlogPost, Error, number, LikePostContext>({
    mutationFn: async (postId: number) => {
      if (!token) throw new Error('You must be logged in to give a like.');
      return blogService.likePost(postId, token);
    },
    onMutate: async (postIdToLike) => {
      await queryClient.cancelQueries({
        queryKey: ['postDetail', postIdToLike],
      });
      await queryClient.cancelQueries({ queryKey: ['blogPosts'] });

      const previousPostDetail = queryClient.getQueryData<BlogPost>([
        'postDetail',
        postIdToLike,
      ]);
      const previousBlogLists = queryClient.getQueriesData<BlogListResponse>({
        queryKey: ['blogPosts'],
      });

      queryClient.setQueryData<BlogPost | undefined>(
        ['postDetail', postIdToLike],
        (old) => {
          if (old) {
            return { ...old, likes: old.likes + 1 };
          }
          return old;
        }
      );

      queryClient.setQueriesData<BlogListResponse | undefined>(
        { queryKey: ['blogPosts'] },
        (oldQueryData) => {
          if (oldQueryData) {
            const updatedData = oldQueryData.data.map((post) =>
              post.id === postIdToLike
                ? { ...post, likes: post.likes + 1 }
                : post
            );
            return { ...oldQueryData, data: updatedData };
          }
          return undefined;
        }
      );

      return { previousPostDetail, previousBlogLists };
    },
    onError: (err, postIdToLike, context) => {
      queryClient.setQueryData(
        ['postDetail', postIdToLike],
        context?.previousPostDetail
      );
      if (context?.previousBlogLists) {
        context.previousBlogLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      options?.onError?.(err);
    },
    onSettled: (data, error, postIdToLike) => {
      queryClient.invalidateQueries({ queryKey: ['postDetail', postIdToLike] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      if (!error) {
        options?.onSuccess?.();
      }
    },
  });
};

export default useLikePost;
