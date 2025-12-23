import { View, Text, StyleSheet, Pressable, ScrollView, FlatList } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, Trophy, Target, Clock, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

// Mock activities data
const MOCK_ACTIVITIES = [
    {
        id: '1',
        type: 'match',
        title: 'Beach Tennis - Duplas',
        location: 'Arena Praia SP',
        date: '14 Dez 2024',
        time: '18:00',
        result: 'victory',
        score: '6-4, 7-5',
        partner: 'Carlos M.',
        opponents: ['João P.', 'Ana S.'],
        duration: '1h 15min',
        sport: 'Beach Tennis',
    },
    {
        id: '2',
        type: 'match',
        title: 'Beach Tennis - Duplas',
        location: 'CT Pinheiros',
        date: '12 Dez 2024',
        time: '19:30',
        result: 'defeat',
        score: '4-6, 3-6',
        partner: 'Pedro R.',
        opponents: ['Lucas T.', 'Maria F.'],
        duration: '58min',
        sport: 'Beach Tennis',
    },
    {
        id: '3',
        type: 'tournament',
        title: 'Copa Beach Pinheiros',
        location: 'CT Pinheiros',
        date: '10 Dez 2024',
        result: 'semifinal',
        position: '3º lugar',
        matches: 4,
        wins: 3,
        sport: 'Beach Tennis',
    },
    {
        id: '4',
        type: 'match',
        title: 'Beach Tennis - Simples',
        location: 'Arena Beach',
        date: '8 Dez 2024',
        time: '10:00',
        result: 'victory',
        score: '6-2, 6-3',
        opponent: 'Ricardo L.',
        duration: '45min',
        sport: 'Beach Tennis',
    },
    {
        id: '5',
        type: 'match',
        title: 'Padel - Duplas',
        location: 'Padel Club SP',
        date: '5 Dez 2024',
        time: '20:00',
        result: 'victory',
        score: '6-3, 6-4',
        partner: 'Fernando M.',
        opponents: ['Gustavo H.', 'Rafael S.'],
        duration: '52min',
        sport: 'Padel',
    },
    {
        id: '6',
        type: 'tournament',
        title: 'Liga Padel Verão',
        location: 'Padel Club SP',
        date: '1 Dez 2024',
        result: 'champion',
        position: '1º lugar',
        matches: 5,
        wins: 5,
        sport: 'Padel',
    },
];

const STATS_SUMMARY = {
    totalMatches: 47,
    wins: 32,
    winRate: 68,
    tournaments: 8,
    hoursPlayed: 62,
};

const FILTERS = [
    { id: 'all', label: 'Todos' },
    { id: 'match', label: 'Partidas' },
    { id: 'tournament', label: 'Torneios' },
    { id: 'victory', label: 'Vitórias' },
    { id: 'defeat', label: 'Derrotas' },
];

