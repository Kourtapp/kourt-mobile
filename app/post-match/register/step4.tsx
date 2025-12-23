import { View, Text, Pressable, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Watch, Flame, Activity, Minus, Plus, Flag, AlertCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RegisterHeader } from '@/components/post-match/RegisterHeader';
import { usePostMatch } from './PostMatchContext';

export default function RegisterStep4() {
    const router = useRouter();
    const { data, updateData, submitMatch, isSubmitting } = usePostMatch();

    // States synced with context
    const [intensity, setIntensity] = useState(data.intensity);
    const [effort, setEffort] = useState(data.effort);
    const [mood, setMood] = useState(data.mood);
    const [aces, setAces] = useState(data.aces);
    const [errors, setErrors] = useState(data.errors);
    const [notes, setNotes] = useState(data.notes);

    // Update context when values change
    useEffect(() => {
        updateData({ intensity, effort, mood, aces, errors: errors, notes });
    }, [intensity, effort, mood, aces, errors, notes]);

    const handlePublish = async () => {
        if (isSubmitting) return;

        const result = await submitMatch();

        if (result.success) {
            router.replace('/post-match/analysis');
        } else {
            Alert.alert('Erro', result.error || 'Não foi possível publicar a partida. Tente novamente.');
        }
    };

    const renderBars = (value: number, setValue: (v: number) => void, colorClass: string) => {
        return (
            <View className="flex-row gap-1 h-12 items-end">
                {[1, 2, 3, 4, 5].map((level) => {
                    const isActive = level <= value;
                    const heightClass = [
                        'h-6', 'h-7', 'h-8', 'h-9', 'h-10'
                    ][level - 1];

                    return (
                        <Pressable
                            key={level}
                            onPress={() => setValue(level)}
                            className={`flex-1 rounded-md ${heightClass} ${isActive ? colorClass : 'bg-gray-100'}`}
                        />
                    );
                })}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-white">
            <RegisterHeader title="Métricas" step={4} />

            <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>

                {/* Apple Watch Card - Hyper Realistic Style */}
                {/* Apple Watch Card - Padding Fix */}
                <Animated.View
                    entering={FadeInDown.delay(200).duration(800).springify()}
                    style={{
                        borderRadius: 22, // Reduced from 32
                        overflow: 'hidden',
                        marginBottom: 32,
                        transform: [{ translateY: 0 }]
                    }}
                >
                    <LinearGradient
                        colors={['#FF3B3F', '#FF5CAD']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        className="relative overflow-hidden"
                    >
                        {/* Explicit Padding Container */}
                        <View className="px-5 py-5">
                            {/* Header */}
                            <View className="flex-row items-center gap-4 mb-4">
                                <View className="w-[44px] h-[44px] bg-white/20 rounded-[14px] items-center justify-center backdrop-blur-md border border-white/10">
                                    <Watch size={22} color="#FFF" strokeWidth={2.5} />
                                </View>
                                <View>
                                    <Text className="text-white font-black text-[18px] tracking-tight leading-6">Dados do Apple Watch</Text>
                                    <Text className="text-white/80 text-[12px] font-medium tracking-wide opacity-95">Sincronizado automaticamente</Text>
                                </View>
                            </View>

                            {/* Stats Grid */}
                            <View className="flex-row justify-between gap-2.5">
                                {/* BPM */}
                                <View className="bg-white/20 rounded-[16px] flex-1 items-center justify-center h-[88px]">
                                    <Text className="text-white font-black text-[28px] mb-0.5 shadow-sm">142</Text>
                                    <Text className="text-white/90 text-[10px] font-bold uppercase tracking-wider">BPM Médio</Text>
                                </View>

                                {/* Calories */}
                                <View className="bg-white/20 rounded-[16px] flex-1 items-center justify-center h-[88px]">
                                    <Text className="text-white font-black text-[28px] mb-0.5 shadow-sm">450</Text>
                                    <Text className="text-white/90 text-[10px] font-bold uppercase tracking-wider">Calorias</Text>
                                </View>

                                {/* KM */}
                                <View className="bg-white/20 rounded-[16px] flex-1 items-center justify-center h-[88px]">
                                    <Text className="text-white font-black text-[28px] mb-0.5 shadow-sm">4.2</Text>
                                    <Text className="text-white/90 text-[10px] font-bold uppercase tracking-wider">Km</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                <Text className="text-base font-bold text-gray-900 mb-3">Adicionar métricas</Text>

                {/* Intensity & Effort Row */}
                <View className="flex-row gap-3 mb-4">
                    {/* Intensity */}
                    <View className="flex-1 border border-gray-200 rounded-3xl p-4 bg-white">
                        <View className="flex-row items-center gap-2 mb-4">
                            <Flame size={16} color="#000" />
                            <Text className="font-bold text-sm">Intensidade</Text>
                        </View>
                        {renderBars(intensity, setIntensity, 'bg-black')}
                        <Text className="text-xs text-gray-500 mt-2 font-medium">Moderada</Text>
                    </View>

                    {/* Effort */}
                    <View className="flex-1 border border-gray-200 rounded-3xl p-4 bg-white">
                        <View className="flex-row items-center gap-2 mb-4">
                            <Activity size={16} color="#3b82f6" />
                            <Text className="font-bold text-sm">Esforço</Text>
                        </View>
                        {renderBars(effort, setEffort, 'bg-blue-500')}
                        <Text className="text-xs text-gray-500 mt-2 font-medium">Alto</Text>
                    </View>
                </View>

                {/* Mood Selector */}
                <View className="border border-gray-200 rounded-2xl p-4 mb-4 flex-row items-center justify-between bg-white">
                    <View className="flex-row items-center gap-2">
                        <Text className="text-green-500 mr-2">😊</Text>
                        <Text className="font-bold text-gray-900 text-sm">Como se sentiu?</Text>
                    </View>
                    <View className="flex-row gap-3">
                        {['😫', '😐', '😊', '🤩'].map((emoji, idx) => {
                            const names = ['sad', 'neutral', 'happy', 'star'];
                            const isSelected = mood === names[idx];
                            return (
                                <Pressable
                                    key={idx}
                                    onPress={() => setMood(names[idx] as any)}
                                    className={`w-10 h-10 items-center justify-center rounded-full ${isSelected ? 'bg-yellow-100' : 'bg-transparent'}`}
                                >
                                    <Text className="text-2xl">{emoji}</Text>
                                </Pressable>
                            )
                        })}
                    </View>
                </View>

                {/* Stats Counters */}
                <View className="border border-gray-200 rounded-2xl p-4 mb-4 flex-row items-center justify-between bg-white">
                    <View className="flex-row items-center gap-3">
                        <Flag size={18} color="#a855f7" />
                        <Text className="font-bold text-gray-900 text-sm">Aces / Winners</Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <Pressable onPress={() => setAces(Math.max(0, aces - 1))} className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center">
                            <Minus size={14} color="#374151" />
                        </Pressable>
                        <Text className="font-bold text-lg w-6 text-center">{aces}</Text>
                        <Pressable onPress={() => setAces(aces + 1)} className="w-8 h-8 bg-black rounded-lg items-center justify-center">
                            <Plus size={14} color="#FFF" />
                        </Pressable>
                    </View>
                </View>

                <View className="border border-gray-200 rounded-2xl p-4 mb-6 flex-row items-center justify-between bg-white">
                    <View className="flex-row items-center gap-3">
                        <AlertCircle size={18} color="#ef4444" />
                        <Text className="font-bold text-gray-900 text-sm">Erros não forçados</Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <Pressable onPress={() => setErrors(Math.max(0, errors - 1))} className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center">
                            <Minus size={14} color="#374151" />
                        </Pressable>
                        <Text className="font-bold text-lg w-6 text-center">{errors}</Text>
                        <Pressable onPress={() => setErrors(errors + 1)} className="w-8 h-8 bg-black rounded-lg items-center justify-center">
                            <Plus size={14} color="#FFF" />
                        </Pressable>
                    </View>
                </View>

                {/* Notes */}
                <Text className="text-sm font-bold text-gray-900 mb-2">Notas (opcional)</Text>
                <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-4 min-h-[100px] text-base mb-8"
                    placeholder="Como foi o jogo? O que você aprendeu?"
                    multiline
                    textAlignVertical="top"
                    value={notes}
                    onChangeText={setNotes}
                />

                <View className="h-24" />
            </ScrollView>

            {/* Footer */}
            <View className="absolute bottom-0 left-0 right-0 p-5 pb-8 bg-white border-t border-gray-100">
                <Pressable
                    className={`w-full h-14 rounded-full items-center justify-center active:opacity-90 transition-opacity ${isSubmitting ? 'bg-gray-300' : 'bg-[#84cc16]'}`}
                    onPress={handlePublish}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text className="text-black font-bold text-lg">Publicar Partida</Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}
