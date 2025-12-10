import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const frequencyOptions = [
    {
        id: 'rarely',
        label: 'Raramente',
        desc: '1-2 vezes por mês',
        icon: 'brightness-5', // brightness_low equivalent
    },
    {
        id: 'occasionally',
        label: 'Ocasionalmente',
        desc: '1 vez por semana',
        icon: 'brightness-6', // brightness_medium equivalent
    },
    {
        id: 'regularly',
        label: 'Regularmente',
        desc: '2-3 vezes por semana',
        icon: 'brightness-7', // brightness_high equivalent
    },
    {
        id: 'intensely',
        label: 'Intensamente',
        desc: '4+ vezes por semana',
        icon: 'local-fire-department',
    },
];

export default function FrequencyScreen() {
    const [frequency, setFrequency] = useState<string>('');

    const handleNext = () => {
        router.push('/(onboarding)/goals');
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
                    <View className="w-2.5 h-2.5 rounded-full bg-black" />
                    <View className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                </View>
                <Pressable onPress={() => router.replace('/(tabs)')}>
                    <Text className="text-neutral-500 font-medium">Pular</Text>
                </Pressable>
            </View>

            <Text className="text-sm font-medium text-neutral-500 mb-2">
                Pergunta 4 de 5
            </Text>
            <Text className="text-2xl font-bold mb-2">
                Com que frequência você joga?
            </Text>
            <Text className="text-neutral-500 mb-8">
                Nos ajuda a sugerir horários
            </Text>

            <View className="gap-4">
                {frequencyOptions.map((option) => {
                    const isSelected = frequency === option.id;
                    return (
                        <Pressable
                            key={option.id}
                            onPress={() => setFrequency(option.id)}
                            className={`flex-row items-center p-4 rounded-2xl border ${isSelected
                                    ? 'bg-black border-black'
                                    : 'bg-white border-neutral-200'
                                }`}
                        >
                            <View
                                className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${isSelected ? 'bg-white/20' : 'bg-neutral-100'
                                    }`}
                            >
                                <MaterialIcons
                                    name={option.icon as any}
                                    size={20}
                                    color={isSelected ? '#FFFFFF' : '#000000'}
                                />
                            </View>
                            <View className="flex-1">
                                <Text
                                    className={`font-semibold text-lg ${isSelected ? 'text-white' : 'text-black'
                                        }`}
                                >
                                    {option.label}
                                </Text>
                                <Text
                                    className={`text-sm ${isSelected ? 'text-neutral-300' : 'text-neutral-500'
                                        }`}
                                >
                                    {option.desc}
                                </Text>
                            </View>
                            <View
                                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? 'border-white' : 'border-neutral-300'
                                    }`}
                            >
                                {isSelected && (
                                    <View className="w-3 h-3 rounded-full bg-white" />
                                )}
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            <View className="flex-1" />

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
