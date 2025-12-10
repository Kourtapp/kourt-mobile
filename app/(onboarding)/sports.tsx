import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const sports = [
    { id: 'beach-tennis', name: 'Beach Tennis', icon: 'sports-tennis' },
    { id: 'padel', name: 'Padel', icon: 'sports-tennis' },
    { id: 'football', name: 'Futebol', icon: 'sports-soccer' },
    { id: 'tennis', name: 'Tênis', icon: 'sports-tennis' },
    { id: 'basketball', name: 'Basquete', icon: 'sports-basketball' },
    { id: 'volleyball', name: 'Vôlei', icon: 'sports-volleyball' },
    { id: 'handball', name: 'Handebol', icon: 'sports-handball' },
    { id: 'other', name: 'Outros', icon: 'more-horiz' },
];

export default function SportsScreen() {
    const [selectedSports, setSelectedSports] = useState<string[]>([]);

    const toggleSport = (sportId: string) => {
        setSelectedSports((prev) =>
            prev.includes(sportId)
                ? prev.filter((id) => id !== sportId)
                : [...prev, sportId]
        );
    };

    const handleNext = () => {
        // In a real app, save selectedSports to store/context
        router.push('/(onboarding)/level');
    };

    return (
        <View className="flex-1 bg-white px-6 py-10">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-8">
                <Pressable onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color="#000" />
                </Pressable>
                <View className="flex-row gap-1">
                    <View className="w-2.5 h-2.5 rounded-full bg-black" />
                    <View className="w-2.5 h-2.5 rounded-full bg-black" />
                    <View className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                    <View className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                    <View className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                </View>
                <Pressable onPress={() => router.replace('/(tabs)')}>
                    <Text className="text-neutral-500 font-medium">Pular</Text>
                </Pressable>
            </View>

            <Text className="text-sm font-medium text-neutral-500 mb-2">
                Pergunta 2 de 5
            </Text>
            <Text className="text-2xl font-bold mb-2">
                Quais esportes você pratica?
            </Text>
            <Text className="text-neutral-500 mb-8">
                Selecione todos que se aplicam
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-row flex-wrap gap-3">
                    {sports.map((sport) => {
                        const isSelected = selectedSports.includes(sport.id);
                        return (
                            <Pressable
                                key={sport.id}
                                onPress={() => toggleSport(sport.id)}
                                className={`w-[48%] p-4 rounded-2xl border ${isSelected
                                        ? 'bg-black border-black'
                                        : 'bg-white border-neutral-200'
                                    }`}
                            >
                                <MaterialIcons
                                    name={sport.icon as any}
                                    size={24}
                                    color={isSelected ? '#FFFFFF' : '#000000'}
                                />
                                <Text
                                    className={`mt-2 font-medium ${isSelected ? 'text-white' : 'text-black'
                                        }`}
                                >
                                    {sport.name}
                                </Text>
                                {isSelected && (
                                    <View className="absolute top-3 right-3">
                                        <MaterialIcons name="check" size={16} color="#FFFFFF" />
                                    </View>
                                )}
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>

            <Pressable
                onPress={handleNext}
                className="w-full bg-black py-4 rounded-2xl flex-row items-center justify-center gap-2 mt-6"
            >
                <Text className="text-white font-semibold text-lg">CONTINUAR</Text>
                <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
            </Pressable>
        </View>
    );
}
