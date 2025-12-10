import { View, Text, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

import { updateScore, finishMatch } from '@/services/matches';

export default function LiveScoreScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [score, setScore] = useState({
        teamA: { sets: [0], games: 0 },
        teamB: { sets: [0], games: 0 },
    });
    const [elapsedTime, setElapsedTime] = useState(0);

    // Animação do placar
    const scoreAScale = useSharedValue(1);
    const scoreBScale = useSharedValue(1);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const addPoint = (team: 'A' | 'B') => {
        // Animação
        if (team === 'A') {
            scoreAScale.value = withSpring(1.2, {}, () => {
                scoreAScale.value = withSpring(1);
            });
        } else {
            scoreBScale.value = withSpring(1.2, {}, () => {
                scoreBScale.value = withSpring(1);
            });
        }

        // Atualizar placar
        const newScore = { ...score };
        if (team === 'A') {
            newScore.teamA.games += 1;
        } else {
            newScore.teamB.games += 1;
        }

        setScore(newScore);
    };

    const handleFinish = () => {
        Alert.alert(
            'Finalizar Partida',
            'Tem certeza que deseja finalizar?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Finalizar',
                    onPress: async () => {
                        try {
                            // await finishMatch(id, score);
                            Alert.alert(
                                'Partida Finalizada!',
                                'Parabéns! A partida foi registrada.',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => router.replace('/(tabs)')
                                    }
                                ]
                            );
                        } catch (error: any) {
                            Alert.alert('Erro', error.message);
                        }
                    },
                },
            ]
        );
    };

    const scoreAStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scoreAScale.value }],
    }));

    const scoreBStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scoreBScale.value }],
    }));

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-black px-5 pt-14 pb-6">
                <View className="flex-row items-center justify-between mb-4">
                    <Pressable onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={24} color="#FFF" />
                    </Pressable>
                    <Text className="text-white font-bold">Placar ao Vivo</Text>
                    <Pressable>
                        <MaterialIcons name="more-vert" size={24} color="#FFF" />
                    </Pressable>
                </View>

                <View className="items-center">
                    <View className="flex-row items-center gap-2 mb-1">
                        <MaterialIcons name="sports-tennis" size={16} color="#FFF" />
                        <Text className="text-white font-medium">Beach Tennis</Text>
                    </View>
                    <Text className="text-white/70 text-sm mb-2">Arena Beach Tennis</Text>
                    <View className="flex-row items-center gap-1 px-3 py-1 bg-red-500 rounded-full">
                        <View className="w-2 h-2 bg-white rounded-full" />
                        <Text className="text-white text-sm font-medium">
                            ⏱️ {formatTime(elapsedTime)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Placar */}
            <View className="px-5 py-8">
                <View className="flex-row items-center justify-between">
                    {/* Time A */}
                    <View className="items-center flex-1">
                        <Text className="text-sm text-neutral-500 mb-2">TIME A</Text>
                        <View className="flex-row gap-2 mb-3">
                            <View className="w-10 h-10 bg-black rounded-full items-center justify-center">
                                <Text className="text-white text-xs font-bold">B</Text>
                            </View>
                            <View className="w-10 h-10 bg-neutral-300 rounded-full" />
                        </View>
                        <Text className="text-sm font-medium text-black">Bruno</Text>
                        <Text className="text-xs text-neutral-500">Marina</Text>
                    </View>

                    {/* Placar Central */}
                    <View className="flex-row items-center gap-4">
                        <Animated.View
                            style={scoreAStyle}
                            className="w-20 h-24 bg-black rounded-2xl items-center justify-center"
                        >
                            <Text className="text-5xl font-black text-white">
                                {score.teamA.games}
                            </Text>
                        </Animated.View>

                        <Text className="text-2xl text-neutral-300">:</Text>

                        <Animated.View
                            style={scoreBStyle}
                            className="w-20 h-24 bg-neutral-100 rounded-2xl items-center justify-center"
                        >
                            <Text className="text-5xl font-black text-black">
                                {score.teamB.games}
                            </Text>
                        </Animated.View>
                    </View>

                    {/* Time B */}
                    <View className="items-center flex-1">
                        <Text className="text-sm text-neutral-500 mb-2">TIME B</Text>
                        <View className="flex-row gap-2 mb-3">
                            <View className="w-10 h-10 bg-neutral-300 rounded-full" />
                            <View className="w-10 h-10 bg-neutral-300 rounded-full" />
                        </View>
                        <Text className="text-sm font-medium text-black">Pedro</Text>
                        <Text className="text-xs text-neutral-500">Lucas</Text>
                    </View>
                </View>

                {/* Sets */}
                <View className="flex-row justify-center gap-8 mt-6">
                    <View className="items-center">
                        <Text className="text-xs text-neutral-500 mb-1">SET 1</Text>
                        <Text className="text-sm font-bold text-black">
                            {score.teamA.sets[0]}-{score.teamB.sets[0]}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Last Point */}
            <View className="mx-5 mb-6 p-4 bg-neutral-50 rounded-2xl">
                <Text className="text-xs text-neutral-500 mb-1">Último ponto</Text>
                <Text className="text-sm font-medium text-black">Time A marcou! 🔥</Text>
            </View>

            {/* Controls */}
            <View className="px-5 space-y-3">
                <View className="flex-row gap-3">
                    <Pressable
                        onPress={() => addPoint('A')}
                        className="flex-1 py-4 bg-black rounded-2xl items-center"
                    >
                        <Text className="text-white font-semibold">+1 Time A</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => addPoint('B')}
                        className="flex-1 py-4 bg-neutral-800 rounded-2xl items-center"
                    >
                        <Text className="text-white font-semibold">+1 Time B</Text>
                    </Pressable>
                </View>

                <Pressable
                    onPress={handleFinish}
                    className="w-full py-4 bg-white border-2 border-black rounded-2xl items-center"
                >
                    <Text className="text-black font-bold">Finalizar Partida</Text>
                </Pressable>
            </View>
        </View>
    );
}
