import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import blogService from '@/services/blogService';
import {
  BlogListResponse,
  BlogPost,
  DeletePostSuccessResponse,
} from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';

interface UseDeletePostOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface DeletePostContext {
  previousBlogLists?: Array<[QueryKey, BlogListResponse | undefined]>;
  previousMyPostsLists?: Array<[QueryKey, BlogListResponse | undefined]>;
  previousPostDetail?: BlogPost | undefined;
  previousMyPostsCount?: BlogListResponse | undefined;
}

const useDeletePost = (options?: UseDeletePostOptions) => {
  const queryClient = useQueryClient();
  const { token, user } = useAuth();
  const rollbackQueryList = (
    list: Array<[QueryKey, BlogListResponse | undefined]> | undefined
  ) => {
    list?.forEach(([key, data]) => {
      queryClient.setQueryData(key, data);
    });
  };

  return useMutation<
    DeletePostSuccessResponse,
    Error,
    number,
    DeletePostContext
  >({
    mutationFn: async (postId: number) => {
      if (!token) throw new Error('You must be logged in to delete a post.');
      return blogService.deletePost(postId);
    },
    onMutate: async (postIdToDelete) => {
      const previousMyPostsCount = queryClient.getQueryData<BlogListResponse>([
        'myPosts-count',
        user?.id?.toString(),
      ]);

      queryClient.setQueryData(
        ['myPosts-count', user?.id?.toString()],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            total: Math.max((old.total || 1) - 1, 0),
            data:
              old.data?.filter(
                (post: BlogPost) => post.id !== postIdToDelete
              ) || [],
          };
        }
      );

      await queryClient.cancelQueries({ queryKey: ['blogPosts'] });
      await queryClient.cancelQueries({ queryKey: ['myPosts'] });
      await queryClient.cancelQueries({
        queryKey: ['postDetail', postIdToDelete],
      });

      const previousBlogLists = queryClient.getQueriesData<BlogListResponse>({
        queryKey: ['blogPosts'],
      });
      const previousMyPostsLists = queryClient.getQueriesData<BlogListResponse>(
        {
          queryKey: ['myPosts'],
        }
      );

      const previousPostDetail = queryClient.getQueryData<BlogPost>([
        'postDetail',
        postIdToDelete,
      ]);

      queryClient.setQueriesData<BlogListResponse | undefined>(
        { queryKey: ['blogPosts'] },
        (oldQueryData) => {
          if (oldQueryData) {
            const newData = oldQueryData.data.filter(
              (post) => post.id !== postIdToDelete
            );
            return {
              ...oldQueryData,
              data: newData,
              total: oldQueryData.total > 0 ? oldQueryData.total - 1 : 0,
            };
          }
          return undefined;
        }
      );

      queryClient.setQueriesData<BlogListResponse | undefined>(
        { queryKey: ['myPosts'] },
        (old) =>
          old
            ? {
                ...old,
                data: old.data.filter((post) => post.id !== postIdToDelete),
                total: Math.max(old.total - 1, 0),
              }
            : old
      );

      queryClient.setQueryData<BlogPost | undefined>(
        ['postDetail', postIdToDelete],
        undefined
      );

      return {
        previousBlogLists,
        previousPostDetail,
        previousMyPostsLists,
        previousMyPostsCount,
      };
    },

    onError: (err, postIdToDelete, context) => {
      rollbackQueryList(context?.previousBlogLists);
      rollbackQueryList(context?.previousMyPostsLists);
      queryClient.setQueryData(
        ['postDetail', postIdToDelete],
        context?.previousPostDetail
      );
      queryClient.setQueryData(
        ['myPosts-count', user?.id?.toString()],
        context?.previousMyPostsCount
      );
      options?.onError?.(err);
    },

    onSuccess: (_, __, ___) => {
      options?.onSuccess?.();
    },

    onSettled: (postIdToDelete) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      queryClient.invalidateQueries({
        queryKey: ['postDetail', postIdToDelete],
      });
      queryClient.invalidateQueries({
        queryKey: ['myPosts-count', user?.id?.toString()],
      });
    },
  });
};

export default useDeletePost;
