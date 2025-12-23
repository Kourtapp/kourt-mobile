import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import {
    ArrowLeft, TrendingUp, TrendingDown, Trophy, Flame,
    Clock, Zap, BarChart3, Target, Award
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Sport tabs
const SPORTS = [
    { id: 'all', label: 'Geral' },
    { id: 'beach_tennis', label: 'Beach Tennis' },
    { id: 'padel', label: 'Padel' },
    { id: 'tennis', label: 'Tênis' },
];

// Mock statistics data
const STATS_DATA = {
    overall: {
        totalMatches: 47,
        wins: 32,
        losses: 15,
        winRate: 68,
        currentStreak: 3,
        bestStreak: 8,
        ranking: 156,
        rankingTrend: 'up',
        rankingChange: 12,
        hoursPlayed: 62,
        avgMatchDuration: '52min',
        tournaments: 8,
        tournamentWins: 2,
    },
    monthly: [
        { month: 'Jul', wins: 4, losses: 2 },
        { month: 'Ago', wins: 5, losses: 3 },
        { month: 'Set', wins: 6, losses: 2 },
        { month: 'Out', wins: 7, losses: 3 },
        { month: 'Nov', wins: 5, losses: 2 },
        { month: 'Dez', wins: 5, losses: 3 },
    ],
    skills: [
        { name: 'Saque', value: 78 },
        { name: 'Voleio', value: 85 },
        { name: 'Smash', value: 72 },
        { name: 'Defesa', value: 80 },
        { name: 'Consistência', value: 88 },
        { name: 'Mental', value: 75 },
    ],
    recentForm: ['W', 'W', 'W', 'L', 'W', 'L', 'W', 'W', 'L', 'W'],
    achievements: [
        { id: '1', title: 'Primeira Vitória', icon: Trophy, unlocked: true },
        { id: '2', title: 'Sequência de 5', icon: Flame, unlocked: true },
        { id: '3', title: 'Campeão Regional', icon: Award, unlocked: true },
        { id: '4', title: 'Top 100', icon: TrendingUp, unlocked: false },
    ],
};

export default function StatisticsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [activeSport, setActiveSport] = useState('all');

    const maxMonthlyValue = Math.max(
        ...STATS_DATA.monthly.map(m => m.wins + m.losses)
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Estatísticas</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Sport Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sportTabs}
            >
                {SPORTS.map((sport) => (
                    <Pressable
                        key={sport.id}
                        style={[
                            styles.sportTab,
                            activeSport === sport.id && styles.sportTabActive
                        ]}
                        onPress={() => setActiveSport(sport.id)}
                    >
                        <Text style={[
                            styles.sportTabText,
                            activeSport === sport.id && styles.sportTabTextActive
                        ]}>
                            {sport.label}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Main Stats Grid */}
                <Animated.View entering={FadeIn.delay(100)} style={styles.mainStatsGrid}>
                    {/* Win Rate Card */}
                    <View style={[styles.statCard, styles.statCardLarge]}>
                        <View style={styles.statCardHeader}>
                            <Target size={20} color="#22C55E" />
                            <Text style={styles.statCardLabel}>Win Rate</Text>
                        </View>
                        <Text style={styles.statCardValueLarge}>{STATS_DATA.overall.winRate}%</Text>
                        <View style={styles.winLossBar}>
                            <View style={[styles.winBar, { flex: STATS_DATA.overall.wins }]} />
                            <View style={[styles.lossBar, { flex: STATS_DATA.overall.losses }]} />
                        </View>
                        <Text style={styles.winLossText}>
                            {STATS_DATA.overall.wins}V - {STATS_DATA.overall.losses}D
                        </Text>
                    </View>

                    {/* Ranking Card */}
                    <View style={styles.statCard}>
                        <View style={styles.statCardHeader}>
                            <BarChart3 size={20} color="#3B82F6" />
                            <Text style={styles.statCardLabel}>Ranking</Text>
                        </View>
                        <Text style={styles.statCardValue}>#{STATS_DATA.overall.ranking}</Text>
                        <View style={styles.trendRow}>
                            {STATS_DATA.overall.rankingTrend === 'up' ? (
                                <TrendingUp size={16} color="#22C55E" />
                            ) : (
                                <TrendingDown size={16} color="#EF4444" />
                            )}
                            <Text style={[
                                styles.trendText,
                                STATS_DATA.overall.rankingTrend === 'up' ? styles.trendUp : styles.trendDown
                            ]}>
                                {STATS_DATA.overall.rankingChange} posições
                            </Text>
                        </View>
                    </View>

                    {/* Streak Card */}
                    <View style={styles.statCard}>
                        <View style={styles.statCardHeader}>
                            <Flame size={20} color="#F59E0B" />
                            <Text style={styles.statCardLabel}>Sequência</Text>
                        </View>
                        <Text style={styles.statCardValue}>{STATS_DATA.overall.currentStreak}</Text>
                        <Text style={styles.subText}>Melhor: {STATS_DATA.overall.bestStreak}</Text>
                    </View>
                </Animated.View>

                {/* Recent Form */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Forma Recente</Text>
                    <View style={styles.formContainer}>
                        {STATS_DATA.recentForm.map((result, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.formBadge,
                                    result === 'W' ? styles.formWin : styles.formLoss
                                ]}
                            >
                                <Text style={[
                                    styles.formText,
                                    result === 'W' ? styles.formTextWin : styles.formTextLoss
                                ]}>
                                    {result}
                                </Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* Monthly Performance Chart */}
                <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Desempenho Mensal</Text>
                    <View style={styles.chartContainer}>
                        {STATS_DATA.monthly.map((month, index) => (
                            <View key={index} style={styles.chartColumn}>
                                <View style={styles.chartBars}>
                                    <View style={[
                                        styles.chartBar,
                                        styles.chartBarWin,
                                        { height: (month.wins / maxMonthlyValue) * 80 }
                                    ]} />
                                    <View style={[
                                        styles.chartBar,
                                        styles.chartBarLoss,
                                        { height: (month.losses / maxMonthlyValue) * 80 }
                                    ]} />
                                </View>
                                <Text style={styles.chartLabel}>{month.month}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.chartLegend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
                            <Text style={styles.legendText}>Vitórias</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                            <Text style={styles.legendText}>Derrotas</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Skills Radar */}
                <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Habilidades</Text>
                    <View style={styles.skillsContainer}>
                        {STATS_DATA.skills.map((skill, index) => (
                            <View key={index} style={styles.skillRow}>
                                <Text style={styles.skillName}>{skill.name}</Text>
                                <View style={styles.skillBarContainer}>
                                    <View style={[styles.skillBar, { width: `${skill.value}%` }]} />
                                </View>
                                <Text style={styles.skillValue}>{skill.value}</Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* Additional Stats */}
                <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Mais Estatísticas</Text>
                    <View style={styles.additionalStats}>
                        <View style={styles.additionalStatItem}>
                            <Clock size={20} color="#6B7280" />
                            <View>
                                <Text style={styles.additionalStatValue}>{STATS_DATA.overall.hoursPlayed}h</Text>
                                <Text style={styles.additionalStatLabel}>Tempo jogado</Text>
                            </View>
                        </View>
                        <View style={styles.additionalStatItem}>
                            <Zap size={20} color="#6B7280" />
                            <View>
                                <Text style={styles.additionalStatValue}>{STATS_DATA.overall.avgMatchDuration}</Text>
                                <Text style={styles.additionalStatLabel}>Média por partida</Text>
                            </View>
                        </View>
                        <View style={styles.additionalStatItem}>
                            <Trophy size={20} color="#6B7280" />
                            <View>
                                <Text style={styles.additionalStatValue}>{STATS_DATA.overall.tournaments}</Text>
                                <Text style={styles.additionalStatLabel}>Torneios</Text>
                            </View>
                        </View>
                        <View style={styles.additionalStatItem}>
                            <Award size={20} color="#6B7280" />
                            <View>
                                <Text style={styles.additionalStatValue}>{STATS_DATA.overall.tournamentWins}</Text>
                                <Text style={styles.additionalStatLabel}>Títulos</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Achievements Preview */}
                <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Conquistas</Text>
                        <Pressable onPress={() => router.push('/achievements')}>
                            <Text style={styles.seeAllText}>Ver todas</Text>
                        </Pressable>
                    </View>
                    <View style={styles.achievementsRow}>
                        {STATS_DATA.achievements.map((achievement, index) => {
                            const Icon = achievement.icon;
                            return (
                                <View
                                    key={achievement.id}
                                    style={[
                                        styles.achievementItem,
                                        !achievement.unlocked && styles.achievementLocked
                                    ]}
                                >
                                    <Icon
                                        size={24}
                                        color={achievement.unlocked ? '#F59E0B' : '#D1D5DB'}
                                    />
                                    <Text style={[
                                        styles.achievementTitle,
                                        !achievement.unlocked && styles.achievementTitleLocked
                                    ]}>
                                        {achievement.title}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </Animated.View>
            </ScrollView>
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
    sportTabs: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        gap: 8,
    },
    sportTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
    },
    sportTabActive: {
        backgroundColor: '#111827',
    },
    sportTabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    sportTabTextActive: {
        color: '#FFF',
    },
    content: {
        padding: 16,
        paddingBottom: 100,
    },
    mainStatsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        width: (SCREEN_WIDTH - 44) / 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statCardLarge: {
        width: '100%',
    },
    statCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    statCardLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    statCardValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
    },
    statCardValueLarge: {
        fontSize: 48,
        fontWeight: '700',
        color: '#22C55E',
        textAlign: 'center',
        marginVertical: 8,
    },
    winLossBar: {
        flexDirection: 'row',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginVertical: 8,
    },
    winBar: {
        backgroundColor: '#22C55E',
    },
    lossBar: {
        backgroundColor: '#EF4444',
    },
    winLossText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    trendText: {
        fontSize: 12,
        fontWeight: '500',
    },
    trendUp: {
        color: '#22C55E',
    },
    trendDown: {
        color: '#EF4444',
    },
    subText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3B82F6',
    },
    formContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    formBadge: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formWin: {
        backgroundColor: '#DCFCE7',
    },
    formLoss: {
        backgroundColor: '#FEE2E2',
    },
    formText: {
        fontSize: 14,
        fontWeight: '600',
    },
    formTextWin: {
        color: '#22C55E',
    },
    formTextLoss: {
        color: '#EF4444',
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 120,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
    },
    chartColumn: {
        alignItems: 'center',
        flex: 1,
    },
    chartBars: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 2,
        marginBottom: 8,
    },
    chartBar: {
        width: 12,
        borderRadius: 4,
    },
    chartBarWin: {
        backgroundColor: '#22C55E',
    },
    chartBarLoss: {
        backgroundColor: '#EF4444',
    },
    chartLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    chartLegend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
        marginTop: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 12,
        color: '#6B7280',
    },
    skillsContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
    },
    skillRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    skillName: {
        width: 90,
        fontSize: 14,
        color: '#374151',
    },
    skillBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
        marginHorizontal: 12,
    },
    skillBar: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 4,
    },
    skillValue: {
        width: 30,
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        textAlign: 'right',
    },
    additionalStats: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    additionalStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        width: (SCREEN_WIDTH - 44) / 2,
    },
    additionalStatValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    additionalStatLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    achievementsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    achievementItem: {
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        width: (SCREEN_WIDTH - 60) / 4,
    },
    achievementLocked: {
        opacity: 0.5,
    },
    achievementTitle: {
        fontSize: 10,
        color: '#374151',
        textAlign: 'center',
        marginTop: 6,
    },
    achievementTitleLocked: {
        color: '#9CA3AF',
    },
});
