import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Sparkles, CheckCircle2, Trophy, CalendarPlus, X } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { useState } from 'react';

// Mock Suggestions based on "Context/AI"
const MOCK_SUGGESTIONS = [
    {
        id: 'result-1',
        type: 'result',
        title: 'Registrar Placar',
        subtitle: 'Jogo de hoje vs João Silva',
        icon: Trophy,
        color: '#F97316', // Orange
        bg: '#FFF7ED',
        action: '/match/mock-123/result'
    },
    {
        id: 'checkin-1',
        type: 'checkin',
        title: 'Fazer Check-in',
        subtitle: 'Arena 7 • Começa em 15min',
        icon: CheckCircle2,
        color: '#22C55E', // Green
        bg: '#DCFCE7',
        action: '/match/mock-456/checkin' // We'll just alert for now or go to details
    },
    {
        id: 'create-1',
        type: 'create',
        title: 'Repetir Partida?',
        subtitle: 'Beach Tennis • Qua, 19:00',
        icon: CalendarPlus,
        color: '#3B82F6', // Blue
        bg: '#EFF6FF',
        action: '/match/create?type=repeat'
    }
];

export function SmartSuggestions() {
    const [suggestions, setSuggestions] = useState(MOCK_SUGGESTIONS);

    const handleDismiss = (id: string) => {
        setSuggestions(prev => prev.filter(s => s.id !== id));
    };

    if (suggestions.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Sparkles size={16} color="#8B5CF6" />
                <Text style={styles.headerTitle}>Sugestões Inteligentes</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {suggestions.map((item, index) => (
                    <Animated.View
                        key={item.id}
                        entering={FadeInRight.delay(index * 100)}
                        exiting={FadeOutRight}
                    >
                        <Pressable
                            style={[styles.card, { backgroundColor: item.bg }]}
                            onPress={() => item.type === 'result' ? router.push(item.action as any) : console.log('Action:', item.type)}
                        >
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(255,255,255,0.8)' }]}>
                                <item.icon size={20} color={item.color} />
                            </View>

                            <View style={styles.info}>
                                <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
                                <Text style={styles.subtitle}>{item.subtitle}</Text>
                            </View>

                            <Pressable
                                style={styles.closeBtn}
                                hitSlop={10}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleDismiss(item.id);
                                }}
                            >
                                <X size={14} color="#9CA3AF" />
                            </Pressable>
                        </Pressable>
                    </Animated.View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8B5CF6',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        width: 260,
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    closeBtn: {
        alignSelf: 'flex-start',
        padding: 2,
    }
});
