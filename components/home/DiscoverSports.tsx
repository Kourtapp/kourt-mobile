import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';

interface Sport {
    id: string;
    name: string;
    emoji: string;
    playersCount: number;
    color: string;
}

interface DiscoverSportsProps {
    sports: Sport[];
    onSelectSport?: (sportId: string) => void;
}

export function DiscoverSports({ sports, onSelectSport }: DiscoverSportsProps) {
    return (
        <View style={{ marginTop: 24 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#000' }}>
                    🎯 Descubra novos esportes
                </Text>
            </View>

            {/* Horizontal scroll */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
            >
                {sports.map((sport) => (
                    <Pressable
                        key={sport.id}
                        onPress={() => onSelectSport?.(sport.id)}
                        style={{
                            width: 140,
                            backgroundColor: sport.color,
                            borderRadius: 16,
                            padding: 16,
                        }}
                    >
                        <Text style={{ fontSize: 32, marginBottom: 8 }}>{sport.emoji}</Text>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#000', marginBottom: 4 }}>
                            {sport.name}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#6B7280' }}>
                            {sport.playersCount.toLocaleString()} jogadores
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}
