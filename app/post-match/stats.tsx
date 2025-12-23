import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ThumbsUp, MessageSquare, Share2, Trophy, User, Watch, Activity, Check, Flame, Search } from 'lucide-react-native';
import Svg, { Path, Circle } from 'react-native-svg';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Image } from 'expo-image';


const { width } = Dimensions.get('window');

export default function MatchDetailsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const LineChart = () => (
        <Svg height="100" width={width - 40}>
            <Path
                d="M0 80 C 40 40, 80 80, 120 40 S 200 60, 260 20 S 320 80, 380 40"
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
            />
            <Path
                d="M0 80 C 40 40, 80 80, 120 40 S 200 60, 260 20 S 320 80, 380 40 V 100 H 0 Z"
                fill="#ffedd5"
                fillOpacity="0.5"
            />
        </Svg>
    );

    const DonutChart = ({ percentage, color, size = 80, strokeWidth = 8, label, subLabel }: any) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <View className="items-center justify-center" style={{ width: size, height: size }}>
                <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#f3f4f6"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin={`${size / 2}, ${size / 2}`}
                    />
                </Svg>
                <View className="absolute items-center justify-center">
                    <Text className="font-bold text-gray-900 text-lg">{label}</Text>
                    {subLabel && <Text className="text-[10px] text-gray-500">{subLabel}</Text>}
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View
                className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100 bg-white z-10"
                style={{ paddingTop: insets.top }}
            >
                <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text className="font-bold text-lg text-gray-900">Estatísticas da Partida</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                {/* Filters */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 py-4 flex-row gap-3">
                    <Pressable className="bg-black px-4 py-2 rounded-full flex-row items-center gap-2">
                        <Search size={14} color="#FFF" />
                        <Text className="text-white font-bold text-sm">Beach Tennis</Text>
                    </Pressable>
                    <Pressable className="bg-gray-100 px-4 py-2 rounded-full flex-row items-center gap-2">
                        <Search size={14} color="#000" />
                        <Text className="text-gray-900 font-bold text-sm">Padel</Text>
                    </Pressable>
                    <Pressable className="bg-gray-100 px-4 py-2 rounded-full flex-row items-center gap-2">
                        <Activity size={14} color="#000" />
                        <Text className="text-gray-900 font-bold text-sm">Futebol</Text>
                    </Pressable>
                    <View className="w-5" />
                </ScrollView>

                {/* User & Match Info */}
                <View className="px-5 mb-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-3">
                            <View className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center">
                                <User size={24} color="#6b7280" />
                            </View>
                            <View>
                                <View className="flex-row items-center gap-1">
                                    <Text className="font-bold text-lg text-gray-900">Bruno Bemlevinho</Text>
                                    <Check size={14} color="#3b82f6" fill="#3b82f6" />
                                </View>
                                <Text className="text-gray-500 text-xs">Hoje • Arena Beach Ibirapuera</Text>
                            </View>
                        </View>
                        <Pressable className="bg-black px-4 py-2 rounded-full">
                            <Text className="text-white font-bold text-xs">Seguir</Text>
                        </Pressable>
                    </View>

                    <Text className="text-3xl font-extrabold text-gray-900 mb-6">Vitória! 6-4, 6-3</Text>

                    {/* Challenge Card */}
                    <View className="bg-gray-50 rounded-2xl p-4 flex-row items-center justify-between mb-6">
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 bg-black rounded-xl items-center justify-center">
                                <Trophy size={20} color="#FFF" />
                            </View>
                            <View>
                                <Text className="font-bold text-gray-900 text-sm">Desafio de Dezembro</Text>
                                <Text className="font-bold text-gray-900 text-sm">completado!</Text>
                            </View>
                        </View>
                        <Pressable className="bg-black px-3 py-1.5 rounded-lg">
                            <Text className="text-white font-bold text-xs">Ver</Text>
                        </Pressable>
                    </View>

                    {/* Main Stats Grid */}
                    <View className="flex-row justify-between mb-6 flex-wrap gap-y-6">
                        <View className="w-[48%]">
                            <Text className="text-gray-500 text-xs mb-1">Duração Total</Text>
                            <Text className="text-2xl font-black text-gray-900">1:23:08</Text>
                        </View>
                        <View className="w-[48%]">
                            <Text className="text-gray-500 text-xs mb-1">Resultado</Text>
                            <Text className="text-2xl font-black text-green-500">Vitória</Text>
                        </View>
                        <View className="w-[48%]">
                            <Text className="text-gray-500 text-xs mb-1">Games Ganhos</Text>
                            <Text className="text-2xl font-black text-gray-900">12</Text>
                        </View>
                        <View className="w-[48%]">
                            <Text className="text-gray-500 text-xs mb-1">Games Perdidos</Text>
                            <Text className="text-2xl font-black text-gray-900">7</Text>
                        </View>
                        <View className="w-[48%]">
                            <Text className="text-gray-500 text-xs mb-1">Winners</Text>
                            <Text className="text-2xl font-black text-gray-900">24</Text>
                        </View>
                        <View className="w-[48%]">
                            <Text className="text-gray-500 text-xs mb-1">Erros Não Forçados</Text>
                            <Text className="text-2xl font-black text-gray-900">11</Text>
                        </View>
                    </View>

                    <View className="border-t border-gray-100 py-4 mb-2">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Search size={16} color="#6b7280" />
                            <Text className="text-gray-600 font-medium text-sm">Drop Shot Conqueror 12</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <Watch size={16} color="#6b7280" />
                            <Text className="text-gray-600 font-medium text-sm">Apple Watch Series 9</Text>
                        </View>
                    </View>

                    <Text className="text-gray-500 text-sm mb-4">47 deram kudos</Text>

                    <View className="flex-row justify-between border-t border-gray-100 pt-4 mb-8">
                        <Pressable className="flex-1 items-center justify-center p-2">
                            <ThumbsUp size={20} color="#374151" />
                        </Pressable>
                        <Pressable className="flex-1 items-center justify-center p-2">
                            <MessageSquare size={20} color="#374151" />
                        </Pressable>
                        <Pressable className="flex-1 items-center justify-center p-2">
                            <Share2 size={20} color="#374151" />
                        </Pressable>
                    </View>
                </View>

                {/* DETAILED ANALYSIS SECTION */}
                <View className="bg-gray-50 pt-8 pb-10 rounded-t-[40px]">

                    <View className="px-5 flex-row items-center gap-3 mb-6">
                        <View className="w-10 h-10 bg-gray-200 rounded-xl items-center justify-center">
                            <Activity size={20} color="#000" />
                        </View>
                        <Text className="text-xl font-extrabold text-gray-900">Análise da Partida</Text>
                    </View>

                    {/* Bar Chart (Graph 1) */}
                    <View className="px-5 mb-8">
                        <View className="flex-row justify-between h-40 items-end px-2 gap-2">
                            {[6, 8, 5, 9, 3, 7, 4, 8, 10, 5].map((h, i) => (
                                <View key={i} className="flex-1 items-center gap-1">
                                    <View className="w-full bg-green-400 rounded-t-md mb-[2px]" style={{ height: h * 10 }} />
                                    {i % 2 === 0 && <View className="w-full bg-red-400 rounded-b-md" style={{ height: h * 5 }} />}
                                </View>
                            ))}
                        </View>
                        <View className="flex-row gap-4 mt-4 justify-center">
                            <View className="flex-row items-center gap-2">
                                <View className="w-3 h-3 bg-green-400 rounded-full" />
                                <Text className="text-xs font-bold text-gray-700">Games ganhos</Text>
                            </View>
                            <View className="flex-row items-center gap-2">
                                <View className="w-3 h-3 bg-red-400 rounded-full" />
                                <Text className="text-xs font-bold text-gray-700">Games perdidos</Text>
                            </View>
                        </View>
                    </View>

                    <View className="bg-white mx-5 p-5 rounded-3xl shadow-sm mb-8">
                        <Text className="font-bold text-lg text-gray-900 mb-4">Detalhes por Set</Text>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-400 text-xs font-bold w-8">Set</Text>
                            <Text className="text-gray-400 text-xs font-bold w-12">Placar</Text>
                            <View className="flex-1" />
                            <Text className="text-gray-400 text-xs font-bold w-16 text-right">Duração</Text>
                            <Text className="text-gray-400 text-xs font-bold w-12 text-right">Win%</Text>
                        </View>

                        {[
                            { set: '1º', score: '6-4', dur: '38:12', win: '60%', bar: 60 },
                            { set: '2º', score: '6-3', dur: '32:45', win: '67%', bar: 67 },
                        ].map((item, i) => (
                            <View key={i} className="flex-row items-center py-3 border-b border-gray-50 last:border-0">
                                <Text className="font-bold text-gray-900 w-8">{item.set}</Text>
                                <Text className="font-bold text-green-600 w-12">{item.score}</Text>
                                <View className="flex-1 px-4">
                                    <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <View className="h-full bg-green-500 rounded-full" style={{ width: `${item.bar}%` }} />
                                    </View>
                                </View>
                                <Text className="font-semibold text-gray-900 w-16 text-right text-xs">{item.dur}</Text>
                                <Text className="font-bold text-green-500 w-12 text-right text-xs">{item.win}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Intensity Line Chart */}
                    <View className="bg-white mx-5 p-5 rounded-3xl shadow-sm mb-8">
                        <View className="flex-row justify-between items-start mb-6">
                            <View>
                                <Text className="font-bold text-lg text-gray-900">Intensidade de Jogo</Text>
                                <Text className="text-gray-500 text-xs">Variação de ritmo durante a partida</Text>
                            </View>
                            <Activity size={20} color="#9ca3af" />
                        </View>
                        <View className="my-4">
                            <LineChart />
                        </View>
                        <View className="flex-row justify-between px-2">
                            <Text className="text-gray-400 text-[10px]">Baixa</Text>
                            <Text className="text-gray-400 text-[10px]">Média</Text>
                            <Text className="text-gray-400 text-[10px]">Alta</Text>
                        </View>
                    </View>

                    {/* Shot Distribution */}
                    <View className="bg-white mx-5 p-5 rounded-3xl shadow-sm mb-8">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="font-bold text-lg text-gray-900">Distribuição de Golpes</Text>
                            <View className="w-8 h-8 bg-gray-50 rounded-lg items-center justify-center">
                                <View className="w-4 h-4 rounded-full border border-black" />
                            </View>
                        </View>

                        {[
                            { label: 'Forehand', val: '42%', color: 'bg-orange-400', w: '42%' },
                            { label: 'Backhand', val: '28%', color: 'bg-black', w: '28%' },
                            { label: 'Smash', val: '15%', color: 'bg-red-500', w: '15%' },
                            { label: 'Voleio', val: '10%', color: 'bg-blue-500', w: '10%' },
                            { label: 'Saque', val: '5%', color: 'bg-purple-500', w: '5%' },
                        ].map((shot, i) => (
                            <View key={i} className="mb-4 last:mb-0">
                                <View className="flex-row justify-between mb-1">
                                    <Text className="text-sm font-semibold text-gray-700">{shot.label}</Text>
                                    <Text className="text-sm font-bold text-gray-900">{shot.val}</Text>
                                </View>
                                <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <View className={`h-full rounded-full ${shot.color}`} style={{ width: shot.w as any }} />
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Serve Stats Donuts */}
                    <View className="mx-5 mb-8">
                        <View className="flex-row items-center gap-2 mb-4">
                            <View className="p-2 bg-green-100 rounded-lg">
                                <Search size={16} color="#16a34a" />
                            </View>
                            <Text className="font-bold text-lg text-gray-900">Estatísticas de Saque</Text>
                        </View>

                        <View className="flex-row gap-3 mb-3">
                            <View className="flex-1 bg-white p-4 rounded-2xl items-center shadow-sm">
                                <DonutChart percentage={72} color="#22c55e" label="72%" size={80} />
                                <Text className="text-gray-500 text-xs font-semibold mt-2">1º Saque In</Text>
                            </View>
                            <View className="flex-1 bg-white p-4 rounded-2xl items-center justify-center shadow-sm">
                                <Text className="text-4xl font-bold text-orange-500 mb-1">8</Text>
                                <Text className="text-gray-500 text-xs font-semibold">Aces</Text>
                            </View>
                        </View>
                        <View className="flex-row gap-3">
                            <View className="flex-1 bg-white p-4 rounded-2xl items-center justify-center shadow-sm">
                                <Text className="text-4xl font-bold text-red-500 mb-1">3</Text>
                                <Text className="text-gray-500 text-xs font-semibold">Dupla Falta</Text>
                            </View>
                            <View className="flex-1 bg-white p-4 rounded-2xl items-center shadow-sm">
                                <DonutChart percentage={68} color="#3b82f6" label="68%" size={80} />
                                <Text className="text-gray-500 text-xs font-semibold mt-2">Pts Ganhos Saque</Text>
                            </View>
                        </View>
                    </View>

                    {/* Heatmap Section */}
                    <View className="mx-5 mb-8">
                        <Text className="font-bold text-lg text-gray-900 mb-1">Cobertura de Quadra</Text>
                        <View className="bg-yellow-100 h-48 w-full rounded-xl border-4 border-yellow-200 relative overflow-hidden mb-2 items-center justify-center">
                            {/* Court Lines */}
                            <View className="absolute w-full h-[1px] bg-yellow-300 top-1/2" />
                            <View className="absolute h-full w-[1px] bg-yellow-300 left-1/2" />

                            {/* Heat spots (simulated with fuzzy rounded views) */}
                            <View className="absolute top-10 left-10 w-20 h-20 bg-red-500 rounded-full opacity-20" />
                            <View className="absolute bottom-12 right-16 w-24 h-24 bg-red-600 rounded-full opacity-30" />
                            <View className="absolute top-1/2 left-1/2 w-32 h-32 bg-red-400 rounded-full opacity-15 -ml-16 -mt-16" />
                        </View>
                        <Text className="text-center text-gray-500 text-xs">Áreas mais frequentes de posicionamento</Text>
                    </View>

                    {/* Performance Summary Grid */}
                    <View className="mx-5 mb-20">
                        <Text className="font-bold text-lg text-gray-900 mb-4">Resumo de Performance</Text>
                        <View className="flex-row gap-3 mb-3">
                            <View className="flex-1 bg-green-50 border border-green-100 p-4 rounded-2xl items-center">
                                <ThumbsUp size={24} color="#16a34a" className="mb-2" />
                                <Text className="text-3xl font-black text-green-600">A+</Text>
                                <Text className="text-green-700 text-[10px] font-bold mt-1">Desempenho Geral</Text>
                            </View>
                            <View className="flex-1 bg-blue-50 border border-blue-100 p-4 rounded-2xl items-center">
                                <Activity size={24} color="#2563eb" className="mb-2" />
                                <Text className="text-3xl font-black text-blue-600">+15%</Text>
                                <Text className="text-blue-700 text-[10px] font-bold mt-1">vs Última Partida</Text>
                            </View>
                        </View>
                        <View className="flex-row gap-3">
                            <View className="flex-1 bg-orange-50 border border-orange-100 p-4 rounded-2xl items-center">
                                <Flame size={24} color="#ea580c" className="mb-2" />
                                <Text className="text-3xl font-black text-orange-600">7</Text>
                                <Text className="text-orange-700 text-[10px] font-bold mt-1">Vitórias Seguidas</Text>
                            </View>
                            <View className="flex-1 bg-purple-50 border border-purple-100 p-4 rounded-2xl items-center">
                                <Trophy size={24} color="#9333ea" className="mb-2" />
                                <Text className="text-3xl font-black text-purple-600">+150</Text>
                                <Text className="text-purple-700 text-[10px] font-bold mt-1">XP Ganho</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>

            {/* Basic Footer Button */}
            <View className="absolute bottom-5 right-5">
                <Pressable className="bg-black w-14 h-14 rounded-full items-center justify-center shadow-lg">
                    <Share2 size={24} color="#FFF" />
                </Pressable>
            </View>
        </View>
    );
}
