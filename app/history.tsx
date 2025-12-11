import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Filter, Check, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HistoryScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const StatBox = ({ value, label, color }: { value: string, label: string, color?: string }) => (
        <View className="flex-1 items-center">
            <Text className={`text-2xl font-black ${color || 'text-gray-900'}`}>{value}</Text>
            <Text className="text-xs text-gray-500 font-medium">{label}</Text>
        </View>
    );

    const MatchItem = ({
        sport, result, score, opponent, location, isWin
    }: {
        sport: string, result: 'Vitória' | 'Derrota', score: string, opponent: string, location: string, isWin: boolean
    }) => (
        <Pressable
            onPress={() => router.push('/match/1')}
            className="flex-row items-center bg-white border border-gray-100 rounded-2xl p-4 mb-3"
        >
            <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${isWin ? 'bg-green-100' : 'bg-red-100'}`}>
                {isWin ? <Check size={20} color="#16a34a" /> : <X size={20} color="#ef4444" />}
            </View>

            <View className="flex-1">
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="font-bold text-gray-900 text-base">{sport}</Text>
                    <Text className={`font-bold text-base ${isWin ? 'text-green-600' : 'text-red-500'}`}>{score}</Text>
                </View>
                <Text className="text-gray-500 text-sm">vs {opponent} · {location}</Text>
            </View>
        </Pressable>
    );

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View
                className="flex-row items-center justify-between px-5 py-3 border-b border-gray-100 bg-white"
                style={{ paddingTop: insets.top }}
            >
                <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-gray-50">
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text className="font-bold text-lg text-gray-900">Histórico</Text>
                <Pressable className="w-10 h-10 items-center justify-center -mr-2 rounded-full active:bg-gray-50">
                    <Filter size={20} color="#000" />
                </Pressable>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Summary Stats */}
                <View className="flex-row justify-between px-5 py-8 border-b border-gray-50">
                    <StatBox value="247" label="Partidas" />
                    <StatBox value="165" label="Vitórias" color="text-green-600" />
                    <StatBox value="82" label="Derrotas" color="text-red-500" />
                    <StatBox value="67%" label="Win Rate" />
                </View>

                {/* List content */}
                <View className="px-5 pt-6 pb-10">
                    {/* December 2024 */}
                    <Text className="font-bold text-gray-500 text-xs mb-4 uppercase tracking-wide">Dezembro 2024</Text>

                    <MatchItem
                        sport="Beach Tennis" result="Vitória" score="6-4, 6-3"
                        opponent="Pedro Lima" location="Arena Ibirapuera" isWin={true}
                    />
                    <MatchItem
                        sport="Padel" result="Derrota" score="4-6, 3-6"
                        opponent="Ana Silva" location="Clube Pinheiros" isWin={false}
                    />
                    <MatchItem
                        sport="Beach Tennis" result="Vitória" score="6-2, 6-4"
                        opponent="Carlos Mendes" location="Arena Beach" isWin={true}
                    />

                    {/* November 2024 */}
                    <Text className="font-bold text-gray-500 text-xs mb-4 mt-4 uppercase tracking-wide">Novembro 2024</Text>

                    <MatchItem
                        sport="Futebol" result="Vitória" score="3-2"
                        opponent="Pelada Sábado" location="CERET" isWin={true}
                    />
                    <MatchItem
                        sport="Vôlei" result="Derrota" score="1-2"
                        opponent="Quadra Ibirapuera" location="" isWin={false}
                    />
                </View>

                <Pressable className="mx-5 bg-gray-50 py-4 rounded-xl items-center mb-8">
                    <Text className="font-bold text-gray-900">Carregar mais</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}
