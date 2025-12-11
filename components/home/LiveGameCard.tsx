import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface LiveGame {
    id: string;
    sport: string;
    time: string;
    venue: string;
    spotsLeft: number;
    sportIcon: 'beachtennis' | 'padel' | 'tennis' | 'soccer' | 'basketball' | 'volleyball';
}

interface LiveGameCardProps {
    game: LiveGame;
    onJoin?: () => void;
}

// Sport icons
const BeachTennisIcon = ({ size = 24, color = '#000' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
        <Path d="M8 8l8 8M8 16l8-8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const SoccerIcon = ({ size = 24, color = '#000' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
        <Path d="M12 2l3 5-3 2-3-2 3-5zM22 12l-5 3-2-3 2-3 5 3zM12 22l-3-5 3-2 3 2-3 5zM2 12l5-3 2 3-2 3-5-3z" stroke={color} strokeWidth="1.5" />
    </Svg>
);

const BasketballIcon = ({ size = 24, color = '#000' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
        <Path d="M4.93 4.93c4.08 4.08 4.08 10.69 0 14.77M19.07 4.93c-4.08 4.08-4.08 10.69 0 14.77M2 12h20M12 2v20" stroke={color} strokeWidth="2" />
    </Svg>
);

const getSportIcon = (sport: string) => {
    switch (sport.toLowerCase()) {
        case 'beachtennis':
        case 'padel':
        case 'tennis':
            return BeachTennisIcon;
        case 'soccer':
        case 'society':
        case 'futebol':
            return SoccerIcon;
        case 'basketball':
        case 'basquete':
            return BasketballIcon;
        default:
            return BeachTennisIcon;
    }
};

export function LiveGameCard({ game, onJoin }: LiveGameCardProps) {
    const SportIcon = getSportIcon(game.sport);

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 16,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: '#E5E7EB',
            }}
        >
            {/* Sport Icon */}
            <View
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#F3F4F6',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 14,
                }}
            >
                <SportIcon size={24} color="#374151" />
            </View>

            {/* Info */}
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#000' }}>
                    {game.sport} · {game.time}
                </Text>
                <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                    {game.venue} · Falta {game.spotsLeft}
                </Text>
            </View>

            {/* Join button */}
            <Pressable
                onPress={onJoin}
                style={{
                    backgroundColor: '#22C55E',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 20,
                }}
            >
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>
                    Entrar
                </Text>
            </Pressable>
        </View>
    );
}

interface LiveGamesListProps {
    games: LiveGame[];
    onJoinGame?: (gameId: string) => void;
    onViewAll?: () => void;
}

// Green dot icon
const GreenDot = () => (
    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 8 }} />
);

export function LiveGamesList({ games, onJoinGame, onViewAll }: LiveGamesListProps) {
    return (
        <View style={{ marginTop: 24 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <GreenDot />
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#000' }}>
                        Jogos acontecendo
                    </Text>
                </View>
                <Pressable onPress={onViewAll}>
                    <Text style={{ fontSize: 14, color: '#6B7280' }}>Ver todos</Text>
                </Pressable>
            </View>

            {/* Games list */}
            <View style={{ paddingHorizontal: 20 }}>
                {games.map((game) => (
                    <LiveGameCard
                        key={game.id}
                        game={game}
                        onJoin={() => onJoinGame?.(game.id)}
                    />
                ))}
            </View>
        </View>
    );
}
