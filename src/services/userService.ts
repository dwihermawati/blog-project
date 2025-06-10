import axios from 'axios';
import apiClient from '@/lib/api';
import { ApiErrorResponse } from '@/types/auth';
import {
  ChangePasswordPayload,
  ChangePasswordSuccessResponse,
  UserProfileResponse,
} from '@/types/user';

const userService = {
  getUserByEmail: async (
    email: string,
    token?: string
  ): Promise<UserProfileResponse> => {
    try {
      const response = await apiClient.get<UserProfileResponse>(
        `/users/${email}`,
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

  changePassword: async (
    payload: ChangePasswordPayload,
    token: string
  ): Promise<ChangePasswordSuccessResponse> => {
    try {
      const apiPayload = {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      };

      const response = await apiClient.patch<ChangePasswordSuccessResponse>(
        '/users/password',
        apiPayload,
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
        throw new Error(apiError.message || 'Failed to change password.');
      } else {
        throw new Error(error.message || 'Failed to connect to server.');
      }
    }
  },
};

export default userService;
