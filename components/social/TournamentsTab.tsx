import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Calendar, MapPin, Users } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { EmptyState } from '@/components/ui/EmptyState';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Tournament {
    id: string;
    name: string;
    description: string | null;
    sport: string;
    start_date: string;
    end_date: string;
    location: string;
    image_url: string | null;
    max_participants: number;
    current_participants: number;
    entry_fee: number | null;
    status: 'upcoming' | 'ongoing' | 'completed';
    isRegistered: boolean;
}

export function TournamentsTab() {
    const router = useRouter();
    const { session } = useAuthStore();
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadTournaments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadTournaments = async () => {
        try {
            // 1. Get user's registered tournaments (Keep existing logic)
            let registeredIds = new Set<string>();
            if (session?.user?.id) {
                const { data: registrations } = await supabase
                    .from('tournament_registrations' as any)
                    .select('tournament_id')
                    .eq('user_id', session.user.id);

                registeredIds = new Set((registrations || []).map((r: any) => r.tournament_id));
            }

            // 2. Get tournaments (without join)
            const { data, error } = await supabase
                .from('tournaments')
                .select(`
                    id,
                    title,
                    description,
                    sport,
                    start_date,
                    end_date,
                    max_participants,
                    entry_fee,
                    status
                `)
                .in('status', ['upcoming', 'ongoing'])
                .order('start_date', { ascending: true })
                .limit(20);

            if (error) throw error;

            if (!data || data.length === 0) {
                setTournaments([]);
                return;
            }

            // 3. Get participant counts separately
            const tournamentIds = (data as any[]).map(t => t.id);
            const { data: registrationCounts, error: countsError } = await supabase
                .from('tournament_registrations' as any)
                .select('tournament_id')
                .in('tournament_id', tournamentIds);

            if (countsError) console.warn('Error fetching counts:', countsError);

            // Group counts by tournament_id
            const countsMap: Record<string, number> = {};
            (registrationCounts || []).forEach((r: any) => {
                countsMap[r.tournament_id] = (countsMap[r.tournament_id] || 0) + 1;
            });

            // 4. Format tournaments
            const formattedTournaments: Tournament[] = (data as any[]).map((t: any) => ({
                id: t.id,
                name: t.title || 'Torneio',
                description: t.description,
                sport: t.sport || 'Esporte',
                start_date: t.start_date,
                end_date: t.end_date,
                location: 'Local a definir',
                image_url: null as string | null,
                max_participants: t.max_participants || 32,
                current_participants: countsMap[t.id] || 0,
                entry_fee: t.entry_fee,
                status: t.status,
                isRegistered: registeredIds.has(t.id),
            }));

            setTournaments(formattedTournaments);
        } catch (error) {
            console.error('Error loading tournaments:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadTournaments();
        setRefreshing(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-[#fafafa]">
                <ActivityIndicator size="large" color="#0F172A" />
            </View>
        );
    }

    if (tournaments.length === 0) {
        return (
            <EmptyState
                type="noTournaments"
                title="Nenhum torneio disponível"
                description="Novos torneios serão anunciados em breve"
            />
        );
    }

    const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming');
    const ongoingTournaments = tournaments.filter(t => t.status === 'ongoing');

    return (
        <ScrollView
            className="flex-1 bg-[#fafafa]"
            contentContainerStyle={{ padding: 20, gap: 16 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0F172A" />
            }
        >
            {/* Ongoing Tournaments */}
            {ongoingTournaments.length > 0 && (
                <View>
                    <Text className="text-sm font-bold text-amber-600 mb-3">
                        Em andamento
                    </Text>
                    {ongoingTournaments.map((tournament) => (
                        <TournamentCard
                            key={tournament.id}
                            tournament={tournament}
                            onPress={() => router.push(`/tournament/${tournament.id}` as any)}
                        />
                    ))}
                </View>
            )}

            {/* Upcoming Tournaments */}
            {upcomingTournaments.length > 0 && (
                <View>
                    <Text className="text-sm font-bold text-black mb-3">
                        Próximos torneios
                    </Text>
                    <View className="gap-4">
                        {upcomingTournaments.map((tournament) => (
                            <TournamentCard
                                key={tournament.id}
                                tournament={tournament}
                                onPress={() => router.push(`/tournament/${tournament.id}` as any)}
                            />
                        ))}
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

function TournamentCard({
    tournament,
    onPress,
}: {
    tournament: Tournament;
    onPress: () => void;
}) {
    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "d 'de' MMM", { locale: ptBR });
        } catch {
            return dateStr;
        }
    };

    const getSportEmoji = (sport: string) => {
        const sports: { [key: string]: string } = {
            'beach_tennis': '🎾',
            'padel': '🎾',
            'tennis': '🎾',
            'futevolei': '⚽',
            'volei': '🏐',
            'basquete': '🏀',
            'futebol': '⚽',
        };
        return sports[sport.toLowerCase()] || '🏆';
    };

    const spotsLeft = tournament.max_participants - tournament.current_participants;
    const isFull = spotsLeft <= 0;

    return (
        <Pressable onPress={onPress}>
            <View className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                {/* Image */}
                <Image
                    source={tournament.image_url || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=400'}
                    className="w-full h-32"
                    contentFit="cover"
                />

                {/* Badge */}
                {tournament.isRegistered && (
                    <View className="absolute top-3 right-3 bg-green-500 px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-bold">INSCRITO</Text>
                    </View>
                )}

                {tournament.status === 'ongoing' && (
                    <View className="absolute top-3 left-3 bg-amber-500 px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-bold">AO VIVO</Text>
                    </View>
                )}

                {/* Content */}
                <View className="p-4">
                    <View className="flex-row items-center gap-2 mb-2">
                        <Text className="text-xl">{getSportEmoji(tournament.sport)}</Text>
                        <Text className="font-bold text-black text-lg flex-1" numberOfLines={1}>
                            {tournament.name}
                        </Text>
                    </View>

                    <View className="gap-2 mb-3">
                        <View className="flex-row items-center gap-2">
                            <Calendar size={14} color="#6B7280" />
                            <Text className="text-sm text-neutral-600">
                                {formatDate(tournament.start_date)}
                                {tournament.end_date && tournament.end_date !== tournament.start_date
                                    ? ` - ${formatDate(tournament.end_date)}`
                                    : ''
                                }
                            </Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <MapPin size={14} color="#6B7280" />
                            <Text className="text-sm text-neutral-600" numberOfLines={1}>
                                {tournament.location}
                            </Text>
                        </View>
                    </View>

                    {/* Footer */}
                    <View className="flex-row items-center justify-between pt-3 border-t border-neutral-100">
                        <View className="flex-row items-center gap-2">
                            <Users size={14} color="#6B7280" />
                            <Text className={`text-sm font-medium ${isFull ? 'text-red-500' : 'text-neutral-600'}`}>
                                {isFull
                                    ? 'Vagas esgotadas'
                                    : `${spotsLeft} vagas restantes`
                                }
                            </Text>
                        </View>
                        {tournament.entry_fee ? (
                            <Text className="font-bold text-black">
                                R$ {tournament.entry_fee.toFixed(2)}
                            </Text>
                        ) : (
                            <Text className="font-bold text-green-600">Gratuito</Text>
                        )}
                    </View>
                </View>
            </View>
        </Pressable>
    );
}
