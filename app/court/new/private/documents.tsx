import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Camera, ShieldCheck, FileText } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtDocumentsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();

    const [cpf, setCpf] = useState(data.cpf || '');
    const [docPhoto, setDocPhoto] = useState<string | null>(data.documentPhoto || null);

    const isValid = cpf.length === 14 && docPhoto !== null;

    const handleTakePhoto = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.7,
                allowsEditing: true,
            });
            if (!result.canceled && result.assets[0]) {
                setDocPhoto(result.assets[0].uri);
            }
        } catch {
            Alert.alert(
                "Erro na Câmera",
                "Falha ao abrir câmera. Simulador detectado?",
                [
                    { text: "Cancelar", style: 'cancel' },
                    { text: "Usar Galeria", onPress: pickFromGallery }
                ]
            );
        }
    };

    const pickFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });
        if (!result.canceled && result.assets[0]) {
            setDocPhoto(result.assets[0].uri);
        }
    };

    const handleContinue = () => {
        if (!isValid) return;
        updateData({ cpf, documentPhoto: docPhoto });
        router.push('/court/new/private/safety');
    };

    const formatCPF = (text: string) => {
        const raw = text.replace(/\D/g, '');
        // Removed complex regex block that was defining unused 'masked'

        // Simpler incremental mask
        return raw
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <ChevronLeft size={28} color="#000" onPress={() => router.back()} />
                <View>
                    <Text style={styles.headerTitle}>Quadra Privada</Text>
                    <Text style={styles.headerSubtitle}>Etapa 5 de 6</Text>
                </View>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.title}>Identificação</Text>
                <Text style={styles.subtitle}>Para segurança, precisamos validar o proprietário.</Text>

                <View style={styles.secureBanner}>
                    <ShieldCheck size={20} color="#059669" />
                    <Text style={styles.secureText}>Seus dados estão protegidos e não serão exibidos publicamente.</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>CPF do Proprietário *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="000.000.000-00"
                        placeholderTextColor="#9CA3AF"
                        value={cpf}
                        onChangeText={(t) => setCpf(formatCPF(t))}
                        keyboardType="numeric"
                        maxLength={14}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Foto do Documento (RG ou CNH) *</Text>
                    <Pressable style={styles.uploadBox} onPress={handleTakePhoto}>
                        {docPhoto ? (
                            <Image source={{ uri: docPhoto }} style={styles.previewImage} resizeMode="cover" />
                        ) : (
                            <View style={styles.placeholder}>
                                <FileText size={32} color="#9CA3AF" />
                                <Text style={styles.uploadText}>Tirar foto do documento</Text>
                                <Text style={styles.uploadSubtext}>Frente e verso legíveis</Text>
                            </View>
                        )}
                        {docPhoto && (
                            <View style={styles.changeBadge}>
                                <Camera size={14} color="#FFF" />
                                <Text style={styles.changeText}>Alterar</Text>
                            </View>
                        )}
                    </Pressable>
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable
                    style={[styles.button, !isValid && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={!isValid}
                >
                    <Text style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}>Continuar</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
    headerTitle: { fontSize: 16, fontWeight: '700', color: '#000' },
    headerSubtitle: { fontSize: 12, color: '#6B7280' },
    content: { flex: 1, paddingHorizontal: 24 },
    title: { fontSize: 24, fontWeight: '800', color: '#000', marginBottom: 4 },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 24 },
    secureBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#ECFDF5', padding: 16, borderRadius: 12, marginBottom: 24 },
    secureText: { fontSize: 13, color: '#047857', fontWeight: '500', flex: 1 },
    section: { marginBottom: 24 },
    label: { fontSize: 14, fontWeight: '700', color: '#000', marginBottom: 8 },
    input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 14, color: '#000' },
    uploadBox: { height: 200, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed', borderRadius: 16, overflow: 'hidden' },
    placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
    uploadText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
    uploadSubtext: { fontSize: 12, color: '#9CA3AF' },
    previewImage: { width: '100%', height: '100%' },
    changeBadge: { position: 'absolute', bottom: 12, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    changeText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    buttonDisabled: { backgroundColor: '#E5E7EB' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    buttonTextDisabled: { color: '#9CA3AF' },
});
