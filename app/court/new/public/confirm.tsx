import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Trophy } from 'lucide-react-native';
import { usePublicCourt } from './PublicCourtContext';

export default function ConfirmSubmissionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { submitCourt, isSubmitting } = usePublicCourt();

    const [checks, setChecks] = useState({
        infoTrue: false,
        photosReal: false,
        publicAccess: false,
        terms: false
    });

    const allChecked = Object.values(checks).every(Boolean);

    const toggleCheck = (key: keyof typeof checks) => {
        setChecks(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSend = async () => {
        if (!allChecked || isSubmitting) return;

        const result = await submitCourt();

        if (result.success) {
            router.push('/court/new/public/success');
        } else {
            Alert.alert('Erro', result.error || 'Não foi possível enviar a quadra. Tente novamente.');
        }
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
                <Text style={styles.title}>Confirmar Envio</Text>
                <Text style={styles.subtitle}>Ao enviar esta sugestão, você confirma:</Text>

                <View style={styles.checklist}>
                    <Checkbox
                        label="As informações são verdadeiras"
                        checked={checks.infoTrue}
                        onPress={() => toggleCheck('infoTrue')}
                    />
                    <Checkbox
                        label="As fotos foram tiradas por mim no local indicado"
                        checked={checks.photosReal}
                        onPress={() => toggleCheck('photosReal')}
                    />
                    <Checkbox
                        label="A quadra é de acesso público"
                        checked={checks.publicAccess}
                        onPress={() => toggleCheck('publicAccess')}
                    />
                    <Checkbox
                        label="Concordo com os Termos de Uso e Política de Privacidade"
                        checked={checks.terms}
                        onPress={() => toggleCheck('terms')}
                    />
                </View>

                {/* XP Reward Card */}
                <View style={styles.rewardCard}>
                    <View style={styles.trophyContainer}>
                        <Trophy size={24} color="#D97706" fill="#D97706" />
                    </View>
                    <View>
                        <Text style={styles.rewardTitle}>Você vai ganhar:</Text>
                        <Text style={styles.rewardText}>+50 XP agora</Text>
                        <Text style={styles.rewardText}>+100 XP se aprovada</Text>
                    </View>
                </View>

            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable
                    style={[styles.button, (!allChecked || isSubmitting) && styles.buttonDisabled]}
                    onPress={handleSend}
                    disabled={!allChecked || isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={[styles.buttonText, !allChecked && styles.buttonTextDisabled]}>Enviar Sugestão</Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}

function Checkbox({ label, checked, onPress }: { label: string, checked: boolean, onPress: () => void }) {
    return (
        <Pressable style={styles.checkboxRow} onPress={onPress}>
            <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                {checked && <Check size={14} color="#FFF" strokeWidth={3} />}
            </View>
            <Text style={styles.checkboxLabel}>{label}</Text>
        </Pressable>
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
    checklist: {
        gap: 16,
        marginBottom: 32,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    checkboxChecked: {
        backgroundColor: '#22C55E',
        borderColor: '#22C55E',
    },
    checkboxLabel: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    rewardCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FEF3C7',
        borderRadius: 16,
        padding: 20,
        gap: 16,
    },
    trophyContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#FEF3C7', // Slightly darker yellow bg for icon
        alignItems: 'center',
        justifyContent: 'center',
    },
    rewardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#92400E',
        marginBottom: 4,
    },
    rewardText: {
        fontSize: 14,
        color: '#B45309',
        fontWeight: '500',
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
        backgroundColor: '#E5E7EB', // Per screenshot
        // Screenshot actually shows gray button.
        // "Enviar Sugestão" is disabled gray in my interpretation if logic follows. 
        // The screenshot shows Checkboxes unchecked and button Gray.
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonTextDisabled: {
        color: '#FFF', // Usually disabled text is distinct, but if bg is gray maybe white is fine? 
        // Or standard disabled text color.
        // Let's use standard disabled text color from previous screens
    },
});
