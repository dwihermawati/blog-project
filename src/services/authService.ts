import apiClient from '@/lib/api';
import {
  RegisterPayload,
  RegisterSuccessResponse,
  ApiErrorResponse,
  LoginPayload,
  LoginSuccessResponse,
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

  login: async (payload: LoginPayload): Promise<LoginSuccessResponse> => {
    try {
      const response = await apiClient.post<LoginSuccessResponse>(
        '/auth/login',
        payload
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error('Login failed: Incorrect email or password');
      } else {
        throw new Error(
          error.message || 'Login failed: Failed to connect to server'
        );
      }
    }
  },
};

export default authService;
