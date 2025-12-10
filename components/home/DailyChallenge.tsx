import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DailyChallengeProps {
    title: string;
    xpReward: number;
    progress: number;
    total: number;
}

export function DailyChallenge({ title, xpReward, progress, total }: DailyChallengeProps) {
    const percentage = (progress / total) * 100;

    return (
        <View className="mx-5 mb-5 p-4 bg-white border border-neutral-200 rounded-2xl">
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2">
                    <MaterialIcons name="bolt" size={20} color="#F59E0B" />
                    <Text className="font-bold text-black">Desafio Diário</Text>
                </View>
                <View className="px-2 py-1 bg-amber-100 rounded-lg">
                    <Text className="text-amber-700 text-xs font-bold">+{xpReward} XP</Text>
                </View>
            </View>

            <Text className="text-sm text-neutral-600 mb-3">{title}</Text>

            <View className="flex-row items-center gap-3">
                <View className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-black rounded-full"
                        style={{ width: `${percentage}%` }}
                    />
                </View>
                <Text className="text-xs font-medium text-black">
                    {progress}/{total}
                </Text>
            </View>
        </View>
    );
}
