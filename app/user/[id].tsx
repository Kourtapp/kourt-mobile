import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  MoreHorizontal,
  Flag,
  Ban,
  Hand,
  MapPin,
  Zap,
  Target,
  ChevronRight,
} from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface UserProfile {
  id: string;
  name: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  level?: number;
  xp?: number;
  favorite_sports?: string[];
  wins?: number;
  losses?: number;
  matches_played?: number;
  is_verified?: boolean;
  is_pro?: boolean;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  preferred_hand?: string;
  court_position?: string;
  play_style?: string;
}

export default function UserProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user: currentUser } = useAuthStore();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [activeTab, setActiveTab] = useState<'activities' | 'posts'>('activities');
  const [selectedSport, setSelectedSport] = useState<string>('Beach Tennis');

  useEffect(() => {
    if (id) {
      loadUser();
      checkFollowStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadUser = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setUser(data as UserProfile);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!id || !currentUser?.id) return;
    try {
      const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', currentUser.id)
        .eq('following_id', id)
        .single();

      setIsFollowing(!!data);
    } catch {
      // Not following
    }
  };

  const handleFollow = async () => {
    if (!id || !currentUser?.id) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', id);
        setIsFollowing(false);
      } else {
        await supabase
          .from('follows')
          .insert({ follower_id: currentUser.id, following_id: id } as any);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleMessage = () => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: user?.id, name: user?.name },
    } as any);
  };

  const handleReport = () => {
    setShowActions(false);
    Alert.alert(
      'Denunciar usuário',
      'Deseja denunciar este usuário por comportamento inadequado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Denunciar', style: 'destructive', onPress: () => Alert.alert('Denúncia enviada') },
      ]
    );
  };

  const handleBlock = () => {
    setShowActions(false);
    Alert.alert(
      'Bloquear usuário',
      'Você não verá mais este usuário e ele não poderá te convidar para partidas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Bloquear', style: 'destructive', onPress: () => Alert.alert('Usuário bloqueado') },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#22C55E" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, color: '#6B7280' }}>Usuário não encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 16, color: '#22C55E', fontWeight: '600' }}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const matchesPlayed = user.matches_played || 0;
  const followersCount = user.followers_count || 0;
  const followingCount = user.following_count || 0;
  const userLevel = user.level || 1;
  const levelReliability = Math.min((matchesPlayed / 20) * 100, 100);
  const wins = user.wins || 0;
  const losses = user.losses || 0;
  const effectiveness = matchesPlayed > 0 ? Math.round((wins / matchesPlayed) * 100) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ChevronLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={{ fontSize: 17, fontWeight: '600', color: '#111827' }}>Perfil</Text>
          <TouchableOpacity onPress={() => setShowActions(true)} style={{ padding: 4 }}>
            <Share2 size={22} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {/* Avatar and Name */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              overflow: 'hidden',
              backgroundColor: '#E5E7EB',
            }}>
              {user.avatar_url ? (
                <Image source={{ uri: user.avatar_url }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#22C55E' }}>
                  <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff' }}>
                    {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginLeft: 16 }}>{user.name}</Text>
          </View>

          {/* Stats Row - Clickable */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => router.push({ pathname: '/user/[id]/matches', params: { id } } as any)}
            >
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>{matchesPlayed}</Text>
              <Text style={{ fontSize: 13, color: '#6B7280' }}>Partidas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => router.push({ pathname: '/user/[id]/connections', params: { id, tab: 'followers' } } as any)}
            >
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>{followersCount}</Text>
              <Text style={{ fontSize: 13, color: '#6B7280' }}>Seguidores</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => router.push({ pathname: '/user/[id]/connections', params: { id, tab: 'following' } } as any)}
            >
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>{followingCount}</Text>
              <Text style={{ fontSize: 13, color: '#6B7280' }}>Seguindo</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
            <TouchableOpacity
              onPress={handleFollow}
              disabled={followLoading}
              style={{
                flex: 1,
                backgroundColor: isFollowing ? '#fff' : '#22C55E',
                paddingVertical: 12,
                borderRadius: 24,
                alignItems: 'center',
                borderWidth: isFollowing ? 1.5 : 0,
                borderColor: '#22C55E',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: isFollowing ? '#22C55E' : '#fff' }}>
                {followLoading ? '...' : isFollowing ? 'Seguindo' : 'Seguir'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleMessage}
              style={{
                flex: 1,
                backgroundColor: '#fff',
                paddingVertical: 12,
                borderRadius: 24,
                alignItems: 'center',
                borderWidth: 1.5,
                borderColor: '#E5E7EB',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>Mensagem</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowActions(true)}
              style={{
                width: 44,
                height: 44,
                backgroundColor: '#fff',
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1.5,
                borderColor: '#E5E7EB',
              }}
            >
              <MoreHorizontal size={20} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => setActiveTab('activities')}
              style={{
                flex: 1,
                paddingVertical: 12,
                alignItems: 'center',
                borderBottomWidth: 2,
                borderBottomColor: activeTab === 'activities' ? '#111827' : 'transparent',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: activeTab === 'activities' ? '600' : '400', color: activeTab === 'activities' ? '#111827' : '#6B7280' }}>
                Atividades
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('posts')}
              style={{
                flex: 1,
                paddingVertical: 12,
                alignItems: 'center',
                borderBottomWidth: 2,
                borderBottomColor: activeTab === 'posts' ? '#111827' : 'transparent',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: activeTab === 'posts' ? '600' : '400', color: activeTab === 'posts' ? '#111827' : '#6B7280' }}>
                Publicações
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'activities' ? (
          <View style={{ paddingHorizontal: 20 }}>
            {/* Sport Tags - Clickable filters */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
              {(user.favorite_sports || ['Beach Tennis', 'Tennis', 'Padel']).map((sport, index) => {
                const sportName = sport === 'beach-tennis' ? 'Beach Tennis' : sport;
                const isSelected = selectedSport === sportName;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedSport(sportName)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 16,
                      backgroundColor: isSelected ? '#111827' : '#fff',
                      borderWidth: isSelected ? 0 : 1,
                      borderColor: '#E5E7EB',
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '500', color: isSelected ? '#fff' : '#6B7280' }}>
                      {sportName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Level Card - Changes based on selected sport */}
            <View style={{
              borderRadius: 16,
              overflow: 'hidden',
              marginBottom: 20,
              height: 140,
            }}>
              <Image
                source={{ uri:
                  selectedSport === 'Tennis'
                    ? 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80'
                    : selectedSport === 'Padel'
                    ? 'https://images.unsplash.com/photo-1612534847738-b3af9bc31f0c?w=800&q=80'
                    : 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80'
                }}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' }} />
              <View style={{ flex: 1, padding: 20, justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                  {selectedSport}
                </Text>
                <Text style={{ fontSize: 36, fontWeight: '700', color: '#84cc16' }}>
                  Nível {userLevel.toFixed(2)}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                    Confiabilidade: {levelReliability.toFixed(0)}%
                  </Text>
                  <View style={{
                    marginLeft: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                    backgroundColor: levelReliability < 30 ? '#EF4444' : levelReliability < 70 ? '#F59E0B' : '#22C55E',
                  }}>
                    <Text style={{ fontSize: 10, fontWeight: '600', color: '#fff' }}>
                      {levelReliability < 30 ? 'BAIXA' : levelReliability < 70 ? 'MÉDIA' : 'ALTA'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Level Progression */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 17, fontWeight: '600', color: '#111827', marginBottom: 16 }}>Progressão de nível</Text>

              {/* Graph placeholder */}
              <View style={{ height: 120, backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{
                    width: '100%',
                    height: 60,
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E7EB',
                    position: 'relative',
                  }}>
                    {/* Simple line graph simulation */}
                    <View style={{
                      position: 'absolute',
                      bottom: 20,
                      left: '10%',
                      width: '80%',
                      height: 2,
                      backgroundColor: '#E5E7EB',
                    }} />
                    <View style={{
                      position: 'absolute',
                      bottom: 18,
                      right: '10%',
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: '#84cc16',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Text style={{ fontSize: 9, fontWeight: '700', color: '#fff' }}>{userLevel.toFixed(1)}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Results filter */}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#111827', borderRadius: 16 }}>
                  <Text style={{ fontSize: 12, fontWeight: '500', color: '#fff' }}>5 resultados</Text>
                </View>
                <View style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F3F4F6', borderRadius: 16 }}>
                  <Text style={{ fontSize: 12, fontWeight: '500', color: '#6B7280' }}>10 resultados</Text>
                </View>
                <View style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F3F4F6', borderRadius: 16 }}>
                  <Text style={{ fontSize: 12, fontWeight: '500', color: '#6B7280' }}>Todos</Text>
                </View>
              </View>
            </View>

            {/* Player Preferences - 2 columns */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 17, fontWeight: '600', color: '#111827', marginBottom: 16 }}>Preferências do jogador</Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { icon: 'hand', title: 'Mão preferida', value: user.preferred_hand || 'Não definido', color: '#F59E0B' },
                  { icon: 'mappin', title: 'Posição na quadra', value: user.court_position || 'Não definido', color: '#EF4444' },
                  { icon: 'zap', title: 'Estilo de jogo', value: user.play_style || 'Não definido', color: '#8B5CF6' },
                  { icon: 'target', title: 'Golpe favorito', value: 'Não definido', color: '#22C55E' },
                ].map((item, index) => (
                  <View
                    key={index}
                    style={{
                      width: (SCREEN_WIDTH - 48) / 2,
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#F8FAFC',
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    <View style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: `${item.color}15`,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}>
                      {item.icon === 'hand' && <Hand size={18} color={item.color} />}
                      {item.icon === 'mappin' && <MapPin size={18} color={item.color} />}
                      {item.icon === 'zap' && <Zap size={18} color={item.color} />}
                      {item.icon === 'target' && <Target size={18} color={item.color} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 11, color: '#9CA3AF' }}>{item.title}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#111827' }} numberOfLines={1}>{item.value}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Statistics */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 17, fontWeight: '600', color: '#111827', marginBottom: 16 }}>Estatísticas</Text>

              <View style={{ flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 20 }}>
                <View style={{ flex: 1 }}>
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 28, fontWeight: '700', color: '#111827' }}>{matchesPlayed}</Text>
                    <Text style={{ fontSize: 13, color: '#6B7280' }}>Total</Text>
                  </View>
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 28, fontWeight: '700', color: '#22C55E' }}>{wins}</Text>
                    <Text style={{ fontSize: 13, color: '#6B7280' }}>Vitórias</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 20, fontWeight: '600', color: '#111827' }}>{losses}</Text>
                    <Text style={{ fontSize: 13, color: '#6B7280' }}>Derrotas</Text>
                  </View>
                </View>

                {/* Effectiveness Circle */}
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    borderWidth: 8,
                    borderColor: '#E5E7EB',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <View style={{
                      position: 'absolute',
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      borderWidth: 8,
                      borderColor: '#111827',
                      borderTopColor: 'transparent',
                      borderRightColor: 'transparent',
                      transform: [{ rotate: `${-45 + (effectiveness * 3.6)}deg` }],
                    }} />
                    <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{effectiveness}%</Text>
                    <Text style={{ fontSize: 10, color: '#6B7280' }}>Efetividade</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Recent Matches */}
            <View style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 17, fontWeight: '600', color: '#111827' }}>Partidas recentes</Text>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: '#6B7280' }}>Ver todas</Text>
                  <ChevronRight size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Empty state */}
              <View style={{ backgroundColor: '#F8FAFC', borderRadius: 12, padding: 32, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#9CA3AF' }}>Nenhuma partida ainda</Text>
              </View>
            </View>

            {/* Frequent Partners - Horizontal scroll */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 17, fontWeight: '600', color: '#111827', marginBottom: 16 }}>
                Parceiros frequentes
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -20 }}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
              >
                {[
                  { name: 'João Silva', level: 2.15, matches: 5, avatar: null },
                  { name: 'Maria Santos', level: 1.85, matches: 3, avatar: null },
                  { name: 'Pedro Costa', level: 2.40, matches: 2, avatar: null },
                ].map((player, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      width: 120,
                      backgroundColor: '#fff',
                      borderRadius: 16,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: '#F3F4F6',
                      alignItems: 'center',
                    }}
                  >
                    {/* Avatar */}
                    <View style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: index === 0 ? '#111827' : index === 1 ? '#22C55E' : '#3B82F6',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}>
                      <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>
                        {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </Text>
                    </View>

                    {/* Name */}
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4, textAlign: 'center' }} numberOfLines={1}>
                      {player.name.split(' ')[0]}
                    </Text>

                    {/* Level badge */}
                    <View style={{
                      backgroundColor: '#F0FDF4',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                      marginBottom: 4,
                    }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#22C55E' }}>
                        {player.level.toFixed(2)}
                      </Text>
                    </View>

                    {/* Matches count */}
                    <Text style={{ fontSize: 11, color: '#9CA3AF' }}>
                      {player.matches} partidas
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Bottom padding */}
            <View style={{ height: 40 }} />
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            {/* Posts Tab - Empty state */}
            <View style={{ paddingVertical: 60, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#9CA3AF' }}>Nenhuma publicação ainda</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Menu Modal */}
      {showActions && (
        <Pressable
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
          onPress={() => setShowActions(false)}
        >
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: insets.bottom + 20 }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View style={{ width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }} />
            </View>

            <TouchableOpacity
              onPress={handleReport}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 8 }}
            >
              <Flag size={20} color="#6B7280" />
              <Text style={{ marginLeft: 12, fontSize: 16, color: '#111827' }}>Denunciar usuário</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBlock}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 8 }}
            >
              <Ban size={20} color="#EF4444" />
              <Text style={{ marginLeft: 12, fontSize: 16, color: '#EF4444' }}>Bloquear usuário</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowActions(false)}
              style={{ padding: 16, backgroundColor: '#F3F4F6', borderRadius: 12, alignItems: 'center', marginTop: 8 }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}
    </View>
  );
}
