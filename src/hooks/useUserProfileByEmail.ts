import { useQuery } from '@tanstack/react-query';
import userService from '@/services/userService';
import { UserProfileResponse } from '@/types/user';

interface UseUserProfileByEmailParams {
  email: string;
  enabled?: boolean;
}

const useUserProfileByEmail = (params: UseUserProfileByEmailParams) => {
  const { email, enabled = true } = params;

  return useQuery<UserProfileResponse, Error>({
    queryKey: ['userProfile', email],
    queryFn: async () => {
      if (!email) {
        throw new Error('User email is missing for fetching profile.');
      }
      return userService.getUserByEmail(email);
    },
    enabled: enabled && !!email,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });
};

export default useUserProfileByEmail;
