import React from 'react';
import { View, Text } from 'react-native';
import { Wifi, Car, Utensils, ShowerHead, Lamp, Droplets, Dumbbell, Sofa } from 'lucide-react-native';

interface AmenitiesListProps {
    amenities?: string[];
}

// Icons mapping matching the screenshot
const AMENITY_ICONS: Record<string, any> = {
    'night_lighting': { icon: Lamp, label: 'Iluminação noturna' },
    'parking': { icon: Car, label: 'Estacionamento' },
    'shower': { icon: ShowerHead, label: 'Vestiário' },
    'water': { icon: Droplets, label: 'Bebedouro' },
    'food': { icon: Utensils, label: 'Restaurante' },
    'equipment': { icon: Dumbbell, label: 'Aluguel de equip.' },
    'wifi': { icon: Wifi, label: 'Wi-Fi grátis' },
    'rest_area': { icon: Sofa, label: 'Área de descanso' },
};

export function AmenitiesList({ amenities = ['night_lighting', 'parking', 'shower', 'water', 'food', 'equipment', 'wifi', 'rest_area'] }: AmenitiesListProps) {
    // Split into chunks of 2 for grid
    const chunks = [];
    for (let i = 0; i < amenities.length; i += 2) {
        chunks.push(amenities.slice(i, i + 2));
    }

    return (
        <View style={{ paddingVertical: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 16 }}>
                Comodidades
            </Text>
            <View style={{ gap: 16 }}>
                {chunks.map((chunk, index) => (
                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {chunk.map((item) => {
                            const config = AMENITY_ICONS[item] || { icon: Wifi, label: item };
                            const Icon = config.icon;
                            return (
                                <View key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, width: '48%' }}>
                                    <Icon size={24} color="#374151" strokeWidth={1.5} />
                                    <Text style={{ fontSize: 15, color: '#374151', flex: 1 }} numberOfLines={2}>{config.label}</Text>
                                </View>
                            );
                        })}
                    </View>
                ))}
            </View>
        </View>
    );
}
