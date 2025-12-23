import { View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { X, ChevronLeft, ChevronRight, Trophy, Star, Zap } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { width: _width } = Dimensions.get('window');

// Questions for level assessment
const QUESTIONS = [
    {
        id: 'self_level',
        question: 'Como você se classificaria?',
        options: [
            { label: 'Iniciante', value: 1, description: 'Estou começando a aprender' },
            { label: 'Intermediário', value: 2, description: 'Conheço o básico e pratico regularmente' },
            { label: 'Avançado', value: 3, description: 'Tenho boa técnica e jogo bem' },
            { label: 'Profissional', value: 4, description: 'Compito em alto nível' },
        ]
    },
    {
        id: 'experience',
        question: 'Há quanto tempo você pratica?',
        options: [
            { label: 'Nunca joguei', value: 0 },
            { label: 'Menos de 1 ano', value: 1 },
            { label: 'Entre 1 e 3 anos', value: 2 },
            { label: 'Entre 3 e 5 anos', value: 3 },
            { label: 'Mais de 5 anos', value: 4 },
        ]
    },
    {
        id: 'training',
        question: 'Você faz ou já fez aulas?',
        options: [
            { label: 'Não', value: 0 },
            { label: 'Sim, no passado', value: 1 },
            { label: 'Sim, atualmente', value: 2 },
        ]
    },
    {
        id: 'competition',
        question: 'Em que nível você compete?',
        options: [
            { label: 'Só jogo com amigos', value: 1 },
            { label: 'Torneios amadores', value: 2 },
            { label: 'Ligas amadoras', value: 3 },
            { label: 'Competições federadas', value: 4 },
        ]
    },
    {
        id: 'frequency',
        question: 'Com que frequência você joga?',
        options: [
            { label: 'Raramente', value: 1 },
            { label: '1-2 vezes por mês', value: 2 },
            { label: '1-2 vezes por semana', value: 3 },
            { label: '3+ vezes por semana', value: 4 },
        ]
    },
];

function getLevelInfo(score: number): { name: string; description: string; color: string; icon: string } {
    if (score <= 1.5) return {
        name: 'Iniciação',
        description: 'Começando sua jornada. Foco nos fundamentos!',
        color: '#10B981',
        icon: '🌱'
    };
    if (score <= 3) return {
        name: 'Iniciante',
        description: 'Evoluindo bem! Continue praticando.',
        color: '#3B82F6',
        icon: '🎯'
    };
    if (score <= 4.5) return {
        name: 'Intermediário',
        description: 'Bom nível! Hora de refinar a técnica.',
        color: '#8B5CF6',
        icon: '⚡'
    };
    if (score <= 6) return {
        name: 'Avançado',
        description: 'Excelente! Você domina o jogo.',
        color: '#F59E0B',
        icon: '🔥'
    };
    return {
        name: 'Profissional',
        description: 'Elite! Nível competitivo alto.',
        color: '#EF4444',
        icon: '🏆'
    };
}

// Creative Result Screen - Badge Style
function LevelResultScreen({ level, onConfirm }: { level: number; onConfirm: () => void }) {
    const levelInfo = getLevelInfo(level);

    // Animations
    const scale = useSharedValue(0);
    const rotation = useSharedValue(0);
    const opacity = useSharedValue(0);
    const numberValue = useSharedValue(0);
    const glowPulse = useSharedValue(0);
    const starScale1 = useSharedValue(0);
    const starScale2 = useSharedValue(0);
    const starScale3 = useSharedValue(0);

    const [displayNumber, setDisplayNumber] = useState('0.00');

    useEffect(() => {
        // Badge entrance animation
        scale.value = withSpring(1, { damping: 12, stiffness: 100 });
        rotation.value = withSequence(
            withTiming(-10, { duration: 200 }),
            withSpring(0, { damping: 8 })
        );
        opacity.value = withTiming(1, { duration: 500 });

        // Number counting animation
        numberValue.value = withTiming(level, {
            duration: 2000,
            easing: Easing.out(Easing.cubic),
        });

        // Update display number
        const interval = setInterval(() => {
            const currentVal = numberValue.value;
            setDisplayNumber(currentVal.toFixed(2));
        }, 50);

        setTimeout(() => clearInterval(interval), 2100);

        // Glow pulse
        glowPulse.value = withDelay(500, withTiming(1, { duration: 1000 }));

        // Stars entrance
        starScale1.value = withDelay(800, withSpring(1, { damping: 10 }));
        starScale2.value = withDelay(1000, withSpring(1, { damping: 10 }));
        starScale3.value = withDelay(1200, withSpring(1, { damping: 10 }));

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level]);

    const badgeStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { rotate: `${rotation.value}deg` },
        ],
        opacity: opacity.value,
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: interpolate(glowPulse.value, [0, 1], [0, 0.6]),
        transform: [{ scale: interpolate(glowPulse.value, [0, 1], [0.8, 1.2]) }],
    }));

    const star1Style = useAnimatedStyle(() => ({
        transform: [{ scale: starScale1.value }],
        opacity: starScale1.value,
    }));

    const star2Style = useAnimatedStyle(() => ({
        transform: [{ scale: starScale2.value }],
        opacity: starScale2.value,
    }));

    const star3Style = useAnimatedStyle(() => ({
        transform: [{ scale: starScale3.value }],
        opacity: starScale3.value,
    }));

    return (
        <View className="flex-1 bg-neutral-900">
            <SafeAreaView className="flex-1">
                {/* Background gradient circles */}
                <View className="absolute inset-0 items-center justify-center">
                    <Animated.View
                        style={[{
                            position: 'absolute',
                            width: 300,
                            height: 300,
                            borderRadius: 150,
                            backgroundColor: levelInfo.color,
                        }, glowStyle]}
                    />
                </View>

                {/* Header */}
                <View className="px-5 pt-4">
                    <Text className="text-white/60 text-center text-sm uppercase tracking-widest">
                        Seu nível foi calculado
                    </Text>
                </View>

                {/* Main Content */}
                <View className="flex-1 items-center justify-center px-5">
                    {/* Floating stars */}
                    <Animated.View style={[{ position: 'absolute', top: '20%', left: '15%' }, star1Style]}>
                        <Star size={24} color="#FBBF24" fill="#FBBF24" />
                    </Animated.View>
                    <Animated.View style={[{ position: 'absolute', top: '25%', right: '20%' }, star2Style]}>
                        <Star size={20} color="#FBBF24" fill="#FBBF24" />
                    </Animated.View>
                    <Animated.View style={[{ position: 'absolute', top: '35%', left: '25%' }, star3Style]}>
                        <Star size={16} color="#FBBF24" fill="#FBBF24" />
                    </Animated.View>

                    {/* Badge */}
                    <Animated.View style={badgeStyle}>
                        <View
                            className="w-64 h-64 rounded-full items-center justify-center"
                            style={{ backgroundColor: levelInfo.color + '20' }}
                        >
                            <View
                                className="w-56 h-56 rounded-full items-center justify-center border-4"
                                style={{ borderColor: levelInfo.color, backgroundColor: '#1F2937' }}
                            >
                                <View
                                    className="w-48 h-48 rounded-full items-center justify-center"
                                    style={{ backgroundColor: levelInfo.color + '30' }}
                                >
                                    {/* Icon */}
                                    <Text className="text-4xl mb-2">{levelInfo.icon}</Text>

                                    {/* Number */}
                                    <Text
                                        className="text-6xl font-black"
                                        style={{ color: levelInfo.color }}
                                    >
                                        {displayNumber.replace('.', ',')}
                                    </Text>

                                    {/* Level name */}
                                    <Text className="text-white font-bold text-lg mt-1">
                                        {levelInfo.name}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Description */}
                    <Animated.View style={{ opacity: opacity }}>
                        <Text className="text-white/70 text-center mt-8 text-base px-10">
                            {levelInfo.description}
                        </Text>
                    </Animated.View>

                    {/* Stats preview */}
                    <Animated.View
                        className="flex-row mt-8 gap-6"
                        style={{ opacity: opacity }}
                    >
                        <View className="items-center">
                            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center mb-2">
                                <Zap size={20} color="#FBBF24" />
                            </View>
                            <Text className="text-white/60 text-xs">XP Inicial</Text>
                            <Text className="text-white font-bold">0</Text>
                        </View>
                        <View className="items-center">
                            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center mb-2">
                                <Trophy size={20} color="#FBBF24" />
                            </View>
                            <Text className="text-white/60 text-xs">Ranking</Text>
                            <Text className="text-white font-bold">--</Text>
                        </View>
                    </Animated.View>
                </View>

                {/* Confirm Button */}
                <View className="px-5 pb-5">
                    <TouchableOpacity
                        onPress={onConfirm}
                        className="py-4 rounded-2xl items-center"
                        style={{ backgroundColor: levelInfo.color }}
                    >
                        <Text className="text-white font-bold text-lg">Começar a jogar!</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="py-3 items-center mt-2">
                        <Text className="text-white/50 text-sm">Acho que meu nível é diferente</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

