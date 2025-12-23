import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import {
    ArrowLeft, Plus, Edit3, Star,
    ShoppingBag, ChevronRight, Package, Calendar
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Equipment categories
const CATEGORIES = [
    { id: 'all', label: 'Todos' },
    { id: 'racket', label: 'Raquetes' },
    { id: 'shoes', label: 'Calçados' },
    { id: 'apparel', label: 'Vestuário' },
    { id: 'accessories', label: 'Acessórios' },
];

// Mock equipment data
const MOCK_EQUIPMENT = [
    {
        id: '1',
        name: 'Head Extreme Tour',
        category: 'racket',
        brand: 'Head',
        imageUrl: 'https://images.unsplash.com/photo-1617083934555-3d8bef6f3d89?w=400',
        purchaseDate: 'Set 2024',
        usageHours: 45,
        isPrimary: true,
        condition: 'excellent',
        notes: 'Raquete principal para Beach Tennis',
    },
    {
        id: '2',
        name: 'Adidas CourtJam Bounce',
        category: 'shoes',
        brand: 'Adidas',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        purchaseDate: 'Out 2024',
        usageHours: 32,
        isPrimary: true,
        condition: 'good',
        notes: 'Tênis para quadra de areia',
    },
    {
        id: '3',
        name: 'Bullpadel Vertex 03',
        category: 'racket',
        brand: 'Bullpadel',
        imageUrl: 'https://images.unsplash.com/photo-1617083934555-3d8bef6f3d89?w=400',
        purchaseDate: 'Jul 2024',
        usageHours: 28,
        isPrimary: false,
        condition: 'good',
        notes: 'Raquete reserva para Padel',
    },
    {
        id: '4',
        name: 'Nike Dri-FIT Shorts',
        category: 'apparel',
        brand: 'Nike',
        imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
        purchaseDate: 'Nov 2024',
        usageHours: 20,
        isPrimary: false,
        condition: 'excellent',
    },
    {
        id: '5',
        name: 'Oakley Radar EV',
        category: 'accessories',
        brand: 'Oakley',
        imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        purchaseDate: 'Ago 2024',
        usageHours: 40,
        isPrimary: true,
        condition: 'excellent',
        notes: 'Óculos para jogos ao ar livre',
    },
    {
        id: '6',
        name: 'Wilson Pro Overgrip',
        category: 'accessories',
        brand: 'Wilson',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        purchaseDate: 'Dez 2024',
        usageHours: 8,
        isPrimary: false,
        condition: 'new',
        notes: 'Pack com 12 unidades',
    },
];

const CONDITION_LABELS: Record<string, { label: string; color: string }> = {
    new: { label: 'Novo', color: '#22C55E' },
    excellent: { label: 'Excelente', color: '#3B82F6' },
    good: { label: 'Bom', color: '#F59E0B' },
    fair: { label: 'Regular', color: '#F97316' },
    poor: { label: 'Desgastado', color: '#EF4444' },
};

export default function EquipmentScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredEquipment = MOCK_EQUIPMENT.filter(item =>
        activeCategory === 'all' || item.category === activeCategory
    );

    const totalItems = MOCK_EQUIPMENT.length;
    const totalHours = MOCK_EQUIPMENT.reduce((acc, item) => acc + item.usageHours, 0);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Equipamento</Text>
                <Pressable style={styles.addButton}>
                    <Plus size={24} color="#FFF" />
                </Pressable>
            </View>

            {/* Stats Summary */}
            <Animated.View entering={FadeIn.delay(100)} style={styles.statsCard}>
                <View style={styles.statItem}>
                    <Package size={24} color="#3B82F6" />
                    <Text style={styles.statValue}>{totalItems}</Text>
                    <Text style={styles.statLabel}>Itens</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Calendar size={24} color="#22C55E" />
                    <Text style={styles.statValue}>{totalHours}h</Text>
                    <Text style={styles.statLabel}>Uso Total</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Star size={24} color="#F59E0B" />
                    <Text style={styles.statValue}>{MOCK_EQUIPMENT.filter(e => e.isPrimary).length}</Text>
                    <Text style={styles.statLabel}>Principais</Text>
                </View>
            </Animated.View>

            {/* Category Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
            >
                {CATEGORIES.map((category) => (
                    <Pressable
                        key={category.id}
                        style={[
                            styles.categoryChip,
                            activeCategory === category.id && styles.categoryChipActive
                        ]}
                        onPress={() => setActiveCategory(category.id)}
                    >
                        <Text style={[
                            styles.categoryText,
                            activeCategory === category.id && styles.categoryTextActive
                        ]}>
                            {category.label}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            {/* Equipment List */}
            <ScrollView
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                {filteredEquipment.map((item, index) => {
                    const condition = CONDITION_LABELS[item.condition];
                    return (
                        <Animated.View key={item.id} entering={FadeInDown.delay(index * 50)}>
                            <Pressable style={styles.equipmentCard}>
                                {/* Image */}
                                <Image
                                    source={{ uri: item.imageUrl }}
                                    style={styles.equipmentImage}
                                />

                                {/* Primary Badge */}
                                {item.isPrimary && (
                                    <View style={styles.primaryBadge}>
                                        <Star size={12} color="#FFF" fill="#FFF" />
                                    </View>
                                )}

                                {/* Content */}
                                <View style={styles.equipmentContent}>
                                    <View style={styles.equipmentHeader}>
                                        <Text style={styles.brandText}>{item.brand}</Text>
                                        <View style={[styles.conditionBadge, { backgroundColor: condition.color + '20' }]}>
                                            <Text style={[styles.conditionText, { color: condition.color }]}>
                                                {condition.label}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.equipmentName}>{item.name}</Text>

                                    <View style={styles.equipmentMeta}>
                                        <View style={styles.metaItem}>
                                            <Calendar size={14} color="#6B7280" />
                                            <Text style={styles.metaText}>{item.purchaseDate}</Text>
                                        </View>
                                        <View style={styles.metaItem}>
                                            <ShoppingBag size={14} color="#6B7280" />
                                            <Text style={styles.metaText}>{item.usageHours}h uso</Text>
                                        </View>
                                    </View>

                                    {item.notes && (
                                        <Text style={styles.notesText} numberOfLines={1}>
                                            {item.notes}
                                        </Text>
                                    )}
                                </View>

                                {/* Actions */}
                                <View style={styles.equipmentActions}>
                                    <Pressable style={styles.actionIcon}>
                                        <Edit3 size={18} color="#6B7280" />
                                    </Pressable>
                                    <ChevronRight size={20} color="#D1D5DB" />
                                </View>
                            </Pressable>
                        </Animated.View>
                    );
                })}

                {/* Add Equipment Card */}
                <Animated.View entering={FadeInDown.delay(filteredEquipment.length * 50)}>
                    <Pressable style={styles.addEquipmentCard}>
                        <View style={styles.addIconContainer}>
                            <Plus size={24} color="#3B82F6" />
                        </View>
                        <View>
                            <Text style={styles.addTitle}>Adicionar Equipamento</Text>
                            <Text style={styles.addDescription}>
                                Registre seu novo equipamento
                            </Text>
                        </View>
                    </Pressable>
                </Animated.View>

                {/* Tips Card */}
                <Animated.View entering={FadeInDown.delay((filteredEquipment.length + 1) * 50)}>
                    <View style={styles.tipsCard}>
                        <Text style={styles.tipsTitle}>💡 Dica</Text>
                        <Text style={styles.tipsText}>
                            Mantenha seu equipamento atualizado para acompanhar o desgaste
                            e saber quando é hora de trocar.
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#111827',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 8,
    },
    categoriesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 8,
    },
    categoryChipActive: {
        backgroundColor: '#111827',
        borderColor: '#111827',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    categoryTextActive: {
        color: '#FFF',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    equipmentCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    equipmentImage: {
        width: 100,
        height: 100,
    },
    primaryBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#F59E0B',
        borderRadius: 12,
        padding: 4,
    },
    equipmentContent: {
        flex: 1,
        padding: 12,
    },
    equipmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    brandText: {
        fontSize: 12,
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    conditionBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    conditionText: {
        fontSize: 10,
        fontWeight: '600',
    },
    equipmentName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    equipmentMeta: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 4,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#6B7280',
    },
    notesText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontStyle: 'italic',
        marginTop: 4,
    },
    equipmentActions: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 12,
        gap: 8,
    },
    actionIcon: {
        padding: 4,
    },
    addEquipmentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#E5E7EB',
    },
    addIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    addDescription: {
        fontSize: 13,
        color: '#6B7280',
    },
    tipsCard: {
        backgroundColor: '#FFFBEB',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    tipsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#92400E',
        marginBottom: 4,
    },
    tipsText: {
        fontSize: 13,
        color: '#92400E',
        lineHeight: 20,
    },
});
