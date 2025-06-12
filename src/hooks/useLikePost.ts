import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from '@/services/blogService';
import { BlogListResponse, BlogPost } from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';

interface UseLikePostOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface LikePostContext {
  previousPostDetail?: BlogPost;
  previousBlogLists?: Array<[QueryKey, BlogListResponse | undefined]>;
}

const useLikePost = (options?: UseLikePostOptions) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation<BlogPost, Error, number, LikePostContext>({
    mutationFn: async (postId) => {
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

      const wasLiked = previousPostDetail?.likedByUser ?? false;

      // Optimistically update post detail
      if (previousPostDetail) {
        queryClient.setQueryData<BlogPost>(['postDetail', postIdToLike], {
          ...previousPostDetail,
          likes: previousPostDetail.likes + (wasLiked ? -1 : 1),
          likedByUser: !wasLiked,
        });
      }

      // Optimistically update blog posts list
      queryClient.setQueriesData<BlogListResponse>(
        { queryKey: ['blogPosts'] },
        (oldQuery) => {
          if (!oldQuery) return oldQuery;
          const updatedData = oldQuery.data.map((post) =>
            post.id === postIdToLike
              ? {
                  ...post,
                  likes: post.likes + (wasLiked ? -1 : 1),
                  likedByUser: !wasLiked,
                }
              : post
          );
          return { ...oldQuery, data: updatedData };
        }
      );

      return {
        previousPostDetail,
        previousBlogLists,
      };
    },

    onError: (error, postIdToLike, context) => {
      // Rollback post detail
      if (context?.previousPostDetail) {
        queryClient.setQueryData(
          ['postDetail', postIdToLike],
          context.previousPostDetail
        );
      }

      // Rollback all blog lists
      context?.previousBlogLists?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      options?.onError?.(error);
    },

    onSettled: (_data, error, postIdToLike) => {
      queryClient.invalidateQueries({ queryKey: ['postDetail', postIdToLike] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });

      if (!error) options?.onSuccess?.();
    },
  });
};

export default useLikePost;
