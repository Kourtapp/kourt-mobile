import { ScrollView, View, RefreshControl, Text } from 'react-native';
import { router } from 'expo-router';
import { useState, useCallback } from 'react';

import { HomeHeader } from '@/components/home/HomeHeader';
import { LevelCard } from '@/components/home/LevelCard';
import { DailyChallenge } from '@/components/home/DailyChallenge';
import { CourtCard } from '@/components/home/CourtCard';
import { SectionHeader } from '@/components/home/SectionHeader';
import { LiveGamesList } from '@/components/home/LiveGameCard';
import { ProgressCard } from '@/components/home/ProgressCard';
import { UserSuggestionsList } from '@/components/home/UserSuggestionCard';
import { InvitesList } from '@/components/home/InviteCard';
import { DiscoverSports } from '@/components/home/DiscoverSports';
import { WeeklyRanking } from '@/components/home/WeeklyRanking';

import { useUserStore } from '@/stores/useUserStore';
import { useCourts } from '@/hooks/useCourts';
import { useMatches } from '@/hooks/useMatches';

// Mock data for new sections
const mockLiveGames = [
  { id: '1', sport: 'BeachTennis', time: '18:00', venue: 'Arena Ibirapuera', spotsLeft: 1, sportIcon: 'beachtennis' as const },
  { id: '2', sport: 'Society', time: '19:30', venue: 'Arena Soccer', spotsLeft: 3, sportIcon: 'soccer' as const },
  { id: '3', sport: 'Basquete 3x3', time: '20:00', venue: 'SESC Consolação', spotsLeft: 2, sportIcon: 'basketball' as const },
];

