import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Users, ChevronDown, Share2, MapPin, CreditCard } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SportIcon } from '../SportIcon';

interface Player {
    id: string;
    name: string;
    avatar?: string;
    level?: string;
    levelScore?: number;
    team?: 1 | 2;
}

interface Match {
    id: string;
    date: string;
    startTime: string;
    sport: string;
    gameLevel: string;
    levelRange: string;
    confirmed: number;
    maxPlayers: number;
    playersPerTeam: number;
    players: Player[];
    isUserGoing: boolean;
    pricePerPerson: number;
    duration: number;
    courtName: string;
    courtLocation?: string;
    allowSplitPayment?: boolean; // Permite dividir pagamento
}

interface SchedulePreviewProps {
    courtId?: string;
    price?: number;
    isPublic?: boolean;
}

// Mock matches data
const MOCK_MATCHES: Match[] = [
    {
        id: '1',
        date: 'Hoje',
        startTime: '06:00',
        sport: 'Beach Tennis',
        gameLevel: 'Intermediário',
        levelRange: '2.0 - 3.5',
        confirmed: 2,
        maxPlayers: 4,
        playersPerTeam: 2,
        players: [
            { id: '1', name: 'Carlos', avatar: 'https://i.pravatar.cc/100?img=12', levelScore: 2.5, team: 1 },
            { id: '2', name: 'Ana', avatar: 'https://i.pravatar.cc/100?img=47', levelScore: 3.1, team: 2 },
        ],
        isUserGoing: false,
        pricePerPerson: 45,
        duration: 120,
        courtName: 'Quadra 1',
        allowSplitPayment: true,
    },
    {
        id: '2',
        date: 'Hoje',
        startTime: '08:00',
        sport: 'Futebol',
        gameLevel: 'Competitivo',
        levelRange: '3.0 - 4.5',
        confirmed: 18,
        maxPlayers: 24,
        playersPerTeam: 12,
        players: [
            // Time 1 - 10 jogadores
            { id: '1', name: 'João', avatar: 'https://i.pravatar.cc/100?img=33', levelScore: 3.2, team: 1 },
            { id: '2', name: 'Pedro', avatar: 'https://i.pravatar.cc/100?img=53', levelScore: 3.8, team: 1 },
            { id: '3', name: 'Bruno', avatar: 'https://i.pravatar.cc/100?img=11', levelScore: 4.0, team: 1 },
            { id: '4', name: 'Thiago', avatar: 'https://i.pravatar.cc/100?img=59', levelScore: 3.7, team: 1 },
            { id: '5', name: 'Lucas', avatar: 'https://i.pravatar.cc/100?img=15', levelScore: 3.4, team: 1 },
            { id: '6', name: 'Gabriel', avatar: 'https://i.pravatar.cc/100?img=67', levelScore: 3.5, team: 1 },
            { id: '7', name: 'Matheus', avatar: 'https://i.pravatar.cc/100?img=52', levelScore: 3.3, team: 1 },
            { id: '8', name: 'Felipe', avatar: 'https://i.pravatar.cc/100?img=14', levelScore: 3.9, team: 1 },
            { id: '9', name: 'Gustavo', avatar: 'https://i.pravatar.cc/100?img=60', levelScore: 3.6, team: 1 },
            { id: '10', name: 'Vinicius', avatar: 'https://i.pravatar.cc/100?img=51', levelScore: 3.1, team: 1 },
            // Time 2 - 8 jogadores
            { id: '11', name: 'Rafael', avatar: 'https://i.pravatar.cc/100?img=68', levelScore: 4.2, team: 2 },
            { id: '12', name: 'Diego', avatar: 'https://i.pravatar.cc/100?img=57', levelScore: 3.9, team: 2 },
            { id: '13', name: 'André', avatar: 'https://i.pravatar.cc/100?img=56', levelScore: 3.5, team: 2 },
            { id: '14', name: 'Caio', avatar: 'https://i.pravatar.cc/100?img=55', levelScore: 3.4, team: 2 },
            { id: '15', name: 'Daniel', avatar: 'https://i.pravatar.cc/100?img=54', levelScore: 3.7, team: 2 },
            { id: '16', name: 'Eduardo', avatar: 'https://i.pravatar.cc/100?img=50', levelScore: 3.2, team: 2 },
            { id: '17', name: 'Fernando', avatar: 'https://i.pravatar.cc/100?img=49', levelScore: 3.8, team: 2 },
            { id: '18', name: 'Henrique', avatar: 'https://i.pravatar.cc/100?img=48', levelScore: 3.6, team: 2 },
        ],
        isUserGoing: false,
        pricePerPerson: 15,
        duration: 120,
        courtName: 'Campo Society',
        allowSplitPayment: true,
    },
    {
        id: '3',
        date: 'Hoje',
        startTime: '18:00',
        sport: 'Beach Tennis',
        gameLevel: 'Intermediário',
        levelRange: '2.5 - 3.5',
        confirmed: 3,
        maxPlayers: 4,
        playersPerTeam: 2,
        players: [
            { id: 'user', name: 'Você', levelScore: 2.8, team: 1 },
            { id: '1', name: 'Pedro', avatar: 'https://i.pravatar.cc/100?img=53', levelScore: 3.2, team: 1 },
            { id: '2', name: 'Marina', avatar: 'https://i.pravatar.cc/100?img=23', levelScore: 2.9, team: 2 },
        ],
        isUserGoing: true,
        pricePerPerson: 45,
        duration: 120,
        courtName: 'Quadra 2',
        allowSplitPayment: true,
    },
    {
        id: '4',
        date: 'Hoje',
        startTime: '20:00',
        sport: 'Vôlei',
        gameLevel: 'Casual',
        levelRange: '1.5 - 3.0',
        confirmed: 8,
        maxPlayers: 12,
        playersPerTeam: 6,
        players: [
            { id: '1', name: 'Rafael', avatar: 'https://i.pravatar.cc/100?img=68', levelScore: 2.5, team: 1 },
            { id: '2', name: 'Fernanda', avatar: 'https://i.pravatar.cc/100?img=32', levelScore: 2.2, team: 1 },
            { id: '3', name: 'Lucas', avatar: 'https://i.pravatar.cc/100?img=15', levelScore: 2.8, team: 1 },
            { id: '4', name: 'Julia', avatar: 'https://i.pravatar.cc/100?img=21', levelScore: 1.9, team: 1 },
            { id: '5', name: 'Thiago', avatar: 'https://i.pravatar.cc/100?img=59', levelScore: 2.3, team: 2 },
            { id: '6', name: 'Carla', avatar: 'https://i.pravatar.cc/100?img=5', levelScore: 2.7, team: 2 },
            { id: '7', name: 'Bruno', avatar: 'https://i.pravatar.cc/100?img=11', levelScore: 2.4, team: 2 },
            { id: '8', name: 'Marina', avatar: 'https://i.pravatar.cc/100?img=23', levelScore: 2.6, team: 2 },
        ],
        isUserGoing: false,
        pricePerPerson: 17,
        duration: 120,
        courtName: 'Quadra 3',
        allowSplitPayment: true,
    },
];

