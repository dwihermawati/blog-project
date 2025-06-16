import { useQuery } from '@tanstack/react-query';
import blogService from '@/services/blogService';
import { BlogPost } from '@/types/blog';

interface UsePostDetailParams {
  postId: string | number;
  enabled?: boolean;
}

const usePostDetail = (params: UsePostDetailParams) => {
  const { postId, enabled = true } = params;

  return useQuery<BlogPost, Error>({
    queryKey: ['postDetail', postId],
    queryFn: async () => blogService.getPostById(postId),
    enabled: enabled && !!postId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });
};

export default usePostDetail;
