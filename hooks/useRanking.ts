import { useState, useEffect, useCallback } from 'react';
import {
  rankingService,
  RankingUser,
  UserRankingStats,
  RankingSport,
  RankingPeriod,
} from '../services/ranking.service';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

export function useRanking(
  sport: RankingSport = 'beach-tennis',
  period: RankingPeriod = 'month'
) {
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const limit = 20;

  const fetchRanking = useCallback(
    async (pageNum: number, isLoadMore: boolean = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const data = await rankingService.getRanking(sport, period, pageNum, limit);

        if (isLoadMore) {
          setRanking((prev) => [...prev, ...data]);
        } else {
          setRanking(data);
        }

        setHasMore(data.length >= limit);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [sport, period]
  );

  useEffect(() => {
    setPage(1);
    fetchRanking(1);
  }, [fetchRanking]);

  // Realtime subscription for ranking changes
  useEffect(() => {
    const channel = supabase
      .channel('rankings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rankings',
        },
        (payload) => {
          logger.log('[useRanking] Realtime update:', payload.eventType);
          setPage(1);
          fetchRanking(1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRanking]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    await fetchRanking(nextPage, true);
  }, [page, loadingMore, hasMore, fetchRanking]);

  const refetch = useCallback(async () => {
    setPage(1);
    await fetchRanking(1);
  }, [fetchRanking]);

  return {
    ranking,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
  };
}

export function useUserRankingStats(sport: RankingSport = 'beach-tennis') {
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  const [stats, setStats] = useState<UserRankingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await rankingService.getUserRankingStats(userId, sport);
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId, sport]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export function useNearbyPlayers(sport: RankingSport = 'beach-tennis') {
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  const [players, setPlayers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlayers = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await rankingService.getNearbyRankedPlayers(userId, sport);
      setPlayers(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId, sport]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return { players, loading, error, refetch: fetchPlayers };
}
