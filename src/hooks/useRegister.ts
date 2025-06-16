import { useMutation } from '@tanstack/react-query';
import authService from '@/services/authService';
import {
  ApiErrorResponse,
  RegisterPayload,
  RegisterSuccessResponse,
} from '@/types/auth';

interface RegisterOptions {
  onSuccess?: (data: RegisterSuccessResponse) => void;
  onError?: (error: ApiErrorResponse) => void;
}

const useRegister = (options?: RegisterOptions) => {
  return useMutation<
    RegisterSuccessResponse,
    ApiErrorResponse,
    RegisterPayload
  >({
    mutationFn: authService.register,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Registration failed (hook):', error);
      options?.onError?.(error);
    },
  });
};

export default useRegister;
