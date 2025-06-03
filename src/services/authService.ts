import apiClient from '@/lib/api';
import {
  RegisterPayload,
  RegisterSuccessResponse,
  ApiErrorResponse,
} from '@/types/auth';
import axios from 'axios';

const authService = {
  register: async (
    payload: RegisterPayload
  ): Promise<RegisterSuccessResponse> => {
    try {
      const response = await apiClient.post<RegisterSuccessResponse>(
        '/auth/register',
        payload
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError: ApiErrorResponse = error.response.data;
        throw new Error(
          apiError.message || 'Registration failed: A server error occurred'
        );
      } else {
        throw new Error(
          error.message || 'Registration failed: Failed to connect to server'
        );
      }
    }
  },
};

export default authService;
