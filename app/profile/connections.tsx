
import { View, Text, FlatList, Image, Pressable, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, Search, CheckCircle2, Users } from 'lucide-react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../../components/ui/EmptyState';

// Mock Data
const MOCK_USERS = [
    { id: '1', name: 'Pedro Ferreira', username: '@pedrof', image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', verified: true, isFollowing: true },
    { id: '2', name: 'Carolina Lima', username: '@carol.lima', image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', verified: false, isFollowing: true },
    { id: '3', name: 'Rafael Santos', username: '@rafa_santos', image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', verified: false, isFollowing: false },
    { id: '4', name: 'Lucas Mendes', username: '@lucasm', image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', verified: false, isFollowing: true },
    { id: '5', name: 'Marina Silva', username: '@marina_bt', image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', verified: true, isFollowing: false },
];

export default function ConnectionsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { type } = useLocalSearchParams(); // type: 'followers' | 'following'

    const [search, setSearch] = useState('');
    const [users, setUsers] = useState(MOCK_USERS);

    const title = type === 'following' ? 'Seguindo' : 'Seguidores';

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    const toggleFollow = (id: string) => {
        setUsers(users.map(user =>
            user.id === id ? { ...user, isFollowing: !user.isFollowing } : user
        ));
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF', paddingTop: insets.top }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <Pressable onPress={() => router.back()} className="p-2">
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text className="text-lg font-bold text-slate-900">{title}</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Search */}
            <View className="px-5 py-2">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2.5">
                    <Search size={18} color="#94A3B8" />
                    <TextInput
                        className="flex-1 ml-2 text-base text-slate-900"
                        placeholder="Buscar..."
                        value={search}
                        onChangeText={setSearch}
                        placeholderTextColor="#94A3B8"
                    />
                </View>
            </View>

            {/* List */}
            <FlatList
                data={filteredUsers}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 20, flexGrow: 1 }}
                ListEmptyComponent={
                    <EmptyState
                        icon={Users}
                        title={type === 'following' ? 'Você ainda não segue ninguém' : 'Nenhum seguidor ainda'}
                        description={type === 'following'
                            ? 'Encontre jogadores para seguir e acompanhar suas partidas'
                            : 'Quando outros jogadores te seguirem, eles aparecerão aqui'}
                        actionLabel="Buscar jogadores"
                        onAction={() => router.push('/search')}
                    />
                }
                renderItem={({ item }) => (
                    <Pressable
                        className="flex-row items-center justify-between mb-6"
                        onPress={() => router.push(`/user/${item.id}`)}
                    >
                        <View className="flex-row items-center gap-3">
                            <Image source={{ uri: item.image }} className="w-12 h-12 rounded-full bg-gray-200" />
                            <View>
                                <View className="flex-row items-center gap-1">
                                    <Text className="font-bold text-slate-900 text-base">{item.name}</Text>
                                    {item.verified && <CheckCircle2 size={14} color="#000" fill="#000" />}
                                </View>
                                <Text className="text-slate-500 text-sm">{item.username}</Text>
                            </View>
                        </View>

                        <Pressable
                            className={`px-4 py-1.5 rounded-full border ${item.isFollowing ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-900'}`}
                            onPress={(e) => {
                                e.stopPropagation();
                                toggleFollow(item.id);
                            }}
                        >
                            <Text className={`font-bold text-sm ${item.isFollowing ? 'text-slate-700' : 'text-white'}`}>
                                {item.isFollowing ? 'Seguindo' : 'Seguir'}
                            </Text>
                        </Pressable>
                    </Pressable>
                )}
            />
        </View>
    );
}
