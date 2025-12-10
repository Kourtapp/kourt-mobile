import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MOCK_POSTS = [
    {
        id: '1',
        user: {
            name: 'Pedro F.',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        },
        time: '2h',
        content: 'Partida incrível hoje! Venci de virada 6-4! 🎾🔥',
        image: 'https://images.unsplash.com/photo-1626248921350-09e8b577f845?q=80&w=800&auto=format&fit=crop',
        likes: 24,
        comments: 8,
    },
    {
        id: '2',
        user: {
            name: 'Marina S.',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        },
        time: '1d',
        content: 'Check-in no Beach Arena! Quem mais está aqui? 🏖️',
        likes: 45,
        comments: 12,
    },
];

export function FeedTab() {
    return (
        <ScrollView
            className="flex-1 bg-[#fafafa]"
            contentContainerStyle={{ padding: 20, gap: 20 }}
            showsVerticalScrollIndicator={false}
        >
            {MOCK_POSTS.map((post) => (
                <View key={post.id} className="bg-white p-4 rounded-2xl border border-neutral-200">
                    {/* Header */}
                    <View className="flex-row items-center gap-3 mb-3">
                        <Image
                            source={{ uri: post.user.avatar }}
                            className="w-10 h-10 rounded-full bg-neutral-200"
                        />
                        <View className="flex-1">
                            <Text className="font-bold text-black">{post.user.name}</Text>
                            <Text className="text-xs text-neutral-500">{post.time}</Text>
                        </View>
                        <Pressable>
                            <MaterialIcons name="more-horiz" size={20} color="#A3A3A3" />
                        </Pressable>
                    </View>

                    {/* Content */}
                    <Text className="text-sm text-black mb-3 leading-5">
                        {post.content}
                    </Text>

                    {/* Image */}
                    {post.image && (
                        <Image
                            source={{ uri: post.image }}
                            className="w-full h-48 rounded-xl mb-3 bg-neutral-100"
                            resizeMode="cover"
                        />
                    )}

                    {/* Actions */}
                    <View className="flex-row items-center gap-6 pt-2 border-t border-neutral-100">
                        <Pressable className="flex-row items-center gap-1.5">
                            <MaterialIcons name="favorite-border" size={20} color="#525252" />
                            <Text className="text-xs font-medium text-neutral-600">{post.likes}</Text>
                        </Pressable>
                        <Pressable className="flex-row items-center gap-1.5">
                            <MaterialIcons name="chat-bubble-outline" size={19} color="#525252" />
                            <Text className="text-xs font-medium text-neutral-600">{post.comments}</Text>
                        </Pressable>
                        <Pressable className="flex-row items-center gap-1.5 ml-auto">
                            <MaterialIcons name="share" size={19} color="#525252" />
                        </Pressable>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}
