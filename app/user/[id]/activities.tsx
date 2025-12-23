import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Clock, Users, Calendar } from 'lucide-react-native';
import { supabase } from '../../../lib/supabase';
import { SportIcon } from '../../../components/SportIcon';

interface Activity {
  id: string;
  type: 'match' | 'training' | 'tournament';
  title: string;
  location: string;
  date: string;
  time: string;
  duration?: string;
  result?: 'win' | 'loss' | 'draw';
  score?: string;
  players?: { name: string; avatar?: string }[];
  sport: string;
}

const DEMO_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'match',
    title: 'Partida de Beach Tennis',
    location: 'Beach Arena SP',
    date: 'Hoje',
    time: '18:00',
    duration: '1h 30min',
    result: 'win',
    score: '6-4, 7-5',
    sport: 'Beach Tennis',
    players: [
      { name: 'Carlos Silva' },
      { name: 'Ana Costa' },
      { name: 'Pedro Lima' },
    ],
  },
  {
    id: '2',
    type: 'training',
    title: 'Treino de Padel',
    location: 'Padel Club Ibirapuera',
    date: 'Ontem',
    time: '08:00',
    duration: '2h',
    sport: 'Padel',
  },
  {
    id: '3',
    type: 'match',
    title: 'Partida de Beach Tennis',
    location: 'Arena Beach Tennis',
    date: '16 Dez',
    time: '19:30',
    duration: '1h 45min',
    result: 'loss',
    score: '4-6, 6-7',
    sport: 'Beach Tennis',
    players: [
      { name: 'Maria Santos' },
      { name: 'João Ferreira' },
    ],
  },
  {
    id: '4',
    type: 'tournament',
    title: 'Torneio de Verão',
    location: 'Beach Arena SP',
    date: '15 Dez',
    time: '09:00',
    duration: '6h',
    result: 'win',
    sport: 'Beach Tennis',
  },
  {
    id: '5',
    type: 'match',
    title: 'Partida de Padel',
    location: 'Padel House',
    date: '14 Dez',
    time: '20:00',
    duration: '1h 20min',
    result: 'win',
    score: '6-3, 6-4',
    sport: 'Padel',
    players: [
      { name: 'Lucas Almeida' },
      { name: 'Fernanda Reis' },
      { name: 'Bruno Costa' },
    ],
  },
];

type FilterType = 'all' | 'matches' | 'training' | 'tournaments';

export default function ActivitiesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [filter, setFilter] = useState<FilterType>('all');
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    checkIfOwnProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const checkIfOwnProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsOwnProfile(user?.id === id);
  };

  const filteredActivities = DEMO_ACTIVITIES.filter((activity) => {
    if (filter === 'all') return true;
    if (filter === 'matches') return activity.type === 'match';
    if (filter === 'training') return activity.type === 'training';
    if (filter === 'tournaments') return activity.type === 'tournament';
    return true;
  });

  const getResultColor = (result?: string) => {
    if (result === 'win') return '#22C55E';
    if (result === 'loss') return '#EF4444';
    return '#6B7280';
  };

  const getResultText = (result?: string) => {
    if (result === 'win') return 'Vitória';
    if (result === 'loss') return 'Derrota';
    if (result === 'draw') return 'Empate';
    return '';
  };

  // Training and tournament icons (not sports)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getTypeEmoji = (type: string) => {
    if (type === 'training') return '💪';
    if (type === 'tournament') return '🏆';
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={24} color="#111827" />
        </Pressable>
        <Text style={{ flex: 1, fontSize: 18, fontWeight: '600', color: '#111827', textAlign: 'center', marginRight: 40 }}>
          Atividades
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
        {[
          { key: 'all', label: 'Todas' },
          { key: 'matches', label: 'Partidas' },
          { key: 'training', label: 'Treinos' },
          { key: 'tournaments', label: 'Torneios' },
        ].map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setFilter(tab.key as FilterType)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: filter === tab.key ? '#111827' : '#F3F4F6',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '500', color: filter === tab.key ? '#fff' : '#6B7280' }}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Activities List */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          {filteredActivities.map((activity, index) => (
            <Pressable
              key={activity.id}
              style={{
                backgroundColor: '#FAFAFA',
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
              }}
            >
              {/* Header */}
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}>
                  {activity.type === 'match' ? (
                    <SportIcon sport={activity.sport} size={40} showBackground={false} />
                  ) : activity.type === 'training' ? (
                    <Text style={{ fontSize: 24 }}>💪</Text>
                  ) : activity.type === 'tournament' ? (
                    <Text style={{ fontSize: 24 }}>🏆</Text>
                  ) : (
                    <SportIcon sport={activity.sport} size={40} showBackground={false} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
                    {activity.title}
                  </Text>
                  {isOwnProfile && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MapPin size={14} color="#6B7280" />
                      <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 4 }}>{activity.location}</Text>
                    </View>
                  )}
                </View>
                {activity.result && (
                  <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                    backgroundColor: getResultColor(activity.result) + '20',
                  }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: getResultColor(activity.result) }}>
                      {getResultText(activity.result)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Date & Time */}
              <View style={{ flexDirection: 'row', gap: 16, marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Calendar size={14} color="#6B7280" />
                  <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 6 }}>{activity.date}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Clock size={14} color="#6B7280" />
                  <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 6 }}>{activity.time}</Text>
                </View>
                {activity.duration && (
                  <Text style={{ fontSize: 13, color: '#6B7280' }}>• {activity.duration}</Text>
                )}
              </View>

              {/* Score */}
              {activity.score && (
                <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center' }}>
                    {activity.score}
                  </Text>
                </View>
              )}

              {/* Players - only show on own profile */}
              {isOwnProfile && activity.players && activity.players.length > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Users size={14} color="#6B7280" />
                  <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 6 }}>
                    {activity.players.map(p => p.name).join(', ')}
                  </Text>
                </View>
              )}
              {!isOwnProfile && activity.players && activity.players.length > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Users size={14} color="#6B7280" />
                  <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 6 }}>
                    {activity.players.length} jogadores
                  </Text>
                </View>
              )}
            </Pressable>
          ))}

          {filteredActivities.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>📅</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
                Nenhuma atividade
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280' }}>
                Não há atividades para mostrar
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
