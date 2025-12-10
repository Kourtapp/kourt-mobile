import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

interface GamificationCardProps {
    level: number;
    xp: number;
    xpToNextLevel: number;
    streak: number;
    wins: number;
    isPro: boolean;
}

export function GamificationCard({
    level,
    xp,
    xpToNextLevel,
    streak,
    wins,
    isPro,
}: GamificationCardProps) {
    const progress = (xp / xpToNextLevel) * 100;

    return (
        <View className="mx-5 mb-5 p-4 bg-black rounded-2xl">
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-3">
                <View className="w-12 h-12 bg-neutral-800 rounded-xl items-center justify-center">
                    <Text className="text-white font-bold text-lg">{level}</Text>
                </View>

                <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                        <Text className="text-white font-bold">Nível {level}</Text>
                        {isPro && (
                            <View className="px-2 py-0.5 bg-amber-500/20 rounded-full">
                                <Text className="text-amber-400 text-[9px] font-bold">PRO</Text>
                            </View>
                        )}
                    </View>
                    <Text className="text-xs text-neutral-400">
                        {xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP para o próximo nível
                    </Text>
                </View>

                <Pressable
                    onPress={() => router.push('/achievements')}
                    className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center"
                >
                    <MaterialIcons name="emoji-events" size={24} color="#FFF" />
                </Pressable>
            </View>

            {/* Progress Bar */}
            <View className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <View
                    className="h-full bg-white rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </View>

            {/* Stats */}
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center gap-1.5">
                        <MaterialIcons name="local-fire-department" size={14} color="#FBBF24" />
                        <Text className="text-white text-xs font-medium">{streak} dias</Text>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                        <MaterialIcons name="check-circle" size={14} color="#4ADE80" />
                        <Text className="text-white text-xs font-medium">{wins} vitórias</Text>
                    </View>
                </View>

                <Pressable
                    onPress={() => router.push('/achievements')}
                    className="px-3 py-1.5 bg-white/10 rounded-lg"
                >
                    <Text className="text-xs text-white font-medium">Ver conquistas</Text>
                </Pressable>
            </View>
        </View>
    );
}
