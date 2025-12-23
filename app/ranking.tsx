import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInUp
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Share2
} from 'lucide-react-native';
import { Colors } from '../constants';
import { Avatar } from '../components/ui';
import { useRanking, useUserRankingStats } from '../hooks/useRanking';
import { RankingUser, RankingPeriod } from '../services/ranking.service';

const PERIODS = [
  { id: 'week' as RankingPeriod, name: 'Semana' },
  { id: 'month' as RankingPeriod, name: 'Mês' },
  { id: 'year' as RankingPeriod, name: 'Ano' },
  { id: 'all-time' as RankingPeriod, name: 'Geral' },
];

export default function RankingScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<RankingPeriod>('month');
  const [activeTab, setActiveTab] = useState<'normal' | 'pro'>('normal');

  // Hardcoded sport for now, as UI removed the selector. Default to beach-tennis.
  const selectedSport = 'beach-tennis';

  const { ranking, loading, loadingMore, loadMore, refetch } = useRanking(
    selectedSport,
    selectedPeriod
  );

  const { stats } = useUserRankingStats(selectedSport);

  // Filtering for visual demo purposes (Pro users would come from backend)
  const displayRanking = activeTab === 'pro'
    ? ranking.filter((_, i) => i % 2 === 0) // Mock filter for Pro
    : ranking;

  // Podium Logic
  const top1 = displayRanking.find(u => u.rank === 1);
  const top2 = displayRanking.find(u => u.rank === 2);
  const top3 = displayRanking.find(u => u.rank === 3);
  const listRanking = displayRanking.filter(u => u.rank > 3);

  const renderRankingItem = ({ item, index }: { item: RankingUser; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <Pressable
        onPress={() => router.push(`/user/${item.id}`)}
        className="flex-row items-center px-5 py-3 mb-2 mx-4 bg-white/5 rounded-2xl border border-white/10"
      >
        <Text className="text-white font-bold w-8 font-mono text-lg text-center opacity-60">
          {item.rank}
        </Text>

        <View className="mx-3">
          <Avatar fallback={item.name} size="sm" />
        </View>

        <View className="flex-1">
          <Text className="text-white font-bold text-base">{item.name}</Text>
          <Text className="text-neutral-400 text-xs">{item.wins} vitórias ({item.win_rate.toFixed(0)}%)</Text>
        </View>

        <View className="items-end">
          <View className="bg-white/10 px-2 py-1 rounded-lg border border-white/5 mb-1">
            <Text className="font-bold text-white text-xs">{item.points} pts</Text>
          </View>
          {item.trend === 'up' && <TrendingUp size={12} color={Colors.success} />}
          {item.trend === 'down' && <TrendingDown size={12} color={Colors.error} />}
          {item.trend === 'stable' && <Minus size={12} color={Colors.neutral[500]} />}
        </View>
      </Pressable>
    </Animated.View>
  );

  const PodiumStep = ({ user, place }: { user?: RankingUser, place: 1 | 2 | 3 }) => {
    if (!user) return <View className="flex-1 items-center" />;

    const isFirst = place === 1;
    const height = isFirst ? 140 : 110;
    const color = isFirst ? '#FACC15' : place === 2 ? '#94A3B8' : '#B45309';

    return (
      <Animated.View
        entering={FadeInUp.delay(place * 200).springify()}
        className={`flex-1 items-center justify-end ${isFirst ? '-mt-8 z-10' : ''}`}
      >
        <View className="items-center relative mb-2">
          {isFirst && (
            <View className="absolute -top-6">
              <Crown size={24} color="#FACC15" fill="#FACC15" />
            </View>
          )}
          <View className={`rounded-full p-1 border-2`} style={{ borderColor: color }}>
            <Avatar fallback={user.name} size={isFirst ? "lg" : "md"} />
          </View>
          <View className="absolute -bottom-2 bg-neutral-900 rounded-full px-2 py-0.5 border border-white/10">
            <Text className="text-white text-xs font-bold" numberOfLines={1}>
              {user.name.split(' ')[0]}
            </Text>
          </View>
        </View>

        {/* 3D Podium Block */}
        <View
          className="w-full items-center justify-start pt-2 rounded-t-lg bg-white/10 border-t border-x border-white/20 backdrop-blur-md"
          style={{
            height: height,
            backgroundColor: isFirst ? 'rgba(250, 204, 21, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            borderColor: isFirst ? 'rgba(250, 204, 21, 0.3)' : 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <Text className="text-4xl font-black text-white/20">{place}</Text>
          <Text className="text-white font-bold text-sm mt-1">{user.points}</Text>
          <Text className="text-white/50 text-[10px]">pts</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-950">
      <LinearGradient
        colors={['#171717', '#000000']}
        className="absolute w-full h-full"
      />

      {/* Cinematic Header Background Effect */}
      <View className="absolute top-0 w-full h-[500px]">
        <LinearGradient colors={['rgba(250, 204, 21, 0.15)', 'transparent']} className="w-full h-full" />
      </View>

      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Navbar */}
        <View className="flex-row items-center justify-between px-5 py-2">
          <Pressable onPress={() => router.back()} className="w-10 h-10 bg-white/10 rounded-full items-center justify-center backdrop-blur-md">
            <ChevronLeft size={24} color="#FFF" />
          </Pressable>

          <View className="flex-row bg-white/10 rounded-full p-1 border border-white/10">
            <Pressable
              onPress={() => setActiveTab('normal')}
              className={`px-4 py-1.5 rounded-full ${activeTab === 'normal' ? 'bg-white' : ''}`}
            >
              <Text className={`font-bold text-xs ${activeTab === 'normal' ? 'text-black' : 'text-white/60'}`}>RANKING</Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('pro')}
              className={`flex-row items-center px-4 py-1.5 rounded-full ${activeTab === 'pro' ? 'bg-yellow-500' : ''}`}
            >
              <Text className={`font-bold text-xs mr-1 ${activeTab === 'pro' ? 'text-black' : 'text-white/60'}`}>PRO</Text>
              {activeTab !== 'pro' && <Crown size={10} color="#FFFFFF60" />}
            </Pressable>
          </View>

          <Pressable className="w-10 h-10 bg-white/10 rounded-full items-center justify-center backdrop-blur-md">
            <Share2 size={20} color="#FFF" />
          </Pressable>
        </View>

        <FlatList
          data={listRanking}
          keyExtractor={(item) => item.id}
          renderItem={renderRankingItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={loading}
          onRefresh={refetch}
          ListHeaderComponent={
            <View className="mb-6">
              {/* Filters */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-5 mt-4 mb-6">
                {PERIODS.map(p => (
                  <Pressable
                    key={p.id}
                    onPress={() => setSelectedPeriod(p.id)}
                    className={`mr-3 px-4 py-2 rounded-xl border ${selectedPeriod === p.id ? 'bg-white border-white' : 'bg-transparent border-white/20'}`}
                  >
                    <Text className={`font-bold ${selectedPeriod === p.id ? 'text-black' : 'text-white'}`}>{p.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              {/* Podium Section - 3D Effect */}
              <View className="flex-row items-end justify-center px-4 h-[280px]">
                <PodiumStep place={2} user={top2} />
                <PodiumStep place={1} user={top1} />
                <PodiumStep place={3} user={top3} />
              </View>

              {/* Stats Summary Strip */}
              {stats && (
                <View className="mx-4 mt-6 mb-4 flex-row justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                  <View>
                    <Text className="text-white/60 text-xs mb-1">Total Jogadores</Text>
                    <Text className="text-white font-bold text-xl">{stats.total_players}</Text>
                  </View>
                  <View className="h-full w-[1px] bg-white/10" />
                  <View>
                    <Text className="text-white/60 text-xs mb-1">Sua Posição</Text>
                    <Text className="text-yellow-400 font-bold text-xl">#{stats.rank}</Text>
                  </View>
                  <View className="h-full w-[1px] bg-white/10" />
                  <View>
                    <Text className="text-white/60 text-xs mb-1">Pontuação</Text>
                    <Text className="text-white font-bold text-xl">{stats.points}</Text>
                  </View>
                </View>
              )}
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
    </View>
  );
}
