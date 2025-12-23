import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ProgressCardProps {
    level: number;
    xp: number;
    xpToNextLevel: number;
    totalMatches: number;
    winRate: number;
    streak: number;
}

// Trophy icon
const TrophyIcon = ({ size = 24, color = '#F59E0B' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M8 21h8M12 17v4M17 4H7a2 2 0 00-2 2v2c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4V6a2 2 0 00-2-2z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M5 6H3a2 2 0 000 4h2M19 6h2a2 2 0 010 4h-2"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export function ProgressCard({
    level,
    xp,
    xpToNextLevel,
    totalMatches,
    winRate,
    streak,
}: ProgressCardProps) {
    const progress = (xp / xpToNextLevel) * 100;
    const xpRemaining = xpToNextLevel - xp;

    return (
        <View
            style={{
                marginHorizontal: 20,
                marginTop: 20,
                backgroundColor: '#1F2937',
                borderRadius: 20,
                padding: 20,
            }}
        >
            {/* Header row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TrophyIcon size={24} color="#F59E0B" />
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>
                        Seu Progresso
                    </Text>
                </View>
                <View
                    style={{
                        backgroundColor: '#22C55E',
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>
                        NÍVEL {level}
                    </Text>
                </View>
            </View>

            {/* XP Progress bar */}
            <View style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>
                        {xp.toLocaleString()} XP
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#9CA3AF' }}>
                        {xpToNextLevel.toLocaleString()} XP
                    </Text>
                </View>
                <View
                    style={{
                        height: 8,
                        backgroundColor: '#374151',
                        borderRadius: 4,
                        overflow: 'hidden',
                    }}
                >
                    <View
                        style={{
                            height: '100%',
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: '#22C55E',
                            borderRadius: 4,
                        }}
                    />
                </View>
                <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>
                    {xpRemaining.toLocaleString()} XP para o próximo nível
                </Text>
            </View>

            {/* Stats boxes */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                {/* Matches */}
                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#374151',
                        borderRadius: 12,
                        paddingVertical: 16,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFFFFF' }}>
                        {totalMatches}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                        Partidas
                    </Text>
                </View>

                {/* Win Rate */}
                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#374151',
                        borderRadius: 12,
                        paddingVertical: 16,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFFFFF' }}>
                        {winRate}%
                    </Text>
                    <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                        Vitórias
                    </Text>
                </View>

                {/* Streak */}
                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#374151',
                        borderRadius: 12,
                        paddingVertical: 16,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFFFFF' }}>
                        {streak}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                        Sequência
                    </Text>
                </View>
            </View>
        </View>
    );
}
