import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Medal,
  Target,
  Flame,
} from 'lucide-react-native';
import { Colors } from '../constants';
import { Avatar, Badge } from '../components/ui';
import { useRanking, useUserRankingStats } from '../hooks/useRanking';
import { RankingUser, RankingSport, RankingPeriod } from '../services/ranking.service';

const SPORTS = [
  { id: 'beach-tennis' as RankingSport, name: 'Beach Tennis', emoji: '🎾' },
  { id: 'padel' as RankingSport, name: 'Padel', emoji: '🎾' },
  { id: 'tennis' as RankingSport, name: 'Tênis', emoji: '🎾' },
  { id: 'futevolei' as RankingSport, name: 'Futevôlei', emoji: '⚽' },
  { id: 'volleyball' as RankingSport, name: 'Vôlei', emoji: '🏐' },
];

const PERIODS = [
  { id: 'week' as RankingPeriod, name: 'Semana' },
  { id: 'month' as RankingPeriod, name: 'Mês' },
  { id: 'year' as RankingPeriod, name: 'Ano' },
  { id: 'all-time' as RankingPeriod, name: 'Geral' },
];

export default function RankingScreen() {
  const router = useRouter();
  const [selectedSport, setSelectedSport] = useState<RankingSport>('beach-tennis');
  const [selectedPeriod, setSelectedPeriod] = useState<RankingPeriod>('month');

  const { ranking, loading, loadingMore, loadMore, refetch } = useRanking(
    selectedSport,
    selectedPeriod
  );
  const { stats } = useUserRankingStats(selectedSport);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={14} color={Colors.success} />;
      case 'down':
        return <TrendingDown size={14} color={Colors.error} />;
      default:
        return <Minus size={14} color={Colors.neutral[400]} />;
    }
  };

  const getRankChange = (current: number, previous: number) => {
    const diff = previous - current;
    if (diff > 0) return `+${diff}`;
    if (diff < 0) return `${diff}`;
    return '-';
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <View className="w-8 h-8 bg-yellow-400 rounded-full items-center justify-center">
          <Trophy size={16} color="#fff" />
        </View>
      );
    }
    if (rank === 2) {
      return (
        <View className="w-8 h-8 bg-neutral-400 rounded-full items-center justify-center">
          <Medal size={16} color="#fff" />
        </View>
      );
    }
    if (rank === 3) {
      return (
        <View className="w-8 h-8 bg-amber-600 rounded-full items-center justify-center">
          <Medal size={16} color="#fff" />
        </View>
      );
    }
    return (
      <View className="w-8 h-8 bg-neutral-100 rounded-full items-center justify-center">
        <Text className="font-bold text-neutral-600">{rank}</Text>
      </View>
    );
  };

  const renderUserItem = ({ item, index }: { item: RankingUser; index: number }) => {
    const isTopThree = item.rank <= 3;

    return (
      <Pressable
        onPress={() => router.push(`/user/${item.id}`)}
        className={`flex-row items-center px-5 py-4 ${
          isTopThree ? 'bg-amber-50' : 'bg-white'
        } border-b border-neutral-50`}
      >
        {getRankBadge(item.rank)}

        <View className="ml-3">
          <Avatar fallback={item.name} size="md" />
        </View>

        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text className="font-semibold text-black">{item.name}</Text>
            <Badge variant="outline" className="ml-2">
              {item.level}
            </Badge>
          </View>
          <View className="flex-row items-center mt-1">
            <Text className="text-xs text-neutral-500">
              {item.wins}V - {item.losses}D
            </Text>
            <Text className="text-xs text-neutral-400 mx-2">•</Text>
            <Text className="text-xs text-neutral-500">{item.win_rate.toFixed(0)}% vitórias</Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="font-bold text-black">{item.points.toLocaleString()}</Text>
          <View className="flex-row items-center mt-1">
            {getTrendIcon(item.trend)}
            <Text
              className={`text-xs ml-1 ${
                item.trend === 'up'
                  ? 'text-success'
                  : item.trend === 'down'
                  ? 'text-error'
                  : 'text-neutral-400'
              }`}
            >
              {getRankChange(item.rank, item.previous_rank)}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Sport Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        className="py-4 border-b border-neutral-100"
      >
        {SPORTS.map((sport) => (
          <Pressable
            key={sport.id}
            onPress={() => setSelectedSport(sport.id)}
            className={`flex-row items-center px-4 py-2 rounded-full border ${
              selectedSport === sport.id
                ? 'bg-black border-black'
                : 'bg-white border-neutral-200'
            }`}
          >
            <Text className="mr-1">{sport.emoji}</Text>
            <Text
              className={selectedSport === sport.id ? 'text-white' : 'text-neutral-700'}
            >
              {sport.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Period Selector */}
      <View className="flex-row px-5 py-3 gap-2 border-b border-neutral-100">
        {PERIODS.map((period) => (
          <Pressable
            key={period.id}
            onPress={() => setSelectedPeriod(period.id)}
            className={`flex-1 py-2 rounded-lg items-center ${
              selectedPeriod === period.id ? 'bg-black' : 'bg-neutral-100'
            }`}
          >
            <Text
              className={`font-medium ${
                selectedPeriod === period.id ? 'text-white' : 'text-neutral-600'
              }`}
            >
              {period.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* User Stats Card */}
      {stats && (
        <View className="mx-5 mt-4 p-4 bg-gradient-to-r from-black to-neutral-800 rounded-2xl">
          <Text className="text-white/70 text-sm mb-2">Sua posição</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-4xl font-bold text-white">#{stats.rank}</Text>
              <Text className="text-white/50 text-lg ml-2">/ {stats.total_players}</Text>
            </View>
            <View className="items-end">
              <Text className="text-white font-bold text-xl">
                {stats.points.toLocaleString()}
              </Text>
              <Text className="text-white/70 text-xs">pontos</Text>
            </View>
          </View>

          <View className="flex-row mt-4 pt-4 border-t border-white/10">
            <View className="flex-1 items-center">
              <View className="flex-row items-center">
                <Target size={14} color={Colors.success} />
                <Text className="text-white font-bold ml-1">{stats.wins}</Text>
              </View>
              <Text className="text-white/50 text-xs mt-1">Vitórias</Text>
            </View>
            <View className="flex-1 items-center">
              <View className="flex-row items-center">
                <Target size={14} color={Colors.error} />
                <Text className="text-white font-bold ml-1">{stats.losses}</Text>
              </View>
              <Text className="text-white/50 text-xs mt-1">Derrotas</Text>
            </View>
            <View className="flex-1 items-center">
              <View className="flex-row items-center">
                <Flame size={14} color={Colors.warning} />
                <Text className="text-white font-bold ml-1">{stats.current_streak}</Text>
              </View>
              <Text className="text-white/50 text-xs mt-1">Sequência</Text>
            </View>
            <View className="flex-1 items-center">
              <View className="flex-row items-center">
                <Trophy size={14} color="#FFD700" />
                <Text className="text-white font-bold ml-1">#{stats.best_rank}</Text>
              </View>
              <Text className="text-white/50 text-xs mt-1">Melhor</Text>
            </View>
          </View>
        </View>
      )}

      <View className="px-5 py-4">
        <Text className="font-semibold text-black">Ranking Geral</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-neutral-100">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 bg-neutral-100 rounded-full items-center justify-center mr-4"
          >
            <ChevronLeft size={24} color={Colors.primary} />
          </Pressable>
          <Text className="text-xl font-bold text-black">Ranking</Text>
        </View>
        <View className="flex-row items-center">
          <Trophy size={24} color={Colors.warning} />
        </View>
      </View>

      <FlatList
        data={ranking}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={loading}
        onRefresh={refetch}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Trophy size={48} color={Colors.neutral[300]} />
            <Text className="text-lg font-semibold text-neutral-700 mt-4">
              {loading ? 'Carregando...' : 'Nenhum ranking disponível'}
            </Text>
            <Text className="text-neutral-500 mt-1">
              Os rankings aparecerão aqui
            </Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View className="py-4 items-center">
              <Text className="text-neutral-500">Carregando mais...</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
