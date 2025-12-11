import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface RankingPlayer {
    id: string;
    rank: number;
    name: string;
    avatar?: string;
    sport: string;
    points: number;
    change: 'up' | 'down' | 'same';
}

interface WeeklyRankingProps {
    players: RankingPlayer[];
    onViewAll?: () => void;
    onPlayerPress?: (playerId: string) => void;
}

// Icons
const TrophyIcon = ({ size = 20, color = '#F59E0B' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Path d="M6 3h12v8a6 6 0 01-6 6v0a6 6 0 01-6-6V3z" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Path d="M12 17v3M8 22h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const ArrowUpIcon = () => (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="#22C55E">
        <Path d="M12 4l-8 8h6v8h4v-8h6z" />
    </Svg>
);

const ArrowDownIcon = () => (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="#EF4444">
        <Path d="M12 20l8-8h-6V4h-4v8H4z" />
    </Svg>
);

const PersonIcon = ({ size = 28, color = '#9CA3AF' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
        <Path d="M20 21a8 8 0 10-16 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return '#F59E0B'; // Gold
    if (rank === 2) return '#9CA3AF'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return '#E5E7EB';
};

export function WeeklyRanking({ players, onViewAll, onPlayerPress }: WeeklyRankingProps) {
    return (
        <View style={{ marginTop: 24 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TrophyIcon size={20} />
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#000' }}>
                        Ranking Semanal
                    </Text>
                </View>
                <Pressable onPress={onViewAll}>
                    <Text style={{ fontSize: 14, color: '#6B7280' }}>Ver todos</Text>
                </Pressable>
            </View>

            {/* Players list */}
            <View style={{ marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
                {players.map((player, index) => (
                    <Pressable
                        key={player.id}
                        onPress={() => onPlayerPress?.(player.id)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 14,
                            borderBottomWidth: index < players.length - 1 ? 1 : 0,
                            borderBottomColor: '#F3F4F6',
                        }}
                    >
                        {/* Rank badge */}
                        <View
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: 14,
                                backgroundColor: getRankBadgeColor(player.rank),
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                            }}
                        >
                            <Text style={{ fontSize: 12, fontWeight: '700', color: player.rank <= 3 ? '#FFFFFF' : '#000' }}>
                                {player.rank}
                            </Text>
                        </View>

                        {/* Avatar */}
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: '#F3F4F6',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                            }}
                        >
                            {player.avatar ? (
                                <Image source={{ uri: player.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                            ) : (
                                <PersonIcon size={24} />
                            )}
                        </View>

                        {/* Info */}
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: '#000' }}>{player.name}</Text>
                            <Text style={{ fontSize: 12, color: '#6B7280' }}>{player.sport}</Text>
                        </View>

                        {/* Points + Change */}
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 15, fontWeight: '700', color: '#000' }}>{player.points.toLocaleString()} pts</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                {player.change === 'up' && <ArrowUpIcon />}
                                {player.change === 'down' && <ArrowDownIcon />}
                            </View>
                        </View>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}
