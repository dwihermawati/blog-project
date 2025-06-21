import { useQuery } from '@tanstack/react-query';
import userService from '@/services/userService';
import { UserProfileResponse } from '@/types/user';

interface UseGetUserProfileByIdParams {
  id: number;
  enabled?: boolean;
}

const useGetUserProfileById = (params: UseGetUserProfileByIdParams) => {
  const { id, enabled = true } = params;

  return useQuery<UserProfileResponse, Error>({
    queryKey: ['userProfile', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('User ID is missing for fetching profile.');
      }
      return userService.getUserById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });
};

export default useGetUserProfileById;
