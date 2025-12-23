import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useProfile } from '../../hooks/useProfile';
import { ChevronRight, MapPin, Trophy, Users, Calendar } from 'lucide-react-native';

interface ProfileViewProps {
    userId: string;
    isOwnProfile: boolean;
}

export function ProfileView({ userId, isOwnProfile }: ProfileViewProps) {
    const router = useRouter();
    // Note: useProfile() fetches current user's profile. For other users,
    // you'd need a separate hook or service call
    const { profile, loading } = useProfile();

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <Text className="text-gray-500">Carregando...</Text>
            </View>
        );
    }

    if (!profile) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <Text className="text-gray-500">Perfil não encontrado</Text>
            </View>
        );
    }

    const menuItems = [
        {
            icon: Calendar,
            label: 'Atividades',
            route: isOwnProfile ? '/profile/activities' : `/user/${userId}/activities`,
        },
        {
            icon: Users,
            label: 'Conexões',
            route: isOwnProfile ? '/profile/connections' : `/user/${userId}/connections`,
        },
        {
            icon: Trophy,
            label: 'Equipamentos',
            route: isOwnProfile ? '/profile/equipment' : `/user/${userId}/equipment`,
        },
        {
            icon: MapPin,
            label: isOwnProfile ? 'Posts' : 'Posts',
            route: isOwnProfile ? '/profile/posts' : `/user/${userId}/posts`,
        },
    ];

    // User-specific menu items
    if (!isOwnProfile) {
        menuItems.push(
            {
                icon: MapPin,
                label: 'Quadras Favoritas',
                route: `/user/${userId}/favorite-courts`,
            },
            {
                icon: Users,
                label: 'Times',
                route: `/user/${userId}/teams`,
            }
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: isOwnProfile ? 'Meu Perfil' : profile.name || 'Perfil',
                    headerShown: true,
                }}
            />
            <ScrollView className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="bg-white p-6 items-center border-b border-gray-100">
                    <Image
                        source={{ uri: profile.avatar_url || 'https://via.placeholder.com/100' }}
                        className="w-24 h-24 rounded-full mb-4"
                    />
                    <Text className="text-2xl font-bold text-gray-900">
                        {profile.name || 'Usuário'}
                    </Text>
                    {profile.username && (
                        <Text className="text-sm text-gray-500 mt-1">@{profile.username}</Text>
                    )}
                    {profile.bio && (
                        <Text className="text-sm text-gray-600 mt-3 text-center">
                            {profile.bio}
                        </Text>
                    )}
                </View>

                {/* Stats */}
                <View className="bg-white mt-2 p-6 flex-row justify-around border-b border-gray-100">
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-gray-900">0</Text>
                        <Text className="text-sm text-gray-500 mt-1">Partidas</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-gray-900">0</Text>
                        <Text className="text-sm text-gray-500 mt-1">Vitórias</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-gray-900">0</Text>
                        <Text className="text-sm text-gray-500 mt-1">Amigos</Text>
                    </View>
                </View>

                {/* Menu Items */}
                <View className="bg-white mt-2">
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => router.push(item.route as any)}
                            className="flex-row items-center justify-between p-4 border-b border-gray-100"
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={`Ver ${item.label}`}
                        >
                            <View className="flex-row items-center">
                                <item.icon size={20} color="#6B7280" />
                                <Text className="text-base text-gray-900 ml-3">{item.label}</Text>
                            </View>
                            <ChevronRight size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Edit Button (only for own profile) */}
                {isOwnProfile && (
                    <TouchableOpacity
                        onPress={() => router.push('/profile/edit')}
                        className="bg-black m-4 p-4 rounded-xl items-center"
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="Editar perfil"
                    >
                        <Text className="text-white font-semibold">Editar Perfil</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </>
    );
}