export default function ActivitiesScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredActivities = MOCK_ACTIVITIES.filter(activity => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'match') return activity.type === 'match';
        if (activeFilter === 'tournament') return activity.type === 'tournament';
        if (activeFilter === 'victory') return activity.result === 'victory' || activity.result === 'champion';
        if (activeFilter === 'defeat') return activity.result === 'defeat';
        return true;
    });

    const renderActivity = ({ item, index }: { item: typeof MOCK_ACTIVITIES[0]; index: number }) => {
        const isVictory = item.result === 'victory' || item.result === 'champion';
        const isDefeat = item.result === 'defeat';

        return (
            <Animated.View entering={FadeInDown.delay(index * 50)}>
                <Pressable
                    style={styles.activityCard}
                    onPress={() => item.type === 'match' ? router.push(`/match/${item.id}`) : null}
                >
                    {/* Result indicator */}
                    <View style={[
                        styles.resultIndicator,
                        isVictory && styles.resultVictory,
                        isDefeat && styles.resultDefeat,
                        !isVictory && !isDefeat && styles.resultNeutral,
                    ]} />

                    <View style={styles.activityContent}>
                        {/* Header */}
                        <View style={styles.activityHeader}>
                            <View style={styles.activityTypeTag}>
                                {item.type === 'tournament' ? (
                                    <Trophy size={12} color="#F59E0B" />
                                ) : (
                                    <Target size={12} color="#3B82F6" />
                                )}
                                <Text style={[
                                    styles.activityTypeText,
                                    item.type === 'tournament' && styles.tournamentTypeText
                                ]}>
                                    {item.type === 'tournament' ? 'Torneio' : 'Partida'}
                                </Text>
                            </View>
                            <Text style={styles.activityDate}>{item.date}</Text>
                        </View>

                        {/* Title */}
                        <Text style={styles.activityTitle}>{item.title}</Text>

                        {/* Location */}
                        <View style={styles.activityMeta}>
                            <MapPin size={14} color="#6B7280" />
                            <Text style={styles.activityMetaText}>{item.location}</Text>
                        </View>

                        {/* Match specific info */}
                        {item.type === 'match' && (
                            <>
                                <View style={styles.scoreSection}>
                                    <Text style={[
                                        styles.scoreText,
                                        isVictory && styles.scoreVictory,
                                        isDefeat && styles.scoreDefeat,
                                    ]}>
                                        {item.score}
                                    </Text>
                                    <Text style={styles.resultLabel}>
                                        {isVictory ? 'Vitória' : 'Derrota'}
                                    </Text>
                                </View>

                                <View style={styles.playersRow}>
                                    <Users size={14} color="#6B7280" />
                                    <Text style={styles.playersText}>
                                        {item.partner ? `Com ${item.partner}` : `vs ${item.opponent}`}
                                        {item.opponents && ` vs ${item.opponents.join(' & ')}`}
                                    </Text>
                                </View>

                                <View style={styles.durationRow}>
                                    <Clock size={14} color="#6B7280" />
                                    <Text style={styles.durationText}>{item.duration}</Text>
                                </View>
                            </>
                        )}

                        {/* Tournament specific info */}
                        {item.type === 'tournament' && (
                            <>
                                <View style={styles.tournamentResult}>
                                    <Trophy size={16} color={item.result === 'champion' ? '#F59E0B' : '#6B7280'} />
                                    <Text style={[
                                        styles.positionText,
                                        item.result === 'champion' && styles.championText
                                    ]}>
                                        {item.position}
                                    </Text>
                                </View>

                                <View style={styles.tournamentStats}>
                                    <Text style={styles.tournamentStatText}>
                                        {item.wins}/{item.matches} vitórias
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>

                    <ChevronRight size={20} color="#D1D5DB" style={styles.chevron} />
                </Pressable>
            </Animated.View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Atividades</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Stats Summary */}
            <Animated.View entering={FadeIn.delay(100)} style={styles.statsCard}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{STATS_SUMMARY.totalMatches}</Text>
                    <Text style={styles.statLabel}>Partidas</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{STATS_SUMMARY.wins}</Text>
                    <Text style={styles.statLabel}>Vitórias</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, styles.statValueGreen]}>{STATS_SUMMARY.winRate}%</Text>
                    <Text style={styles.statLabel}>Win Rate</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{STATS_SUMMARY.hoursPlayed}h</Text>
                    <Text style={styles.statLabel}>Jogadas</Text>
                </View>
            </Animated.View>

            {/* Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContainer}
            >
                {FILTERS.map((filter) => (
                    <Pressable
                        key={filter.id}
                        style={[
                            styles.filterChip,
                            activeFilter === filter.id && styles.filterChipActive
                        ]}
                        onPress={() => setActiveFilter(filter.id)}
                    >
                        <Text style={[
                            styles.filterText,
                            activeFilter === filter.id && styles.filterTextActive
                        ]}>
                            {filter.label}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            {/* Activities List */}
            <FlatList
                data={filteredActivities}
                renderItem={renderActivity}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Calendar size={48} color="#D1D5DB" />
                        <Text style={styles.emptyTitle}>Nenhuma atividade</Text>
                        <Text style={styles.emptyText}>
                            Suas partidas e torneios aparecerão aqui
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    statValueGreen: {
        color: '#22C55E',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 4,
    },
    filtersContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: '#111827',
        borderColor: '#111827',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    filterTextActive: {
        color: '#FFF',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    activityCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    resultIndicator: {
        width: 4,
    },
    resultVictory: {
        backgroundColor: '#22C55E',
    },
    resultDefeat: {
        backgroundColor: '#EF4444',
    },
    resultNeutral: {
        backgroundColor: '#F59E0B',
    },
    activityContent: {
        flex: 1,
        padding: 16,
    },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    activityTypeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    activityTypeText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#3B82F6',
    },
    tournamentTypeText: {
        color: '#F59E0B',
    },
    activityDate: {
        fontSize: 12,
        color: '#6B7280',
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    activityMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 12,
    },
    activityMetaText: {
        fontSize: 13,
        color: '#6B7280',
    },
    scoreSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    scoreText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    scoreVictory: {
        color: '#22C55E',
    },
    scoreDefeat: {
        color: '#EF4444',
    },
    resultLabel: {
        fontSize: 12,
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    playersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    playersText: {
        fontSize: 13,
        color: '#6B7280',
    },
    durationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    durationText: {
        fontSize: 13,
        color: '#6B7280',
    },
    tournamentResult: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    positionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    championText: {
        color: '#F59E0B',
    },
    tournamentStats: {
        marginTop: 4,
    },
    tournamentStatText: {
        fontSize: 13,
        color: '#6B7280',
    },
    chevron: {
        alignSelf: 'center',
        marginRight: 12,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
        textAlign: 'center',
    },
});
