import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import apiService from '../services/api';
import { Repository } from '../types';

export const useRepositories = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery<Repository[], Error>({
    queryKey: ['repositories', token],
    queryFn: async () => {
      if (!token) {
        throw new Error('No authentication token');
      }
      return apiService.getRepositories(token);
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
