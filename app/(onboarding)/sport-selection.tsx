import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SportIcon, getSportIcon } from '../../components/SportIcon';

const sports = [
    { id: 'beach-tennis', name: 'Beach Tennis' },
    { id: 'padel', name: 'Padel' },
    { id: 'football', name: 'Futebol' },
    { id: 'tennis', name: 'Tênis' },
    { id: 'volleyball', name: 'Vôlei' },
    { id: 'basketball', name: 'Basquete' },
    { id: 'futevolei', name: 'Futevôlei' },
    { id: 'handball', name: 'Handebol' },
];

export default function SportsScreen() {
    console.log('SPORTS SCREEN RENDERED');
    const [selectedSports, setSelectedSports] = useState<string[]>([]);

    const toggleSport = (sportId: string) => {
        setSelectedSports((prev) =>
            prev.includes(sportId)
                ? prev.filter((id) => id !== sportId)
                : [...prev, sportId]
        );
    };

    const handleNext = () => {
        if (selectedSports.length === 0) {
            // Optional: Alert user to select at least one
            return;
        }
        router.push({
            pathname: '/(onboarding)/level',
            params: { sports: JSON.stringify(selectedSports) }
        });
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
                        const hasSportIcon = getSportIcon(sport.id);
                        return (
                            <Pressable
                                key={sport.id}
                                testID={sport.id}
                                onPress={() => toggleSport(sport.id)}
                                className={`w-[48%] p-4 rounded-2xl border ${isSelected
                                    ? 'bg-black border-black'
                                    : 'bg-white border-neutral-200'
                                    }`}
                            >
                                {hasSportIcon ? (
                                    <SportIcon sport={sport.id} size={48} showBackground={false} />
                                ) : (
                                    <View style={{ width: 48, height: 48, backgroundColor: isSelected ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                                        <MaterialIcons name="sports" size={32} color={isSelected ? '#FFFFFF' : '#6B7280'} />
                                    </View>
                                )}
                                <Text
                                    className={`mt-3 font-semibold ${isSelected ? 'text-white' : 'text-black'
                                        }`}
                                >
                                    {sport.name}
                                </Text>
                                {isSelected && (
                                    <View className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full items-center justify-center">
                                        <MaterialIcons name="check" size={16} color="#FFFFFF" />
                                    </View>
                                )}
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>

            <Pressable
                testID="next-button"
                onPress={handleNext}
                className="w-full bg-black py-4 rounded-2xl flex-row items-center justify-center gap-2 mt-6"
            >
                <Text className="text-white font-semibold text-lg">CONTINUAR</Text>
                <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
            </Pressable>
        </View>
    );
}
