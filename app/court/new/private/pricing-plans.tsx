import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, Calendar, CalendarDays, Package, Repeat, ChevronDown, ChevronUp, Info } from 'lucide-react-native';
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type PlanKey = 'hourly' | 'dayUse' | 'monthly' | 'daily' | 'package';

const PLANS = [
    {
        key: 'hourly' as PlanKey,
        icon: Clock,
        title: 'Hora Avulsa',
        description: 'Cobrança por hora. Ideal para jogos rápidos.',
        popular: true,
    },
    {
        key: 'dayUse' as PlanKey,
        icon: Calendar,
        title: 'Day Use',
        description: 'Períodos do dia: manhã, tarde ou noite.',
        popular: false,
    },
    {
        key: 'monthly' as PlanKey,
        icon: Repeat,
        title: 'Mensalista',
        description: 'Horário fixo semanal com desconto mensal.',
        popular: true,
    },
    {
        key: 'daily' as PlanKey,
        icon: CalendarDays,
        title: 'Diária',
        description: 'Acesso por dia inteiro à quadra.',
        popular: false,
    },
    {
        key: 'package' as PlanKey,
        icon: Package,
        title: 'Pacote de Horas',
        description: 'Compre horas em pacote com desconto.',
        popular: false,
    },
];

export default function PricingPlansScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();
    const [expandedPlan, setExpandedPlan] = useState<PlanKey | null>('hourly');
    const [plans, setPlans] = useState((data as any).pricingPlans as any);

    const togglePlan = (key: PlanKey) => {
        setPlans((prev: any) => ({
            ...prev,
            [key]: { ...prev[key], enabled: !prev[key].enabled }
        }));
    };

    const updatePlanField = (key: PlanKey, field: string, value: any) => {
        setPlans((prev: any) => ({
            ...prev,
            [key]: { ...prev[key], [field]: value }
        }));
    };

    const handleContinue = () => {
        updateData({
            pricingPlans: plans,
            priceWeekday: (plans as any).hourly.priceWeekday, // Keep legacy field in sync
        } as any);
        router.push('/court/new/private/operating-hours');
    };

    const atLeastOnePlanEnabled = Object.values(plans as any).some((p: any) => p.enabled);

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

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <Text style={styles.title}>Como você quer cobrar?</Text>
                <Text style={styles.subtitle}>
                    Escolha as formas de cobrança que deseja oferecer. Você pode habilitar mais de uma opção.
                </Text>

                <View style={styles.plansContainer}>
                    {PLANS.map((plan) => {
                        const Icon = plan.icon;
                        const isEnabled = (plans as any)[plan.key].enabled;
                        const isExpanded = expandedPlan === plan.key;
                        const planData = (plans as any)[plan.key];

                        return (
                            <View key={plan.key} style={[styles.planCard, isEnabled && styles.planCardEnabled]}>
                                {/* Plan Header */}
                                <Pressable
                                    style={styles.planHeader}
                                    onPress={() => setExpandedPlan(isExpanded ? null : plan.key)}
                                >
                                    <View style={styles.planHeaderLeft}>
                                        <View style={[styles.planIcon, isEnabled && styles.planIconEnabled]}>
                                            <Icon size={20} color={isEnabled ? '#FFF' : '#6B7280'} />
                                        </View>
                                        <View style={styles.planInfo}>
                                            <View style={styles.planTitleRow}>
                                                <Text style={[styles.planTitle, isEnabled && styles.planTitleEnabled]}>
                                                    {plan.title}
                                                </Text>
                                                {plan.popular && (
                                                    <View style={styles.popularBadge}>
                                                        <Text style={styles.popularText}>Popular</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={styles.planDescription}>{plan.description}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.planHeaderRight}>
                                        <Switch
                                            value={isEnabled}
                                            onValueChange={() => togglePlan(plan.key)}
                                            trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                                            thumbColor={isEnabled ? '#22C55E' : '#9CA3AF'}
                                        />
                                        {isExpanded ? (
                                            <ChevronUp size={20} color="#9CA3AF" />
                                        ) : (
                                            <ChevronDown size={20} color="#9CA3AF" />
                                        )}
                                    </View>
                                </Pressable>

                                {/* Expanded Content */}
                                {isExpanded && isEnabled && (
                                    <Animated.View
                                        entering={FadeIn.duration(200)}
                                        exiting={FadeOut.duration(150)}
                                        style={styles.planDetails}
                                    >
                                        {plan.key === 'hourly' && (
                                            <>
                                                <View style={styles.fieldRow}>
                                                    <Text style={styles.fieldLabel}>Preço (Seg-Sex)</Text>
                                                    <View style={styles.priceInput}>
                                                        <Text style={styles.currency}>R$</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={String(planData.priceWeekday)}
                                                            onChangeText={(v) => updatePlanField('hourly', 'priceWeekday', Number(v) || 0)}
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                </View>
                                                <View style={styles.fieldRow}>
                                                    <Text style={styles.fieldLabel}>Preço (Sáb-Dom)</Text>
                                                    <View style={styles.priceInput}>
                                                        <Text style={styles.currency}>R$</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={String(planData.priceWeekend)}
                                                            onChangeText={(v) => updatePlanField('hourly', 'priceWeekend', Number(v) || 0)}
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                </View>
                                                <View style={styles.fieldRow}>
                                                    <Text style={styles.fieldLabel}>Mínimo de horas</Text>
                                                    <View style={styles.smallInput}>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={String(planData.minHours)}
                                                            onChangeText={(v) => updatePlanField('hourly', 'minHours', Number(v) || 1)}
                                                            keyboardType="numeric"
                                                        />
                                                        <Text style={styles.suffix}>hora(s)</Text>
                                                    </View>
                                                </View>
                                            </>
                                        )}

                                        {plan.key === 'dayUse' && (
                                            <>
                                                <View style={styles.periodInfo}>
                                                    <Info size={14} color="#6B7280" />
                                                    <Text style={styles.periodInfoText}>
                                                        Manhã: 06h-12h | Tarde: 12h-18h | Noite: 18h-22h
                                                    </Text>
                                                </View>
                                                <View style={styles.fieldRow}>
                                                    <Text style={styles.fieldLabel}>Manhã</Text>
                                                    <View style={styles.priceInput}>
                                                        <Text style={styles.currency}>R$</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={String(planData.priceMorning)}
                                                            onChangeText={(v) => updatePlanField('dayUse', 'priceMorning', Number(v) || 0)}
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                </View>
                                                <View style={styles.fieldRow}>
                                                    <Text style={styles.fieldLabel}>Tarde</Text>
                                                    <View style={styles.priceInput}>
                                                        <Text style={styles.currency}>R$</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={String(planData.priceAfternoon)}
                                                            onChangeText={(v) => updatePlanField('dayUse', 'priceAfternoon', Number(v) || 0)}
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                </View>
                                                <View style={styles.fieldRow}>
                                                    <Text style={styles.fieldLabel}>Noite</Text>
                                                    <View style={styles.priceInput}>
                                                        <Text style={styles.currency}>R$</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={String(planData.priceNight)}
                                                            onChangeText={(v) => updatePlanField('dayUse', 'priceNight', Number(v) || 0)}
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                </View>
                                                <View style={styles.fieldRow}>
                                                    <Text style={styles.fieldLabel}>Dia inteiro</Text>
                                                    <View style={styles.priceInput}>
                                                        <Text style={styles.currency}>R$</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={String(planData.priceFullDay)}
                                                            onChangeText={(v) => updatePlanField('dayUse', 'priceFullDay', Number(v) || 0)}
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                </View>
                                            </>
                                        )}

                                        {plan.key === 'monthly' && (
                                            <>
                                                <View style={styles.fieldRow}>
                                                    <Text style={styles.fieldLabel}>Valor mensal</Text>
                                                    <View style={styles.priceInput}>
                                                        <Text style={styles.currency}>R$</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={String(planData.pricePerMonth)}
                                                            onChangeText={(v) => updatePlanField('monthly', 'pricePerMonth', Number(v) || 0)}
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                </View>
                                                <View style={styles.fieldRow}>
                                                    <Text style={styles.fieldLabel}>Horas por semana</Text>
                                                    <View style={styles.smallInput}>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={String(planData.hoursPerWeek)}
                                                            onChangeText={(v) => updatePlanField('monthly', 'hoursPerWeek', Number(v) || 1)}
                                                            keyboardType="numeric"
                                                        />
                                                        <Text style={styles.suffix}>h/sem</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.switchRow}>
                                                    <Text style={styles.fieldLabel}>Horário fixo semanal</Text>
                                                    <Switch
                                                        value={planData.fixedDayTime}
                                                        onValueChange={(v) => updatePlanField('monthly', 'fixedDayTime', v)}
                                                        trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                                                        thumbColor={planData.fixedDayTime ? '#22C55E' : '#9CA3AF'}
                                                    />
                                                </View>
                                            </>
                                        )}

                                        {plan.key === 'daily' && (
                                            <View style={styles.fieldRow}>
                                                <Text style={styles.fieldLabel}>Valor da diária</Text>
                                                <View style={styles.priceInput}>
                                                    <Text style={styles.currency}>R$</Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        value={String(planData.pricePerDay)}
                                                        onChangeText={(v) => updatePlanField('daily', 'pricePerDay', Number(v) || 0)}
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {plan.key === 'package' && (
                                            <>
                                                <View style={styles.fieldRow}>
                                                    <Text style={styles.fieldLabel}>Quantidade de horas</Text>
                                                    <View style={styles.smallInput}>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={String(planData.hours)}
                                                            onChangeText={(v) => updatePlanField('package', 'hours', Number(v) || 1)}
                                                            keyboardType="numeric"
                                                        />
                                                        <Text style={styles.suffix}>horas</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.fieldRow}>
                                                    <Text style={styles.fieldLabel}>Valor do pacote</Text>
                                                    <View style={styles.priceInput}>
                                                        <Text style={styles.currency}>R$</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={String(planData.price)}
                                                            onChangeText={(v) => updatePlanField('package', 'price', Number(v) || 0)}
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                </View>
                                                <View style={styles.fieldRow}>
                                                    <Text style={styles.fieldLabel}>Validade</Text>
                                                    <View style={styles.smallInput}>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={String(planData.validityDays)}
                                                            onChangeText={(v) => updatePlanField('package', 'validityDays', Number(v) || 30)}
                                                            keyboardType="numeric"
                                                        />
                                                        <Text style={styles.suffix}>dias</Text>
                                                    </View>
                                                </View>
                                            </>
                                        )}
                                    </Animated.View>
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable
                    style={[styles.button, !atLeastOnePlanEnabled && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={!atLeastOnePlanEnabled}
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
    scrollView: { flex: 1 },
    content: { paddingHorizontal: 24, paddingBottom: 40 },
    title: { fontSize: 26, fontWeight: '700', color: '#000', marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 24 },
    plansContainer: { gap: 12 },
    planCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    planCardEnabled: {
        borderColor: '#22C55E',
        backgroundColor: '#F0FDF4',
    },
    planHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    planHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    planIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    planIconEnabled: {
        backgroundColor: '#22C55E',
    },
    planInfo: {
        flex: 1,
    },
    planTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    planTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
    },
    planTitleEnabled: {
        color: '#000',
    },
    popularBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    popularText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#D97706',
    },
    planDescription: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    planHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    planDetails: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 12,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    fieldLabel: {
        fontSize: 14,
        color: '#374151',
    },
    priceInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
        height: 40,
    },
    smallInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
        height: 40,
    },
    currency: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginRight: 4,
    },
    input: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        minWidth: 60,
        textAlign: 'right',
    },
    suffix: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 4,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    periodInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    periodInfoText: {
        fontSize: 12,
        color: '#6B7280',
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#D1D5DB',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
