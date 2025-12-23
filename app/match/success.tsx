import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Check, Clock, MapPin, Users, Camera, Share2, User, Droplets } from 'lucide-react-native';
import { useMatchStore } from '@/stores/useMatchStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MatchSuccessScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { selectedSport, selectedTime, selectedCourt } = useMatchStore();

    // Default values if store is empty (preview mode)
    const sportName = (selectedSport || 'Beach Tennis').replace('-', ' ');
    const courtName = selectedCourt?.name || 'Quadra Parque Ibirapuera';
    const courtAddress = 'Portão 10 · Você está aqui';
    const timeRange = selectedTime ? `${selectedTime} - 20:00` : '18:00 - 20:00';

    return (
        <View className="flex-1 bg-white">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Header: Close Button */}
                <View style={{ paddingTop: insets.top + 10 }} className="px-5 items-end">
                    <Pressable
                        onPress={() => router.push('/(tabs)')}
                        className="w-10 h-10 bg-white rounded-full border border-gray-100 items-center justify-center shadow-sm"
                    >
                        <X size={20} color="#000" />
                    </Pressable>
                </View>

                {/* Hero: Check-in Status */}
                <View className="items-center mt-4 mb-8">
                    <View className="w-24 h-24 bg-[#22C55E] rounded-full items-center justify-center mb-6 shadow-lg shadow-green-200">
                        <Check size={40} color="#FFF" strokeWidth={3} />
                    </View>
                    <Text className="text-2xl font-extrabold text-black text-center mb-2">Check-in realizado!</Text>
                    <Text className="text-gray-500 text-base text-center">Você está na quadra. Bom jogo!</Text>
                </View>

                {/* Map Card */}
                <View className="mx-5 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                    {/* Top: Pseudo-Map Visual */}
                    <View className="h-32 bg-[#D1FAE5] items-center justify-center relative">
                        <View className="absolute w-[200%] h-[200%] bg-[#ECFDF5] rounded-full -top-[50%] opacity-50" />

                        {/* Pin */}
                        <View className="items-center justify-center">
                            <View className="w-10 h-10 bg-[#22C55E] rounded-full border-4 border-white items-center justify-center shadow-sm">
                                <MapPin size={18} color="#FFF" />
                            </View>
                            <View className="w-2 h-2 bg-[#22C55E] rounded-full mt-1" />
                        </View>
                    </View>

                    {/* Bottom: Info */}
                    <View className="p-5">
                        <Text className="font-bold text-black text-lg mb-1">{courtName}</Text>
                        <Text className="text-gray-500 text-sm">{courtAddress}</Text>
                    </View>
                </View>

                {/* Details List */}
                <View className="mx-8 gap-6 mb-8">
                    {/* Time */}
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <Clock size={20} color="#22C55E" />
                            <Text className="text-gray-500 font-medium text-[15px]">Horário</Text>
                        </View>
                        <Text className="font-bold text-black text-[15px]">{timeRange}</Text>
                    </View>

                    {/* Sport */}
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            {/* Generic Icon - in real app use specific sport icon */}
                            <View className="w-5 h-5 items-center justify-center">
                                <View className="w-3 h-3 rounded-full border-2 border-[#22C55E]" />
                                <View className="h-5 w-[2px] bg-[#22C55E] absolute -rotate-45" />
                            </View>
                            <Text className="text-gray-500 font-medium text-[15px]">Esporte</Text>
                        </View>
                        <Text className="font-bold text-black text-[15px] capitalize">{sportName}</Text>
                    </View>

                    {/* Players */}
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <Users size={20} color="#22C55E" />
                            <Text className="text-gray-500 font-medium text-[15px]">Jogadores</Text>
                        </View>
                        <Text className="font-bold text-black text-[15px]">{maxPlayers} confirmados</Text>
                    </View>
                </View>

                {/* Detailed Player List */}
                <View className="mx-5 mb-6">
                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4 px-3">QUEM ESTÁ JOGANDO:</Text>
                    <View className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
                        {/* Player 1: You (Here) */}
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-[#22C55E] rounded-full items-center justify-center">
                                    <User size={18} color="#FFF" />
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Text className="font-bold text-black text-[15px]">Você</Text>
                                    <View className="bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                                        <Text className="text-[#15803D] text-[10px] font-bold">AQUI</Text>
                                    </View>
                                </View>
                            </View>
                            <Text className="text-gray-400 text-xs">18:02</Text>
                        </View>

                        {/* Player 2: Pedro (Here) */}
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-[#22C55E] rounded-full items-center justify-center">
                                    <Text className="text-white font-bold">P</Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Text className="font-bold text-black text-[15px]">Pedro F.</Text>
                                    <View className="bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                                        <Text className="text-[#15803D] text-[10px] font-bold">AQUI</Text>
                                    </View>
                                </View>
                            </View>
                            <Text className="text-gray-400 text-xs">17:55</Text>
                        </View>

                        {/* Player 3: Marina (On the way) */}
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center">
                                    <Text className="text-gray-500 font-bold">M</Text>
                                </View>
                                <Text className="font-bold text-black text-[15px]">Marina S.</Text>
                            </View>
                            <Text className="text-[#EAB308] text-xs font-bold">A caminho</Text>
                        </View>

                        {/* Player 4: Lucas (On the way) */}
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center">
                                    <Text className="text-gray-500 font-bold">L</Text>
                                </View>
                                <Text className="font-bold text-black text-[15px]">Lucas R.</Text>
                            </View>
                            <Text className="text-[#EAB308] text-xs font-bold">A caminho</Text>
                        </View>
                    </View>
                </View>

                {/* Tips Card */}
                <View className="mx-5 p-5 bg-[#F9FAFB] rounded-3xl mb-8">
                    <Text className="font-bold text-black text-[16px] mb-4">Dicas para sua partida</Text>

                    <View className="flex-row gap-3 mb-4">
                        <View className="w-5 items-center">
                            <Droplets size={18} color="#9CA3AF" />
                        </View>
                        <Text className="text-gray-600 text-sm flex-1">Mantenha-se hidratado</Text>
                    </View>

                    <View className="flex-row gap-3">
                        <View className="w-5 items-center">
                            <Camera size={18} color="#9CA3AF" />
                        </View>
                        <Text className="text-gray-600 text-sm flex-1">Registre a partida depois para ganhar pontos!</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Footer Actions */}
            <View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 pb-10">
                <View className="flex-row gap-3 mb-6">
                    {/* Primary: Register Match */}
                    <Pressable
                        className="flex-1 bg-black h-14 rounded-2xl flex-row items-center justify-center gap-3 shadow-md active:opacity-90"
                        onPress={() => router.push('/match/live')}
                    >
                        <Camera size={20} color="#FFF" />
                        <Text className="text-white font-bold text-[16px]">Registrar Partida</Text>
                    </Pressable>

                    {/* Secondary: Share */}
                    <Pressable className="w-14 h-14 bg-gray-100 rounded-2xl items-center justify-center active:bg-gray-200">
                        <Share2 size={20} color="#000" />
                    </Pressable>
                </View>

                <Pressable className="items-center">
                    <Text className="text-gray-500 font-bold text-sm">Ver chat do grupo</Text>
                </Pressable>
            </View>
        </View>
    );
}
