import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function WelcomeScreen() {

    const handleSkip = () => {
        router.replace('/(tabs)');
    };

    const handleStart = () => {
        router.push('/(onboarding)/sports');
    };

    return (
        <View className="flex-1 bg-white px-6 py-10">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-10">
                <Pressable onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color="#000" />
                </Pressable>
                <View className="flex-row gap-1">
                    <View className="w-2.5 h-2.5 rounded-full bg-black" />
                    <View className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                    <View className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                    <View className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                    <View className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                </View>
                <Pressable onPress={handleSkip}>
                    <Text className="text-neutral-500 font-medium">Pular</Text>
                </Pressable>
            </View>

            {/* Content */}
            <View className="flex-1 items-center justify-center">
                <View className="w-64 h-64 bg-neutral-100 rounded-full items-center justify-center mb-10">
                    <Text className="text-6xl">🎾 🏃 ⚽</Text>
                </View>

                <Text className="text-3xl font-bold text-center mb-4">
                    Bem-vindo ao Kourt!
                </Text>
                <Text className="text-neutral-500 text-center text-lg px-4">
                    Encontre quadras, organize partidas e conecte-se com jogadores da sua região.
                </Text>
            </View>

            {/* Footer */}
            <Pressable
                onPress={handleStart}
                className="w-full bg-black py-4 rounded-2xl flex-row items-center justify-center gap-2"
            >
                <Text className="text-white font-semibold text-lg">COMEÇAR</Text>
                <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
            </Pressable>
        </View>
    );
}
