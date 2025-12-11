import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface LevelCardProps {
    level: number;
    xp: number;
    xpToNextLevel: number;
    streak: number;
    wins: number;
    isPro?: boolean;
    onViewAchievements?: () => void;
}

// Trophy icon (filled cup style)
const TrophyIcon = ({ size = 24, color = '#F59E0B' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <Path d="M5 3h14c0 0 1 0 1 1v3c0 2-1 3-3 3h-1c-.5 2-2 4-4 4-2 0-3.5-2-4-4H7c-2 0-3-1-3-3V4c0-1 1-1 1-1z" />
        <Path d="M8 14h8v2H8z" />
        <Path d="M10 16h4v2h-4z" />
        <Path d="M7 20h10v2H7z" />
    </Svg>
);

// Fire icon for streak
const FireIcon = ({ size = 16, color = '#F97316' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <Path d="M12 23a7.5 7.5 0 01-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.5.562 1.104.863 2.351.863 3.663A7.5 7.5 0 0112 23z" />
    </Svg>
);

// Check circle icon for wins
const CheckCircleIcon = ({ size = 16, color = '#22C55E' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Path d="M22 4L12 14.01l-3-3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export function LevelCard({
    level,
    xp,
    xpToNextLevel,
    streak,
    wins,
    isPro = false,
    onViewAchievements,
}: LevelCardProps) {
    const progress = (xp / xpToNextLevel) * 100;

    return (
        <View
            style={{
                marginHorizontal: 20,
                marginTop: 16,
                backgroundColor: '#1F2937',
                borderRadius: 20,
                padding: 16,
            }}
        >
            {/* Top row: Level box + Info + Trophy */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                {/* Level Number */}
                <View
                    style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        backgroundColor: '#374151',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                    }}
                >
                    <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFFFFF' }}>
                        {level}
                    </Text>
                </View>

                {/* Info column */}
                <View style={{ flex: 1 }}>
                    {/* Title row */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF', marginRight: 8 }}>
                            Nível {level}
                        </Text>
                        {isPro && (
                            <View
                                style={{
                                    backgroundColor: '#22C55E',
                                    paddingHorizontal: 8,
                                    paddingVertical: 2,
                                    borderRadius: 6,
                                }}
                            >
                                <Text style={{ fontSize: 10, fontWeight: '700', color: '#FFFFFF' }}>PRO</Text>
                            </View>
                        )}
                    </View>

                    {/* XP Progress text */}
                    <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                        {xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP para o próximo nível
                    </Text>
                </View>

                {/* Trophy icon */}
                <TrophyIcon size={28} color="#F59E0B" />
            </View>

            {/* Progress bar */}
            <View
                style={{
                    height: 6,
                    backgroundColor: '#374151',
                    borderRadius: 3,
                    marginTop: 12,
                    marginBottom: 14,
                    overflow: 'hidden',
                }}
            >
                <View
                    style={{
                        height: '100%',
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: '#22C55E',
                        borderRadius: 3,
                    }}
                />
            </View>

            {/* Stats row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    {/* Streak */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FireIcon size={16} />
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#FFFFFF', marginLeft: 5 }}>
                            {streak} dias
                        </Text>
                    </View>

                    {/* Wins */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CheckCircleIcon size={16} />
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#FFFFFF', marginLeft: 5 }}>
                            {wins} vitórias
                        </Text>
                    </View>
                </View>

                {/* View achievements */}
                <Pressable onPress={onViewAchievements}>
                    <Text style={{ fontSize: 13, fontWeight: '500', color: '#9CA3AF' }}>
                        Ver conquistas
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
