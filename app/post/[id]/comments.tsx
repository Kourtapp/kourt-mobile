import { View, Text, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Send } from 'lucide-react-native';
import { Image } from 'expo-image';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profile: {
        name: string;
        avatar_url: string | null;
    };
}

export default function CommentsScreen() {
    const { id: rawId } = useLocalSearchParams();
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { session } = useAuthStore();

    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        loadComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadComments = async () => {
        try {
            const { data, error } = await supabase
                .from('post_comments')
                .select(`
                    id,
                    content,
                    created_at,
                    user_id,
                    profile:profiles!user_id(name, avatar_url)
                `)
                .eq('post_id', id)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setComments((data as any) || []);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!newComment.trim() || !session?.user?.id || sending) return;

        setSending(true);
        try {
            const { data, error } = await (supabase
                .from('post_comments')
                .insert({
                    post_id: id,
                    user_id: session.user.id,
                    content: newComment.trim(),
                } as any)
                .select(`
                    id,
                    content,
                    created_at,
                    user_id,
                    profile:profiles!user_id(name, avatar_url)
                `)
                .single() as any);

            if (error) throw error;

            setComments(prev => [...prev, data as any]);
            setNewComment('');

            // Update comments count on post
            await (supabase.rpc as any)('increment_comments_count', { post_id: id });

        } catch (error) {
            console.error('Error sending comment:', error);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) return 'Agora';
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d`;
        return date.toLocaleDateString('pt-BR');
    };

    const renderComment = ({ item }: { item: Comment }) => (
        <View className="flex-row px-4 py-3 border-b border-neutral-100">
            <Image
                source={item.profile?.avatar_url || 'https://github.com/shadcn.png'}
                className="w-10 h-10 rounded-full bg-neutral-200"
            />
            <View className="flex-1 ml-3">
                <View className="flex-row items-center gap-2">
                    <Text className="font-bold text-slate-900">{item.profile?.name || 'Usuário'}</Text>
                    <Text className="text-xs text-neutral-400">{formatTime(item.created_at)}</Text>
                </View>
                <Text className="text-slate-700 mt-1">{item.content}</Text>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View
                style={{ paddingTop: insets.top }}
                className="bg-white border-b border-neutral-100 px-4 pb-3"
            >
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                        <ArrowLeft size={24} color="#0F172A" />
                    </Pressable>
                    <Text className="text-lg font-bold text-slate-900 ml-2">Comentários</Text>
                </View>
            </View>

            {/* Comments List */}
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#22c55e" />
                </View>
            ) : comments.length === 0 ? (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-neutral-400">Nenhum comentário ainda</Text>
                    <Text className="text-neutral-400 text-sm mt-1">Seja o primeiro a comentar!</Text>
                </View>
            ) : (
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    renderItem={renderComment}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}

            {/* Input Area */}
            <View
                style={{ paddingBottom: insets.bottom + 8 }}
                className="bg-white border-t border-neutral-100 px-4 pt-3"
            >
                <View className="flex-row items-center bg-neutral-100 rounded-full px-4 py-2">
                    <TextInput
                        value={newComment}
                        onChangeText={setNewComment}
                        placeholder="Adicione um comentário..."
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 text-slate-900"
                        multiline
                        maxLength={500}
                    />
                    <Pressable
                        onPress={handleSend}
                        disabled={!newComment.trim() || sending}
                        className={`ml-2 p-2 rounded-full ${newComment.trim() ? 'bg-green-500' : 'bg-neutral-300'}`}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Send size={18} color="#FFF" />
                        )}
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
