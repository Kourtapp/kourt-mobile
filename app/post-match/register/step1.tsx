import { View, Text, Pressable, Switch, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { RegisterHeader } from '@/components/post-match/RegisterHeader';
import { usePostMatch } from './PostMatchContext';

export default function RegisterStep1() {
    const router = useRouter();
    const { data, updateData } = usePostMatch();
    const [hasWatermark, setHasWatermark] = useState(data.hasWatermark);
    const [photos, setPhotos] = useState<string[]>(data.photos);

    const handleTakePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar fotos.');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsEditing: false,
            });

            if (!result.canceled && result.assets?.[0]) {
                const newPhotos = [...photos, result.assets[0].uri];
                setPhotos(newPhotos);
                updateData({ photos: newPhotos });
            }
        } catch (error) {
            console.log('Error taking photo:', error);
            Alert.alert(
                'Erro na Câmera',
                'Não foi possível abrir a câmera. Se você estiver em um simulador, use a galeria.',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Usar Galeria', onPress: handlePickFromGallery }
                ]
            );
        }
    };

    const handlePickFromGallery = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsMultipleSelection: true,
                selectionLimit: 5,
            });

            if (!result.canceled && result.assets?.length > 0) {
                const newUris = result.assets.map(asset => asset.uri);
                const newPhotos = [...photos, ...newUris].slice(0, 5); // Max 5 photos
                setPhotos(newPhotos);
                updateData({ photos: newPhotos });
            }
        } catch (error) {
            console.log('Error picking from gallery:', error);
            Alert.alert('Erro', 'Não foi possível abrir a galeria.');
        }
    };

    const removePhoto = (index: number) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        setPhotos(newPhotos);
        updateData({ photos: newPhotos });
    };

    const handleWatermarkChange = (value: boolean) => {
        setHasWatermark(value);
        updateData({ hasWatermark: value });
    };

    const handleNext = () => {
        router.push('/post-match/register/step2');
    };

    return (
        <View className="flex-1 bg-white">
            <RegisterHeader title="Registrar Partida" step={1} totalSteps={4} />

            <ScrollView className="flex-1 px-5 pt-6">
                {/* Progress Bar */}
                <View className="flex-row gap-2 mb-8">
                    <View className="flex-1 h-1 bg-black rounded-full" />
                    <View className="flex-1 h-1 bg-gray-200 rounded-full" />
                    <View className="flex-1 h-1 bg-gray-200 rounded-full" />
                    <View className="flex-1 h-1 bg-gray-200 rounded-full" />
                </View>

                {/* Photo Preview or Placeholder */}
                {photos.length === 0 ? (
                    <View className="w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-gray-200 items-center justify-center bg-transparent mb-8">
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
                ) : (
                    <View className="mb-8">
                        {/* Main Photo */}
                        <View className="w-full aspect-[4/3] rounded-3xl overflow-hidden mb-3 relative">
                            <Image source={{ uri: photos[0] }} className="w-full h-full" />
                            <Pressable
                                onPress={() => removePhoto(0)}
                                className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full items-center justify-center"
                            >
                                <X size={18} color="#FFF" />
                            </Pressable>
                        </View>

                        {/* Thumbnails */}
                        {photos.length > 1 && (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View className="flex-row gap-2">
                                    {photos.slice(1).map((uri, index) => (
                                        <View key={index} className="relative">
                                            <Image
                                                source={{ uri }}
                                                className="w-20 h-20 rounded-xl"
                                            />
                                            <Pressable
                                                onPress={() => removePhoto(index + 1)}
                                                className="absolute -top-1 -right-1 w-6 h-6 bg-black/60 rounded-full items-center justify-center"
                                            >
                                                <X size={12} color="#FFF" />
                                            </Pressable>
                                        </View>
                                    ))}
                                    {photos.length < 5 && (
                                        <Pressable
                                            onPress={handlePickFromGallery}
                                            className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 items-center justify-center"
                                        >
                                            <ImageIcon size={20} color="#9CA3AF" />
                                        </Pressable>
                                    )}
                                </View>
                            </ScrollView>
                        )}
                    </View>
                )}

                {/* Action Buttons */}
                <View className="flex-row gap-4 mb-8">
                    <Pressable
                        className="flex-1 bg-black h-14 rounded-2xl flex-row items-center justify-center gap-3 active:opacity-90 shadow-sm"
                        onPress={handleTakePhoto}
                    >
                        <Camera size={20} color="#FFF" />
                        <Text className="text-white font-bold text-[15px]">Tirar Foto</Text>
                    </Pressable>

                    <Pressable
                        className="flex-1 bg-gray-50 h-14 rounded-2xl flex-row items-center justify-center gap-3 active:opacity-80 border border-gray-100"
                        onPress={handlePickFromGallery}
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
                        onValueChange={handleWatermarkChange}
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
