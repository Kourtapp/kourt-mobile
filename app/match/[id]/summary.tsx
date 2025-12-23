import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert, Share, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, Trophy, Clock, MapPin, Calendar, Users, TrendingUp, Flame, Target } from 'lucide-react-native';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { MatchService } from '@/services/matchService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Player {
    user_id: string;
    team: string;
    status: string;
    profile: {
        name: string;
        full_name: string;
        avatar_url: string | null;
        level: number;
    };
}

interface Match {
    id: string;
    sport: string;
    date: string;
    start_time: string;
    status: string;
    type: string;
    score_final: string | null;
    winner_team: number | null;
    duration: number | null;
    organizer_id: string;
    court: {
        name: string;
        location: string;
        images: string[];
    } | null;
    players: Player[];
}

export default function MatchSummaryScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { session } = useAuthStore();

    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMatch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadMatch = async () => {
        try {
            const result = await MatchService.getMatchDetails(id as string) as any;
            if (result.success && result.match) {
                setMatch(result.match as Match);
            }
        } catch (error) {
            console.error('Error loading match:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        Alert.alert(
            "Compartilhar",
            "Como deseja compartilhar?",
            [
                {
                    text: "Postar no Feed",
                    onPress: () => {
                        const content = match?.score_final
                            ? `Partida de ${match.sport} finalizada! ${isWinner ? 'Vitória' : 'Derrota'} ${match.score_final}`
                            : `Partida de ${match?.sport || 'esporte'} finalizada!`;

                        router.push({
                            pathname: '/social/create',
                            params: {
                                content,
                                matchId: id,
                                sport: match?.sport || '',
                            }
                        } as any);
                    }
                },
                {
                    text: "Compartilhar externo",
                    onPress: async () => {
                        try {
                            const message = match?.score_final
                                ? `Acabei de jogar ${match.sport} no Kourt! Resultado: ${match.score_final}\n\nBaixe o Kourt: https://kourt.app`
                                : `Acabei de jogar uma partida no Kourt!\n\nBaixe o Kourt: https://kourt.app`;

                            await Share.share({
                                message,
                                title: 'Resultado da Partida',
                            });
                        } catch (error) {
                            console.log('Error sharing:', error);
                        }
                    }
                },
                { text: "Cancelar", style: "cancel" }
            ]
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (!match) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.errorText}>Partida não encontrada</Text>
                <Pressable onPress={() => router.back()} style={styles.backButtonAlt}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </Pressable>
            </View>
        );
    }

    // Parse score and determine winner
    const scores = match.score_final?.split(' ') || [];
    const isWinner = match.winner_team === 1;
    const teamA = match.players?.filter(p => p.team === 'A') || [];
    const teamB = match.players?.filter(p => p.team === 'B') || [];

    // Calculate stats (mock for now, can be enhanced with real data)
    const duration = match.duration || 60;
    const dateStr = match.date || new Date().toISOString().split('T')[0];
    const timeStr = match.start_time || '00:00:00';
    const matchDate = new Date(`${dateStr}T${timeStr}`);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Background Header */}
            <View style={[styles.bgHeader, { backgroundColor: isWinner ? '#10B981' : '#EF4444' }]} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <Pressable onPress={() => router.back()} style={styles.headerButton}>
                    <ArrowLeft size={24} color="#FFF" />
                </Pressable>
                <Text style={styles.headerTitle}>Resumo da Partida</Text>
                <Pressable onPress={handleShare} style={styles.headerButton}>
                    <Share2 size={24} color="#FFF" />
                </Pressable>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Result Card */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.resultCard}>
                    <View style={[styles.resultBadge, { backgroundColor: isWinner ? '#DCFCE7' : '#FEE2E2' }]}>
                        <Trophy size={20} color={isWinner ? '#10B981' : '#EF4444'} />
                        <Text style={[styles.resultBadgeText, { color: isWinner ? '#10B981' : '#EF4444' }]}>
                            {isWinner ? 'VITÓRIA' : match.winner_team ? 'DERROTA' : 'FINALIZADA'}
                        </Text>
                    </View>

                    <Text style={styles.sportTitle}>{match.sport}</Text>
                    <Text style={styles.courtName}>{match.court?.name || 'Local não definido'}</Text>

                    {/* Score Display */}
                    {match.score_final && (
                        <View style={styles.scoreContainer}>
                            <Text style={styles.scoreText}>{match.score_final}</Text>
                        </View>
                    )}

                    {/* Match Info */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Calendar size={16} color="#64748B" />
                            <Text style={styles.infoText}>
                                {format(matchDate, "dd 'de' MMMM", { locale: ptBR })}
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Clock size={16} color="#64748B" />
                            <Text style={styles.infoText}>{duration} min</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Teams */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Jogadores</Text>

                    {/* Team A */}
                    <View style={styles.teamContainer}>
                        <View style={styles.teamHeader}>
                            <Text style={styles.teamLabel}>Time A</Text>
                            {match.winner_team === 1 && (
                                <View style={styles.winnerBadge}>
                                    <Trophy size={12} color="#F59E0B" />
                                    <Text style={styles.winnerText}>Vencedor</Text>
                                </View>
                            )}
                        </View>
                        {teamA.length > 0 ? teamA.map((player) => (
                            <Pressable
                                key={player.user_id}
                                style={styles.playerCard}
                                onPress={() => router.push(`/user/${player.user_id}` as any)}
                            >
                                <Image
                                    source={player.profile?.avatar_url || 'https://github.com/shadcn.png'}
                                    style={styles.playerAvatar}
                                />
                                <View style={styles.playerInfo}>
                                    <Text style={styles.playerName}>
                                        {player.profile?.full_name || player.profile?.name || 'Jogador'}
                                    </Text>
                                    <Text style={styles.playerLevel}>Nível {player.profile?.level || 1}</Text>
                                </View>
                            </Pressable>
                        )) : (
                            <Text style={styles.noPlayersText}>Nenhum jogador</Text>
                        )}
                    </View>

                    {/* Team B */}
                    <View style={styles.teamContainer}>
                        <View style={styles.teamHeader}>
                            <Text style={styles.teamLabel}>Time B</Text>
                            {match.winner_team === 2 && (
                                <View style={styles.winnerBadge}>
                                    <Trophy size={12} color="#F59E0B" />
                                    <Text style={styles.winnerText}>Vencedor</Text>
                                </View>
                            )}
                        </View>
                        {teamB.length > 0 ? teamB.map((player) => (
                            <Pressable
                                key={player.user_id}
                                style={styles.playerCard}
                                onPress={() => router.push(`/user/${player.user_id}` as any)}
                            >
                                <Image
                                    source={player.profile?.avatar_url || 'https://github.com/shadcn.png'}
                                    style={styles.playerAvatar}
                                />
                                <View style={styles.playerInfo}>
                                    <Text style={styles.playerName}>
                                        {player.profile?.full_name || player.profile?.name || 'Jogador'}
                                    </Text>
                                    <Text style={styles.playerLevel}>Nível {player.profile?.level || 1}</Text>
                                </View>
                            </Pressable>
                        )) : (
                            <Text style={styles.noPlayersText}>Nenhum jogador</Text>
                        )}
                    </View>
                </Animated.View>

                {/* Stats */}
                <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Estatísticas</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Flame size={24} color="#F59E0B" />
                            <Text style={styles.statValue}>{duration}</Text>
                            <Text style={styles.statLabel}>Minutos</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Target size={24} color="#3B82F6" />
                            <Text style={styles.statValue}>{scores.length}</Text>
                            <Text style={styles.statLabel}>Sets</Text>
                        </View>
                        <View style={styles.statCard}>
                            <TrendingUp size={24} color="#10B981" />
                            <Text style={styles.statValue}>+25</Text>
                            <Text style={styles.statLabel}>XP</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Users size={24} color="#8B5CF6" />
                            <Text style={styles.statValue}>{match.players?.length || 0}</Text>
                            <Text style={styles.statLabel}>Jogadores</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Location */}
                {match.court && (
                    <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
                        <Text style={styles.sectionTitle}>Local</Text>
                        <View style={styles.locationCard}>
                            {match.court.images?.[0] && (
                                <Image
                                    source={match.court.images[0]}
                                    style={styles.locationImage}
                                    contentFit="cover"
                                />
                            )}
                            <View style={styles.locationInfo}>
                                <Text style={styles.locationName}>{match.court.name}</Text>
                                <View style={styles.locationRow}>
                                    <MapPin size={14} color="#64748B" />
                                    <Text style={styles.locationAddress}>{match.court.location}</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>

            {/* Bottom Action */}
            <View style={[styles.bottomAction, { paddingBottom: insets.bottom + 16 }]}>
                <Pressable style={styles.shareButton} onPress={handleShare}>
                    <Share2 size={20} color="#FFF" />
                    <Text style={styles.shareButtonText}>Compartilhar no Feed</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 220,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    resultCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    resultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 16,
    },
    resultBadgeText: {
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1,
    },
    sportTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    courtName: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 16,
    },
    scoreContainer: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    scoreText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: 2,
    },
    infoRow: {
        flexDirection: 'row',
        gap: 24,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoText: {
        fontSize: 14,
        color: '#64748B',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 12,
    },
    teamContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    teamHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    teamLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    winnerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    winnerText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#F59E0B',
    },
    playerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    playerAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E2E8F0',
    },
    playerInfo: {
        marginLeft: 12,
    },
    playerName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
    },
    playerLevel: {
        fontSize: 13,
        color: '#64748B',
    },
    noPlayersText: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        paddingVertical: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0F172A',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    locationCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
    },
    locationImage: {
        width: '100%',
        height: 120,
        backgroundColor: '#E2E8F0',
    },
    locationInfo: {
        padding: 16,
    },
    locationName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationAddress: {
        fontSize: 13,
        color: '#64748B',
        flex: 1,
    },
    bottomAction: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#0F172A',
        paddingVertical: 16,
        borderRadius: 16,
    },
    shareButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    errorText: {
        fontSize: 16,
        color: '#64748B',
        marginBottom: 16,
    },
    backButtonAlt: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
});
