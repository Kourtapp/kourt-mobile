import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// Mock selected sports from previous step
const selectedSports = [
    { id: 'beach-tennis', name: 'Beach Tennis' },
    { id: 'padel', name: 'Padel' },
];

const levelOptions = [
    { id: 'beginner', label: 'Iniciante', short: 'Inic.' },
    { id: 'intermediate', label: 'Intermediário', short: 'Inter.' },
    { id: 'advanced', label: 'Avançado', short: 'Avanç.' },
    { id: 'pro', label: 'Pro', short: 'Pro' },
];

export default function LevelScreen() {
    const [levels, setLevels] = useState<Record<string, string>>({});

    const setLevel = (sportId: string, levelId: string) => {
        setLevels((prev) => ({ ...prev, [sportId]: levelId }));
    };

    const handleNext = () => {
        router.push('/(onboarding)/frequency');
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
                    <View className="w-2.5 h-2.5 rounded-full bg-black" />
                    <View className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                    <View className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                </View>
                <Pressable onPress={() => router.replace('/(tabs)')}>
                    <Text className="text-neutral-500 font-medium">Pular</Text>
                </Pressable>
            </View>

            <Text className="text-sm font-medium text-neutral-500 mb-2">
                Pergunta 3 de 5
            </Text>
            <Text className="text-2xl font-bold mb-2">
                Qual seu nível em cada esporte?
            </Text>
            <Text className="text-neutral-500 mb-8">
                Baseado nos esportes selecionados
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="gap-6">
                    {selectedSports.map((sport) => (
                        <View key={sport.id} className="bg-neutral-50 p-4 rounded-2xl">
                            <Text className="font-semibold text-lg mb-4">{sport.name}</Text>
                            <View className="flex-row justify-between gap-2">
                                {levelOptions.map((level) => {
                                    const isSelected = levels[sport.id] === level.id;
                                    return (
                                        <Pressable
                                            key={level.id}
                                            onPress={() => setLevel(sport.id, level.id)}
                                            className={`flex-1 py-2 rounded-lg items-center border ${isSelected
                                                    ? 'bg-black border-black'
                                                    : 'bg-white border-neutral-200'
                                                }`}
                                        >
                                            <Text
                                                className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-black'
                                                    }`}
                                            >
                                                {level.short}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>
                    ))}

                    <View className="bg-neutral-50 p-4 rounded-2xl mt-2">
                        <Text className="font-semibold mb-2">Legenda dos níveis</Text>
                        <View className="gap-2">
                            <Text className="text-sm text-neutral-600">
                                ○ Iniciante — Aprendendo
                            </Text>
                            <Text className="text-sm text-neutral-600">
                                ○ Intermed. — Joga regular
                            </Text>
                            <Text className="text-sm text-neutral-600">
                                ○ Avançado — Competitivo
                            </Text>
                            <Text className="text-sm text-neutral-600">
                                ○ Pro — Joga torneios
                            </Text>
                        </View>
                    </View>
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
