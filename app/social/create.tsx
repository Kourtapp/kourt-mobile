import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Image as ImageIcon, Camera, MapPin, Users, Hash } from 'lucide-react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/useUserStore';

export default function CreatePostScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const { session } = useAuthStore();
    const { profile } = useUserStore();

    const [content, setContent] = useState((params.content as string) || '');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [posting, setPosting] = useState(false);

    const matchId = params.matchId as string;
    const sport = params.sport as string;

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 4,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            const newImages = result.assets.map(a => a.uri);
            setSelectedImages(prev => [...prev, ...newImages].slice(0, 4));
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permissão necessária", "Permita acesso à câmera para tirar fotos.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedImages(prev => [...prev, result.assets[0].uri].slice(0, 4));
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handlePost = async () => {
        if (!content.trim() && selectedImages.length === 0) {
            Alert.alert("Post vazio", "Escreva algo ou adicione uma imagem.");
            return;
        }

        if (!session?.user?.id) {
            Alert.alert("Erro", "Você precisa estar logado para postar.");
            return;
        }

        setPosting(true);

        try {
            let imageUrl = null;

            // Upload first image if selected
            if (selectedImages.length > 0) {
                const fileName = `${session.user.id}/${Date.now()}.jpg`;
                const response = await fetch(selectedImages[0]);
                const blob = await response.blob();

                const { error: uploadError } = await supabase.storage
                    .from('posts')
                    .upload(fileName, blob, {
                        contentType: 'image/jpeg',
                    });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('posts')
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
            }

            // Create post
            const { error } = await ((supabase.from('posts') as any)
                .insert({
                    user_id: session.user.id,
                    content: content.trim(),
                    image_url: imageUrl,
                    type: matchId ? 'match_share' : (imageUrl ? 'image' : 'text'),
                    metadata: matchId ? { match_id: matchId, sport } : null,
                }));

            if (error) throw error;

            router.back();
        } catch (error) {
            console.error('Error creating post:', error);
            Alert.alert("Erro", "Não foi possível publicar. Tente novamente.");
        } finally {
            setPosting(false);
        }
    };

    const canPost = content.trim().length > 0 || selectedImages.length > 0;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header - Threads/Instagram style */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.closeButton}>
                    <X size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Novo post</Text>
                <Pressable
                    onPress={handlePost}
                    disabled={posting || !canPost}
                    style={[styles.postButton, canPost && styles.postButtonActive]}
                >
                    {posting ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Text style={[styles.postButtonText, canPost && styles.postButtonTextActive]}>
                            Publicar
                        </Text>
                    )}
                </Pressable>
            </View>

            <ScrollView
                style={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* User Info Row - Like Threads */}
                <View style={styles.userRow}>
                    <Image
                        source={profile?.avatar_url || 'https://github.com/shadcn.png'}
                        style={styles.avatar}
                    />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{profile?.name || 'Você'}</Text>
                        <View style={styles.threadLine} />
                    </View>
                </View>

                {/* Text Input Area */}
                <View style={styles.inputContainer}>
                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        placeholder="No que você está pensando?"
                        placeholderTextColor="#999"
                        multiline
                        style={styles.textInput}
                        textAlignVertical="top"
                        autoFocus
                        maxLength={500}
                    />

                    {/* Character Count */}
                    {content.length > 400 && (
                        <Text style={[styles.charCount, content.length >= 500 && styles.charCountLimit]}>
                            {content.length}/500
                        </Text>
                    )}
                </View>

                {/* Match Context Badge */}
                {matchId && (
                    <View style={styles.matchBadge}>
                        <Text style={styles.matchBadgeText}>
                            Compartilhando partida {sport ? `de ${sport}` : ''}
                        </Text>
                    </View>
                )}

                {/* Selected Images Grid */}
                {selectedImages.length > 0 && (
                    <View style={styles.imagesGrid}>
                        {selectedImages.map((uri, index) => (
                            <View key={index} style={[
                                styles.imageWrapper,
                                selectedImages.length === 1 && styles.singleImage,
                                selectedImages.length === 2 && styles.doubleImage,
                                selectedImages.length >= 3 && styles.gridImage,
                            ]}>
                                <Image source={uri} style={styles.selectedImage} contentFit="cover" />
                                <Pressable
                                    onPress={() => removeImage(index)}
                                    style={styles.removeImageButton}
                                >
                                    <X size={14} color="#FFF" />
                                </Pressable>
                            </View>
                        ))}
                    </View>
                )}

                {/* Media Actions - Instagram style */}
                <View style={styles.mediaActions}>
                    <Pressable onPress={pickImage} style={styles.mediaButton}>
                        <ImageIcon size={24} color="#000" />
                    </Pressable>
                    <Pressable onPress={takePhoto} style={styles.mediaButton}>
                        <Camera size={24} color="#000" />
                    </Pressable>
                    <Pressable style={styles.mediaButton}>
                        <Hash size={24} color="#CCC" />
                    </Pressable>
                    <Pressable style={styles.mediaButton}>
                        <MapPin size={24} color="#CCC" />
                    </Pressable>
                    <Pressable style={styles.mediaButton}>
                        <Users size={24} color="#CCC" />
                    </Pressable>
                </View>
            </ScrollView>

            {/* Bottom Safe Area */}
            <View style={{ height: insets.bottom }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#EFEFEF',
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    postButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#E5E5E5',
    },
    postButtonActive: {
        backgroundColor: '#000',
    },
    postButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999',
    },
    postButtonTextActive: {
        color: '#FFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    userRow: {
        flexDirection: 'row',
        paddingTop: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E5E5E5',
    },
    userInfo: {
        marginLeft: 12,
        flex: 1,
    },
    userName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
    },
    threadLine: {
        position: 'absolute',
        left: -32,
        top: 48,
        width: 2,
        height: 40,
        backgroundColor: '#E5E5E5',
        borderRadius: 1,
    },
    inputContainer: {
        marginLeft: 52,
        minHeight: 100,
    },
    textInput: {
        fontSize: 15,
        color: '#000',
        lineHeight: 22,
        paddingTop: 4,
    },
    charCount: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
        marginTop: 8,
    },
    charCountLimit: {
        color: '#EF4444',
    },
    matchBadge: {
        marginLeft: 52,
        marginTop: 12,
        backgroundColor: '#F0F9FF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    matchBadgeText: {
        fontSize: 13,
        color: '#0369A1',
    },
    imagesGrid: {
        marginLeft: 52,
        marginTop: 12,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    imageWrapper: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
    },
    singleImage: {
        width: '100%',
        height: 300,
    },
    doubleImage: {
        width: '49%',
        height: 200,
    },
    gridImage: {
        width: '49%',
        height: 150,
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#E5E5E5',
    },
    removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mediaActions: {
        flexDirection: 'row',
        marginLeft: 52,
        marginTop: 16,
        gap: 20,
        paddingBottom: 20,
    },
    mediaButton: {
        padding: 4,
    },
});
