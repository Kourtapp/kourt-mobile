import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Alert } from 'react-native';
import { usePublicCourt } from './PublicCourtContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Plus, Info } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

// Categories
const OPTIONAL_Categories = [
    { id: 'entrance', label: 'Entrada' },
    { id: 'parking', label: 'Estacionamento' },
    { id: 'locker', label: 'Vestiário' },
    { id: 'lighting', label: 'Iluminação' },
    { id: 'other', label: 'Outro' },
];

export default function OptionalPhotosScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const params = useLocalSearchParams();
    const { data, updateData } = usePublicCourt();

    // State for optional photos
    const [optionalPhotos, setOptionalPhotos] = useState<Record<string, string>>(data.optionalPhotos || {});

    // Mandatory Preview Data
    const MANDATORY_PREVIEW = [
        { id: 'general', label: 'Visão Geral', uri: data.mandatoryPhotos.general },
        { id: 'net', label: 'Rede / Tabela', uri: data.mandatoryPhotos.net },
        { id: 'floor', label: 'Piso', uri: data.mandatoryPhotos.floor },
    ].filter(item => !!item.uri);

    const updateOptionalPhotos = (newPhotos: Record<string, string>) => {
        setOptionalPhotos(newPhotos);
        updateData({ optionalPhotos: newPhotos });
    };

    const handleTakePhoto = async (categoryId: string) => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permissão necessária", "Precisamos de acesso à câmera.");
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.7,
                allowsEditing: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const newPhotos = {
                    ...optionalPhotos,
                    [categoryId]: result.assets[0].uri
                };
                updateOptionalPhotos(newPhotos);
            }
        } catch (error) {
            console.log("Error taking photo:", error);
            Alert.alert("Erro", "Não foi possível abrir a câmera.");
        }
    };

    const handleContinue = () => {
        router.push('/court/new/public/review');
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
                <Text style={styles.title}>Suas Fotos</Text>
                <Text style={styles.subtitle}>Adicione mais fotos se desejar</Text>

                {/* Mandatory Photos Section (Read-Only Preview) */}
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <Text style={styles.sectionTitle}>FOTOS OBRIGATÓRIAS</Text>
                        <Check size={16} color="#000" />
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mandatoryScroll}>
                        {MANDATORY_PREVIEW.map((photo) => (
                            <View key={photo.id} style={styles.mandatoryCard}>
                                <Image source={{ uri: photo.uri }} style={styles.mandatoryImage} />
                                <View style={styles.mandatoryLabelContainer}>
                                    <Check size={12} color="#22C55E" />
                                    <Text style={styles.mandatoryLabel}>{photo.label}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Optional Photos Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>FOTOS OPCIONAIS</Text>
                    <View style={styles.optionalGrid}>
                        {OPTIONAL_Categories.map((cat) => {
                            const photoUri = optionalPhotos[cat.id];
                            return (
                                <View key={cat.id} style={styles.optionalItemWrapper}>
                                    <Pressable
                                        style={[
                                            styles.optionalButton,
                                            photoUri ? styles.optionalButtonFilled : styles.optionalButtonEmpty
                                        ]}
                                        onPress={() => handleTakePhoto(cat.id)}
                                    >
                                        {photoUri ? (
                                            <Image source={{ uri: photoUri }} style={styles.optionalImage} />
                                        ) : (
                                            <Plus size={24} color="#9CA3AF" />
                                        )}
                                    </Pressable>
                                    <Text style={styles.optionalLabel}>{cat.label}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <Info size={16} color="#6B7280" />
                    <Text style={styles.infoText}>A primeira foto será a capa da quadra.</Text>
                </View>

            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.button} onPress={handleContinue}>
                    <Text style={styles.buttonText}>Continuar</Text>
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
        marginBottom: 32,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4B5563',
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    mandatoryScroll: {
        gap: 12,
    },
    mandatoryCard: {
        width: 120,
    },
    mandatoryImage: {
        width: 120,
        height: 80,
        borderRadius: 8,
        marginBottom: 6,
        backgroundColor: '#F3F4F6',
    },
    mandatoryLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    mandatoryLabel: {
        fontSize: 12,
        color: '#4B5563',
    },
    optionalGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    optionalItemWrapper: {
        alignItems: 'center',
        width: '30%', // roughly 3 per row with gaps
        marginBottom: 8,
    },
    optionalButton: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        overflow: 'hidden',
    },
    optionalButtonEmpty: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    optionalButtonFilled: {
        borderWidth: 0,
    },
    optionalImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    optionalLabel: {
        fontSize: 12,
        color: '#4B5563',
        textAlign: 'center',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 12,
        gap: 8,
        marginBottom: 24,
    },
    infoText: {
        fontSize: 12,
        color: '#6B7280',
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
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
