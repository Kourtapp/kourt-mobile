import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutGrid, Home, ChevronRight, Check, X } from 'lucide-react-native';

const AddCourtOption = ({
    title,
    subtitle,
    features,
    icon: Icon,
    color,
    bgColor,
    onPress
}: {
    title: string,
    subtitle: string,
    features: string[],
    icon: any,
    color: string,
    bgColor: string,
    onPress: () => void
}) => {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                { transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
        >
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
                        <Icon size={24} color={color} />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <Text style={styles.cardSubtitle}>{subtitle}</Text>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                </View>

                <View style={styles.featuresList}>
                    {features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <Check size={14} color={color} style={{ marginTop: 2 }} />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </Pressable>
    );
};

export default function AddCourtScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.closeButton}>
                    <X size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Adicionar Quadra</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <Text style={styles.pageTitle}>Adicionar Quadra</Text>
                <Text style={styles.pageSubtitle}>Qual tipo de quadra você quer adicionar?</Text>

                <View style={styles.optionsContainer}>
                    {/* Quadra Pública */}
                    <AddCourtOption
                        title="Quadra Pública"
                        subtitle="Parques, praças, escolas"
                        icon={LayoutGrid}
                        color="#22C55E"
                        bgColor="#DCFCE7"
                        features={[
                            "Qualquer pessoa pode sugerir",
                            "Ajude a mapear a cidade",
                            "Você ganha +50 XP"
                        ]}
                        onPress={() => router.push('/court/new/public')}
                    />

                    {/* Quadra Privada */}
                    <AddCourtOption
                        title="Quadra Privada"
                        subtitle="Arena, condomínio, sítio ou casa"
                        icon={Home}
                        color="#3B82F6"
                        bgColor="#EFF6FF"
                        features={[
                            "Defina preços e receba pagamentos",
                            "Gestão completa de reservas",
                            "Ideal para renda extra"
                        ]}
                        onPress={() => router.push('/court/new/private/type')}
                    />
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: '#F3F4F6',
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    content: {
        padding: 24,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
        marginBottom: 8,
    },
    pageSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
    },
    optionsContainer: {
        gap: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    headerText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    featuresList: {
        gap: 8,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    featureText: {
        fontSize: 14,
        color: '#4B5563',
        flex: 1,
    },
});
