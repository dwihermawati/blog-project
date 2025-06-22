import axios, { AxiosRequestConfig } from 'axios';
import apiClient from '@/lib/api';
import {
  BlogListResponse,
  BlogPost,
  CreateCommentPayload,
  CreateCommentSuccessResponse,
  CreatePostPayload,
  DeletePostSuccessResponse,
  PostCommentsResponse,
  PostLikesResponse,
  UpdatePostPayload,
} from '@/types/blog';
import { ApiErrorResponse } from '@/types/auth';

interface GetPostsParams {
  limit?: number;
  page?: number;
  search?: string;
  userId?: number;
  sortBy?: 'recommended' | 'most-liked' | 'search' | 'myPosts' | 'userId';
}

const blogService = {
  getPosts: async (params?: GetPostsParams): Promise<BlogListResponse> => {
    let path = '/posts';
    const requestParams: any = {
      limit: params?.limit || 5,
      page: params?.page || 1,
    };

    const config: AxiosRequestConfig = {
      params: requestParams,
    };

    if (params?.sortBy === 'myPosts' && params?.userId) {
      path = '/posts/my-posts';
    } else if (params?.sortBy === 'recommended') {
      path = '/posts/recommended';
    } else if (params?.sortBy === 'most-liked') {
      path = '/posts/most-liked';
    } else if (params?.sortBy === 'search') {
      path = '/posts/search';
      if (params.search && params.search.trim() !== '') {
        requestParams.query = params.search;
      }
    } else if (params?.sortBy === 'userId' && params?.userId) {
      path = `/posts/by-user/${params.userId}`;
    }

    try {
      const response = await apiClient.get<BlogListResponse>(path, config);
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

  deletePost: async (postId: number): Promise<DeletePostSuccessResponse> => {
    try {
      const response = await apiClient.delete<DeletePostSuccessResponse>(
        `/posts/${postId}`
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
  likePost: async (postId: number): Promise<BlogPost> => {
    try {
      const response = await apiClient.post<BlogPost>(
        `/posts/${postId}/like`,
        {}
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

  getCommentsByPostId: async (
    postId: number
  ): Promise<PostCommentsResponse> => {
    try {
      const response = await apiClient.get<PostCommentsResponse>(
        `/posts/${postId}/comments`
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError: ApiErrorResponse = error.response.data;
        throw new Error(
          apiError.message || `Failed to fetch comments for post ID: ${postId}.`
        );
      } else {
        throw new Error(error.message || 'Failed to connect to server.');
      }
    }
  },
  createComment: async (
    postId: number,
    payload: CreateCommentPayload
  ): Promise<CreateCommentSuccessResponse> => {
    try {
      const response = await apiClient.post<CreateCommentSuccessResponse>(
        `/comments/${postId}`,
        payload
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError: ApiErrorResponse = error.response.data;
        throw new Error(apiError.message || 'Failed to post comment.');
      } else {
        throw new Error(error.message || 'Failed to connect to server.');
      }
    }
  },

  createPost: async (payload: CreatePostPayload): Promise<BlogPost> => {
    try {
      const formData = new FormData();
      formData.append('title', payload.title);
      formData.append('content', payload.content);
      payload.tags.forEach((tag) => formData.append('tags', tag));
      formData.append('image', payload.image);

      const response = await apiClient.post<BlogPost>('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError: ApiErrorResponse = error.response.data;
        throw new Error(apiError.message || 'Failed to create post.');
      } else {
        throw new Error(error.message || 'Failed to connect to server.');
      }
    }
  },
  updatePost: async (
    postId: number,
    payload: UpdatePostPayload
  ): Promise<BlogPost> => {
    try {
      const formData = new FormData();

      if (payload.title !== undefined) {
        formData.append('title', payload.title);
      }
      if (payload.content !== undefined) {
        formData.append('content', payload.content);
      }
      if (payload.tags !== undefined) {
        payload.tags.forEach((tag) => formData.append('tags', tag));
      }
      if (payload.image instanceof File) {
        formData.append('image', payload.image);
      } else if (payload.image === null) {
        formData.append('removeImage', 'true');
      }

      const response = await apiClient.patch<BlogPost>(
        `/posts/${postId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError: ApiErrorResponse = error.response.data;
        throw new Error(
          apiError.message || `Failed to update post ID: ${postId}.`
        );
      } else {
        throw new Error(error.message || 'Failed to connect to server.');
      }
    }
  },
};

export default blogService;
