import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { coalesceRequests } from '@/lib/performance';

/**
 * Optimized query hook with request coalescing and stale-while-revalidate
 */
export function useOptimizedQuery<T>(
  queryKey: string[],
  fetcher: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T>({
    queryKey,
    queryFn: () => coalesceRequests(queryKey.join(':'), fetcher),
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
}
