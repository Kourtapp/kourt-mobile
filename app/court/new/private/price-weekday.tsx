import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pencil, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtPriceWeekdayScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();
    const [price, setPrice] = useState(String(data.priceWeekday || 180));

    const handleContinue = () => {
        updateData({ priceWeekday: Number(price) });
        router.push('/court/new/private/price-weekend');
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

            <View style={styles.content}>
                <Text style={styles.title}>Defina um preço básico para dias de semana</Text>
                <Text style={styles.subtitle}>Dica: R$180. Você pode definir um preço para fins de semana a seguir.</Text>

                <View style={styles.priceContainer}>
                    <Text style={styles.currencyPrefix}>R$</Text>
                    <TextInput
                        style={styles.priceInput}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                        maxLength={5}
                    />
                    <View style={styles.editIcon}>
                        <Pencil size={16} color="#4B5563" />
                    </View>
                </View>

                {/* Similar Listings Button */}
                <View style={styles.similarListingsContainer}>
                    <Pressable style={styles.similarButton}>
                        <MapPin size={16} color="#222222" />
                        <Text style={styles.similarText}>Visualizar anúncios semelhantes</Text>
                    </Pressable>
                </View>

                <Pressable style={{ alignItems: 'center', marginTop: 16 }}>
                    <Text style={styles.linkText}>Saiba mais sobre preços</Text>
                </Pressable>
            </View>

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
    content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
    title: { fontSize: 26, fontWeight: '700', color: '#000', marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 40 },
    priceContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
    currencyPrefix: { fontSize: 48, fontWeight: '800', color: '#000', marginRight: 8 },
    priceInput: { fontSize: 64, fontWeight: '800', color: '#000', minWidth: 120, textAlign: 'center' },
    editIcon: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20, marginLeft: 16, position: 'absolute', right: 20 }, // Adjust positioning as needed
    similarListingsContainer: { alignItems: 'center', marginBottom: 16 },
    similarButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, gap: 8 },
    similarText: { fontSize: 14, fontWeight: '600', color: '#000' },
    linkText: { fontSize: 14, fontWeight: '600', textDecorationLine: 'underline', color: '#6B7280' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
