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

  const updatePostInLists = (
    queryKeyPrefix: string[],
    postId: number,
    updatedPost: BlogPost
  ) => {
    queryClient.setQueriesData<BlogListResponse>(
      { queryKey: queryKeyPrefix },
      (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((post) =>
            post.id === postId ? { ...post, ...updatedPost } : post
          ),
        };
      }
    );
  };

  return useMutation<BlogPost, Error, number, LikePostContext>({
    mutationFn: async (postId) => {
      if (!token) throw new Error('You must be logged in to like a post.');
      return blogService.likePost(postId, token);
    },

    onMutate: async (postId) => {
      const listKeys = ['blogPosts', 'myPosts', 'searchResults'];
      const allKeys: QueryKey[] = [
        ...listKeys.map((key) => [key]),
        ['postDetail', postId],
      ];
      for (const key of allKeys) {
        await queryClient.cancelQueries({ queryKey: key });
      }
      // await queryClient.cancelQueries({ queryKey: ['postDetail', postId] });
      // await queryClient.cancelQueries({ queryKey: ['blogPosts'] });
      // await queryClient.cancelQueries({ queryKey: ['myPosts'] });
      // await queryClient.cancelQueries({ queryKey: ['searchResults'] });

      const previousPostDetail = queryClient.getQueryData<BlogPost>([
        'postDetail',
        postId,
      ]);

      const previousBlogLists = listKeys.flatMap((key) =>
        queryClient.getQueriesData<BlogListResponse>({ queryKey: [key] })
      );
      // const previousBlogLists = [
      //   ...queryClient.getQueriesData<BlogListResponse>({
      //     queryKey: ['blogPosts'],
      //   }),
      //   ...queryClient.getQueriesData<BlogListResponse>({
      //     queryKey: ['myPosts'],
      //   }),
      //   ...queryClient.getQueriesData<BlogListResponse>({
      //     queryKey: ['searchResults'],
      //   }),
      // ];

      return { previousPostDetail, previousBlogLists };
    },

    onSuccess: (newPost, postId) => {
      queryClient.setQueryData(['postDetail', postId], newPost);

      updatePostInLists(['blogPosts'], postId, newPost);
      updatePostInLists(['myPosts'], postId, newPost);
      updatePostInLists(['searchResults'], postId, newPost);

      queryClient.invalidateQueries({ queryKey: ['postLikes', postId] });
      options?.onSuccess?.();
    },

    onError: (error, postId, context) => {
      if (context?.previousPostDetail) {
        queryClient.setQueryData(
          ['postDetail', postId],
          context.previousPostDetail
        );
      }
      context?.previousBlogLists?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      options?.onError?.(error);
    },

    onSettled: (_data, _error, postId) => {
      queryClient.invalidateQueries({ queryKey: ['postDetail', postId] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
    },
  });
};

export default useLikePost;
