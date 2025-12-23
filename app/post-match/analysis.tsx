import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Upload, Instagram, MessageCircle, Check } from 'lucide-react-native';
import Animated, { ZoomIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function AnalysisScreen() {
    const router = useRouter();

    const handleFinish = () => {
        router.dismissAll();
        router.push('/(tabs)');
    };

    return (
        <View className="flex-1 bg-white">
            <Pressable
                onPress={handleFinish}
                className="absolute top-14 right-5 z-10 w-10 h-10 bg-gray-100 rounded-full items-center justify-center active:bg-gray-200"
            >
                <X size={20} color="#000" />
            </Pressable>

            <ScrollView className="flex-1 px-5 pt-16" showsVerticalScrollIndicator={false}>

                <Animated.View
                    entering={FadeInUp.delay(100).springify()}
                    className="items-center mb-6"
                >
                    <Animated.View
                        entering={ZoomIn.delay(300).springify().damping(12).stiffness(200)}
                        className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4"
                    >
                        <View className="w-12 h-12 bg-[#22c55e] rounded-full items-center justify-center shadow-md shadow-green-500/40">
                            <Check size={28} color="#FFF" strokeWidth={4} />
                        </View>
                    </Animated.View>
                    <Text className="text-2xl font-black text-gray-900 mb-0.5 tracking-tight">Partida Registrada!</Text>
                    <Text className="text-gray-500 font-semibold text-sm">+25 XP · +15 pontos ranking</Text>
                </Animated.View>

                {/* PIXEL PERFECT MATCH CARD V2 - CENTERED LAYOUT */}
                <Animated.View
                    entering={FadeInDown.delay(500).springify()}
                    className="shadow-xl shadow-black/20 mb-8"
                >
                    <LinearGradient
                        colors={['#2E9F55', '#00120b']} // Enhanced Depth: Green -> Ultra Dark Forest
                        locations={[0, 0.9]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        className="relative overflow-hidden"
                        style={{ borderRadius: 24, height: 420 }}
                    >
                        {/* Explicit Padding Container */}
                        <View className="px-8 py-7 flex-1">
                            {/* Header Row */}
                            <View className="flex-row justify-between items-start mb-10 mt-2 mx-1">
                                {/* KOURT Badge - Larger Logo */}
                                <View
                                    className="flex-row items-center gap-3"
                                    style={{
                                        backgroundColor: 'rgba(5, 46, 22, 0.4)',
                                        paddingHorizontal: 24,
                                        paddingVertical: 14,
                                        borderRadius: 60
                                    }}
                                >
                                    <View className="w-10 h-10 bg-white items-center justify-center rounded-xl">
                                        <Text className="font-black text-xl text-black">K</Text>
                                    </View>
                                    <Text className="text-white font-black text-[16px] tracking-widest">KOURT</Text>
                                </View>

                                {/* Victory Badge */}
                                <View
                                    style={{
                                        backgroundColor: '#E8F7ED',
                                        paddingHorizontal: 24,
                                        paddingVertical: 14,
                                        borderRadius: 60
                                    }}
                                >
                                    <Text className="font-bold text-[14px] uppercase tracking-wide" style={{ color: '#166534' }}>VITÓRIA</Text>
                                </View>
                            </View>

                            {/* Centered Match Content */}
                            <View className="items-center mb-6">
                                {/* Sport & Location */}
                                <Text className="text-white/90 font-medium text-[15px] mb-4 tracking-tight">
                                    <Text className="font-bold">BeachTennis</Text> · Arena Ibirapuera
                                </Text>

                                {/* Score Box */}
                                <View
                                    className="items-center justify-center w-full"
                                    style={{
                                        borderRadius: 24,
                                        borderWidth: 1.5,
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        paddingVertical: 24
                                    }}
                                >
                                    <Text className="text-white font-black text-[76px] leading-tight flex-row" style={{ includeFontPadding: false }}>
                                        6 - 4
                                    </Text>
                                </View>
                            </View>

                            {/* Metrics Bar */}
                            <View
                                className="flex-row justify-between items-center p-4 mb-5"
                                style={{
                                    backgroundColor: 'rgba(0, 20, 10, 0.6)',
                                    borderRadius: 20, // Slightly reduced to match main card
                                    marginTop: 'auto'
                                }}
                            >
                                <View className="items-center flex-1">
                                    <Text className="text-white font-bold text-[18px]">1h</Text>
                                    <Text className="text-white/60 text-[10px] uppercase font-bold tracking-wider mt-0.5">Duração</Text>
                                </View>
                                <View className="w-[1px] bg-white/10 h-6" />
                                <View className="items-center flex-1">
                                    <Text className="text-white font-bold text-[18px]">450</Text>
                                    <Text className="text-white/60 text-[10px] uppercase font-bold tracking-wider mt-0.5">Calorias</Text>
                                </View>
                                <View className="w-[1px] bg-white/10 h-6" />
                                <View className="items-center flex-1">
                                    <Text className="text-white font-bold text-[18px]">142</Text>
                                    <Text className="text-white/60 text-[10px] uppercase font-bold tracking-wider mt-0.5">BPM Méd</Text>
                                </View>
                                <View className="w-[1px] bg-white/10 h-6" />
                                <View className="items-center flex-1">
                                    <Text className="text-white font-bold text-[18px]">4.2</Text>
                                    <Text className="text-white/60 text-[10px] uppercase font-bold tracking-wider mt-0.5">KM</Text>
                                </View>
                            </View>

                            {/* Footer Info */}
                            <View className="flex-row justify-between items-center px-2 mb-1">
                                <View className="flex-row items-center gap-2">
                                    <View className="flex-row -space-x-3">
                                        <View className="w-8 h-8 rounded-full bg-gray-300 border-2 border-[#022c1b]" />
                                        <View className="w-8 h-8 rounded-full bg-gray-400 border-2 border-[#022c1b]" />
                                    </View>
                                    <Text className="text-white/80 text-[13px] font-medium ml-1">com Pedro F.</Text>
                                </View>
                                <Text className="text-white/60 text-[12px] font-medium">1 Dez 2024 • 18:00</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Share Section */}
                <Animated.View
                    entering={FadeInDown.delay(700).springify()}
                    className="bg-white border border-gray-100 rounded-[32px] p-6 mb-8 shadow-sm"
                >
                    <Text className="font-bold text-gray-900 mb-6 text-lg">Compartilhar</Text>
                    <View className="flex-row justify-between gap-2">
                        {/* Instagram */}
                        <Pressable className="items-center flex-1 gap-3">
                            <LinearGradient
                                colors={['#833ab4', '#fd1d1d', '#fcb045']}
                                className="w-16 h-16 rounded-[22px] items-center justify-center transform transition-transform active:scale-95"
                            >
                                <Instagram size={30} color="#FFF" />
                            </LinearGradient>
                            <Text className="text-xs font-semibold text-gray-900">Instagram</Text>
                        </Pressable>

                        {/* WhatsApp */}
                        <Pressable className="items-center flex-1 gap-3">
                            <View className="w-16 h-16 bg-[#25D366] rounded-[22px] items-center justify-center transform transition-transform active:scale-95">
                                <MessageCircle size={30} color="#FFF" />
                            </View>
                            <Text className="text-xs font-semibold text-gray-900">WhatsApp</Text>
                        </Pressable>

                        {/* Twitter / X */}
                        <Pressable className="items-center flex-1 gap-3">
                            <View className="w-16 h-16 bg-black rounded-[22px] items-center justify-center transform transition-transform active:scale-95">
                                <Text className="text-white font-bold text-2xl">X</Text>
                            </View>
                            <Text className="text-xs font-semibold text-gray-900">Twitter</Text>
                        </Pressable>

                        {/* More */}
                        <Pressable className="items-center flex-1 gap-3">
                            <View className="w-16 h-16 bg-gray-100 rounded-[22px] items-center justify-center transform transition-transform active:scale-95">
                                <Upload size={26} color="#374151" />
                            </View>
                            <Text className="text-xs font-semibold text-gray-900">Mais</Text>
                        </Pressable>
                    </View>
                </Animated.View>
                <View className="h-10" />
            </ScrollView>
        </View>
    );
}
