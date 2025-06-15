import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from '@/services/blogService';
import { BlogListResponse, BlogPost } from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';

interface UseLikePostOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  post?: BlogPost;
}

interface LikePostContext {
  previousPostDetail?: BlogPost;
  previousBlogLists?: Array<[QueryKey, BlogListResponse | undefined]>;
}

const useLikePost = (options?: UseLikePostOptions) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  // 🔁 Helper untuk update semua list cache (blogPosts, myPosts, dll)
  const updatePostInLists = (
    queryKeyPrefix: string[],
    postId: number,
    updater: (post: BlogPost) => BlogPost
  ) => {
    queryClient.setQueriesData<BlogListResponse>(
      { queryKey: queryKeyPrefix },
      (oldQuery) => {
        if (!oldQuery) return oldQuery;
        return {
          ...oldQuery,
          data: oldQuery.data.map((post) =>
            post.id === postId ? updater(post) : post
          ),
        };
      }
    );
  };

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
      await queryClient.cancelQueries({ queryKey: ['myPosts'] });

      const previousPostDetail =
        options?.post?.id === postIdToLike
          ? options.post
          : queryClient.getQueryData<BlogPost>(['postDetail', postIdToLike]);

      const previousBlogLists = [
        ...queryClient.getQueriesData<BlogListResponse>({
          queryKey: ['blogPosts'],
        }),
        ...queryClient.getQueriesData<BlogListResponse>({
          queryKey: ['myPosts'],
        }),
      ];

      const wasLiked = previousPostDetail?.likedByUser ?? false;

      // ✅ Update post detail
      if (previousPostDetail) {
        queryClient.setQueryData<BlogPost>(['postDetail', postIdToLike], {
          ...previousPostDetail,
          likes: previousPostDetail.likes + (wasLiked ? -1 : 1),
          likedByUser: !wasLiked,
        });
      }

      // ✅ Update semua list: blogPosts & myPosts
      const updateFn = (post: BlogPost) => ({
        ...post,
        likes: post.likes + (wasLiked ? -1 : 1),
        likedByUser: !wasLiked,
      });

      updatePostInLists(['blogPosts'], postIdToLike, updateFn);
      updatePostInLists(['myPosts'], postIdToLike, updateFn);

      return { previousPostDetail, previousBlogLists };
    },

    onError: (error, postIdToLike, context) => {
      if (context?.previousPostDetail) {
        queryClient.setQueryData(
          ['postDetail', postIdToLike],
          context.previousPostDetail
        );
      }

      context?.previousBlogLists?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      options?.onError?.(error);
    },

    onSettled: (_data, error, postIdToLike) => {
      queryClient.invalidateQueries({ queryKey: ['postDetail', postIdToLike] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });

      if (!error) options?.onSuccess?.();
    },
  });
};

export default useLikePost;
