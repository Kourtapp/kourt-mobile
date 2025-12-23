import { View, Text, Image, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Settings, MessageSquare, Edit3 } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ProfileHeaderProps {
    user: {
        name: string;
        username: string;
        avatar?: string;
        cover?: string;
        isVerified: boolean;
        bio?: string;
        stats: {
            followers: number;
            following: number;
            matches: number;
        };
    };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
    return (
        <Animated.View
            entering={FadeInDown.duration(600).springify()}
            className="mb-4 bg-white"
        >
            {/* Cover Image */}
            <View className="h-44 bg-slate-100 w-full relative">
                {user.cover ? (
                    <Image
                        source={{ uri: user.cover }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-full bg-slate-200 items-center justify-center">
                        <Text className="text-slate-400 font-bold tracking-widest uppercase">Capa</Text>
                    </View>
                )}

                {/* Standardized Header Actions */}
                <View className="absolute top-12 right-5 flex-row gap-3">
                    <Pressable
                        onPress={() => router.push('/messages' as any)}
                        className="w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-100 shadow-sm"
                        style={{ elevation: 2 }}
                    >
                        <MessageSquare size={18} color="#1E293B" />
                    </Pressable>
                    <Pressable
                        onPress={() => router.push('/settings')}
                        className="w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-100 shadow-sm"
                        style={{ elevation: 2 }}
                    >
                        <Settings size={18} color="#1E293B" />
                    </Pressable>
                </View>
            </View>

            {/* Profile Info */}
            <View className="px-5">
                <View className="flex-row justify-between items-end -mt-12 mb-3">
                    {/* Avatar with Premium Border */}
                    <View className="w-24 h-24 bg-white rounded-full p-1 shadow-md border-4 border-white">
                        <Image
                            source={{ uri: user.avatar || 'https://via.placeholder.com/150' }}
                            className="w-full h-full rounded-full"
                        />
                    </View>

                    {/* Action Button */}
                    <Pressable
                        className="bg-slate-900 px-5 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm active:scale-95 transition-all"
                        onPress={() => router.push('/profile/edit')}
                    >
                        <Edit3 size={14} color="white" />
                        <Text className="text-white font-bold text-sm">Editar Perfil</Text>
                    </Pressable>
                </View>

                {/* Name & Bio */}
                <View className="mb-6">
                    <View className="flex-row items-center gap-1.5 mb-1">
                        <Text className="text-2xl font-black text-slate-900 tracking-tight">{user.name}</Text>
                        {user.isVerified && (
                            <MaterialIcons name="verified" size={20} color="#22C55E" />
                        )}
                    </View>
                    <Text className="text-slate-500 font-medium mb-4">@{user.username}</Text>

                    {user.bio && (
                        <Text className="text-slate-700 leading-relaxed mb-6">{user.bio}</Text>
                    )}

                    {/* Stats Row - Clean & Spaced */}
                    <View className="flex-row gap-8 py-4 border-t border-slate-50">
                        <Pressable className="items-center" onPress={() => router.push('/profile/connections?type=followers')}>
                            <Text className="font-black text-lg text-slate-900">{user.stats.followers}</Text>
                            <Text className="text-slate-400 text-xs font-medium uppercase tracking-wide">Seguidores</Text>
                        </Pressable>
                        <Pressable className="items-center" onPress={() => router.push('/profile/connections?type=following')}>
                            <Text className="font-black text-lg text-slate-900">{user.stats.following}</Text>
                            <Text className="text-slate-400 text-xs font-medium uppercase tracking-wide">Seguindo</Text>
                        </Pressable>
                        <View className="items-center">
                            <Text className="font-black text-lg text-slate-900">{user.stats.matches}</Text>
                            <Text className="text-slate-400 text-xs font-medium uppercase tracking-wide">Partidas</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}
