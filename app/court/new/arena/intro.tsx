
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, TrendingUp, Users, Calendar } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ArenaIntroScreen() {
    const router = useRouter();

    const features = [
        { icon: TrendingUp, text: "Gerencie reservas e faturamento" },
        { icon: Users, text: "Conecte-se com milhares de atletas" },
        { icon: Calendar, text: "Sistema de agendamento automático" }
    ];

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="light" />

            {/* Background Image */}
            <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' }}
                style={styles.backgroundImage}
            />
            <View style={styles.overlay} />

            <View style={styles.content}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#FFF" />
                </Pressable>

                <View style={styles.header}>
                    <Text style={styles.badge}>KOURT BUSINESS</Text>
                    <Text style={styles.title}>Transforme sua Arena em um Hub Esportivo</Text>
                    <Text style={styles.subtitle}>
                        A plataforma completa para gestão, reservas e engajamento de clubes e complexos esportivos.
                    </Text>
                </View>

                <View style={styles.features}>
                    {features.map((feature, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeInDown.delay(index * 200)}
                            style={styles.featureRow}
                        >
                            <View style={styles.iconBox}>
                                <feature.icon size={20} color="#FFF" />
                            </View>
                            <Text style={styles.featureText}>{feature.text}</Text>
                        </Animated.View>
                    ))}
                </View>

                <Animated.View entering={FadeInDown.delay(800)} style={styles.footer}>
                    <Pressable
                        style={styles.button}
                        onPress={() => router.push('/court/new/arena/form')}
                    >
                        <Text style={styles.buttonText}>Cadastrar Arena</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A' },
    backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.6 },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.85)' },

    content: { flex: 1, padding: 24, justifyContent: 'space-between' },
    backButton: { marginTop: 40, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },

    header: { marginTop: 20 },
    badge: { color: '#F59E0B', fontWeight: '800', letterSpacing: 1, fontSize: 12, marginBottom: 12 },
    title: { fontSize: 32, fontWeight: '900', color: '#FFF', lineHeight: 40, marginBottom: 16 },
    subtitle: { fontSize: 16, color: '#94A3B8', lineHeight: 24 },

    features: { gap: 24 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    featureText: { fontSize: 16, color: '#E2E8F0', fontWeight: '500', flex: 1 },

    footer: { marginBottom: 20 },
    button: { backgroundColor: '#FFF', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
    buttonText: { color: '#0F172A', fontSize: 16, fontWeight: '800' },
});
