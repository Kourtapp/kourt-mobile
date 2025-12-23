import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Camera, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtPhotosScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();
    const [photos, setPhotos] = useState<string[]>(data.photos || []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
            selectionLimit: 10
        });

        if (!result.canceled) {
            const newPhotos = result.assets.map(asset => asset.uri);
            setPhotos([...photos, ...newPhotos]);
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });

        if (!result.canceled) {
            setPhotos([...photos, result.assets[0].uri]);
        }
    };

    const removePhoto = (index: number) => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);
    };

    const handleContinue = () => {
        if (photos.length < 5) {
            // Visualize validation error (optional)
            // return; 
        }
        updateData({ photos });
        // Navigate to next Step (Title/Description - Step 3)
        // For now, based on previous context, we might go to title-description or similar.
        // The user flow seems to imply "Title/Description" comes after photos based on "Depois, você deverá criar um título e uma descrição".
        // I'll create a placeholder title-desc screen or point to existing flow if it matches.
        // For now pointing to a new route 'step3-intro' or 'title' to be created next
        router.push('/court/new/private/title');
    };

    const coverPhoto = photos.length > 0 ? photos[0] : null;
    const gridPhotos = photos.slice(1);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </Pressable>
                <Pressable style={styles.saveButton}>
                    <Text style={styles.saveText}>Salvar e sair</Text>
                </Pressable>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.title}>Adicione algumas fotos da sua quadra</Text>
                <Text style={styles.subtitle}>
                    Você precisará de cinco fotos para começar. Você pode adicionar outras imagens ou fazer alterações mais tarde.
                </Text>

                {photos.length === 0 ? (
                    <View style={styles.emptyStateContainer}>
                        <Pressable style={styles.addCard} onPress={pickImage}>
                            <Plus size={24} color="#000" />
                            <Text style={styles.addCardText}>Adicionar fotos</Text>
                        </Pressable>
                        <Pressable style={styles.addCard} onPress={takePhoto}>
                            <Camera size={24} color="#000" />
                            <Text style={styles.addCardText}>Tirar novas fotos</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View style={styles.photosContainer}>
                        {/* Cover Photo */}
                        <View style={styles.coverPhotoContainer}>
                            <Image source={{ uri: coverPhoto! }} style={styles.coverPhoto} />
                            <View style={styles.coverBadge}>
                                <Text style={styles.coverBadgeText}>Foto de capa</Text>
                            </View>
                            <Pressable style={styles.deleteButton} onPress={() => removePhoto(0)}>
                                <Trash2 size={16} color="#FFF" />
                            </Pressable>
                        </View>

                        {/* Grid Photos */}
                        <View style={styles.grid}>
                            {gridPhotos.map((photo, index) => (
                                <View key={index} style={styles.gridItem}>
                                    <Image source={{ uri: photo }} style={styles.gridImage} />
                                    <Pressable style={styles.deleteButtonSmall} onPress={() => removePhoto(index + 1)}>
                                        <Trash2 size={14} color="#FFF" />
                                    </Pressable>
                                </View>
                            ))}
                            {/* Add More Button in Grid */}
                            <Pressable style={styles.gridAddButton} onPress={pickImage}>
                                <Plus size={24} color="#6B7280" />
                                <Text style={styles.gridAddText}>Adicionar mais</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable
                    style={[styles.button, photos.length < 5 && styles.buttonDisabled]}
                    onPress={handleContinue}
                // disabled={photos.length < 5} // Optional: enforce 5 photos
                >
                    <Text style={styles.buttonText}>Avançar</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
    backButton: { padding: 4, marginLeft: -4 },
    backText: { fontSize: 16, fontWeight: '600', textDecorationLine: 'underline' },
    saveButton: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
    saveText: { fontSize: 12, fontWeight: '600' },
    content: { flex: 1, paddingHorizontal: 24 },
    title: { fontSize: 26, fontWeight: '700', color: '#000', marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32, lineHeight: 24 },
    emptyStateContainer: { gap: 16 },
    addCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 24, backgroundColor: '#FFF' },
    addCardText: { fontSize: 16, fontWeight: '600', color: '#000' },
    photosContainer: {},
    coverPhotoContainer: { width: '100%', height: 220, borderRadius: 12, overflow: 'hidden', marginBottom: 16, position: 'relative' },
    coverPhoto: { width: '100%', height: '100%' },
    coverBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    coverBadgeText: { fontSize: 12, fontWeight: '700', color: '#000' },
    deleteButton: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },
    deleteButtonSmall: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: 16 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    gridItem: { width: '48%', aspectRatio: 1.4, borderRadius: 12, overflow: 'hidden', position: 'relative' }, // 48% to fit 2 with gap
    gridImage: { width: '100%', height: '100%' },
    gridAddButton: { width: '48%', aspectRatio: 1.4, borderRadius: 12, borderWidth: 1, borderColor: '#D1D5DB', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4 },
    gridAddText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonDisabled: { backgroundColor: '#D1D5DB' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
