import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { MessageSquare, Bell, Sparkles, Calendar, Clock, MapPin, History } from 'lucide-react-native';
import { FeedTab } from '../../components/social/FeedTab';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MatchService } from '../../services/matchService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUserStore } from '../../stores/useUserStore';
import { useNotifications } from '../../hooks/useNotifications';
import { useRanking } from '../../hooks/useRanking';

// 3D Assets (Assuming they are copied to assets/images/gamification/)
const ASSETS = {
  trophy: require('../../assets/images/gamification/trophy.png'),
  flame: require('../../assets/images/gamification/flame.png'),
  target: require('../../assets/images/gamification/target.png'),
  chart: require('../../assets/images/gamification/chart.png'),
};

const tabs = [
  { id: 'feed', label: 'Feed' },
  { id: 'partidas', label: 'Partidas' },
  { id: 'torneios', label: 'Torneios' },
];

// Stats will be computed dynamically from user profile

const MatchCard = ({ match, onPress }: { match: any; onPress: (id: string) => void }) => {
  // Combine date (YYYY-MM-DD) + start_time (HH:mm:ss) to create full datetime
  const dateStr = match.date || new Date().toISOString().split('T')[0];
  const timeStr = match.start_time || '00:00:00';
  const date = new Date(`${dateStr}T${timeStr}`);
  const courtName = match.courts?.name || 'Local não definido';
  const isFinished = new Date() > date;

  return (
    <TouchableOpacity
      onPress={() => onPress(match.id)}
      activeOpacity={0.7}
      style={styles.matchCardContainer}
    >
      <View style={styles.matchCardContent}>
        {/* Date Box */}
        <View style={styles.dateBox}>
          <Text style={styles.dateMonth}>{format(date, 'MMM', { locale: ptBR })}</Text>
          <Text style={styles.dateDay}>{format(date, 'dd')}</Text>
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sportText} numberOfLines={1}>
            {match.sport || 'Esporte'}
          </Text>
          <View style={styles.detailRow}>
            <Clock size={12} color="#64748B" />
            <Text style={styles.detailText}>
              {format(date, 'HH:mm')} • {match.duration || 60} min
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={12} color="#64748B" />
            <Text style={[styles.detailText, { flex: 1 }]} numberOfLines={1}>
              {courtName}
            </Text>
          </View>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          {isFinished ? (
            <View style={styles.finishedBadge}>
              <Text style={styles.finishedText}>Concluído</Text>
            </View>
          ) : (
            <View style={styles.chatIconContainer}>
              <MessageSquare size={16} color="#FFF" />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function SocialScreen() {
  const [activeTab, setActiveTab] = useState('feed');
  const [matchFilter, setMatchFilter] = useState<'scheduled' | 'history'>('scheduled');
  const [matches, setMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Get real data from stores/hooks
  const { profile } = useUserStore();
  const { unreadCount: unreadNotifications } = useNotifications();
  const { ranking } = useRanking('beach-tennis', 'week');

  // Calculate user's rank position
  const userRank = useMemo(() => {
    if (!profile?.id || !ranking.length) return null;
    const position = ranking.findIndex(p => p.id === profile.id);
    return position >= 0 ? position + 1 : null;
  }, [profile?.id, ranking]);

  // Calculate win rate
  const winRate = useMemo(() => {
    if (!profile?.matches_count || profile.matches_count === 0) return 0;
    return Math.round(((profile.wins || 0) / profile.matches_count) * 100);
  }, [profile?.wins, profile?.matches_count]);

  // Build dynamic stats from real data
  const STATS = useMemo(() => [
    {
      id: 'streak',
      title: `${profile?.streak || 0} Dias`,
      subtitle: 'Sequência',
      icon: ASSETS.flame,
      color: 'rgba(249, 115, 22, 0.1)',
      titleColor: '#EA580C'
    },
    {
      id: 'rank',
      title: userRank ? `#${userRank}` : '-',
      subtitle: 'Ranking',
      icon: ASSETS.trophy,
      color: 'rgba(234, 179, 8, 0.1)',
      titleColor: '#CA8A04'
    },
    {
      id: 'wins',
      title: `${winRate}%`,
      subtitle: 'Vitórias',
      icon: ASSETS.chart,
      color: 'rgba(34, 197, 94, 0.1)',
      titleColor: '#16A34A'
    },
    {
      id: 'level',
      title: `Nv ${profile?.level || 1}`,
      subtitle: 'Nível',
      icon: ASSETS.target,
      color: 'rgba(59, 130, 246, 0.1)',
      titleColor: '#2563EB'
    },
  ], [profile?.streak, profile?.level, userRank, winRate]);

  const fetchMatches = useCallback(async () => {
    try {
      setLoadingMatches(true);
      let data = [];
      if (matchFilter === 'scheduled') {
        data = await MatchService.getUpcoming();
      } else {
        data = await MatchService.getHistory();
      }
      setMatches(data || []);
    } catch (error) {
      console.error('Failed to fetch matches', error);
    } finally {
      setLoadingMatches(false);
    }
  }, [matchFilter]);

  // Fetch matches when the Partidas tab is active or filter changes
  useEffect(() => {
    if (activeTab === 'partidas') {
      fetchMatches();
    }
  }, [activeTab, fetchMatches]);

  const handleMatchPress = (matchId: string) => {
    // Use push specifically for stack navigation
    router.push(`/match/${matchId}` as any);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Premium Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.headerTitle}>Social</Text>
              <Text style={styles.headerSubtitle}>Conecte-se e suba no ranking</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => router.push('/social/create-ai')}
                activeOpacity={0.8}
              >
                <View style={styles.actionButtonDark}>
                  <Sparkles size={18} color="#FFF" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/notifications')}
                activeOpacity={0.8}
              >
                <View style={styles.actionButtonLight}>
                  <Bell size={20} color="#1E293B" />
                  {unreadNotifications > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationText}>
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Gamification Stats Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.statsScroll}
            contentContainerStyle={styles.statsScrollContent}
          >
            {STATS.map((stat, index) => (
              <Animated.View
                key={stat.id}
                entering={FadeInRight.delay(index * 100).springify()}
                style={styles.statCardWrapper}
              >
                <View style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: stat.color }]}>
                    <Image source={stat.icon} style={styles.statIcon} resizeMode="contain" />
                  </View>
                  <View style={styles.statTextContainer}>
                    <Text style={[styles.statTitle, { color: stat.titleColor }]}>{stat.title}</Text>
                    <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </ScrollView>

          {/* Premium Tabs */}
          <View style={styles.tabsContainer}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  style={styles.tabButton}
                >
                  <View style={[styles.tabContent, isActive && styles.activeTabContent]}>
                    <Text style={[styles.tabLabel, isActive ? styles.activeTabLabel : styles.inactiveTabLabel]}>
                      {tab.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {activeTab === 'feed' && (
            <Animated.View entering={FadeInUp.springify()} style={styles.flex1}>
              <FeedTab />
            </Animated.View>
          )}

          {activeTab === 'partidas' && (
            <Animated.View entering={FadeInUp.springify()} style={styles.matchesContainer}>
              {/* Internal Filter: Agendadas vs Historico */}
              <View style={styles.filterContainer}>
                <TouchableOpacity onPress={() => setMatchFilter('scheduled')}>
                  <View style={styles.filterButton}>
                    <Calendar size={16} color={matchFilter === 'scheduled' ? '#0F172A' : '#94A3B8'} />
                    <Text style={[styles.filterText, matchFilter === 'scheduled' ? styles.activeFilterText : styles.inactiveFilterText]}>
                      Agendadas
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMatchFilter('history')}>
                  <View style={styles.filterButton}>
                    <History size={16} color={matchFilter === 'history' ? '#0F172A' : '#94A3B8'} />
                    <Text style={[styles.filterText, matchFilter === 'history' ? styles.activeFilterText : styles.inactiveFilterText]}>
                      Histórico
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {loadingMatches ? (
                <ActivityIndicator size="small" color="#0F172A" style={styles.loader} />
              ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.matchesScrollContent}>
                  {matches.length > 0 ? (
                    matches.map(m => <MatchCard key={m.id} match={m} onPress={handleMatchPress} />)
                  ) : (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateText}>Nenhuma partida encontrada.</Text>
                    </View>
                  )}
                </ScrollView>
              )}
            </Animated.View>
          )}

          {activeTab === 'torneios' && (
            <View style={styles.centerContainer}>
              <Text style={styles.comingSoonText}>Em breve</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900', // black
    color: '#0F172A', // slate-900
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: '#64748B', // slate-500
    fontSize: 14,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonDark: {
    width: 40,
    height: 40,
    backgroundColor: '#0F172A',
    borderRadius: 20, // full
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0F172A',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonLight: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9', // slate-100
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444', // red-500
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  statsScroll: {
    marginBottom: 32,
    overflow: 'visible',
  },
  statsScrollContent: {
    paddingRight: 20,
  },
  statCardWrapper: {
    marginRight: 12,
  },
  statCard: {
    width: 112, // w-28 (28 * 4)
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    height: 128,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
  },
  statTextContainer: {
    alignItems: 'center',
  },
  statTitle: {
    fontWeight: '900',
    fontSize: 20,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#94A3B8', // slate-400
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9', // slate-100
    padding: 4,
    borderRadius: 16,
  },
  tabButton: {
    flex: 1,
  },
  tabContent: {
    paddingVertical: 10,
    borderRadius: 12, // xl
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabContent: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabLabel: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeTabLabel: {
    color: '#0F172A',
  },
  inactiveTabLabel: {
    color: '#94A3B8',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  flex1: {
    flex: 1,
  },
  matchesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterText: {
    fontWeight: 'bold',
  },
  activeFilterText: {
    color: '#0F172A',
  },
  inactiveFilterText: {
    color: '#94A3B8',
  },
  loader: {
    marginTop: 40,
  },
  matchesScrollContent: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#94A3B8',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonText: {
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  // Match Card Styles
  matchCardContainer: {
    marginBottom: 12,
  },
  matchCardContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dateBox: {
    backgroundColor: '#F8FAFC',
    borderColor: '#F1F5F9',
    borderWidth: 1,
    borderRadius: 12,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  dateDay: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  detailsContainer: {
    flex: 1,
  },
  sportText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#64748B',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  finishedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 9999,
  },
  finishedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  chatIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#EFF6FF', // blue-50
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
