import { ScrollView, View, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useState, useCallback, useEffect } from 'react';

import { HomeHeader } from '@/components/home/HomeHeader';
import { LevelCard } from '@/components/home/LevelCard';
import { DailyChallenge } from '@/components/home/DailyChallenge';
import { ProgressCard } from '../../components/home/ProgressCard';
import { UserSuggestionsList } from '../../components/home/UserSuggestionCard';
import { WeeklyRanking } from '../../components/home/WeeklyRanking';
import { LocationPickerSheet } from '../../components/ui/LocationPickerSheet';
import HomeCategories from '../../components/HomeCategories';
import { QuadrasContent, MatchsContent, TorneiosContent, ProfissionaisContent } from '../../components/home/categories';

import { useUserStore } from '../../stores/useUserStore';
import { useCourts } from '../../hooks/useCourts';
import { useMatches } from '../../hooks/useMatches';
import { useInvites } from '../../hooks/useInvites';
import { useRanking } from '../../hooks/useRanking';
import { useSuggestions } from '../../hooks/useSuggestions';
import { useNotifications } from '../../hooks/useNotifications';


export default function HomeScreen() {
  const { profile, syncLocation, updateProfile } = useUserStore();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('quadras');

  const handleLocationSelect = (location: string) => {
    if (profile) {
      updateProfile({ location });
    }
  };

  const { nearbyCourts, featuredCourts, refetch: refetchCourts } = useCourts();
  const { refetch: refetchMatches } = useMatches();
  const { invites, refetch: refetchInvites } = useInvites();
  const { suggestions, refetch: refetchSuggestions, followUser } = useSuggestions();
  const { ranking: rankingPlayers, refetch: refetchRanking } = useRanking('beach-tennis', 'week');
  const { unreadCount: unreadNotifications, refetch: refetchNotifications } = useNotifications();

  // Auto-sync location on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile?.name === 'Maestro User') {
        console.log('🏠 [Home] Skipping syncLocation for Maestro User');
        return;
      }
      console.log('🏠 [Home] Calling syncLocation...');
      syncLocation();
    }, 1500);
    return () => clearTimeout(timer);
  }, [syncLocation, profile?.name]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchCourts(),
      refetchMatches(),
      refetchInvites(),
      refetchSuggestions(),
      refetchRanking(),
      refetchNotifications(),
      syncLocation()
    ]);
    setRefreshing(false);
  }, [refetchCourts, refetchMatches, refetchInvites, refetchSuggestions, refetchRanking, refetchNotifications, syncLocation]);

  const handleCategoryToggle = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev => {
        if (prev.includes(categoryId)) {
          return prev.filter(c => c !== categoryId);
        } else {
          return [...prev, categoryId];
        }
      });
    }
  };

  return (
    <View className="flex-1 bg-[#fafafa]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with search and filters */}
        <HomeHeader
          location={profile?.location || 'São Paulo, SP'}
          onLocationPress={() => setShowLocationPicker(true)}
          unreadNotifications={unreadNotifications}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchPress={() => router.push('/search')}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
        />

        {/* Categories - Quadras, Matchs, Torneios, Profissionais */}
        <HomeCategories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Daily Challenge - Only on Quadras */}
        {selectedCategory === 'quadras' && (
          <DailyChallenge
            title="Jogue 2 partidas hoje e ganhe bônus de XP!"
            xpReward={150}
            progress={0}
            total={2}
          />
        )}

        {/* Category Content */}
        {selectedCategory === 'quadras' && (
          <QuadrasContent nearbyCourts={nearbyCourts} featuredCourts={featuredCourts} />
        )}

        {selectedCategory === 'matchs' && (
          <>
            <MatchsContent matches={invites as any} />
            {/* Sugestões de Jogadores - também em Matchs */}
            {suggestions.length > 0 && (
              <UserSuggestionsList
                users={suggestions}
                onViewAll={() => router.push('/suggestions' as any)}
                onFollow={(id) => followUser(id)}
                onUserPress={(id) => router.push(`/user/${id}` as any)}
              />
            )}
          </>
        )}

        {selectedCategory === 'torneios' && (
          <TorneiosContent />
        )}

        {selectedCategory === 'profissionais' && (
          <ProfissionaisContent />
        )}

        {/* Gamification Section - Only on Quadras tab */}
        {selectedCategory === 'quadras' && (
          <>
            {/* Level Card */}
            <View style={{ marginTop: 24 }}>
              <LevelCard
                level={profile?.level || 1}
                xp={profile?.xp || 0}
                xpToNextLevel={profile?.xp_to_next_level || 1000}
                streak={profile?.streak || 0}
                wins={profile?.wins || 0}
                isPro={profile?.is_pro || false}
                onViewAchievements={() => router.push('/achievements' as any)}
              />
            </View>

            {/* Sugestões de Jogadores */}
            {suggestions.length > 0 && (
              <UserSuggestionsList
                users={suggestions}
                onViewAll={() => router.push('/suggestions' as any)}
                onFollow={(id) => followUser(id)}
                onUserPress={(id) => router.push(`/user/${id}` as any)}
              />
            )}

            {/* Seu Progresso */}
            <ProgressCard
              level={profile?.level || 1}
              xp={profile?.xp || 0}
              xpToNextLevel={profile?.xp_to_next_level || 1000}
              totalMatches={profile?.matches_count || 0}
              winRate={profile?.wins && profile?.matches_count ? Math.round((profile.wins / profile.matches_count) * 100) : 0}
              streak={profile?.streak || 0}
            />

            {/* Ranking Semanal */}
            {rankingPlayers.length > 0 && (
              <WeeklyRanking
                players={rankingPlayers.slice(0, 5).map(p => ({
                  id: p.id,
                  rank: p.rank,
                  name: p.name,
                  avatar: (p as any).avatar_url || (p as any).avatar,
                  sport: p.sport === 'beach-tennis' ? 'Beach Tennis' : p.sport,
                  points: p.points,
                  change: ((p as any).trend === 'stable' ? 'same' : (p as any).trend) || (p as any).change || 'same',
                }))}
                onViewAll={() => router.push('/ranking' as any)}
                onPlayerPress={(id) => router.push(`/user/${id}` as any)}
              />
            )}
          </>
        )}

        <View className="h-24" />
      </ScrollView>

      {/* Location Picker Bottom Sheet */}
      <LocationPickerSheet
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelectLocation={handleLocationSelect}
        currentLocation={profile?.location}
      />
    </View>
  );
}
