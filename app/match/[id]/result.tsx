
import { View, Text, StyleSheet, Pressable, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Trophy, Star } from 'lucide-react-native';
import { useState } from 'react';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { AutomationService } from '@/services/automationService';

export default function MatchResultScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();

    // Mock state for scores (Tennis/Beach Tennis logical sets)
    const [set1User, setSet1User] = useState('');
    const [set1Opponent, setSet1Opponent] = useState('');
    const [set2User, setSet2User] = useState('');
    const [set2Opponent, setSet2Opponent] = useState('');

    const [rating, setRating] = useState(0);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!set1User || !set1Opponent) {
            Alert.alert("Placar Incompleto", "Preencha pelo menos o primeiro set.");
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const matchId = Array.isArray(id) ? id[0] : id;
            if (!matchId) {
                Alert.alert("Erro", "ID da partida não encontrado.");
                return;
            }

            const result = await AutomationService.registerMatchResult(
                matchId,
                {
                    set1: [set1User, set1Opponent],
                    set2: set2User && set2Opponent ? [set2User, set2Opponent] : undefined
                },
                rating
            );

            Alert.alert(
                "Resultado Registrado! 🏆",
                `Seu ranking foi atualizado (+${result.xpEarned} XP). Notificação enviada para os adversários.`,
                [
                    { text: "OK", onPress: () => router.replace('/(tabs)') }
                ]
            );
        } catch (error: any) {
            console.error('[MatchResult] Error:', error);
            Alert.alert("Erro", error.message || "Falha ao registrar resultado.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#FFF" />
                </Pressable>
                <Text style={styles.headerTitle}>Registrar Resultado</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Match Context */}
                <Animated.View entering={ZoomIn} style={styles.matchCard}>
                    <Trophy size={32} color="#F59E0B" style={{ marginBottom: 8 }} />
                    <Text style={styles.matchTitle}>Beach Tennis - Duplas</Text>
                    <Text style={styles.matchSubtitle}>Ontem, 19:00 • Arena 7</Text>

                    <View style={styles.versusContainer}>
                        <View style={styles.playerSide}>
                            <View style={styles.avatar}><Text style={styles.avatarText}>VC</Text></View>
                            <Text style={styles.playerName}>Você</Text>
                        </View>
                        <Text style={styles.versusText}>VS</Text>
                        <View style={styles.playerSide}>
                            <View style={[styles.avatar, styles.avatarOpponent]}><Text style={styles.avatarText}>JO</Text></View>
                            <Text style={styles.playerName}>João</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Automation Tip */}
                <View style={styles.autoTip}>
                    <Text style={styles.autoTipText}>
                        🤖 Automação 2.5: Este formulário foi enviado automaticamente após o fim da partida.
                    </Text>
                </View>

                {/* Score Inputs */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.formCard}>
                    <Text style={styles.sectionTitle}>Placar Final</Text>

                    <View style={styles.setRow}>
                        <Text style={styles.setLabel}>1º Set</Text>
                        <TextInput
                            style={styles.scoreInput}
                            placeholder="6"
                            keyboardType="numeric"
                            maxLength={1}
                            value={set1User}
                            onChangeText={setSet1User}
                        />
                        <Text style={styles.dash}>-</Text>
                        <TextInput
                            style={styles.scoreInput}
                            placeholder="4"
                            keyboardType="numeric"
                            maxLength={1}
                            value={set1Opponent}
                            onChangeText={setSet1Opponent}
                        />
                    </View>

                    <View style={styles.setRow}>
                        <Text style={styles.setLabel}>2º Set</Text>
                        <TextInput
                            style={styles.scoreInput}
                            placeholder="-"
                            keyboardType="numeric"
                            maxLength={1}
                            value={set2User}
                            onChangeText={setSet2User}
                        />
                        <Text style={styles.dash}>-</Text>
                        <TextInput
                            style={styles.scoreInput}
                            placeholder="-"
                            keyboardType="numeric"
                            maxLength={1}
                            value={set2Opponent}
                            onChangeText={setSet2Opponent}
                        />
                    </View>
                </Animated.View>

                {/* Rating */}
                <Animated.View entering={FadeInDown.delay(300)} style={styles.ratingCard}>
                    <Text style={styles.sectionTitle}>Avalie a Partida</Text>
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Pressable key={star} onPress={() => setRating(star)}>
                                <Star
                                    size={32}
                                    color={star <= rating ? "#F59E0B" : "#E5E7EB"}
                                    fill={star <= rating ? "#F59E0B" : "transparent"}
                                />
                            </Pressable>
                        ))}
                    </View>
                </Animated.View>

            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable
                    style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.submitText}>Confirmar Resultado</Text>
                    )}
                </Pressable>
            </View>

            {/* Background Decoration */}
            <View style={styles.bgHeader} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    bgHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 250,
        backgroundColor: '#1E293B',
        zIndex: -1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },

    content: { padding: 20, paddingBottom: 100 },

    matchCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginBottom: 16,
    },
    matchTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
    matchSubtitle: { fontSize: 14, color: '#64748B', marginBottom: 24 },

    versusContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-around' },
    playerSide: { alignItems: 'center', gap: 8 },
    avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
    avatarOpponent: { backgroundColor: '#F97316' },
    avatarText: { color: '#FFF', fontWeight: '800', fontSize: 18 },
    playerName: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
    versusText: { fontSize: 24, fontWeight: '900', color: '#CBD5E1' },

    autoTip: {
        backgroundColor: '#E0F2FE',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#BAE6FD',
    },
    autoTipText: { fontSize: 12, color: '#0369A1', textAlign: 'center' },

    formCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 16 },
    setRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12, gap: 12 },
    setLabel: { width: 60, fontSize: 14, fontWeight: '600', color: '#64748B' },
    scoreInput: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        backgroundColor: '#F8FAFC',
    },
    dash: { fontSize: 24, fontWeight: '400', color: '#CBD5E1' },

    ratingCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    starsRow: { flexDirection: 'row', gap: 8 },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    submitButton: {
        backgroundColor: '#1E293B',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
