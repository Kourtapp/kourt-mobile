import { View, Text, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CourtListItemProps {
    court: {
        id: string;
        name: string;
        type: 'public' | 'private';
        sport: string;
        distance: string;
        rating: number;
        price: number | null;
        image?: string;
    };
    onPress: () => void;
}

export function CourtListItem({ court, onPress }: CourtListItemProps) {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row bg-white border border-neutral-200 rounded-2xl overflow-hidden p-3 gap-3"
        >
            {/* Image */}
            <View className="w-24 h-24 bg-neutral-200 rounded-xl overflow-hidden">
                {court.image && (
                    <Image source={{ uri: court.image }} className="w-full h-full" />
                )}
            </View>

            {/* Content */}
            <View className="flex-1 justify-between py-1">
                <View>
                    <View className="flex-row items-start justify-between">
                        <Text className="font-semibold text-black text-base flex-1 mr-2" numberOfLines={1}>
                            {court.name}
                        </Text>
                        <View className="flex-row items-center gap-1">
                            <MaterialIcons name="star" size={14} color="#FBBF24" />
                            <Text className="text-xs font-medium text-black">{court.rating}</Text>
                        </View>
                    </View>

                    <Text className="text-sm text-neutral-500 mt-1">
                        {court.distance} · {court.sport}
                    </Text>
                </View>

                <View className="flex-row items-center justify-between mt-2">
                    <View className="px-2 py-1 bg-neutral-100 rounded-md">
                        <Text className="text-[10px] font-medium text-neutral-600">
                            {court.type === 'public' ? 'Pública' : 'Privada'}
                        </Text>
                    </View>

                    <Text className="text-sm font-bold text-black">
                        {court.price ? `R$ ${court.price}/h` : 'Gratuita'}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}
