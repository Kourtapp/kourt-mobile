
import { View, Text, StyleSheet, Pressable, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Sparkles, Wand2 } from 'lucide-react-native';
import { useState } from 'react';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { AutomationService } from '@/services/automationService';

export default function CreatePostAIScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [generating, setGenerating] = useState(false);
    const [content, setContent] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    // ...

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const result = await AutomationService.generateAiPost();
            setContent(result.content);
            setGeneratedImage(result.imageUrl);
        } catch {
            Alert.alert("Erro", "Falha ao gerar post. Tente novamente.");
        } finally {
            setGenerating(false);
        }
    };

    const handlePost = () => {
        Alert.alert("Post Publicado! 🚀", "Seu post gerado por IA já está no feed.");
        router.back();
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#0F172A" />
                </Pressable>
                <View style={styles.headerTitleContainer}>
                    <Sparkles size={16} color="#8B5CF6" />
                    <Text style={styles.headerTitle}>Criar com IA</Text>
                </View>
                <Pressable onPress={handlePost} disabled={!content} style={[styles.postButton, !content && styles.disabledButton]}>
                    <Text style={[styles.postButtonText, !content && styles.disabledText]}>Publicar</Text>
                </Pressable>
            </View>

            <View style={styles.content}>

                {/* Prompt Section */}
                {!content && !generating && (
                    <Animated.View entering={FadeInDown} style={styles.promptCard}>
                        <Wand2 size={32} color="#8B5CF6" style={{ marginBottom: 16 }} />
                        <Text style={styles.promptTitle}>O que você jogou hoje?</Text>
                        <Text style={styles.promptDesc}>
                            Vou analisar seu histórico de partidas recentes e criar um post engajador para você.
                        </Text>
                        <Pressable style={styles.generateButton} onPress={handleGenerate}>
                            <Text style={styles.generateText}>✨ Gerar Post Automático</Text>
                        </Pressable>
                    </Animated.View>
                )}

                {/* Loading State */}
                {generating && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#8B5CF6" />
                        <Text style={styles.loadingText}>Criando legenda e escolhendo foto...</Text>
                    </View>
                )}

                {/* Generated Content */}
                {content && (
                    <Animated.View entering={ZoomIn} style={styles.previewCard}>
                        <View style={styles.userRow}>
                            <View style={styles.avatar} />
                            <View>
                                <Text style={styles.userName}>Bruno Silva</Text>
                                <Text style={styles.userTime}>Agora mesmo</Text>
                            </View>
                        </View>

                        <TextInput
                            style={styles.captionInput}
                            value={content}
                            onChangeText={setContent}
                            multiline
                        />

                        {generatedImage && (
                            <Image source={{ uri: generatedImage }} style={styles.generatedImage} />
                        )}

                        <View style={styles.aiBadge}>
                            <Sparkles size={12} color="#FFF" />
                            <Text style={styles.aiBadgeText}>Gerado por Gumloop + Claude</Text>
                        </View>
                    </Animated.View>
                )}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backButton: { padding: 4 },
    headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
    postButton: { backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    disabledButton: { backgroundColor: '#E2E8F0' },
    postButtonText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
    disabledText: { color: '#94A3B8' },

    content: { flex: 1, padding: 20 },

    promptCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginTop: 40,
        borderStyle: 'dashed',
    },
    promptTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B', marginBottom: 8, textAlign: 'center' },
    promptDesc: { fontSize: 16, color: '#64748B', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
    generateButton: {
        backgroundColor: '#1E293B',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    generateText: { color: '#FFF', fontWeight: '700', fontSize: 16 },

    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loadingText: { marginTop: 16, fontSize: 16, color: '#64748B', fontWeight: '500' },

    previewCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    userRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#CBD5E1' },
    userName: { fontWeight: '700', color: '#1E293B' },
    userTime: { fontSize: 12, color: '#94A3B8' },
    captionInput: { fontSize: 16, color: '#334155', lineHeight: 24, marginBottom: 12, minHeight: 60 },
    generatedImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12, backgroundColor: '#F1F5F9' },

    aiBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    aiBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
});
