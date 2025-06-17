import { useQuery } from '@tanstack/react-query';
import blogService from '@/services/blogService';
import { PostCommentsResponse } from '@/types/blog';

interface UseCommentsParams {
  postId: number;
  enabled?: boolean;
}

const useComments = (params: UseCommentsParams) => {
  const { postId, enabled = true } = params;

  return useQuery<PostCommentsResponse, Error>({
    queryKey: ['comments', postId],
    queryFn: async () => blogService.getCommentsByPostId(postId),
    enabled: enabled && !!postId,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export default useComments;
