import { View, Text } from 'react-native';
import { Search } from 'lucide-react-native';

export function TrainingPost({ data }: { data: any }) {
    return (
        <View className="rounded-2xl overflow-hidden h-80 relative bg-neutral-900">
            {/* Placeholder Gradient Background */}
            <View className="absolute inset-0 bg-neutral-800 opacity-50" />

            <View className="absolute top-4 left-4 flex-row gap-2">
                <View className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
                    <Search size={12} color="white" />
                    <Text className="text-white text-xs font-bold">BeachTennis</Text>
                </View>
            </View>

            {/* Stats Overlay */}
            <View className="absolute bottom-0 w-full p-5 bg-gradient-to-t from-black/80 to-transparent">
                <View className="flex-row items-end justify-between">
                    <View className="flex-row gap-6">
                        <View>
                            <Text className="text-3xl font-black text-white">{data.stats.duration.split(' ')[0]}</Text>
                            <Text className="text-white/70 text-xs">min</Text>
                        </View>
                        <View>
                            <Text className="text-3xl font-black text-white">{data.stats.calories.split(' ')[0]}</Text>
                            <Text className="text-white/70 text-xs">kcal</Text>
                        </View>
                        <View>
                            <Text className="text-3xl font-black text-white">{data.stats.bpm.split(' ')[0]}</Text>
                            <Text className="text-white/70 text-xs">bpm avg</Text>
                        </View>
                    </View>

                    <View className="bg-green-500 px-3 py-2 rounded-lg items-center">
                        <Text className="text-white text-[10px] font-bold uppercase mb-0.5">{data.result.label}</Text>
                        <Text className="text-white text-sm font-black">{data.result.score}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
