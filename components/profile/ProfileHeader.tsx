import { View, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ProfileHeaderProps {
    user: {
        name: string;
        username: string;
        avatar?: string;
        isVerified: boolean;
        stats: {
            matches: number;
            wins: number;
            level: number;
        };
    };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
    return (
        <View className="items-center mb-8">
            {/* Avatar */}
            <View className="relative mb-3">
                <View className="w-24 h-24 bg-neutral-200 rounded-full overflow-hidden border-4 border-white shadow-sm">
                    {user.avatar && (
                        <Image
                            source={{ uri: user.avatar }}
                            className="w-full h-full"
                        />
                    )}
                </View>
                <View className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-sm">
                    <MaterialIcons name="settings" size={16} color="#000" />
                </View>
            </View>

            {/* Name & Username */}
            <View className="items-center mb-6">
                <View className="flex-row items-center gap-1">
                    <Text className="text-xl font-bold text-black">{user.name}</Text>
                    {user.isVerified && (
                        <MaterialIcons name="verified" size={20} color="#000" />
                    )}
                </View>
                <Text className="text-sm text-neutral-500">@{user.username}</Text>
            </View>

            {/* Stats */}
            <View className="flex-row items-center justify-center w-full px-4">
                <View className="items-center px-6 border-r border-neutral-200">
                    <Text className="text-xl font-bold text-black">{user.stats.matches}</Text>
                    <Text className="text-xs text-neutral-500 uppercase tracking-wide mt-1">Partidas</Text>
                </View>

                <View className="items-center px-6 border-r border-neutral-200">
                    <Text className="text-xl font-bold text-black">{user.stats.wins}</Text>
                    <Text className="text-xs text-neutral-500 uppercase tracking-wide mt-1">Vitórias</Text>
                </View>

                <View className="items-center px-6">
                    <Text className="text-xl font-bold text-black">{user.stats.level}</Text>
                    <Text className="text-xs text-neutral-500 uppercase tracking-wide mt-1">Nível</Text>
                </View>
            </View>
        </View>
    );
}
