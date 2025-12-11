import { View, Text, ScrollView, Pressable, Image as RNImage } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Share2, MoreHorizontal, CheckCircle, Trophy, User, Search, MessageSquare, ThumbsUp as ThumbsUpIcon, Share, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function MatchDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const insets = useSafeAreaInsets();

    const StatBar = ({ label, valueLeft, valueRight, max }: { label: string, valueLeft: number, valueRight: number, max: number }) => {
        const widthLeft = `${(valueLeft / max) * 100}%` as any;
        const widthRight = `${(valueRight / max) * 100}%` as any;

        return (
            <View className="flex-row items-center mb-4">
                <Text className="w-8 font-bold text-gray-900 text-xs">{valueLeft}</Text>
                <View className="flex-1 flex-row items-center gap-2">
                    <View className="flex-1 h-2 bg-gray-100 rounded-l-full flex-row justify-end overflow-hidden">
                        <View className="h-full bg-black rounded-l-full" style={{ width: widthLeft }} />
                    </View>
                    <Text className="text-[10px] text-gray-500 font-bold w-20 text-center">{label}</Text>
                    <View className="flex-1 h-2 bg-gray-100 rounded-r-full flex-row justify-start overflow-hidden">
                        <View className="h-full bg-gray-400 rounded-r-full" style={{ width: widthRight }} />
                    </View>
                </View>
                <Text className="w-8 font-bold text-gray-500 text-xs text-right">{valueRight}</Text>
            </View>
        )
    }

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
                <Text className="font-bold text-lg text-gray-900">BeachTennis</Text>
                <Pressable className="w-10 h-10 items-center justify-center -mr-2 rounded-full active:bg-gray-50">
                    <Share2 size={24} color="#000" />
                </Pressable>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Post Header */}
                <View className="px-5 pt-6 pb-4">
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-3">
                            <View className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center">
                                <User size={24} color="#6b7280" />
                            </View>
                            <View>
                                <View className="flex-row items-center gap-1">
                                    <Text className="font-bold text-base text-gray-900">Lucas Mendes</Text>
                                    <CheckCircle size={14} color="#3b82f6" fill="#3b82f6" />
                                </View>
                                <View className="flex-row items-center gap-1">
                                    <Search size={10} color="#9ca3af" />
                                    <Text className="text-gray-500 text-xs">Hoje às 18:30</Text>
                                </View>
                            </View>
                        </View>
                        <Pressable className="bg-black px-5 py-2 rounded-full">
                            <Text className="text-white font-bold text-xs">Seguir</Text>
                        </Pressable>
                    </View>

                    <Text className="text-gray-900 text-base leading-6">
                        Jogo intenso hoje! Conseguimos virar no segundo set. Obrigado @pedroferreira pela parceria!
                    </Text>
                </View>

                {/* Challenge Card */}
                <View className="px-5 mb-6">
                    <View className="border border-gray-100 rounded-2xl p-3 flex-row items-center gap-3 bg-white shadow-sm">
                        <LinearGradient
                            colors={['#3b82f6', '#06b6d4']}
                            className="w-10 h-10 rounded-xl items-center justify-center"
                        >
                            <Trophy size={18} color="#FFF" />
                        </LinearGradient>
                        <View className="flex-1">
                            <Text className="font-bold text-gray-900 text-sm">Desafio de Dezembro</Text>
                            <Text className="text-gray-500 text-xs">10 partidas em 30 dias</Text>
                        </View>
                        <Pressable className="bg-black px-4 py-2 rounded-full">
                            <Text className="text-white font-bold text-xs">Participar</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Score Section */}
                <View className="px-5 mb-6">
                    <View className="flex-row justify-between mb-6">
                        <View className="items-center">
                            <Text className="text-gray-400 text-xs mb-1 font-medium">Resultado</Text>
                            <Text className="text-3xl font-black text-green-500 uppercase tracking-wide">VITÓRIA</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-gray-400 text-xs mb-1 font-medium">Placar</Text>
                            <Text className="text-3xl font-black text-gray-900 tracking-widest">6-4, 6-3</Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between border-t border-b border-gray-100 py-4">
                        <View className="items-center flex-1 border-r border-gray-100">
                            <Text className="text-gray-400 text-xs mb-1">Duração</Text>
                            <Text className="font-black text-lg text-gray-900">1h 23min</Text>
                        </View>
                        <View className="items-center flex-1 border-r border-gray-100">
                            <Text className="text-gray-400 text-xs mb-1">Games</Text>
                            <Text className="font-black text-lg text-gray-900">19</Text>
                        </View>
                        <View className="items-center flex-1">
                            <Text className="text-gray-400 text-xs mb-1">Pontos XP</Text>
                            <Text className="font-black text-lg text-gray-900">+125</Text>
                        </View>
                    </View>
                </View>

                {/* Court Visual */}
                <View className="px-5 mb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="flex-row items-center gap-2">
                            <MapPin size={16} color="#000" />
                            <Text className="font-bold text-lg text-gray-900">Quadra</Text>
                        </View>
                        <Text className="text-gray-500 text-xs">Arena BeachIbirapuera</Text>
                    </View>

                    <View className="h-48 w-full rounded-2xl overflow-hidden relative bg-blue-100">
                        {/* Sky/Background */}
                        <View className="absolute top-0 left-0 right-0 h-1/2 bg-sky-200" />

                        {/* Court Surface */}
                        <View className="absolute bottom-0 left-0 right-0 h-2/3 bg-[#fde047] mx-4 rounded-t-xl border-x-4 border-t-4 border-white opacity-90 items-center justify-center">
                            <View className="w-full h-[2px] bg-black opacity-30" />
                            <View className="absolute w-[2px] h-full bg-white left-1/2 transform -translate-x-1/2" />
                        </View>

                        {/* Labels */}
                        <View className="absolute top-4 left-4 bg-black px-2 py-1 rounded">
                            <Text className="text-white text-[10px] font-bold uppercase">Sua Dupla</Text>
                        </View>
                        <View className="absolute bottom-4 left-4 bg-gray-500 px-2 py-1 rounded">
                            <Text className="text-white text-[10px] font-bold uppercase">Adversários</Text>
                        </View>

                        {/* Avatars on Court */}
                        <View className="absolute top-1/2 left-1/4 w-3 h-3 bg-black rounded-full" style={{ marginTop: 20 }} />
                        <View className="absolute top-1/2 right-1/4 w-3 h-3 bg-black rounded-full" style={{ marginTop: 20 }} />

                        <View className="absolute bottom-10 left-1/3 w-3 h-3 bg-gray-400 rounded-full" />
                        <View className="absolute bottom-10 right-1/3 w-3 h-3 bg-gray-400 rounded-full" />
                    </View>
                </View>

                {/* Detailed Stats Link Header */}
                <View className="px-5 mb-6">
                    <View className="flex-row items-center gap-2 mb-6">
                        <View className="w-8 h-8 bg-black rounded-lg items-center justify-center">
                            {/* Placeholder icon for Analysis */}
                            <View className="w-4 h-4 border border-white rounded-[2px]" />
                            <View className="absolute w-2 h-2 bg-white rounded-[1px]" />
                        </View>
                        <Text className="font-bold text-lg text-gray-900">Análise de Performance</Text>
                    </View>

                    {/* Stats Comparison */}
                    <View className="mb-8">
                        <View className="flex-row justify-between mb-4">
                            <Text className="font-bold text-xl text-gray-900">Estatísticas</Text>
                        </View>

                        <StatBar label="1º Saque In" valueLeft={78} valueRight={65} max={100} />
                        <StatBar label="Winners" valueLeft={12} valueRight={8} max={20} />
                        <StatBar label="Erros" valueLeft={6} valueRight={11} max={15} />
                        <StatBar label="Break Points" valueLeft={4} valueRight={1} max={5} />
                    </View>
                </View>

                {/* Players */}
                <View className="px-5 mb-8">
                    <Text className="font-bold text-xl text-gray-900 mb-4">Jogadores</Text>
                    <View className="flex-row gap-4">
                        {/* Winners */}
                        <View className="flex-1 bg-green-50 p-4 rounded-2xl border border-green-100">
                            <Text className="text-green-700 font-bold text-xs mb-3 uppercase">Vencedores</Text>

                            <View className="flex-row items-center gap-3 mb-3">
                                <View className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User size={16} color="#6b7280" />
                                </View>
                                <View>
                                    <Text className="font-bold text-gray-900 text-sm">Lucas M.</Text>
                                    <Text className="text-gray-500 text-xs">Você</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center gap-3">
                                <View className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User size={16} color="#6b7280" />
                                </View>
                                <View>
                                    <Text className="font-bold text-gray-900 text-sm">Pedro F.</Text>
                                    <Text className="text-gray-500 text-xs">Parceiro</Text>
                                </View>
                            </View>
                        </View>

                        {/* Opponents */}
                        <View className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <Text className="text-gray-500 font-bold text-xs mb-3 uppercase">Adversários</Text>

                            <View className="flex-row items-center gap-3 mb-3">
                                <View className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User size={16} color="#6b7280" />
                                </View>
                                <View>
                                    <Text className="font-bold text-gray-900 text-sm">Carlos S.</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center gap-3">
                                <View className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User size={16} color="#6b7280" />
                                </View>
                                <View>
                                    <Text className="font-bold text-gray-900 text-sm">João P.</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Equipment */}
                <View className="px-5 mb-8">
                    <Text className="font-bold text-xl text-gray-900 mb-4">Equipamento</Text>
                    <View className="border border-gray-100 rounded-2xl p-4 flex-row items-center gap-4">
                        <View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center">
                            <Search size={20} color="#000" />
                        </View>
                        <View>
                            <Text className="font-bold text-gray-900 text-base">Raquete Drop Shot</Text>
                            <Text className="text-gray-500 text-sm">BeachTennis · 24 partidas</Text>
                        </View>
                    </View>
                </View>

                {/* Social Footer */}
                <View className="px-5 pb-8">
                    <Text className="text-gray-500 text-sm mb-4 font-medium">47 pessoas curtiram</Text>

                    <View className="border-t border-gray-100 pt-4 flex-row justify-between">
                        <Pressable className="flex-row items-center gap-2 px-4 py-2">
                            <ThumbsUpIcon size={20} color="#374151" />
                            <Text className="text-gray-700 font-bold">Curtir</Text>
                        </Pressable>
                        <Pressable className="flex-row items-center gap-2 px-4 py-2">
                            <MessageSquare size={20} color="#374151" />
                            <Text className="text-gray-700 font-bold">Comentar</Text>
                        </Pressable>
                        <Pressable className="flex-row items-center gap-2 px-4 py-2">
                            <Share size={20} color="#374151" />
                            <Text className="text-gray-700 font-bold">Compartilhar</Text>
                        </Pressable>
                    </View>
                </View>

                <View className="h-10" />
            </ScrollView>
        </View>
    );
}
