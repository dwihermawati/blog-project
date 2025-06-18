import { useQuery } from '@tanstack/react-query';
import userService from '@/services/userService';
import { UserProfileResponse } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';

const useGetUserByEmail = () => {
  const { token, user: authUser } = useAuth();

  const queryResult = useQuery<UserProfileResponse, Error>({
    queryKey: ['user', authUser?.email],
    queryFn: async () => {
      if (!authUser?.email || !token) {
        throw new Error('User email or token is missing for fetching profile.');
      }
      return userService.getUserByEmail(authUser.email, token);
    },
    enabled: !!authUser?.email && !!token,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 60,
  });

  return {
    ...queryResult,
    user: queryResult.data,
  };
};

export default useGetUserByEmail;
