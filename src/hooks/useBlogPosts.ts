import { useQuery } from '@tanstack/react-query';
import blogService from '@/services/blogService';
import { BlogListResponse } from '@/types/blog';

interface UseBlogPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  userId?: number;
  sortBy?: 'recommended' | 'most-liked' | 'search' | 'myPosts';
  token?: string;
  enabled?: boolean;
  queryKeyPrefix?: string[];
}

const useBlogPosts = (params: UseBlogPostsParams = {}) => {
  const {
    page = 1,
    limit = 5,
    search,
    userId,
    sortBy,
    enabled = true,
    queryKeyPrefix = ['blogPosts'],
    token,
  } = params;

  return useQuery<BlogListResponse, Error>({
    queryKey: [...queryKeyPrefix, sortBy, page, limit, search, userId],
    queryFn: async () =>
      blogService.getPosts({ page, limit, search, userId, sortBy, token }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    enabled: enabled,
  });
};

export default useBlogPosts;
