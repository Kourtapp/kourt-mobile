import { View, Text, Image } from 'react-native';
import { MapPin } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export function MatchResultPost({ data }: { data: any }) {
    return (
        <Animated.View
            entering={FadeInDown.duration(600).springify()}
            className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm mx-1 my-1"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2
            }}
        >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    RESULTADO DA PARTIDA
                </Text>
                {data.result === 'win' && (
                    <View className="bg-green-100 px-3 py-1 rounded-md">
                        <Text className="text-[10px] font-bold text-green-700 uppercase tracking-wide">
                            VITÓRIA
                        </Text>
                    </View>
                )}
            </View>

            {/* Players & Score */}
            <View className="flex-row items-center justify-between mb-8 px-2">
                {/* Player 1 */}
                <View className="items-center flex-1">
                    <Image
                        source={{ uri: data.team1.player1.image }}
                        className="w-16 h-16 rounded-full bg-gray-200 mb-3 border-2 border-white shadow-sm"
                    />
                    <Text className="font-bold text-slate-900 text-[15px] mb-0.5 text-center" numberOfLines={1}>
                        {data.team1.player1.name.split(' ')[0]} {data.team1.player1.name.split(' ')[1]?.[0]}.
                    </Text>
                    <Text className="text-[11px] text-gray-400 font-medium">{data.team1.player1.level}</Text>
                </View>

                {/* Score Column */}
                <View className="items-center mx-4 min-w-[80px]">
                    <View className="flex-col items-center gap-2">
                        {/* Rendering scores. Assuming data.score is array of strings e.g. ["6-4", "6-4"] */}
                        {(data.score && Array.isArray(data.score)) ? data.score.flat().map((set: string, i: number) => (
                            <Text key={i} className="text-3xl font-black text-slate-900 tracking-tight">
                                {set}
                            </Text>
                        )) : (
                            <>
                                <Text className="text-3xl font-black text-slate-900 tracking-tight">6-4</Text>
                                <Text className="text-3xl font-black text-slate-900 tracking-tight">6-4</Text>
                                <Text className="text-3xl font-black text-slate-900 tracking-tight">7-5</Text>
                            </>
                        )}
                    </View>
                    <Text className="text-xs text-gray-400 font-medium mt-3">{data.duration}</Text>
                </View>

                {/* Player 2 */}
                <View className="items-center flex-1">
                    <Image
                        source={{ uri: data.team2.player1.image }}
                        className="w-16 h-16 rounded-full bg-gray-200 mb-3 border-2 border-white shadow-sm"
                    />
                    <Text className="font-bold text-slate-900 text-[15px] mb-0.5 text-center" numberOfLines={1}>
                        {data.team2.player1.name.split(' ')[0]} {data.team2.player1.name.split(' ')[1]?.[0]}.
                    </Text>
                    <Text className="text-[11px] text-gray-400 font-medium">{data.team2.player1.level}</Text>
                </View>
            </View>

            {/* Footer / Location */}
            <View className="border-t border-gray-50 pt-4 flex-row items-center justify-center gap-1.5 opacity-80">
                <MapPin size={14} color="#60A5FA" fill="#DBEAFE" />
                <Text className="text-[13px] text-blue-500 font-semibold">
                    {data.location}
                </Text>
            </View>
        </Animated.View>
    );
}
