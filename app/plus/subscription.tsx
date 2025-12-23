
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Switch } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Crown, CreditCard, Clock, CheckCircle2 } from 'lucide-react-native';
import { useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AutomationService } from '@/services/automationService';

export default function SubscriptionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Mock State for Automation 4.3 (Renovação Automática)
    const [autoRenew, setAutoRenew] = useState(true);
    const [loading, setLoading] = useState(false);


    // ...

    const toggleAutoRenew = async () => {
        setLoading(true);
        try {
            const newState = !autoRenew;
            const result = await AutomationService.toggleAutoRenewal(newState);

            setAutoRenew(newState);

            if (newState) {
                Alert.alert("Renovação Ativada", result.message);
            } else {
                Alert.alert("Renovação Pausada", result.message);
            }
        } catch {
            Alert.alert("Erro", "Não foi possível alterar a configuração.");
        } finally {
            setLoading(false);
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
                <Text style={styles.headerTitle}>Minha Assinatura</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Current Plan Card */}
                <Animated.View entering={FadeInDown} style={styles.planCard}>
                    <View style={styles.planHeader}>
                        <View style={styles.badge}>
                            <Crown size={20} color="#F59E0B" fill="#F59E0B" />
                            <Text style={styles.badgeText}>Kourt PRO</Text>
                        </View>
                        <Text style={styles.price}>R$ 29,90<Text style={styles.period}>/mês</Text></Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Clock size={18} color="#94A3B8" />
                        <Text style={styles.detailText}>Próxima cobrança: <Text style={styles.bold}>15 Jan 2026</Text></Text>
                    </View>
                    <View style={styles.detailRow}>
                        <CreditCard size={18} color="#94A3B8" />
                        <Text style={styles.detailText}>Mastercard final 8842</Text>
                    </View>
                </Animated.View>

                {/* Automation Control (4.3) */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.automationSection}>
                    <Text style={styles.sectionTitle}>Automação de Pagamento</Text>

                    <View style={styles.settingCard}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Renovação Automática</Text>
                            <Text style={styles.settingDesc}>
                                {autoRenew
                                    ? "O valor será debitado automaticamente na data de vencimento."
                                    : "Sua assinatura será cancelada ao fim do período atual."}
                            </Text>
                        </View>
                        <Switch
                            value={autoRenew}
                            onValueChange={toggleAutoRenew}
                            trackColor={{ false: "#E2E8F0", true: "#8B5CF6" }}
                            thumbColor={"#FFF"}
                            disabled={loading}
                        />
                    </View>

                    {/* Smart Alert (Automation 4.4 Simulation) */}
                    <View style={styles.infoBox}>
                        <CheckCircle2 size={16} color="#059669" />
                        <Text style={styles.infoText}>
                            Automação Ativa: Você receberá um e-mail 7 dias antes da renovação.
                        </Text>
                    </View>
                </Animated.View>

            </ScrollView>

            <View style={styles.bgHeader} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    bgHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
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

    content: { padding: 20 },

    planCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFF7ED',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: '#FFEDD5',
    },
    badgeText: { fontWeight: '800', color: '#F59E0B', fontSize: 14 },
    price: { fontSize: 24, fontWeight: '800', color: '#1E293B' },
    period: { fontSize: 14, fontWeight: '500', color: '#64748B' },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 20 },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    detailText: { fontSize: 14, color: '#475569' },
    bold: { fontWeight: '700', color: '#1E293B' },

    automationSection: { gap: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#334155' },

    settingCard: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    settingInfo: { flex: 1, paddingRight: 16 },
    settingLabel: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
    settingDesc: { fontSize: 13, color: '#64748B', lineHeight: 18 },

    infoBox: {
        flexDirection: 'row',
        gap: 8,
        padding: 16,
        backgroundColor: '#ECFDF5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    infoText: { flex: 1, fontSize: 12, color: '#047857', lineHeight: 18 },
});
