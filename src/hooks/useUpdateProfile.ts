import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '@/services/userService';
import { UpdateProfilePayload, UserProfileResponse } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';

interface UseUpdateProfileOptions {
  onSuccess?: (data: UserProfileResponse) => void;
  onError?: (error: Error) => void;
}

const useUpdateProfile = (options?: UseUpdateProfileOptions) => {
  const queryClient = useQueryClient();
  const { token, user: authUser, login } = useAuth();

  return useMutation<UserProfileResponse, Error, UpdateProfilePayload>({
    mutationFn: async (payload) => {
      if (!token)
        throw new Error('You must be logged in to update your profile.');
      return userService.updateProfile(payload, token);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', authUser?.email] });
      if (authUser) {
        login({ token: token as string }, authUser.email, {
          ...authUser,
          name: data.name,
          headline: data.headline,
          avatarUrl: data.avatarUrl,
        });
      }
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Update profile failed:', error);
      options?.onError?.(error);
    },
  });
};

export default useUpdateProfile;
