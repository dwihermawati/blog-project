import axios from 'axios';
import apiClient from '@/lib/api';
import { BlogListResponse } from '@/types/blog';
import { ApiErrorResponse } from '@/types/auth';

interface GetPostsParams {
  limit?: number;
  page?: number;
  search?: string;
  userId?: number;
  sortBy?: 'recommended' | 'most-liked';
}

const blogService = {
  getPosts: async (params?: GetPostsParams): Promise<BlogListResponse> => {
    let path = '/posts';

    if (params?.sortBy === 'recommended') {
      path = '/posts/recommended';
    } else if (params?.sortBy === 'most-liked') {
      path = '/posts/most-liked';
    } else if (params?.search) {
      path = '/posts/search';
    }

    try {
      const response = await apiClient.get<BlogListResponse>(path, {
        params: {
          limit: params?.limit || 5,
          page: params?.page || 1,
          search: params?.search,
          userId: params?.userId,
        },
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError: ApiErrorResponse = error.response.data;
        throw new Error(
          apiError.message || `Failed to fetch post from ${path}.`
        );
      } else {
        throw new Error(error.message || 'Failed to connect to server.');
      }
    }
  },
};

export default blogService;
