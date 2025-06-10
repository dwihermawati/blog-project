import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '@/services/userService';
import {
  ChangePasswordPayload,
  ChangePasswordSuccessResponse,
} from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';

interface UseChangePasswordOptions {
  onSuccess?: (data: ChangePasswordSuccessResponse) => void;
  onError?: (error: Error) => void;
}

const useChangePassword = (options?: UseChangePasswordOptions) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation<
    ChangePasswordSuccessResponse,
    Error,
    ChangePasswordPayload
  >({
    mutationFn: async (payload) => {
      if (!token)
        throw new Error('You must be logged in to change your password.');
      return userService.changePassword(payload, token);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Change password failed:', error);
      options?.onError?.(error);
    },
  });
};

export default useChangePassword;
