import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, Sun, Moon, Users, Calendar } from 'lucide-react-native';

// Mock data - será substituído por dados reais do banco
const MOCK_MATCHES = [
    {
        id: '1',
        time: '06:00 - 08:00',
        period: 'morning',
        status: 'available',
        players: 2,
        maxPlayers: 4,
        people: [
            { name: 'Carlos', initials: 'CA' },
            { name: 'Ana', initials: 'AN' },
        ]
    },
    {
        id: '2',
        time: '08:00 - 10:00',
        period: 'morning',
        status: 'full',
        players: 4,
        maxPlayers: 4,
        people: [
            { name: 'João', initials: 'JO' },
            { name: 'Maria', initials: 'MA' },
            { name: 'Pedro', initials: 'PE' },
            { name: 'Lucia', initials: 'LU' },
        ]
    },
    {
        id: '3',
        time: '10:00 - 12:00',
        period: 'morning',
        status: 'empty',
        players: 0,
        maxPlayers: 4,
        people: []
    },
    {
        id: '4',
        time: '14:00 - 16:00',
        period: 'afternoon',
        status: 'available',
        players: 1,
        maxPlayers: 4,
        people: [
            { name: 'Rafael', initials: 'RA' },
        ]
    },
    {
        id: '5',
        time: '16:00 - 18:00',
        period: 'afternoon',
        status: 'available',
        players: 3,
        maxPlayers: 4,
        people: [
            { name: 'Bruno', initials: 'BR' },
            { name: 'Carla', initials: 'CA' },
            { name: 'Thiago', initials: 'TH' },
        ]
    },
    {
        id: '6',
        time: '18:00 - 20:00',
        period: 'evening',
        status: 'user_going',
        players: 3,
        maxPlayers: 4,
        people: [
            { name: 'Você', initials: 'VC', isUser: true },
            { name: 'Pedro F.', initials: 'PF' },
            { name: 'Marina S.', initials: 'MS' },
        ]
    },
    {
        id: '7',
        time: '20:00 - 22:00',
        period: 'night',
        status: 'empty',
        players: 0,
        maxPlayers: 4,
        people: []
    },
];

export default function CourtMatchesScreen() {
    const router = useRouter();

    const getStatusBadge = (status: string, players: number, maxPlayers: number) => {
        switch (status) {
            case 'full':
                return { text: 'LOTADO', bg: '#FEE2E2', color: '#991B1B' };
            case 'user_going':
                return { text: 'VOCÊ VAI', bg: '#22C55E', color: '#FFF' };
            case 'empty':
                return { text: 'VAZIO', bg: '#F3F4F6', color: '#6B7280' };
            default:
                return { text: `FALTA ${maxPlayers - players}`, bg: '#DCFCE7', color: '#166534' };
        }
    };

    const getPeriodIcon = (period: string) => {
        if (period === 'night') return <Moon size={16} color="#9CA3AF" />;
        return <Sun size={16} color="#9CA3AF" />;
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#F3F4F6'
            }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#F3F4F6',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <ChevronLeft size={24} color="#000" />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#000' }}>
                        Partidas do dia
                    </Text>
                    <Text style={{ fontSize: 13, color: '#6B7280' }}>
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </Text>
                </View>
                <View style={{
                    backgroundColor: '#F3F4F6',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20
                }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>
                        {MOCK_MATCHES.length} horários
                    </Text>
                </View>
            </View>

            {/* Empty State */}
            {MOCK_MATCHES.length === 0 ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
                    <View style={{
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                        backgroundColor: '#F0FDF4',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 24
                    }}>
                        <Calendar size={48} color="#22C55E" />
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: '#000', textAlign: 'center', marginBottom: 8 }}>
                        Nenhuma partida agendada
                    </Text>
                    <Text style={{ fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22 }}>
                        Ainda não há partidas marcadas para este dia. Seja o primeiro a fazer check-in!
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            backgroundColor: '#000',
                            paddingHorizontal: 32,
                            paddingVertical: 14,
                            borderRadius: 12,
                            marginTop: 24
                        }}
                    >
                        <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '600' }}>
                            Fazer check-in
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, gap: 12 }}
                showsVerticalScrollIndicator={false}
            >
                {MOCK_MATCHES.map((match) => {
                    const badge = getStatusBadge(match.status, match.players, match.maxPlayers);
                    const isUserGoing = match.status === 'user_going';
                    const isFull = match.status === 'full';

                    return (
                        <View
                            key={match.id}
                            style={{
                                padding: 16,
                                backgroundColor: isUserGoing ? '#ECFDF5' : '#FAFAFA',
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: isUserGoing ? '#22C55E' : '#F3F4F6',
                                opacity: isFull ? 0.7 : 1
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    {getPeriodIcon(match.period)}
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>
                                        {match.time}
                                    </Text>
                                </View>
                                <View style={{
                                    backgroundColor: badge.bg,
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    borderRadius: 4
                                }}>
                                    <Text style={{
                                        color: badge.color,
                                        fontSize: 10,
                                        fontWeight: '700',
                                        textTransform: 'uppercase'
                                    }}>
                                        {badge.text}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    {match.people.length > 0 ? (
                                        <View style={{ flexDirection: 'row' }}>
                                            {match.people.slice(0, 4).map((person, idx) => (
                                                <View
                                                    key={idx}
                                                    style={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: 14,
                                                        backgroundColor: (person as any).isUser ? '#000' : '#E5E7EB',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginLeft: idx > 0 ? -10 : 0,
                                                        borderWidth: 2,
                                                        borderColor: isUserGoing ? '#ECFDF5' : '#FAFAFA'
                                                    }}
                                                >
                                                    <Text style={{
                                                        fontSize: 10,
                                                        fontWeight: '700',
                                                        color: (person as any).isUser ? '#FFF' : '#6B7280'
                                                    }}>
                                                        {person.initials}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    ) : (
                                        <Users size={20} color="#9CA3AF" />
                                    )}
                                    <Text style={{ fontSize: 13, color: '#6B7280' }}>
                                        {match.players > 0
                                            ? `${match.players}/${match.maxPlayers} jogadores`
                                            : 'Nenhum check-in ainda'
                                        }
                                    </Text>
                                </View>

                                {!isFull && (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: isUserGoing ? '#FFF' : '#000',
                                            paddingHorizontal: 16,
                                            paddingVertical: 8,
                                            borderRadius: 20,
                                            borderWidth: isUserGoing ? 1 : 0,
                                            borderColor: '#D1D5DB'
                                        }}
                                    >
                                        <Text style={{
                                            color: isUserGoing ? '#374151' : '#FFF',
                                            fontSize: 13,
                                            fontWeight: '600'
                                        }}>
                                            {isUserGoing ? 'Cancelar' : match.players === 0 ? 'Ser o 1º' : 'Vou'}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                {isFull && (
                                    <View style={{
                                        backgroundColor: '#E5E7EB',
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        borderRadius: 20
                                    }}>
                                        <Text style={{ color: '#9CA3AF', fontSize: 13, fontWeight: '600' }}>
                                            Cheio
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
            )}
        </SafeAreaView>
    );
}
