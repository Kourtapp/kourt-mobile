import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronDown, Trophy, Image as ImageIcon, Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useMatchStore } from '@/stores/useMatchStore';

export default function SaveMatchScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { selectedSport, selectedCourt } = useMatchStore();

    // Local State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [result, setResult] = useState('Win'); // Win, Loss

    // Defaults
    const sportName = (selectedSport || 'BeachTennis').replace('-', ' ');
    const courtName = selectedCourt?.name || 'Arena Ibirapuera';

    const handleSave = () => {
        // Here we would save the match to the backend
        router.push('/post-match/register/step1');
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="px-5 pt-4 pb-4 flex-row items-center justify-between" style={{ marginTop: insets.top }}>
                <Pressable onPress={() => router.back()}>
                    <Text className="text-gray-500 text-[16px]">Cancelar</Text>
                </Pressable>
                <Text className="text-[17px] font-bold text-black">Salvar Partida</Text>
                <View className="w-16" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* 1. Title Input */}
                <View className="px-5 mt-4 border-b border-gray-100 pb-4">
                    <TextInput
                        className="text-2xl font-bold text-black placeholder:text-gray-300"
                        placeholder="Vitória no Beach"
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor="#D1D5DB"
                    />
                </View>

                {/* 2. Description Input */}
                <View className="px-5 mt-4 border-b border-gray-100 pb-8">
                    <TextInput
                        className="text-[15px] text-black leading-5 min-h-[60px]"
                        placeholder="Como foi a partida? Marque outros jogadores com @..."
                        value={description}
                        onChangeText={setDescription}
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {/* 3. Sport Selector (Read-only for now) */}
                <View className="px-5 mt-6 mb-6">
                    <View className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <Search size={20} color="#000" />
                            <Text className="font-bold text-black text-[15px]">{sportName}</Text>
                        </View>
                        <ChevronDown size={20} color="#9CA3AF" />
                    </View>
                </View>

                {/* 4. Media Section (Map + Photos) */}
                <View className="px-5 flex-row gap-3 h-[140px] mb-4">
                    {/* Left: Map Preview Mock */}
                    <View className="flex-1 rounded-2xl bg-[#FEF08A] overflow-hidden relative border border-none">
                        {/* Gradient Mock */}
                        <View className="absolute inset-0 bg-[#E0F2FE] opacity-60" />
                        {/* Grid Lines Mock */}
                        <View className="absolute inset-0 items-center justify-center">
                            <View className="w-16 h-16 border border-white opacity-50" />
                        </View>
                        {/* Label */}
                        <View className="absolute bottom-3 left-3 bg-[#333] px-2 py-1 rounded">
                            <Text className="text-white text-[10px] font-bold">{courtName}</Text>
                        </View>
                    </View>

                    {/* Right: Add Photos */}
                    <Pressable className="flex-1 rounded-2xl border-2 border-dashed border-gray-200 items-center justify-center bg-white active:bg-gray-50">
                        <View className="items-center gap-2">
                            <ImageIcon size={24} color="#9CA3AF" />
                            <Text className="text-gray-400 text-xs font-medium">Adicionar fotos</Text>
                        </View>
                    </Pressable>
                </View>

                <View className="px-5 mb-8">
                    <Pressable className="w-full py-3 rounded-xl border border-gray-200 items-center justify-center shadow-sm bg-white">
                        <Text className="text-black font-bold text-sm">Alterar tipo de mapa</Text>
                    </Pressable>
                </View>

                {/* 5. Details Section (Result) */}
                <View className="px-5">
                    <Text className="text-[17px] font-bold text-black mb-4">Detalhes</Text>

                    <View className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <Trophy size={20} color="#6B7280" />
                            <Text className="font-bold text-black text-[15px]">Resultado</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <Text className="font-bold text-[#16A34A] text-[15px]">Vitória</Text>
                            <ChevronDown size={20} color="#9CA3AF" />
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Footer Button */}
            <View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 pb-8">
                <Pressable
                    onPress={handleSave}
                    className="w-full bg-black h-14 rounded-2xl items-center justify-center shadow-sm active:opacity-90"
                >
                    <Text className="text-white font-bold text-[16px]">Salvar Partida</Text>
                </Pressable>
            </View>
        </View>
    );
}
