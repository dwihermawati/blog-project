import { useQuery } from '@tanstack/react-query';
import blogService from '@/services/blogService';
import { PostLikesResponse } from '@/types/blog';

interface UsePostLikesParams {
  postId: number;
  enabled?: boolean;
}

const usePostLikes = (params: UsePostLikesParams) => {
  const { postId, enabled = true } = params;

  return useQuery<PostLikesResponse, Error>({
    queryKey: ['postLikes', postId],
    queryFn: async () => {
      if (!postId) throw new Error('Post ID is missing for fetching likes.');
      return blogService.getPostLikes(postId);
    },
    enabled: enabled && !!postId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

export default usePostLikes;
