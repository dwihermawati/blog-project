import axios from 'axios';
import apiClient from '@/lib/api';
import { ApiErrorResponse } from '@/types/auth';
import { UserProfileResponse } from '@/types/user';

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
};

export default userService;
