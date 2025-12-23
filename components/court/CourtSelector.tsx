import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

interface Court {
    id: string;
    name: string;
    image?: string;
    sport?: string;
    price?: number;
    covered?: boolean;
    surface?: string;
}

interface CourtSelectorProps {
    courts: Court[];
    selectedCourtId: string;
    onSelectCourt: (courtId: string) => void;
}

export function CourtSelector({ courts, selectedCourtId, onSelectCourt }: CourtSelectorProps) {
    if (courts.length <= 1) return null;

    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 12 }}>
                Quadras disponíveis
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
            >
                {courts.map((court) => {
                    const isSelected = court.id === selectedCourtId;
                    return (
                        <TouchableOpacity
                            key={court.id}
                            onPress={() => onSelectCourt(court.id)}
                            style={{
                                width: 140,
                                borderRadius: 12,
                                overflow: 'hidden',
                                borderWidth: 2,
                                borderColor: isSelected ? '#22C55E' : '#E5E7EB',
                                backgroundColor: '#fff',
                            }}
                        >
                            {/* Court Image */}
                            <View style={{ height: 80, backgroundColor: '#F3F4F6' }}>
                                {court.image ? (
                                    <Image
                                        source={{ uri: court.image }}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 24 }}>🎾</Text>
                                    </View>
                                )}
                                {isSelected && (
                                    <View style={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        width: 20,
                                        height: 20,
                                        borderRadius: 10,
                                        backgroundColor: '#22C55E',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>✓</Text>
                                    </View>
                                )}
                            </View>

                            {/* Court Info */}
                            <View style={{ padding: 10 }}>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: '#000' }} numberOfLines={1}>
                                    {court.name}
                                </Text>
                                <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                                    {court.sport || 'Beach Tennis'}
                                </Text>
                                {/* Surface and Covered info */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                    {court.surface && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                                            <Text style={{ fontSize: 10 }}>🏖️</Text>
                                            <Text style={{ fontSize: 10, color: '#6B7280' }}>{court.surface}</Text>
                                        </View>
                                    )}
                                    {court.covered !== undefined && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                                            <Text style={{ fontSize: 10 }}>{court.covered ? '🏠' : '☀️'}</Text>
                                            <Text style={{ fontSize: 10, color: '#6B7280' }}>{court.covered ? 'Coberta' : 'Aberta'}</Text>
                                        </View>
                                    )}
                                </View>
                                {/* Price */}
                                <View style={{ marginTop: 6 }}>
                                    {court.price ? (
                                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#22C55E' }}>
                                            R${court.price}/h
                                        </Text>
                                    ) : (
                                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#22C55E' }}>
                                            Grátis
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}
