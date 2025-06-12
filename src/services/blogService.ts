import axios from 'axios';
import apiClient from '@/lib/api';
import {
  BlogListResponse,
  BlogPost,
  DeletePostSuccessResponse,
  PostLikesResponse,
} from '@/types/blog';
import { ApiErrorResponse } from '@/types/auth';

interface GetPostsParams {
  limit?: number;
  page?: number;
  search?: string;
  userId?: number;
  sortBy?: 'recommended' | 'most-liked' | 'search';
}

const blogService = {
  getPosts: async (params?: GetPostsParams): Promise<BlogListResponse> => {
    let path = '/posts';
    const requestParams: any = {
      limit: params?.limit || 5,
      page: params?.page || 1,
      userId: params?.userId,
    };

    if (params?.sortBy === 'recommended') {
      path = '/posts/recommended';
    } else if (params?.sortBy === 'most-liked') {
      path = '/posts/most-liked';
    } else if (params?.search) {
      path = '/posts/search';
      requestParams.query = params.search;
    }

    try {
      const response = await apiClient.get<BlogListResponse>(path, {
        params: requestParams,
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
  getPostById: async (id: string | number): Promise<BlogPost> => {
    try {
      const response = await apiClient.get<BlogPost>(`/posts/${id}`);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError: ApiErrorResponse = error.response.data;
        throw new Error(
          apiError.message || `Failed to fetch post details with ID: ${id}.`
        );
      } else {
        throw new Error(error.message || 'Failed to connect to server.');
      }
    }
  },
  deletePost: async (
    postId: number,
    token: string
  ): Promise<DeletePostSuccessResponse> => {
    try {
      const response = await apiClient.delete<DeletePostSuccessResponse>(
        `/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError: ApiErrorResponse = error.response.data;
        throw new Error(
          apiError.message || `Failed to delete post with ID: ${postId}.`
        );
      } else {
        throw new Error(error.message || 'Failed to connect to server.');
      }
    }
  },
  getPostLikes: async (postId: number): Promise<PostLikesResponse> => {
    try {
      const response = await apiClient.get<PostLikesResponse>(
        `/posts/${postId}/likes`
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError: ApiErrorResponse = error.response.data;
        throw new Error(
          apiError.message ||
            `Failed to fetch likes list for post ID: ${postId}.`
        );
      } else {
        throw new Error(error.message || 'Failed to connect to server.');
      }
    }
  },

  likePost: async (postId: number, token: string): Promise<BlogPost> => {
    try {
      const response = await apiClient.post<BlogPost>(
        `/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError: ApiErrorResponse = error.response.data;
        throw new Error(
          apiError.message || `Failed to like post ID: ${postId}.`
        );
      } else {
        throw new Error(error.message || 'Failed to connect to server.');
      }
    }
  },
};

export default blogService;
