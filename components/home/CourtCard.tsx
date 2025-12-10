import { View, Text, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CourtCardProps {
    court: {
        id: string;
        name: string;
        type: 'public' | 'private';
        sport: string;
        distance: string;
        rating: number;
        price: number | null;
        currentPlayers?: number;
        image?: string;
    };
    onPress: () => void;
}

export function CourtCard({ court, onPress }: CourtCardProps) {
    return (
        <Pressable
            onPress={onPress}
            className="w-[260px] bg-white border border-neutral-200 rounded-2xl overflow-hidden"
        >
            {/* Image */}
            <View className="h-28 bg-neutral-200 relative">
                {court.image && (
                    <Image source={{ uri: court.image }} className="w-full h-full" />
                )}

                {/* Badge Tipo */}
                <View className="absolute top-3 left-3 px-2.5 py-1 bg-black rounded-full">
                    <Text className="text-white text-[10px] font-medium">
                        {court.type === 'public' ? 'Pública' : 'Privada'}
                    </Text>
                </View>

                {/* Badge Distância */}
                <View className="absolute top-3 right-3 px-2 py-1 bg-white/90 rounded-full">
                    <Text className="text-black text-[10px] font-semibold">
                        {court.distance}
                    </Text>
                </View>
            </View>

            {/* Content */}
            <View className="p-3">
                <Text className="font-semibold text-black text-sm mb-1" numberOfLines={1}>
                    {court.name}
                </Text>

                <View className="flex-row items-center gap-2 mb-2">
                    <View className="flex-row items-center gap-1">
                        <MaterialIcons name="star" size={12} color="#000" />
                        <Text className="text-xs text-black">{court.rating}</Text>
                    </View>
                    <Text className="text-xs text-neutral-400">·</Text>
                    <Text className="text-xs text-neutral-500">{court.sport}</Text>
                </View>

                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1">
                        <MaterialIcons name="group" size={12} color="#525252" />
                        <Text className="text-[11px] text-neutral-600">
                            {court.currentPlayers
                                ? `${court.currentPlayers} jogando agora`
                                : 'Disponível'}
                        </Text>
                    </View>

                    <Text className="text-xs font-semibold text-black">
                        {court.price ? `R$ ${court.price}/h` : 'Gratuita'}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}
