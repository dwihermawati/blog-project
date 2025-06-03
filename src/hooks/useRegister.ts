import { useMutation } from '@tanstack/react-query';
import authService from '@/services/authService';
import { RegisterPayload } from '@/types/auth';

interface RegisterOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const useRegister = (options?: RegisterOptions) => {
  return useMutation<any, Error, RegisterPayload>({
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
