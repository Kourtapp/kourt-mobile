import React from 'react';
import { View, Text } from 'react-native';
import { Wifi, Car, Coffee, Utensils, ShowerHead, Lock } from 'lucide-react-native';

interface AmenitiesListProps {
    amenities?: string[];
}

const AMENITY_ICONS: Record<string, any> = {
    'wifi': { icon: Wifi, label: 'Wi-Fi Grátis' },
    'parking': { icon: Car, label: 'Estacionamento' },
    'cafe': { icon: Coffee, label: 'Lanchonete' },
    'food': { icon: Utensils, label: 'Restaurante' },
    'shower': { icon: ShowerHead, label: 'Vestiário' },
    'lockers': { icon: Lock, label: 'Armários' },
};

export function AmenitiesList({ amenities = ['wifi', 'parking', 'shower', 'cafe'] }: AmenitiesListProps) {
    return (
        <View style={{ paddingVertical: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 16 }}>
                O que esse lugar oferece
            </Text>
            <View style={{ gap: 16 }}>
                {amenities.map((item) => {
                    const config = AMENITY_ICONS[item] || { icon: Wifi, label: item };
                    const Icon = config.icon;
                    return (
                        <View key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                            <Icon size={24} color="#374151" />
                            <Text style={{ fontSize: 16, color: '#374151' }}>{config.label}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
