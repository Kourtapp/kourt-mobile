import { useState, useCallback, useRef } from 'react';

export interface PaginatedResult<T> {
  data: T[];
  loading: boolean;
  loadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  refreshing: boolean;
}

export interface PaginatedQueryOptions<T> {
  fetchFn: (page: number, limit: number) => Promise<T[]>;
  limit?: number;
  initialData?: T[];
}

export function usePaginatedQuery<T>({
  fetchFn,
  limit = 20,
  initialData = [],
}: PaginatedQueryOptions<T>): PaginatedResult<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);

  const fetchData = useCallback(
    async (page: number, isLoadMore = false, isRefresh = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const result = await fetchFn(page, limit);

        if (isLoadMore) {
          setData((prev) => [...prev, ...result]);
        } else {
          setData(result);
        }

        setHasMore(result.length >= limit);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
        isFetchingRef.current = false;
      }
    },
    [fetchFn, limit]
  );

  const refetch = useCallback(async () => {
    pageRef.current = 1;
    await fetchData(1);
  }, [fetchData]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || loading) return;
    pageRef.current += 1;
    await fetchData(pageRef.current, true);
  }, [hasMore, loadingMore, loading, fetchData]);

  const refresh = useCallback(async () => {
    pageRef.current = 1;
    await fetchData(1, false, true);
  }, [fetchData]);

  return {
    data,
    loading,
    loadingMore,
    error,
    hasMore,
    refetch,
    loadMore,
    refresh,
    refreshing,
  };
}

// Hook for infinite scroll with FlatList
export function useInfiniteScroll<T>(
  fetchFn: (page: number, limit: number) => Promise<T[]>,
  limit = 20
) {
  const result = usePaginatedQuery({ fetchFn, limit });

  const flatListProps = {
    onEndReached: result.loadMore,
    onEndReachedThreshold: 0.5,
    refreshing: result.refreshing,
    onRefresh: result.refresh,
  };

  return {
    ...result,
    flatListProps,
  };
}
