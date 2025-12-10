import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';

const goalOptions = [
    {
        id: 'skills',
        label: 'Melhorar minhas habilidades',
        icon: 'sports-score',
    },
    {
        id: 'social',
        label: 'Conhecer novos jogadores',
        icon: 'group',
    },
    {
        id: 'compete',
        label: 'Competir em torneios',
        icon: 'emoji-events',
    },
    {
        id: 'active',
        label: 'Manter-me ativo',
        icon: 'fitness-center',
    },
    {
        id: 'fun',
        label: 'Diversão',
        icon: 'sentiment-satisfied-alt',
    },
];

export default function GoalsScreen() {
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();

    const toggleGoal = (goalId: string) => {
        setSelectedGoals((prev) =>
            prev.includes(goalId)
                ? prev.filter((id) => id !== goalId)
                : [...prev, goalId]
        );
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            // In a real app, save to Supabase here
            // await supabase.from('profiles').update({...}).eq('id', user.id);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            router.replace('/(tabs)');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
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
                    <View className="w-2.5 h-2.5 rounded-full bg-black" />
                </View>
                <View className="w-10" /> {/* Spacer */}
            </View>

            <Text className="text-sm font-medium text-neutral-500 mb-2">
                Pergunta 5 de 5
            </Text>
            <Text className="text-2xl font-bold mb-2">
                Quais seus objetivos?
            </Text>
            <Text className="text-neutral-500 mb-8">
                Selecione todos que se aplicam
            </Text>

            <View className="gap-4">
                {goalOptions.map((option) => {
                    const isSelected = selectedGoals.includes(option.id);
                    return (
                        <Pressable
                            key={option.id}
                            onPress={() => toggleGoal(option.id)}
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
                            </View>
                            <View
                                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-neutral-300'
                                    }`}
                            >
                                {isSelected && (
                                    <MaterialIcons name="check" size={14} color="#000000" />
                                )}
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            <View className="flex-1" />

            <Pressable
                onPress={handleFinish}
                disabled={loading}
                className={`w-full py-4 rounded-2xl flex-row items-center justify-center gap-2 mt-6 ${loading ? 'bg-neutral-400' : 'bg-black'
                    }`}
            >
                <Text className="text-white font-semibold text-lg">
                    {loading ? 'FINALIZANDO...' : 'FINALIZAR'}
                </Text>
                {!loading && (
                    <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
                )}
            </Pressable>
        </View>
    );
}
