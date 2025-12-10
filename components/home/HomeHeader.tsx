import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

interface HomeHeaderProps {
    userName: string;
    location: string;
    unreadNotifications: number;
}

export function HomeHeader({ userName, location, unreadNotifications }: HomeHeaderProps) {
    return (
        <View className="bg-white px-5 pt-4 pb-3">
            <View className="flex-row items-start justify-between mb-4">
                {/* Left */}
                <View>
                    <Text className="text-sm text-neutral-500">Olá,</Text>
                    <Text className="text-2xl font-bold text-black">{userName}</Text>
                    <View className="flex-row items-center mt-1">
                        <MaterialIcons name="location-on" size={14} color="#A3A3A3" />
                        <Text className="text-sm text-neutral-500 ml-1">{location}</Text>
                    </View>
                </View>

                {/* Right */}
                <View className="flex-row items-center gap-2">
                    <Pressable
                        onPress={() => router.push('/search')}
                        className="w-11 h-11 bg-neutral-100 rounded-full items-center justify-center"
                    >
                        <MaterialIcons name="search" size={22} color="#000" />
                    </Pressable>

                    <Pressable
                        onPress={() => router.push('/notifications')}
                        className="w-11 h-11 bg-neutral-100 rounded-full items-center justify-center relative"
                    >
                        <MaterialIcons name="notifications" size={22} color="#000" />
                        {unreadNotifications > 0 && (
                            <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                                <Text className="text-white text-[10px] font-bold">
                                    {unreadNotifications}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
