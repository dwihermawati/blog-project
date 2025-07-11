import axios from 'axios';
import apiClient from '@/lib/api';
import { ApiErrorResponse } from '@/types/auth';
import {
  ChangePasswordPayload,
  ChangePasswordSuccessResponse,
  UpdateProfilePayload,
  UserProfileResponse,
} from '@/types/user';

const userService = {
  getUserByEmail: async (email: string): Promise<UserProfileResponse> => {
    try {
      const response = await apiClient.get<UserProfileResponse>(
        `/users/by-email/${email}`
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError: ApiErrorResponse = error.response.data;
        throw new Error(
          apiError.message || `Failed to fetch user data: ${email}`
        );
      } else {
        throw new Error(
          error.message ||
            'Failed to retrieve user data: Failed to connect to server'
        );
      }
    }
  },

  getUserById: async (id: number): Promise<UserProfileResponse> => {
    try {
      const response = await apiClient.get<UserProfileResponse>(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError: ApiErrorResponse = error.response.data;
        throw new Error(apiError.message || `Failed to fetch user data: ${id}`);
      } else {
        throw new Error(
          error.message ||
            'Failed to retrieve user data: Failed to connect to server'
        );
      }
    }
  },

  changePassword: async (
    payload: ChangePasswordPayload
  ): Promise<ChangePasswordSuccessResponse> => {
    try {
      const apiPayload = {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
        confirmPassword: payload.confirmPassword,
      };

      const response = await apiClient.patch<ChangePasswordSuccessResponse>(
        '/users/password',
        apiPayload
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError: ApiErrorResponse = error.response.data;
        throw new Error(apiError.message || 'Failed to change password.');
      } else {
        throw new Error(error.message || 'Failed to connect to server.');
      }
    }
  },

  updateProfile: async (
    payload: UpdateProfilePayload
  ): Promise<UserProfileResponse> => {
    try {
      const formData = new FormData();
      if (payload.name !== undefined) {
        formData.append('name', payload.name);
      }
      if (payload.headline !== undefined) {
        formData.append('headline', payload.headline || '');
      }
      if (payload.avatar) {
        formData.append('avatar', payload.avatar);
      }

      const response = await apiClient.patch<UserProfileResponse>(
        '/users/profile',
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
        throw new Error(apiError.message || 'Failed to update profile.');
      } else {
        throw new Error(error.message || 'Failed to connect to server.');
      }
    }
  },
};

export default userService;