export default function LevelAssessmentScreen() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [showResult, setShowResult] = useState(false);
    const [calculatedLevel, setCalculatedLevel] = useState(0);

    const fadeAnim = useSharedValue(1);

    const question = QUESTIONS[currentQuestion];
    const progress = (currentQuestion + 1) / QUESTIONS.length;
    const canGoNext = answers[question?.id] !== undefined;
    const isLastQuestion = currentQuestion === QUESTIONS.length - 1;

    const selectAnswer = (value: number) => {
        setAnswers(prev => ({ ...prev, [question.id]: value }));
    };

    const goNext = () => {
        if (isLastQuestion) {
            const values = Object.values(answers);
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            const level = Math.min(7, Math.max(0, avg * 1.4));
            setCalculatedLevel(parseFloat(level.toFixed(2)));
            setShowResult(true);
        } else {
            fadeAnim.value = withSequence(
                withTiming(0, { duration: 150 }),
                withTiming(1, { duration: 150 })
            );
            setTimeout(() => setCurrentQuestion(prev => prev + 1), 150);
        }
    };

    const goBack = () => {
        if (currentQuestion > 0) {
            fadeAnim.value = withSequence(
                withTiming(0, { duration: 150 }),
                withTiming(1, { duration: 150 })
            );
            setTimeout(() => setCurrentQuestion(prev => prev - 1), 150);
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
        transform: [{ translateX: (1 - fadeAnim.value) * 20 }],
    }));

    if (showResult) {
        return <LevelResultScreen level={calculatedLevel} onConfirm={() => router.back()} />;
    }

    return (
        <LinearGradient colors={['#0F172A', '#1E293B']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View className="flex-row items-center justify-between px-5 pt-2">
                    <TouchableOpacity onPress={() => router.back()}>
                        <X size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text className="text-white/60 text-sm">
                        {currentQuestion + 1} de {QUESTIONS.length}
                    </Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Progress bar */}
                <View className="px-5 mt-4">
                    <View className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <Animated.View
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${progress * 100}%` }}
                        />
                    </View>
                </View>

                {/* Question Card */}
                <View className="flex-1 px-5 pt-8">
                    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                        <View className="bg-white rounded-3xl p-6 shadow-xl">
                            <Text className="text-neutral-900 text-2xl font-bold mb-6">
                                {question.question}
                            </Text>

                            {/* Options */}
                            <View className="gap-3">
                                {question.options.map((option) => {
                                    const isSelected = answers[question.id] === option.value;
                                    return (
                                        <TouchableOpacity
                                            key={option.value}
                                            onPress={() => selectAnswer(option.value)}
                                            className={`p-4 rounded-2xl border-2 ${isSelected
                                                ? 'bg-blue-50 border-blue-500'
                                                : 'bg-neutral-50 border-transparent'
                                                }`}
                                        >
                                            <View className="flex-row items-center">
                                                <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-neutral-300'
                                                    }`}>
                                                    {isSelected && (
                                                        <View className="w-2 h-2 rounded-full bg-white" />
                                                    )}
                                                </View>
                                                <View className="flex-1">
                                                    <Text className={`font-semibold text-base ${isSelected ? 'text-blue-700' : 'text-neutral-700'}`}>
                                                        {option.label}
                                                    </Text>
                                                    {(option as any).description && (
                                                        <Text className="text-neutral-500 text-sm mt-0.5">
                                                            {(option as any).description}
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </Animated.View>
                </View>

                {/* Navigation */}
                <View className="flex-row justify-between px-5 pb-5">
                    <TouchableOpacity
                        onPress={goBack}
                        disabled={currentQuestion === 0}
                        className={`w-14 h-14 rounded-full items-center justify-center ${currentQuestion === 0 ? 'bg-slate-700/50' : 'bg-blue-500'
                            }`}
                    >
                        <ChevronLeft size={24} color={currentQuestion === 0 ? '#64748B' : '#FFF'} />
                    </TouchableOpacity>

                    {isLastQuestion ? (
                        <TouchableOpacity
                            onPress={goNext}
                            disabled={!canGoNext}
                            className={`px-8 h-14 rounded-full items-center justify-center ${canGoNext ? 'bg-green-500' : 'bg-slate-700/50'
                                }`}
                        >
                            <Text className={`font-bold ${canGoNext ? 'text-white' : 'text-slate-500'}`}>
                                Ver resultado
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={goNext}
                            disabled={!canGoNext}
                            className={`w-14 h-14 rounded-full items-center justify-center ${canGoNext ? 'bg-blue-500' : 'bg-slate-700/50'
                                }`}
                        >
                            <ChevronRight size={24} color={canGoNext ? '#FFF' : '#64748B'} />
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
