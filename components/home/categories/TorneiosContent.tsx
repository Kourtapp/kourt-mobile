import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Trophy, Calendar, MapPin, Users, ChevronRight } from 'lucide-react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Tournament {
  id: string;
  name: string;
  sport: string;
  start_date: string;
  end_date?: string;
  location: string;
  max_teams: number;
  registered_teams: number;
  entry_fee?: number;
  prize?: string;
  image_url?: string;
  status: 'upcoming' | 'ongoing' | 'finished';
}

// Demo tournaments for now
const demoTournaments: Tournament[] = [
  {
    id: '1',
    name: 'Copa Beach Tennis SP',
    sport: 'beach-tennis',
    start_date: '2024-12-21',
    end_date: '2024-12-22',
    location: 'Arena Beach Tennis - Moema',
    max_teams: 32,
    registered_teams: 24,
    entry_fee: 15000,
    prize: 'R$ 5.000',
    status: 'upcoming',
  },
  {
    id: '2',
    name: 'Torneio Iniciantes Padel',
    sport: 'padel',
    start_date: '2024-12-28',
    location: 'Padel Club Ibirapuera',
    max_teams: 16,
    registered_teams: 12,
    entry_fee: 8000,
    prize: 'Troféu + Brindes',
    status: 'upcoming',
  },
  {
    id: '3',
    name: 'Liga de Verão Beach Tennis',
    sport: 'beach-tennis',
    start_date: '2025-01-05',
    end_date: '2025-02-28',
    location: 'Clube Pinheiros',
    max_teams: 64,
    registered_teams: 45,
    entry_fee: 20000,
    prize: 'R$ 10.000',
    status: 'upcoming',
  },
];

const sportColors: Record<string, string> = {
  'beach-tennis': '#F59E0B',
  'padel': '#3B82F6',
  'tennis': '#22C55E',
  'volleyball': '#EF4444',
};

const sportEmoji: Record<string, string> = {
  'beach-tennis': '🏆',
  'padel': '🎾',
  'tennis': '🎾',
  'volleyball': '🏐',
};

function TournamentCard({ tournament }: { tournament: Tournament }) {
  const spotsLeft = tournament.max_teams - tournament.registered_teams;
  const startDate = new Date(tournament.start_date);
  const color = sportColors[tournament.sport] || '#3B82F6';

  return (
    <TouchableOpacity
      onPress={() => router.push(`/tournament/${tournament.id}` as any)}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
      activeOpacity={0.7}
    >
      {/* Header with color */}
      <View
        style={{
          height: 80,
          backgroundColor: `${color}15`,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Text style={{ fontSize: 40 }}>{sportEmoji[tournament.sport] || '🏆'}</Text>

        {/* Status Badge */}
        <View
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: tournament.status === 'ongoing' ? '#22C55E' : color,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: 'white', fontSize: 11, fontWeight: '600' }}>
            {tournament.status === 'ongoing' ? 'EM ANDAMENTO' : 'INSCRIÇÕES ABERTAS'}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 }}>
          {tournament.name}
        </Text>

        {/* Date */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Calendar size={14} color="#6B7280" />
          <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 6 }}>
            {format(startDate, "d 'de' MMMM", { locale: ptBR })}
            {tournament.end_date &&
              ` - ${format(new Date(tournament.end_date), "d 'de' MMMM", { locale: ptBR })}`}
          </Text>
        </View>

        {/* Location */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <MapPin size={14} color="#6B7280" />
          <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 6 }}>
            {tournament.location}
          </Text>
        </View>

        {/* Footer */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            {/* Teams */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Users size={14} color="#6B7280" />
              <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 4 }}>
                {tournament.registered_teams}/{tournament.max_teams}
              </Text>
            </View>

            {/* Spots */}
            {spotsLeft > 0 && (
              <View
                style={{
                  backgroundColor: '#DCFCE7',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#15803D' }}>
                  {spotsLeft} vagas
                </Text>
              </View>
            )}
          </View>

          {/* Entry Fee / Prize */}
          <View style={{ alignItems: 'flex-end' }}>
            {tournament.entry_fee && (
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>
                R$ {(tournament.entry_fee / 100).toFixed(0)}
              </Text>
            )}
            {tournament.prize && (
              <Text style={{ fontSize: 11, color: '#059669' }}>Prêmio: {tournament.prize}</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function TorneiosContent() {
  const upcomingTournaments = demoTournaments.filter((t) => t.status === 'upcoming');
  const ongoingTournaments = demoTournaments.filter((t) => t.status === 'ongoing');

  return (
    <View>
      {/* Create Tournament CTA */}
      <TouchableOpacity
        onPress={() => router.push('/tournament/create' as any)}
        style={{
          marginHorizontal: 20,
          marginTop: 16,
          backgroundColor: '#F59E0B',
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
          <Trophy size={24} color="white" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: 'white', marginBottom: 4 }}>
            Criar Torneio
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
            Organize sua própria competição
          </Text>
        </View>
        <ChevronRight size={24} color="white" />
      </TouchableOpacity>

      {/* Ongoing Tournaments */}
      {ongoingTournaments.length > 0 && (
        <View style={{ marginTop: 24 }}>
          <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' }} />
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
                Em andamento
              </Text>
            </View>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            {ongoingTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </View>
        </View>
      )}

      {/* Upcoming Tournaments */}
      <View style={{ marginTop: 24 }}>
        <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B' }} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
              Próximos torneios
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
            Inscrições abertas
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {upcomingTournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </View>
      </View>

      {/* Empty State */}
      {demoTournaments.length === 0 && (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🏆</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Nenhum torneio disponível
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 20 }}>
            Seja o primeiro a criar um torneio na sua região!
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/tournament/create' as any)}
            style={{
              backgroundColor: '#F59E0B',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Criar Torneio</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
