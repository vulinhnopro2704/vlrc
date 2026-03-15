import { useQuery } from '@tanstack/react-query';
import { getMe } from '@api/auth-management';

export const AUTH_ME_QUERY_KEY = ['auth', 'me'] as const;

export const useAuthSession = (enabled = true) => {
  const { data, error, isLoading, isSuccess, refetch, status } = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: getMe,
    retry: 0,
    staleTime: 5 * 60 * 1000,
    enabled
  });

  return { data, error, isLoading, isSuccess, status, refetch };
};

export type AuthSession = ReturnType<typeof useAuthSession>;
