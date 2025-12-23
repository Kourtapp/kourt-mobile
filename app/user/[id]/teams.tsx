import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Plus, Users, Trophy, Star } from 'lucide-react-native';
import { supabase } from '../../../lib/supabase';
import { SportIcon } from '../../../components/SportIcon';

interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  sport: string;
  memberCount: number;
  matchesPlayed: number;
  wins: number;
  role: 'captain' | 'member';
  avatar?: string;
}

const DEMO_TEAMS: Team[] = [
  {
    id: '1',
    name: 'Beach Warriors',
    shortName: 'BW',
    color: '#F59E0B',
    sport: 'beach-tennis',
    memberCount: 4,
    matchesPlayed: 23,
    wins: 15,
    role: 'captain',
  },
  {
    id: '2',
    name: 'Padel Club SP',
    shortName: 'PC',
    color: '#3B82F6',
    sport: 'padel',
    memberCount: 6,
    matchesPlayed: 18,
    wins: 12,
    role: 'member',
  },
  {
    id: '3',
    name: 'Os Invencíveis',
    shortName: 'OI',
    color: '#22C55E',
    sport: 'beach-tennis',
    memberCount: 4,
    matchesPlayed: 45,
    wins: 38,
    role: 'member',
  },
];

export default function TeamsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    checkIfOwnProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const checkIfOwnProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsOwnProfile(user?.id === id);
  };

  const totalWins = DEMO_TEAMS.reduce((sum, team) => sum + team.wins, 0);
  const totalMatches = DEMO_TEAMS.reduce((sum, team) => sum + team.matchesPlayed, 0);

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
        <Text style={{ flex: 1, fontSize: 18, fontWeight: '600', color: '#111827', textAlign: 'center' }}>
          Times
        </Text>
        {isOwnProfile && (
          <Pressable
            onPress={() => router.push('/teams/create' as any)}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}
          >
            <Plus size={24} color="#111827" />
          </Pressable>
        )}
        {!isOwnProfile && <View style={{ width: 40 }} />}
      </View>

      {/* Summary */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, gap: 12 }}>
        <View style={{ flex: 1, backgroundColor: '#FAFAFA', borderRadius: 12, padding: 16, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{DEMO_TEAMS.length}</Text>
          <Text style={{ fontSize: 13, color: '#6B7280' }}>Times</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#FAFAFA', borderRadius: 12, padding: 16, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{totalMatches}</Text>
          <Text style={{ fontSize: 13, color: '#6B7280' }}>Partidas</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#FAFAFA', borderRadius: 12, padding: 16, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#22C55E' }}>{totalWins}</Text>
          <Text style={{ fontSize: 13, color: '#6B7280' }}>Vitórias</Text>
        </View>
      </View>

      {/* Teams List */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          {DEMO_TEAMS.map((team) => (
            <Pressable
              key={team.id}
              onPress={() => router.push(`/teams/${team.id}` as any)}
              style={{
                backgroundColor: '#FAFAFA',
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
              }}
            >
              {/* Header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                {/* Team Avatar */}
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  backgroundColor: team.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>{team.shortName}</Text>
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>{team.name}</Text>
                    {team.role === 'captain' && (
                      <View style={{ backgroundColor: '#F59E0B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ fontSize: 10, fontWeight: '600', color: '#fff' }}>CAPITÃO</Text>
                      </View>
                    )}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <SportIcon sport={team.sport} size={20} showBackground={false} />
                    <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 6 }}>
                      {team.memberCount} membros
                    </Text>
                  </View>
                </View>
              </View>

              {/* Stats */}
              <View style={{ flexDirection: 'row', gap: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Trophy size={14} color="#6B7280" />
                  <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 6 }}>
                    {team.matchesPlayed} partidas
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Star size={14} color="#22C55E" fill="#22C55E" />
                  <Text style={{ fontSize: 13, color: '#22C55E', fontWeight: '600', marginLeft: 6 }}>
                    {team.wins} vitórias
                  </Text>
                </View>
                <Text style={{ fontSize: 13, color: '#6B7280' }}>
                  {Math.round((team.wins / team.matchesPlayed) * 100)}% win rate
                </Text>
              </View>
            </Pressable>
          ))}

          {DEMO_TEAMS.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <Users size={48} color="#D1D5DB" />
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 16, marginBottom: 4 }}>
                Nenhum time
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
                {isOwnProfile ? 'Crie um time para jogar com seus amigos' : 'Este usuário não participa de nenhum time'}
              </Text>
              {isOwnProfile && (
                <Pressable
                  onPress={() => router.push('/teams/create' as any)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#111827',
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 12,
                    marginTop: 20,
                    gap: 8,
                  }}
                >
                  <Plus size={20} color="#fff" />
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>Criar Time</Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Create Team Button (when there are teams) */}
          {isOwnProfile && DEMO_TEAMS.length > 0 && (
            <Pressable
              onPress={() => router.push('/teams/create' as any)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#111827',
                paddingVertical: 16,
                borderRadius: 12,
                marginTop: 8,
                gap: 8,
              }}
            >
              <Plus size={20} color="#fff" />
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>Criar Novo Time</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