const mockUserSuggestions = [
  { id: '1', name: 'Lucas M.', sport: 'BeachTennis', reason: 'Nível similar', isOnline: true, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&q=80' },
  { id: '2', name: 'Ana C.', sport: 'BeachTennis', reason: 'Por perto', isOnline: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&q=80' },
  { id: '3', name: 'Pedro S.', sport: 'Padel', reason: 'Contato', isOnline: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&q=80' },
];

const mockInvites = [
  {
    id: '1',
    senderName: 'Pedro Ferreira',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&q=80',
    message: 'Falta 1 pra fechar! Quem topa?',
    venue: 'Arena BeachClub',
    dateTime: 'Hoje, 19:00',
    participants: [{ id: '1' }, { id: '2' }, { id: '3' }],
    maxParticipants: 4,
    likes: 24,
    comments: 5,
  },
];

// Mock courts for different sections
// Mock courts for different sections
const mockBestCourts = [
  { id: 'b1', name: 'Arena BeachPremium', type: 'private' as const, sport: 'BeachTennis', distance: '2.5 km', rating: 4.9, price: 120, rank: '#1 Beach', image: 'https://images.unsplash.com/photo-1610419846569-450cb05cae1a?q=80&w=800', images: ['https://images.unsplash.com/photo-1610419846569-450cb05cae1a?q=80&w=800', 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?q=80&w=800'] },
  { id: 'b2', name: 'Club Padel SP', type: 'private' as const, sport: 'Padel', distance: '3.1 km', rating: 4.8, price: 100, rank: '#2 Padel', image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800', images: ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800', 'https://images.unsplash.com/photo-1622345579974-95844439c2c5?q=80&w=800'] },
];

const mockRecommendedCourts = [
  { id: 'r1', name: 'Quadra do Carlos', type: 'private' as const, sport: 'BeachTennis', distance: '1.2 km', rating: 5.0, price: 80, matchPercent: 92, image: 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?q=80&w=800', images: ['https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?q=80&w=800', 'https://images.unsplash.com/photo-1617693322135-1383c4e72320?q=80&w=800'] },
  { id: 'r2', name: 'BeachArena Premium', type: 'private' as const, sport: 'BeachTennis', distance: '2.0 km', rating: 4.7, price: 90, matchPercent: 87, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800', images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800', 'https://images.unsplash.com/photo-1599582298687-d86b85642674?q=80&w=800'] },
  { id: 'r3', name: 'Padel Zone', type: 'private' as const, sport: 'Padel', distance: '5.0 km', rating: 4.6, price: 110, matchPercent: 95, image: 'https://images.unsplash.com/photo-1622345579974-95844439c2c5?q=80&w=800', images: ['https://images.unsplash.com/photo-1622345579974-95844439c2c5?q=80&w=800', 'https://images.unsplash.com/photo-1554068865-2484cd13263b?q=80&w=800'] },
];

const mockPopularCourts = [
  { id: 'p1', name: 'Parque Villa-Lobos', type: 'public' as const, sport: 'BeachTennis', distance: '4.2 km', rating: 4.5, price: null, currentPlayers: 24, isCrowded: true, image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800', images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800', 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=800'] },
  { id: 'p2', name: 'Arena Beach Moema', type: 'public' as const, sport: 'BeachTennis', distance: '1.2 km', rating: 4.8, price: null, currentPlayers: 18, isCrowded: false, image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=800', images: ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=800', 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800'] },
  { id: 'p3', name: 'Quadra do Parque', type: 'public' as const, sport: 'Basquete', distance: '1.5 km', rating: 4.2, price: null, currentPlayers: 12, isCrowded: false, image: 'https://images.unsplash.com/photo-1546519638-68e109498ad0?q=80&w=800', images: ['https://images.unsplash.com/photo-1546519638-68e109498ad0?q=80&w=800', 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?q=80&w=800'] },
];

const mockSportsToDiscover = [
  { id: 's1', name: 'Padel', emoji: '🎾', playersCount: 12500, color: '#DBEAFE' },
  { id: 's2', name: 'Futevôlei', emoji: '⚽', playersCount: 8300, color: '#FEF3C7' },
  { id: 's3', name: 'Vôlei de Praia', emoji: '🏐', playersCount: 9800, color: '#DCFCE7' },
  { id: 's4', name: 'Basquete 3x3', emoji: '🏀', playersCount: 5200, color: '#FFE4E6' },
];

const mockRankingPlayers = [
  { id: 'rp1', rank: 1, name: 'Carlos Silva', sport: 'BeachTennis', points: 2850, change: 'same' as const, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&q=80' },
  { id: 'rp2', rank: 2, name: 'Marina Santos', sport: 'BeachTennis', points: 2720, change: 'up' as const, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&q=80' },
  { id: 'rp3', rank: 3, name: 'João Pedro', sport: 'BeachTennis', points: 2680, change: 'down' as const, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&q=80' },
  { id: 'rp4', rank: 4, name: 'Ana Beatriz', sport: 'BeachTennis', points: 2540, change: 'up' as const, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&q=80' },
  { id: 'rp5', rank: 5, name: 'Lucas Oliveira', sport: 'BeachTennis', points: 2450, change: 'same' as const, avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&q=80' },
];

export default function HomeScreen() {
  const { profile } = useUserStore();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { nearbyCourts, refetch: refetchCourts } = useCourts();
  const { openMatches, refetch: refetchMatches } = useMatches();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchCourts(), refetchMatches()]);
    setRefreshing(false);
  }, [refetchCourts, refetchMatches]);

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with search and filters */}
        <HomeHeader
          location={profile?.location || 'São Paulo'}
          unreadNotifications={5}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchPress={() => router.push('/search')}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
        />

        {/* Level Card - Gamification */}
        <LevelCard
          level={12}
          xp={2450}
          xpToNextLevel={3000}
          streak={7}
          wins={165}
          isPro={true}
          onViewAchievements={() => router.push('/achievements' as any)}
        />

        {/* Daily Challenge */}
        <DailyChallenge
          title="Jogue 2 partidas hoje para completar o desafio!"
          xpReward={150}
          progress={1}
          total={2}
        />

        {/* Quadras Próximas */}
        <View style={{ marginTop: 24 }}>
          <SectionHeader
            icon="near-me"
            title="Quadras perto de você"
            subtitle="Baseado na sua localização atual"
            actionText="Ver mapa"
            onActionPress={() => router.push('/(tabs)/map')}
          />
          {/* Row 1 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 12 }}
          >
            {nearbyCourts.map((court) => (
              <CourtCard
                key={`r1-${court.id}`}
                court={court}
                onPress={() => router.push(`/court/${court.id}` as any)}
              />
            ))}
          </ScrollView>

          {/* Row 2 */}
          <View style={{ marginTop: 12 }}>
            <SectionHeader
              title="Explore mais opções"
              subtitle="Outras quadras excelentes na sua região"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 8 }}
            >
              {[...nearbyCourts].reverse().map((court) => (
                <CourtCard
                  key={`r2-${court.id}`}
                  court={court}
                  onPress={() => router.push(`/court/${court.id}` as any)}
                />
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Sugestões de Jogadores */}
        <UserSuggestionsList
          users={mockUserSuggestions}
          onViewAll={() => router.push('/suggestions' as any)}
          onInvite={(id) => console.log('Invite', id)}
        />

        {/* Melhores da Região (NOVO) */}
        <View style={{ marginTop: 12 }}>
          <SectionHeader
            icon="star"
            title="Melhores de São Paulo"
            subtitle="As quadras mais bem avaliadas da região"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 8 }}
          >
            {mockBestCourts.map((court) => (
              <CourtCard
                key={court.id}
                court={court}
                onPress={() => router.push(`/court/${court.id}` as any)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Convites para você */}
        <InvitesList
          invites={mockInvites}
          onViewAll={() => router.push('/invites' as any)}
          onJoin={(id) => console.log('Join invite', id)}
        />

        {/* Recomendado para você (NOVO) */}
        <View style={{ marginTop: 12 }}>
          <SectionHeader
            icon="thumb-up"
            title="Recomendado para você"
            subtitle="Com base no seu histórico de jogos"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 8 }}
          >
            {mockRecommendedCourts.map((court) => (
              <CourtCard
                key={court.id}
                court={court}
                onPress={() => router.push(`/court/${court.id}` as any)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Jogos Acontecendo */}
        <LiveGamesList
          games={mockLiveGames}
          onViewAll={() => router.push('/games' as any)}
          onJoinGame={(id) => console.log('Join game', id)}
        />

        {/* Populares Agora (NOVO) */}
        <View style={{ marginTop: 0 }}>
          <SectionHeader
            icon="trending-up"
            title="Populares agora"
            subtitle="Quadras com maior movimento neste momento"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 8 }}
          >
            {mockPopularCourts.map((court) => (
              <CourtCard
                key={court.id}
                court={court}
                onPress={() => router.push(`/court/${court.id}` as any)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Seu Progresso */}
        <ProgressCard
          level={12}
          xp={2450}
          xpToNextLevel={3000}
          totalMatches={127}
          winRate={68}
          streak={12}
        />

        {/* Descubra Novos Esportes */}
        <DiscoverSports
          sports={mockSportsToDiscover}
          onSelectSport={(id) => console.log('Select sport', id)}
        />

        {/* Ranking Semanal */}
        <WeeklyRanking
          players={mockRankingPlayers}
          onViewAll={() => router.push('/ranking' as any)}
          onPlayerPress={(id) => router.push(`/user/${id}` as any)}
        />

        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
