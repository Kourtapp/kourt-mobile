import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

const DAYS = [
    { key: 'monday', label: 'Segunda-feira', short: 'Seg' },
    { key: 'tuesday', label: 'Terça-feira', short: 'Ter' },
    { key: 'wednesday', label: 'Quarta-feira', short: 'Qua' },
    { key: 'thursday', label: 'Quinta-feira', short: 'Qui' },
    { key: 'friday', label: 'Sexta-feira', short: 'Sex' },
    { key: 'saturday', label: 'Sábado', short: 'Sáb' },
    { key: 'sunday', label: 'Domingo', short: 'Dom' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

export default function OperatingHoursScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();
    const [hours, setHours] = useState((data as any).operatingHours as any);
    const [editingDay, setEditingDay] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<'open' | 'close' | null>(null);

    const toggleDay = (key: string) => {
        setHours((prev: any) => ({
            ...prev,
            [key]: { ...prev[key], enabled: !prev[key].enabled }
        }));
    };

    const updateTime = (key: string, field: 'open' | 'close', value: string) => {
        setHours((prev: any) => ({
            ...prev,
            [key]: { ...prev[key], [field]: value }
        }));
        setEditingDay(null);
        setEditingField(null);
    };

    const applyToAll = (key: string) => {
        const sourceDay = (hours as any)[key];
        const newHours = { ...hours };
        DAYS.forEach(day => {
            (newHours as any)[day.key] = {
                ...(newHours as any)[day.key],
                open: sourceDay.open,
                close: sourceDay.close,
            };
        });
        setHours(newHours);
    };

    const handleContinue = () => {
        updateData({ operatingHours: hours } as any);
        router.push('/court/new/private/discounts');
    };

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
                <View style={styles.titleRow}>
                    <Clock size={28} color="#22C55E" />
                    <Text style={styles.title}>Horários de funcionamento</Text>
                </View>
                <Text style={styles.subtitle}>
                    Defina os dias e horários que sua quadra estará disponível para reservas.
                </Text>

                <View style={styles.daysContainer}>
                    {DAYS.map((day) => {
                        const dayData = (hours as any)[day.key];
                        const isEnabled = dayData?.enabled ?? true;
                        const isEditingOpen = editingDay === day.key && editingField === 'open';
                        const isEditingClose = editingDay === day.key && editingField === 'close';

                        return (
                            <View key={day.key} style={[styles.dayCard, !isEnabled && styles.dayCardDisabled]}>
                                <View style={styles.dayHeader}>
                                    <View style={styles.dayInfo}>
                                        <Text style={[styles.dayLabel, !isEnabled && styles.dayLabelDisabled]}>
                                            {day.label}
                                        </Text>
                                        {isEnabled && (
                                            <Text style={styles.dayHours}>
                                                {dayData?.open || '06:00'} - {dayData?.close || '22:00'}
                                            </Text>
                                        )}
                                    </View>
                                    <Switch
                                        value={isEnabled}
                                        onValueChange={() => toggleDay(day.key)}
                                        trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                                        thumbColor={isEnabled ? '#22C55E' : '#9CA3AF'}
                                    />
                                </View>

                                {isEnabled && (
                                    <View style={styles.timeSelectors}>
                                        <View style={styles.timeSelector}>
                                            <Text style={styles.timeSelectorLabel}>Abre</Text>
                                            <Pressable
                                                style={styles.timeButton}
                                                onPress={() => {
                                                    setEditingDay(day.key);
                                                    setEditingField('open');
                                                }}
                                            >
                                                <Text style={styles.timeButtonText}>{dayData?.open || '06:00'}</Text>
                                                <ChevronDown size={16} color="#6B7280" />
                                            </Pressable>
                                        </View>
                                        <View style={styles.timeSelector}>
                                            <Text style={styles.timeSelectorLabel}>Fecha</Text>
                                            <Pressable
                                                style={styles.timeButton}
                                                onPress={() => {
                                                    setEditingDay(day.key);
                                                    setEditingField('close');
                                                }}
                                            >
                                                <Text style={styles.timeButtonText}>{dayData?.close || '22:00'}</Text>
                                                <ChevronDown size={16} color="#6B7280" />
                                            </Pressable>
                                        </View>
                                        <Pressable
                                            style={styles.applyAllButton}
                                            onPress={() => applyToAll(day.key)}
                                        >
                                            <Text style={styles.applyAllText}>Aplicar a todos</Text>
                                        </Pressable>
                                    </View>
                                )}

                                {/* Hour Picker */}
                                {(isEditingOpen || isEditingClose) && (
                                    <View style={styles.hourPicker}>
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={styles.hourPickerContent}
                                        >
                                            {HOURS.map((hour) => (
                                                <Pressable
                                                    key={hour}
                                                    style={[
                                                        styles.hourOption,
                                                        (isEditingOpen && dayData?.open === hour) && styles.hourOptionSelected,
                                                        (isEditingClose && dayData?.close === hour) && styles.hourOptionSelected,
                                                    ]}
                                                    onPress={() => updateTime(day.key, editingField!, hour)}
                                                >
                                                    <Text style={[
                                                        styles.hourOptionText,
                                                        ((isEditingOpen && dayData?.open === hour) ||
                                                            (isEditingClose && dayData?.close === hour)) && styles.hourOptionTextSelected,
                                                    ]}>
                                                        {hour}
                                                    </Text>
                                                </Pressable>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.button} onPress={handleContinue}>
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
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
    title: { fontSize: 24, fontWeight: '700', color: '#000' },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 24 },
    daysContainer: { gap: 12 },
    dayCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dayCardDisabled: {
        backgroundColor: '#F3F4F6',
        opacity: 0.7,
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dayInfo: {
        flex: 1,
    },
    dayLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    dayLabelDisabled: {
        color: '#9CA3AF',
    },
    dayHours: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    timeSelectors: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    timeSelector: {
        flex: 1,
    },
    timeSelectorLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    timeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    timeButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
    },
    applyAllButton: {
        paddingVertical: 8,
    },
    applyAllText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#22C55E',
        textDecorationLine: 'underline',
    },
    hourPicker: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    hourPickerContent: {
        gap: 8,
    },
    hourOption: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    hourOptionSelected: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    hourOptionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    hourOptionTextSelected: {
        color: '#FFF',
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
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