export function SchedulePreview({ courtId, price, isPublic = true }: SchedulePreviewProps) {
    const router = useRouter();
    const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

    const handleViewAll = () => {
        router.push({
            pathname: '/court/[id]/matches',
            params: { id: courtId || '1' }
        });
    };

    // Para jogos pequenos (até 4 jogadores), mostra avatars na horizontal
    const renderSmallGamePlayers = (match: Match) => {
        const team1Players = match.players.filter(p => p.team === 1);
        const team2Players = match.players.filter(p => p.team === 2);

        const renderPlayerSlot = (player: Player | null, index: number) => {
            if (player) {
                return (
                    <View key={player.id} style={{ alignItems: 'center', width: 70 }}>
                        <View style={{
                            width: 52,
                            height: 52,
                            borderRadius: 26,
                            backgroundColor: player.id === 'user' ? '#000' : '#E5E7EB',
                            overflow: 'hidden',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 6,
                        }}>
                            {player.avatar ? (
                                <Image source={{ uri: player.avatar }} style={{ width: '100%', height: '100%' }} />
                            ) : (
                                <Text style={{ fontSize: 16, fontWeight: '700', color: player.id === 'user' ? '#FFF' : '#6B7280' }}>
                                    {player.name[0]}
                                </Text>
                            )}
                        </View>
                        <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151' }} numberOfLines={1}>
                            {player.name}
                        </Text>
                        {player.levelScore && (
                            <View style={{
                                backgroundColor: '#DBEAFE',
                                paddingHorizontal: 8,
                                paddingVertical: 2,
                                borderRadius: 10,
                                marginTop: 4,
                            }}>
                                <Text style={{ fontSize: 11, fontWeight: '700', color: '#1E40AF' }}>
                                    {player.levelScore.toFixed(1).replace('.', ',')}
                                </Text>
                            </View>
                        )}
                    </View>
                );
            }

            return (
                <View key={`empty-${index}`} style={{ alignItems: 'center', width: 70 }}>
                    <TouchableOpacity style={{
                        width: 52,
                        height: 52,
                        borderRadius: 26,
                        borderWidth: 2,
                        borderColor: '#3B82F6',
                        borderStyle: 'dashed',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 6,
                    }}>
                        <Text style={{ fontSize: 24, color: '#3B82F6', fontWeight: '300' }}>+</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 12, fontWeight: '500', color: '#3B82F6' }}>
                        Disponível
                    </Text>
                </View>
            );
        };

        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
                gap: 8,
                borderTopWidth: 1,
                borderTopColor: '#F3F4F6',
            }}>
                {/* Time 1 */}
                <View style={{ flexDirection: 'row', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
                    {Array.from({ length: match.playersPerTeam }).map((_, idx) =>
                        renderPlayerSlot(team1Players[idx] || null, idx)
                    )}
                </View>

                {/* Divider */}
                <View style={{ width: 1, backgroundColor: '#E5E7EB', marginHorizontal: 8 }} />

                {/* Time 2 */}
                <View style={{ flexDirection: 'row', gap: 8, flex: 1 }}>
                    {Array.from({ length: match.playersPerTeam }).map((_, idx) =>
                        renderPlayerSlot(team2Players[idx] || null, idx + 10)
                    )}
                </View>
            </View>
        );
    };

    // Para jogos grandes (mais de 4 jogadores), mostra resumo compacto
    const renderLargeGamePlayers = (match: Match, isExpanded: boolean) => {
        const team1Players = match.players.filter(p => p.team === 1);
        const team2Players = match.players.filter(p => p.team === 2);
        const team1Spots = match.playersPerTeam - team1Players.length;
        const team2Spots = match.playersPerTeam - team2Players.length;

        return (
            <View style={{ borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
                {/* Summary View */}
                <TouchableOpacity
                    onPress={() => setExpandedMatchId(isExpanded ? null : match.id)}
                    activeOpacity={0.7}
                    style={{ padding: 16 }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* Time 1 */}
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <View style={{
                                backgroundColor: '#000',
                                paddingHorizontal: 12,
                                paddingVertical: 4,
                                borderRadius: 12,
                                marginBottom: 8,
                            }}>
                                <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFF' }}>TIME 1</Text>
                            </View>
                            {/* Avatars empilhados */}
                            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                {team1Players.slice(0, 5).map((player, idx) => (
                                    <View
                                        key={player.id}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 16,
                                            marginLeft: idx > 0 ? -10 : 0,
                                            borderWidth: 2,
                                            borderColor: '#FFF',
                                            backgroundColor: '#E5E7EB',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {player.avatar ? (
                                            <Image source={{ uri: player.avatar }} style={{ width: '100%', height: '100%' }} />
                                        ) : (
                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ fontSize: 10, fontWeight: '700', color: '#6B7280' }}>{player.name[0]}</Text>
                                            </View>
                                        )}
                                    </View>
                                ))}
                                {team1Players.length > 5 && (
                                    <View style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                        marginLeft: -10,
                                        borderWidth: 2,
                                        borderColor: '#FFF',
                                        backgroundColor: '#374151',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#FFF' }}>+{team1Players.length - 5}</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#000' }}>
                                {team1Players.length}/{match.playersPerTeam}
                            </Text>
                            {team1Spots > 0 && (
                                <Text style={{ fontSize: 12, color: '#22C55E', fontWeight: '600' }}>
                                    {team1Spots} vaga{team1Spots > 1 ? 's' : ''}
                                </Text>
                            )}
                        </View>

                        {/* VS */}
                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }}>
                            <Text style={{ fontSize: 20, fontWeight: '800', color: '#D1D5DB' }}>VS</Text>
                        </View>

                        {/* Time 2 */}
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <View style={{
                                backgroundColor: '#6B7280',
                                paddingHorizontal: 12,
                                paddingVertical: 4,
                                borderRadius: 12,
                                marginBottom: 8,
                            }}>
                                <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFF' }}>TIME 2</Text>
                            </View>
                            {/* Avatars empilhados */}
                            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                {team2Players.slice(0, 5).map((player, idx) => (
                                    <View
                                        key={player.id}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 16,
                                            marginLeft: idx > 0 ? -10 : 0,
                                            borderWidth: 2,
                                            borderColor: '#FFF',
                                            backgroundColor: '#E5E7EB',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {player.avatar ? (
                                            <Image source={{ uri: player.avatar }} style={{ width: '100%', height: '100%' }} />
                                        ) : (
                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ fontSize: 10, fontWeight: '700', color: '#6B7280' }}>{player.name[0]}</Text>
                                            </View>
                                        )}
                                    </View>
                                ))}
                                {team2Players.length > 5 && (
                                    <View style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                        marginLeft: -10,
                                        borderWidth: 2,
                                        borderColor: '#FFF',
                                        backgroundColor: '#374151',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#FFF' }}>+{team2Players.length - 5}</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#000' }}>
                                {team2Players.length}/{match.playersPerTeam}
                            </Text>
                            {team2Spots > 0 && (
                                <Text style={{ fontSize: 12, color: '#22C55E', fontWeight: '600' }}>
                                    {team2Spots} vaga{team2Spots > 1 ? 's' : ''}
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* Expand indicator */}
                    <View style={{ alignItems: 'center', marginTop: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text style={{ fontSize: 12, color: '#6B7280' }}>
                                {isExpanded ? 'Ocultar jogadores' : 'Ver todos os jogadores'}
                            </Text>
                            <ChevronDown
                                size={16}
                                color="#6B7280"
                                style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
                            />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Expanded Full List */}
                {isExpanded && (
                    <View style={{
                        borderTopWidth: 1,
                        borderTopColor: '#E5E7EB',
                        backgroundColor: '#FAFAFA',
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            {/* Team 1 List */}
                            <View style={{ flex: 1, padding: 12, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
                                <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                                    {team1Players.map(player => (
                                        <View key={player.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                                                <View style={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: 14,
                                                    backgroundColor: '#E5E7EB',
                                                    overflow: 'hidden',
                                                }}>
                                                    {player.avatar ? (
                                                        <Image source={{ uri: player.avatar }} style={{ width: '100%', height: '100%' }} />
                                                    ) : (
                                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#6B7280' }}>{player.name[0]}</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text style={{ fontSize: 12, fontWeight: '500', color: '#000' }} numberOfLines={1}>
                                                    {player.name}
                                                </Text>
                                            </View>
                                            {player.levelScore && (
                                                <Text style={{ fontSize: 11, color: '#1E40AF', fontWeight: '600' }}>
                                                    {player.levelScore.toFixed(1).replace('.', ',')}
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                    {/* Empty spots */}
                                    {Array.from({ length: team1Spots }).map((_, idx) => (
                                        <View key={`empty1-${idx}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 }}>
                                            <View style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: 14,
                                                borderWidth: 1,
                                                borderColor: '#3B82F6',
                                                borderStyle: 'dashed',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <Text style={{ fontSize: 12, color: '#3B82F6' }}>+</Text>
                                            </View>
                                            <Text style={{ fontSize: 12, color: '#3B82F6' }}>Disponível</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Team 2 List */}
                            <View style={{ flex: 1, padding: 12 }}>
                                <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                                    {team2Players.map(player => (
                                        <View key={player.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                                                <View style={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: 14,
                                                    backgroundColor: '#E5E7EB',
                                                    overflow: 'hidden',
                                                }}>
                                                    {player.avatar ? (
                                                        <Image source={{ uri: player.avatar }} style={{ width: '100%', height: '100%' }} />
                                                    ) : (
                                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#6B7280' }}>{player.name[0]}</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text style={{ fontSize: 12, fontWeight: '500', color: '#000' }} numberOfLines={1}>
                                                    {player.name}
                                                </Text>
                                            </View>
                                            {player.levelScore && (
                                                <Text style={{ fontSize: 11, color: '#1E40AF', fontWeight: '600' }}>
                                                    {player.levelScore.toFixed(1).replace('.', ',')}
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                    {/* Empty spots */}
                                    {Array.from({ length: team2Spots }).map((_, idx) => (
                                        <View key={`empty2-${idx}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 }}>
                                            <View style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: 14,
                                                borderWidth: 1,
                                                borderColor: '#3B82F6',
                                                borderStyle: 'dashed',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <Text style={{ fontSize: 12, color: '#3B82F6' }}>+</Text>
                                            </View>
                                            <Text style={{ fontSize: 12, color: '#3B82F6' }}>Disponível</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    const renderMatchCard = (match: Match) => {
        const spotsLeft = match.maxPlayers - match.confirmed;
        const isFull = spotsLeft === 0;
        const isExpanded = expandedMatchId === match.id;
        const isLargeGame = match.maxPlayers > 4;

        return (
            <View
                key={match.id}
                style={{
                    backgroundColor: '#FFF',
                    borderRadius: 16,
                    borderWidth: match.isUserGoing ? 2 : 1,
                    borderColor: match.isUserGoing ? '#22C55E' : '#E5E7EB',
                    overflow: 'hidden',
                }}
            >
                {/* Header - Date and Time */}
                <View style={{ padding: 16, paddingBottom: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View>
                            <Text style={{ fontSize: 17, fontWeight: '800', color: '#000', marginBottom: 4 }}>
                                {match.date} | {match.startTime}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <SportIcon sport={match.sport.toLowerCase().replace(' ', '-')} size={14} showBackground={false} />
                                    <Text style={{ fontSize: 13, color: '#6B7280' }}>{match.gameLevel}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <Text style={{ fontSize: 12 }}>📊</Text>
                                    <Text style={{ fontSize: 13, color: '#6B7280' }}>{match.levelRange}</Text>
                                </View>
                                {isLargeGame && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                        <Users size={14} color="#6B7280" />
                                        <Text style={{ fontSize: 13, color: '#6B7280' }}>{match.confirmed}/{match.maxPlayers}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        {match.isUserGoing && (
                            <View style={{ backgroundColor: '#22C55E', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 }}>
                                <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>VOCÊ VAI</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Players Section */}
                {isLargeGame ? renderLargeGamePlayers(match, isExpanded) : renderSmallGamePlayers(match)}

                {/* Footer - Court, Price and Duration */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: '#F9FAFB',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            backgroundColor: '#E5E7EB',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <MapPin size={16} color="#6B7280" />
                        </View>
                        <View>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#000' }}>{match.courtName}</Text>
                            {match.courtLocation && (
                                <Text style={{ fontSize: 11, color: '#6B7280' }}>{match.courtLocation}</Text>
                            )}
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        {isPublic ? (
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#22C55E' }}>Grátis</Text>
                        ) : (
                            <>
                                <Text style={{ fontSize: 16, fontWeight: '800', color: '#22C55E' }}>
                                    R$ {match.pricePerPerson}
                                </Text>
                                <Text style={{ fontSize: 11, color: '#6B7280' }}>
                                    {match.duration}min
                                </Text>
                            </>
                        )}
                    </View>
                </View>

                {/* Split Payment Badge */}
                {!isPublic && match.allowSplitPayment && (
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        paddingVertical: 8,
                        backgroundColor: '#EFF6FF',
                        borderTopWidth: 1,
                        borderTopColor: '#DBEAFE',
                    }}>
                        <CreditCard size={14} color="#3B82F6" />
                        <Text style={{ fontSize: 12, color: '#1E40AF', fontWeight: '500' }}>
                            Pagamento dividido disponível · Valor garantido
                        </Text>
                    </View>
                )}

                {/* Action Button */}
                <View style={{
                    padding: 12,
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                }}>
                    {match.isUserGoing ? (
                        <TouchableOpacity style={{
                            backgroundColor: '#FFF',
                            paddingVertical: 12,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#D1D5DB',
                            alignItems: 'center',
                        }}>
                            <Text style={{ color: '#374151', fontSize: 14, fontWeight: '600' }}>Cancelar participação</Text>
                        </TouchableOpacity>
                    ) : isFull ? (
                        <View style={{
                            backgroundColor: '#E5E7EB',
                            paddingVertical: 12,
                            borderRadius: 12,
                            alignItems: 'center',
                        }}>
                            <Text style={{ color: '#9CA3AF', fontSize: 14, fontWeight: '600' }}>Partida lotada</Text>
                        </View>
                    ) : (
                        <TouchableOpacity style={{
                            backgroundColor: '#000',
                            paddingVertical: 12,
                            borderRadius: 12,
                            alignItems: 'center',
                        }}>
                            <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '700' }}>
                                Participar{!isPublic ? ` · R$ ${match.pricePerPerson}` : ''}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={{ gap: 16 }}>
            {/* Header */}
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#000' }}>
                        Partidas abertas
                    </Text>
                    <TouchableOpacity onPress={handleViewAll}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#3B82F6' }}>
                            Ver todas
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>
                    Entre em uma partida aberta, jogue com outros e conheça novas pessoas.
                </Text>
            </View>

            {/* Match Cards */}
            {MOCK_MATCHES.map(renderMatchCard)}

            {/* Share action */}
            <TouchableOpacity style={{
                backgroundColor: '#F3F4F6',
                padding: 14,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
            }}>
                <Share2 size={18} color="#374151" />
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>Compartilhar para achar jogadores</Text>
            </TouchableOpacity>
        </View>
    );
}
