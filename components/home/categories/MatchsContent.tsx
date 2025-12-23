import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Plus, Users, MapPin, Calendar, ChevronRight } from 'lucide-react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Match {
  id: string;
  title: string;
  sport: string;
  date: string;
  start_time: string;
  location_name?: string;
  court?: { name: string; distance_km?: number };
  max_players: number;
  players: any[];
  level_min?: number;
  level_max?: number;
  price_per_player?: number;
}

interface MatchsContentProps {
  matches: Match[];
  onJoin?: (id: string) => void;
}

const sportEmoji: Record<string, string> = {
  'beach-tennis': '🎾',
  'padel': '🏸',
  'tennis': '🎾',
  'volleyball': '🏐',
  'football': '⚽',
};

function MatchCard({ match, onPress }: { match: Match; onPress: () => void }) {
  const confirmedPlayers = match.players?.filter((p: any) => p.status === 'confirmed') || [];
  const spotsLeft = match.max_players - confirmedPlayers.length;
  const dateTime = match.date ? new Date(`${match.date}T${match.start_time || '00:00:00'}`) : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {/* Sport Badge */}
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            backgroundColor: '#F3F4F6',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Text style={{ fontSize: 28 }}>{sportEmoji[match.sport] || '🎾'}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
            {match.title || 'Partida aberta'}
          </Text>

          {/* Location */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <MapPin size={14} color="#6B7280" />
            <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 4 }}>
              {match.court?.name || match.location_name || 'Local a definir'}
              {match.court?.distance_km && ` • ${match.court.distance_km.toFixed(1)}km`}
            </Text>
          </View>

          {/* Date/Time */}
          {dateTime && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Calendar size={14} color="#6B7280" />
              <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 4 }}>
                {format(dateTime, "EEE, d MMM • HH:mm", { locale: ptBR })}
              </Text>
            </View>
          )}

          {/* Players & Spots */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Users size={14} color="#6B7280" />
              <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 4 }}>
                {confirmedPlayers.length}/{match.max_players} jogadores
              </Text>
            </View>

            {spotsLeft > 0 ? (
              <View
                style={{
                  backgroundColor: '#DCFCE7',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#15803D' }}>
                  {spotsLeft} {spotsLeft === 1 ? 'vaga' : 'vagas'}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: '#FEE2E2',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#DC2626' }}>Lotado</Text>
              </View>
            )}
          </View>
        </View>

        <ChevronRight size={20} color="#9CA3AF" />
      </View>

      {/* Price if exists */}
      {match.price_per_player && (
        <View
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 14, color: '#6B7280' }}>Custo por jogador</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#059669' }}>
            R$ {(match.price_per_player / 100).toFixed(2).replace('.', ',')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function MatchsContent({ matches, onJoin }: MatchsContentProps) {
  const openMatches = matches.filter((m) => {
    const confirmed = m.players?.filter((p: any) => p.status === 'confirmed').length || 0;
    return confirmed < m.max_players;
  });

  const upcomingMatches = matches.filter((m) => {
    if (!m.date) return false;
    return new Date(`${m.date}T${m.start_time || '00:00:00'}`) > new Date();
  });

  return (
    <View>
      {/* Create Match CTA */}
      <TouchableOpacity
        onPress={() => router.push('/match/create' as any)}
        style={{
          marginHorizontal: 20,
          marginTop: 16,
          backgroundColor: '#3B82F6',
          borderRadius: 16,
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        activeOpacity={0.8}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          }}
        >
          <Plus size={24} color="white" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: 'white', marginBottom: 4 }}>
            Criar Jogo
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
            Organize um jogo e convide amigos
          </Text>
        </View>
        <ChevronRight size={24} color="white" />
      </TouchableOpacity>

      {/* Open Matches */}
      {openMatches.length > 0 && (
        <View style={{ marginTop: 24 }}>
          <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
              Partidas com vagas
            </Text>
            <Text style={{ fontSize: 14, color: '#6B7280' }}>
              Entre em uma partida e jogue agora
            </Text>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            {openMatches.slice(0, 5).map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onPress={() => router.push(`/match/${match.id}` as any)}
              />
            ))}
          </View>

          {openMatches.length > 5 && (
            <TouchableOpacity
              onPress={() => router.push('/invites' as any)}
              style={{ alignItems: 'center', paddingVertical: 12 }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#3B82F6' }}>
                Ver todas as partidas ({openMatches.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && openMatches.length === 0 && (
        <View style={{ marginTop: 24 }}>
          <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
              Próximas partidas
            </Text>
            <Text style={{ fontSize: 14, color: '#6B7280' }}>
              Partidas agendadas para os próximos dias
            </Text>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            {upcomingMatches.slice(0, 5).map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onPress={() => router.push(`/match/${match.id}` as any)}
              />
            ))}
          </View>
        </View>
      )}

      {/* Empty State */}
      {matches.length === 0 && (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🤝</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Nenhuma partida disponível
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 20 }}>
            Seja o primeiro a criar uma partida e convide seus amigos!
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/match/create' as any)}
            style={{
              backgroundColor: '#3B82F6',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Criar Jogo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
