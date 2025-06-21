import { useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from '@/services/blogService';
import { BlogPost, CreatePostPayload } from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';

interface UseCreatePostOptions {
  onSuccess?: (newPost: BlogPost) => void;
  onError?: (error: Error) => void;
}

const useCreatePost = (options?: UseCreatePostOptions) => {
  const queryClient = useQueryClient();
  const { token, user: authUser } = useAuth();

  return useMutation<BlogPost, Error, CreatePostPayload>({
    mutationFn: async (payload) => {
      if (!token) throw new Error('You must be logged in to create a post.');
      return blogService.createPost(payload, token);
    },
    onSuccess: (newPost) => {
      if (authUser?.id) {
        queryClient.setQueryData(
          ['myPosts-count', authUser.id.toString()],
          (old: any) => {
            if (!old) return old;
            return {
              ...old,
              total: (old.total || 0) + 1,
              data: [newPost, ...(old.data || [])],
            };
          }
        );
      }
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedPosts'] });
      queryClient.invalidateQueries({
        queryKey: ['myPosts', authUser?.id?.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ['myPosts-count', authUser?.id?.toString()],
      });
      options?.onSuccess?.(newPost);
    },
    onError: (error) => {
      console.error('Create post failed:', error);
      options?.onError?.(error);
    },
  });
};

export default useCreatePost;
