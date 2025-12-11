import { View, Text, Pressable, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Camera, Image as ImageIcon, Check } from 'lucide-react-native';
import { RegisterHeader } from '@/components/post-match/RegisterHeader';

export default function RegisterStep1() {
    const router = useRouter();
    const [hasWatermark, setHasWatermark] = useState(true);

    // TODO: Add image picker state logic here
    const [hasImage, setHasImage] = useState(false);

    const handleNext = () => {
        router.push('/post-match/register/step2');
    };

    return (
        <View className="flex-1 bg-white">
            <RegisterHeader title="Registrar Partida" step={1} totalSteps={4} />

            <ScrollView className="flex-1 px-5 pt-6">
                {/* Progress Bar (Mock for now, or implicit in header if passed) */}
                {/* Design shows line segments. Implementing custom here if Header doesn't have it */}
                {/* Assuming RegisterHeader handles title. We add the progress bars here if needed, 
                    but layout implies they might be just below header. 
                    Let's put them here for safety based on the screenshot. */}
                <View className="flex-row gap-2 mb-8">
                    <View className="flex-1 h-1 bg-black rounded-full" />
                    <View className="flex-1 h-1 bg-gray-200 rounded-full" />
                    <View className="flex-1 h-1 bg-gray-200 rounded-full" />
                    <View className="flex-1 h-1 bg-gray-200 rounded-full" />
                </View>

                {/* Photo Placeholder / Dropzone */}
                <View
                    className="w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-gray-200 items-center justify-center bg-transparent mb-8"
                >
                    <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
                        <Camera size={28} color="#9CA3AF" />
                    </View>
                    <Text className="text-[17px] font-bold text-black mb-1">
                        Adicione fotos da partida
                    </Text>
                    <Text className="text-gray-400 text-center px-8 text-sm">
                        Quadra, grupo, placar ou momentos
                    </Text>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-4 mb-8">
                    <Pressable
                        className="flex-1 bg-black h-14 rounded-2xl flex-row items-center justify-center gap-3 active:opacity-90 shadow-sm"
                        onPress={() => console.log('Camera')}
                    >
                        <Camera size={20} color="#FFF" />
                        <Text className="text-white font-bold text-[15px]">Tirar Foto</Text>
                    </Pressable>

                    <Pressable
                        className="flex-1 bg-gray-50 h-14 rounded-2xl flex-row items-center justify-center gap-3 active:opacity-80 border border-gray-100"
                        onPress={() => console.log('Gallery')}
                    >
                        <ImageIcon size={20} color="#000" />
                        <Text className="text-black font-bold text-[15px]">Galeria</Text>
                    </Pressable>
                </View>

                {/* Watermark Toggle */}
                <View className="flex-row items-center justify-between p-4 border border-gray-100 rounded-2xl mb-8 bg-white shadow-sm">
                    <View className="flex-row items-center gap-4 flex-1">
                        <View className="w-12 h-12 bg-black rounded-xl items-center justify-center">
                            <Text className="text-white font-bold text-xl">K</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-black text-[15px]">Adicionar marca Kourt</Text>
                            <Text className="text-gray-500 text-xs">Logo + métricas na foto</Text>
                        </View>
                    </View>
                    <Switch
                        value={hasWatermark}
                        onValueChange={setHasWatermark}
                        trackColor={{ false: '#E5E7EB', true: '#000' }}
                        thumbColor={'#FFF'}
                        ios_backgroundColor="#E5E7EB"
                    />
                </View>

                {/* Skip Link */}
                <Pressable
                    className="items-center py-2 mb-10"
                    onPress={handleNext}
                >
                    <View className="flex-row items-center gap-1">
                        <Text className="text-gray-400 font-bold text-sm">Pular foto</Text>
                        <Text className="text-gray-400 font-bold">→</Text>
                    </View>
                </Pressable>
            </ScrollView>

            {/* Footer / Next Button */}
            <View className="p-5 pb-10 border-t border-gray-100 bg-white">
                <Pressable
                    className="w-full bg-black h-14 rounded-2xl items-center justify-center active:opacity-90 shadow-md"
                    onPress={handleNext}
                >
                    <Text className="text-white font-bold text-[16px]">Próximo</Text>
                </Pressable>
            </View>
        </View>
    );
}
