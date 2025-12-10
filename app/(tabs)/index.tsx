import { ScrollView, View, RefreshControl, Text } from 'react-native';
import { router } from 'expo-router';
import { useState, useCallback } from 'react';

import { HomeHeader } from '@/components/home/HomeHeader';
import { SportPills } from '@/components/home/SportPills';
import { GamificationCard } from '@/components/home/GamificationCard';
import { DailyChallenge } from '@/components/home/DailyChallenge';
import { CourtCard } from '@/components/home/CourtCard';
import { OpenMatchCard } from '@/components/home/OpenMatchCard';
import { SectionHeader } from '@/components/home/SectionHeader';

import { useUserStore } from '@/stores/useUserStore';
import { useCourts } from '@/hooks/useCourts';
import { useMatches } from '@/hooks/useMatches';

export default function HomeScreen() {
  const { profile } = useUserStore();
  const [selectedSport, setSelectedSport] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const { nearbyCourts, refetch: refetchCourts } = useCourts();
  const { openMatches, refetch: refetchMatches } = useMatches();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchCourts(), refetchMatches()]);
    setRefreshing(false);
  }, [refetchCourts, refetchMatches]);

  return (
    <View className="flex-1 bg-[#fafafa]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <HomeHeader
          userName={profile?.name || 'Jogador'}
          location={profile?.location || 'São Paulo, SP'}
          unreadNotifications={3}
        />

        {/* Sport Pills */}
        <SportPills
          sports={profile?.sports || []}
          selectedSport={selectedSport}
          onSelect={setSelectedSport}
        />

        {/* Gamification */}
        <GamificationCard
          level={profile?.level || 1}
          xp={profile?.xp || 0}
          xpToNextLevel={profile?.xp_to_next_level || 1000}
          streak={profile?.streak || 0}
          wins={profile?.wins || 0}
          isPro={profile?.is_pro || false}
        />

        {/* Daily Challenge */}
        <DailyChallenge
          title="Jogue 2 partidas hoje!"
          xpReward={150}
          progress={1}
          total={2}
        />

        {/* Quadras Próximas */}
        <SectionHeader
          icon="near-me"
          title="Quadras perto de você"
          subtitle="Baseado na sua localização atual"
          onActionPress={() => router.push('/(tabs)/map')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 8 }}
        >
          {nearbyCourts.map((court) => (
            <CourtCard
              key={court.id}
              court={court}
              onPress={() => router.push(`/court/${court.id}` as any)}
            />
          ))}
        </ScrollView>

        {/* Partidas Abertas */}
        <View className="mt-5">
          <SectionHeader
            icon="sports-tennis"
            title="Partidas abertas"
            onActionPress={() => router.push('/matches' as any)}
          />
          <View className="px-5 mb-2">
            <View className="flex-row items-center gap-1.5 px-3 py-1.5 bg-lime-100 rounded-full self-start">
              <View className="w-2 h-2 bg-lime-500 rounded-full" />
              <Text className="text-xs text-lime-700 font-medium">
                {openMatches.length} partidas precisando de jogadores
              </Text>
            </View>
          </View>
          <View className="px-5">
            {openMatches.slice(0, 3).map((match) => (
              <OpenMatchCard
                key={match.id}
                match={match}
                onJoin={() => router.push(`/match/${match.id}` as any)}
              />
            ))}
          </View>
        </View>

        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
