import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface OpenMatchCardProps {
    match: {
        id: string;
        sport: string;
        time: string;
        location: string;
        spotsLeft: number;
    };
    onJoin: () => void;
}

export function OpenMatchCard({ match, onJoin }: OpenMatchCardProps) {
    const sportIcons: Record<string, string> = {
        'beach-tennis': 'sports-tennis',
        'padel': 'sports-tennis',
        'football': 'sports-soccer',
        'basketball': 'sports-basketball',
    };

    return (
        <View className="bg-white border border-neutral-200 rounded-2xl p-4 flex-row items-center gap-4 mb-3">
            <View className="w-12 h-12 bg-neutral-100 rounded-xl items-center justify-center">
                <MaterialIcons
                    name={(sportIcons[match.sport] || 'sports') as any}
                    size={24}
                    color="#000"
                />
            </View>

            <View className="flex-1">
                <Text className="font-semibold text-black text-sm capitalize">
                    {match.sport.replace('-', ' ')} · {match.time}
                </Text>
                <Text className="text-xs text-neutral-500">
                    {match.location} · Falta {match.spotsLeft}
                </Text>
            </View>

            <Pressable
                onPress={onJoin}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Entrar na partida de ${match.sport.replace('-', ' ')}`}
                accessibilityHint={`Toque duas vezes para entrar. Faltam ${match.spotsLeft} jogadores`}
                className="px-4 py-2 bg-lime-500 rounded-full"
                style={{ minWidth: 44, minHeight: 44, justifyContent: 'center' }}  // ✅ Touch target
            >
                <Text className="text-lime-950 text-xs font-semibold">Entrar</Text>
            </Pressable>
        </View>
    );
}
