import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';

function useDebouncedQuery<TData, TError>(
  queryKey: string | readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: UseQueryOptions<TData, TError>,
  delay: number = 1000
): UseQueryResult<TData, TError> {
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldFetch(true), delay);
    return () => clearTimeout(timer);
  }, [queryKey, delay]);

  return useQuery(queryKey, queryFn, {
    ...options,
    enabled: shouldFetch && options?.enabled !== false,
  });
}

export default useDebouncedQuery;