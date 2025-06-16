import { useMutation } from '@tanstack/react-query';
import authService from '@/services/authService';
import { LoginPayload, LoginSuccessResponse } from '@/types/auth';

interface LoginOptions {
  onSuccess?: (data: LoginSuccessResponse, variables: LoginPayload) => void;
  onError?: (error: Error) => void;
}

const useLogin = (options?: LoginOptions) => {
  return useMutation<LoginSuccessResponse, Error, LoginPayload>({
    mutationFn: authService.login,
    onSuccess: (data, variables) => {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userEmail', variables.email);

      options?.onSuccess?.(data, variables);
    },
    onError: (error) => {
      console.error('Login failed (hook):', error);
      options?.onError?.(error);
    },
  });
};

export default useLogin;
