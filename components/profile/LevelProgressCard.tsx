import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

// Sport-specific background images
const SPORT_IMAGES: Record<string, string> = {
    'beach-tennis': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
    'padel': 'https://images.unsplash.com/photo-1612534847738-b3af9bc31f0c?w=800&q=80',
    'tennis': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80',
};

interface LevelProgressCardProps {
    level: number | null;
    reliability?: number;
    sport: string;
    sportId: string;
    onStartAssessment: () => void;
}

export function LevelProgressCard({ level, reliability, sport, sportId, onStartAssessment }: LevelProgressCardProps) {
    const router = useRouter();
    const hasLevel = level !== null && level > 0;

    // Get sport-specific image
    const backgroundImage = SPORT_IMAGES[sportId] || SPORT_IMAGES['beach-tennis'];

    if (!hasLevel) {
        // Not assessed yet - show gauge placeholder
        return (
            <View className="mx-5 mb-6 rounded-3xl overflow-hidden border border-neutral-200 bg-white">
                <View className="p-5">
                    {/* Header */}
                    <Text className="text-lg font-bold text-neutral-900 mb-4">Nível no {sport}</Text>

                    {/* Empty Gauge */}
                    <View className="items-center py-4">
                        <Svg width={240} height={120} viewBox="0 0 240 120">
                            {/* Background arc */}
                            <Path
                                d="M 20 100 A 100 100 0 0 1 220 100"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth={12}
                                strokeLinecap="round"
                            />
                            {/* Level markers */}
                            <SvgText x={20} y={115} fill="#9CA3AF" fontSize={10} textAnchor="middle">1</SvgText>
                            <SvgText x={57} y={60} fill="#9CA3AF" fontSize={10} textAnchor="middle">2</SvgText>
                            <SvgText x={95} y={30} fill="#9CA3AF" fontSize={10} textAnchor="middle">3</SvgText>
                            <SvgText x={145} y={30} fill="#9CA3AF" fontSize={10} textAnchor="middle">5</SvgText>
                            <SvgText x={183} y={60} fill="#9CA3AF" fontSize={10} textAnchor="middle">6</SvgText>
                            <SvgText x={220} y={115} fill="#9CA3AF" fontSize={10} textAnchor="middle">7</SvgText>
                            {/* Center question mark */}
                            <SvgText x={120} y={85} fill="#D1D5DB" fontSize={40} fontWeight="bold" textAnchor="middle">?</SvgText>
                        </Svg>
                    </View>

                    <TouchableOpacity
                        onPress={onStartAssessment}
                        className="bg-black py-3.5 rounded-2xl items-center"
                    >
                        <Text className="text-white font-semibold text-base">
                            Definir meu nível
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Calculate gauge angle based on level (1-7 scale)
    const levelPercent = ((level - 1) / 6) * 100; // 0-100%
    const arcLength = 200; // Total arc length
    const filledLength = (levelPercent / 100) * arcLength;

    // Get level category name
    const getLevelName = (lvl: number) => {
        if (lvl < 2) return 'Iniciante';
        if (lvl < 3) return 'Iniciante+';
        if (lvl < 4) return 'Intermediário';
        if (lvl < 5) return 'Intermediário+';
        if (lvl < 6) return 'Avançado';
        return 'Profissional';
    };

    // Has level - show gauge with level
    return (
        <TouchableOpacity
            onPress={() => router.push('/level-assessment')}
            className="mx-5 mb-6 rounded-3xl overflow-hidden"
            activeOpacity={0.9}
        >
            <ImageBackground
                source={{ uri: backgroundImage }}
                resizeMode="cover"
                className="overflow-hidden"
            >
                {/* Dark overlay for readability */}
                <View className="bg-black/60 p-5">
                    {/* Header with sport badge */}
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-lg font-bold text-white">Nível no {sport}</Text>
                        <View className="flex-row items-center">
                            <Text className="text-white/70 text-sm mr-1">Editar</Text>
                            <ChevronRight size={16} color="rgba(255,255,255,0.7)" />
                        </View>
                    </View>

                    {/* Gauge with level */}
                    <View className="items-center py-2">
                        <Svg width={240} height={130} viewBox="0 0 240 130">
                            {/* Background arc */}
                            <Path
                                d="M 20 110 A 100 100 0 0 1 220 110"
                                fill="none"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth={14}
                                strokeLinecap="round"
                            />
                            {/* Filled arc based on level */}
                            <Path
                                d="M 20 110 A 100 100 0 0 1 220 110"
                                fill="none"
                                stroke="#22C55E"
                                strokeWidth={14}
                                strokeLinecap="round"
                                strokeDasharray={`${filledLength} ${arcLength}`}
                            />
                            {/* Level markers */}
                            <SvgText x={15} y={125} fill="rgba(255,255,255,0.6)" fontSize={11} textAnchor="middle">1</SvgText>
                            <SvgText x={120} y={20} fill="rgba(255,255,255,0.6)" fontSize={11} textAnchor="middle">4</SvgText>
                            <SvgText x={225} y={125} fill="rgba(255,255,255,0.6)" fontSize={11} textAnchor="middle">7</SvgText>
                            {/* Level number in center */}
                            <SvgText x={120} y={85} fill="#FFFFFF" fontSize={48} fontWeight="bold" textAnchor="middle">
                                {level.toFixed(1)}
                            </SvgText>
                            {/* Level name */}
                            <SvgText x={120} y={108} fill="rgba(255,255,255,0.8)" fontSize={14} textAnchor="middle">
                                {getLevelName(level)}
                            </SvgText>
                        </Svg>
                    </View>

                    {/* Reliability bar */}
                    <View className="mt-2">
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-xs text-white/70">Confiabilidade</Text>
                            <Text className="text-xs font-medium text-white">{reliability || 15}%</Text>
                        </View>
                        <View className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <View
                                className={`h-full rounded-full ${(reliability || 15) < 50 ? 'bg-amber-400' : 'bg-green-500'}`}
                                style={{ width: `${reliability || 15}%` }}
                            />
                        </View>
                        <Text className="text-[10px] text-white/60 mt-1">
                            Jogue mais partidas para aumentar a confiabilidade
                        </Text>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
}
