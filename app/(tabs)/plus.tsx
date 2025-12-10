import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const menuItems = [
    {
        id: 'reserve',
        icon: 'sports-tennis',
        title: 'Reservar Quadra',
        subtitle: 'Encontre e reserve',
        route: '/(tabs)/map',
        color: '#000000',
    },
    {
        id: 'create',
        icon: 'group-add',
        title: 'Criar Partida',
        subtitle: 'Organize um jogo',
        route: '/match/create',
        color: '#000000',
    },
    {
        id: 'checkin',
        icon: 'location-on',
        title: 'Check-in',
        subtitle: 'Registre presença',
        route: '/match/checkin',
        color: '#000000',
    },
    {
        id: 'search',
        icon: 'person-search',
        title: 'Buscar Jogadores',
        subtitle: 'Encontre parceiros',
        route: '/match/search-players',
        color: '#000000',
    },
];

export default function PlusScreen() {
    const handleClose = () => {
        router.back();
    };

    const handleItemPress = (route: string) => {
        // @ts-ignore
        router.replace(route);
    };

    return (
        <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            className="flex-1 bg-black/50 justify-end"
        >
            <Pressable className="flex-1" onPress={handleClose} />
            <View className="bg-white rounded-t-3xl p-5 pb-10">
                {/* Handle */}
                <View className="w-12 h-1 bg-neutral-300 rounded-full mx-auto mb-6" />

                {/* Menu Items */}
                <View className="space-y-3 gap-3">
                    {menuItems.map((item) => (
                        <Pressable
                            key={item.id}
                            onPress={() => handleItemPress(item.route)}
                            className="flex-row items-center p-4 bg-neutral-50 rounded-2xl"
                        >
                            <View className="w-12 h-12 bg-black rounded-xl items-center justify-center">
                                <MaterialIcons name={item.icon as any} size={24} color="#FFFFFF" />
                            </View>
                            <View className="flex-1 ml-4">
                                <Text className="text-black font-semibold text-base">
                                    {item.title}
                                </Text>
                                <Text className="text-neutral-500 text-sm">
                                    {item.subtitle}
                                </Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#A3A3A3" />
                        </Pressable>
                    ))}
                </View>

                {/* Close Button */}
                <Pressable
                    onPress={handleClose}
                    className="mt-6 py-4 bg-neutral-100 rounded-2xl items-center"
                >
                    <Text className="text-black font-semibold">Fechar</Text>
                </Pressable>
            </View>
        </Animated.View>
    );
}
