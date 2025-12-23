import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Alert } from 'react-native';
import { usePublicCourt } from './PublicCourtContext';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, ChevronRight, Check, Sparkles, AlertCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

type PhotoType = {
    id: string;
    title: string;
    description: string;
    uri?: string;
};

const REQUIRED_PHOTOS: PhotoType[] = [
    { id: 'general', title: 'Foto 1: Visão Geral', description: 'Mostre toda a quadra, incluindo linhas e rede' },
    { id: 'net', title: 'Foto 2: Rede / Tabela', description: 'Detalhe da rede, tabela ou equipamento principal' },
    { id: 'floor', title: 'Foto 3: Piso', description: 'Textura do piso (areia, saibro, cimento, etc)' },
];

export default function MandatoryPhotosScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePublicCourt();

    // State to hold photo URIs keyed by ID
    const [photos, setPhotos] = useState<Record<string, string>>(data.mandatoryPhotos as Record<string, string> || {});

    // Save photos to context whenever they change
    const updatePhotos = (newPhotos: Record<string, string>) => {
        setPhotos(newPhotos);
        updateData({
            mandatoryPhotos: {
                general: newPhotos.general,
                net: newPhotos.net,
                floor: newPhotos.floor
            }
        });
    };

    const photoCount = Object.keys(photos).length;
    const isComplete = photoCount === 3;

    const handleTakePhoto = async (id: string) => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permissão necessária", "Precisamos de acesso à câmera para tirar as fotos.");
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.7,
                allowsEditing: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                if (!result.canceled && result.assets && result.assets.length > 0) {
                    const newPhotos = { ...photos, [id]: result.assets[0].uri };
                    updatePhotos(newPhotos);
                }
            }
        } catch (error) {
            console.log("Error taking photo:", error);
            Alert.alert(
                "Erro na Câmera",
                "Não foi possível abrir a câmera. Se você estiver em um simulador, pode usar a galeria.",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Usar Galeria (Simulador)", onPress: () => pickImage(id) }
                ]
            );
        }
    };

    const pickImage = async (id: string) => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.7,
                allowsEditing: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                if (!result.canceled && result.assets && result.assets.length > 0) {
                    const newPhotos = { ...photos, [id]: result.assets[0].uri };
                    updatePhotos(newPhotos);
                }
            }
        } catch (error) {
            console.log("Error picking image:", error);
            Alert.alert("Erro", "Não foi possível abrir a galeria.");
        }
    };

    const handleContinue = () => {
        if (!isComplete) return;
        router.push('/court/new/public/photos-optional');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </Pressable>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Fotos Obrigatórias</Text>
                <Text style={styles.subtitle}>Tire as 3 fotos necessárias</Text>

                {/* AI Warning Card */}
                <View style={styles.aiCard}>
                    <Sparkles size={20} color="#3B82F6" />
                    <Text style={styles.aiCardText}>
                        Suas fotos serão verificadas por IA para garantir que mostram as informações necessárias.
                    </Text>
                </View>

                {/* Photos List */}
                <View style={styles.photosContainer}>
                    {REQUIRED_PHOTOS.map((item) => {
                        const photoUri = photos[item.id];
                        const hasPhoto = !!photoUri;

                        return (
                            <Pressable
                                key={item.id}
                                style={[styles.photoCard, hasPhoto && styles.photoCardFilled]}
                                onPress={() => handleTakePhoto(item.id)}
                            >
                                <View style={styles.photoPreview}>
                                    {hasPhoto ? (
                                        <Image source={{ uri: photoUri }} style={styles.photoImage} />
                                    ) : (
                                        <View style={styles.cameraIconContainer}>
                                            <Camera size={24} color="#9CA3AF" />
                                        </View>
                                    )}
                                </View>

                                <View style={styles.photoInfo}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Text style={styles.photoTitle}>{item.title}</Text>
                                        {hasPhoto && <Check size={16} color="#22C55E" strokeWidth={3} />}
                                    </View>
                                    <Text style={styles.photoDescription} numberOfLines={2}>
                                        {item.description}
                                    </Text>
                                </View>

                                {hasPhoto ? (
                                    <View style={styles.approvedIconContainer}>
                                        <Check size={16} color="#FFF" strokeWidth={3} />
                                    </View>
                                ) : (
                                    <View style={styles.actionIcon}>
                                        <ChevronRight size={20} color="#9CA3AF" />
                                    </View>
                                )}
                            </Pressable>
                        );
                    })}
                </View>

                {/* Status Text */}
                <View style={styles.statusContainer}>
                    {isComplete ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Check size={18} color="#22C55E" />
                            <Text style={[styles.statusText, { color: '#15803D' }]}>3/3 fotos obrigatórias</Text>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <AlertCircle size={18} color="#F59E0B" />
                            <Text style={[styles.statusText, { color: '#B45309' }]}>{photoCount}/3 fotos obrigatórias</Text>
                        </View>
                    )}
                </View>

            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable
                    style={[styles.button, !isComplete && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={!isComplete}
                >
                    <Text style={[styles.buttonText, !isComplete && styles.buttonTextDisabled]}>Continuar</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        padding: 4,
        marginLeft: -4,
    },
    backText: {
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 24,
    },
    aiCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF', // Light Blue
        borderRadius: 12,
        padding: 16,
        gap: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    aiCardText: {
        flex: 1,
        fontSize: 13,
        color: '#1E40AF', // Dark Blue
        // fontWeight: '500', 
    },
    photosContainer: {
        gap: 16,
        marginBottom: 24,
    },
    photoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingLeft: 12,
        paddingRight: 48, // Reserve space for absolute icon
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        gap: 16,
        position: 'relative',
    },
    photoCardFilled: {
        borderColor: '#22C55E',
        backgroundColor: '#F0FDF4',
    },
    photoPreview: {
        width: 80,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    photoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cameraIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoInfo: {
        flex: 1,
    },
    photoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        marginBottom: 2,
    },
    photoDescription: {
        fontSize: 12,
        color: '#6B7280',
    },
    actionIcon: {
        padding: 4,
        marginRight: 4,
        // Using absolute positioning now, so this wrapper might need adjustment logic or just let the child be absolute
    },
    approvedIconContainer: {
        position: 'absolute',
        right: 16,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#22C55E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusContainer: {
        marginBottom: 24,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#000',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#E5E7EB',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonTextDisabled: {
        color: '#9CA3AF',
    },
});
