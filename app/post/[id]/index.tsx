import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert, Share, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, MessageSquare, Share2, MoreHorizontal, Bookmark } from 'lucide-react-native';
import { Image } from 'expo-image';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

interface Post {
    id: string;
    content: string | null;
    image_url: string | null;
    type: string;
    created_at: string;
    likes_count: number;
    comments_count: number;
    user_id: string;
    metadata: any;
    profile: {
        name: string;
        avatar_url: string | null;
        verified: boolean;
    };
}

export default function PostDetailScreen() {
    const { id: rawId } = useLocalSearchParams();
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { session } = useAuthStore();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        loadPost();
        checkIfLiked();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadPost = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    id,
                    content,
                    image_url,
                    type,
                    created_at,
                    likes_count,
                    comments_count,
                    user_id,
                    metadata,
                    profile:profiles!user_id(name, avatar_url, verified)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            setPost(data as any);
            setLikesCount((data as any)?.likes_count || 0);
        } catch (error) {
            console.error('Error loading post:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkIfLiked = async () => {
        if (!session?.user?.id) return;
        try {
            const { data } = await supabase
                .from('post_likes')
                .select('id')
                .eq('post_id', id)
                .eq('user_id', session.user.id)
                .single();
            setIsLiked(!!data);
        } catch {
            // Not liked
        }
    };

    const handleLike = async () => {
        if (!session?.user?.id) {
            Alert.alert("Login necessário", "Faça login para curtir posts.");
            return;
        }

        if (isLiking) return;
        setIsLiking(true);

        const wasLiked = isLiked;
        setIsLiked(!wasLiked);
        setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

        try {
            if (wasLiked) {
                await supabase
                    .from('post_likes')
                    .delete()
                    .eq('post_id', id)
                    .eq('user_id', session.user.id);
            } else {
                await (supabase
                    .from('post_likes')
                    .insert({
                        post_id: id,
                        user_id: session.user.id,
                    } as any) as any);
            }

            await ((supabase.from('posts') as any)
                .update({ likes_count: likesCount + (wasLiked ? -1 : 1) })
                .eq('id', id));

        } catch (error) {
            console.error('Error liking post:', error);
            setIsLiked(wasLiked);
            setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
        } finally {
            setIsLiking(false);
        }
    };

    const handleShare = async () => {
        try {
            const message = post?.content
                ? `${post.profile?.name || 'Alguém'} no Kourt: "${post.content}"\n\nBaixe o Kourt: https://kourt.app`
                : `Confira este post no Kourt!\n\nBaixe o Kourt: https://kourt.app`;

            await Share.share({
                message,
                title: 'Compartilhar do Kourt',
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    const handleOptions = () => {
        const isOwner = session?.user?.id === post?.user_id;

        const options = isOwner
            ? [
                { text: "Excluir", style: "destructive" as const, onPress: handleDelete },
                { text: "Cancelar", style: "cancel" as const },
            ]
            : [
                { text: "Denunciar", style: "destructive" as const, onPress: () => Alert.alert("Denúncia enviada", "Obrigado pelo feedback.") },
                { text: "Cancelar", style: "cancel" as const },
            ];

        Alert.alert("Opções", "", options);
    };

    const handleDelete = async () => {
        Alert.alert(
            "Excluir post",
            "Tem certeza que deseja excluir este post?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await supabase.from('posts').delete().eq('id', id);
                            router.back();
                        } catch {
                            Alert.alert("Erro", "Não foi possível excluir o post.");
                        }
                    }
                }
            ]
        );
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

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (!post) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.errorText}>Post não encontrado</Text>
                <Pressable onPress={() => router.back()} style={styles.backButtonAlt}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <Pressable onPress={() => router.back()} style={styles.headerButton}>
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Post</Text>
                <Pressable onPress={handleOptions} style={styles.headerButton}>
                    <MoreHorizontal size={24} color="#000" />
                </Pressable>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* User Info */}
                <Pressable
                    style={styles.userRow}
                    onPress={() => router.push(`/user/${post.user_id}` as any)}
                >
                    <Image
                        source={post.profile?.avatar_url || 'https://github.com/shadcn.png'}
                        style={styles.avatar}
                    />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{post.profile?.name || 'Usuário'}</Text>
                        <Text style={styles.postTime}>{formatTime(post.created_at)}</Text>
                    </View>
                </Pressable>

                {/* Content */}
                {post.content && (
                    <Text style={styles.postContent}>{post.content}</Text>
                )}

                {/* Image */}
                {post.image_url && (
                    <View style={styles.imageContainer}>
                        <Image
                            source={post.image_url}
                            style={styles.postImage}
                            contentFit="cover"
                        />
                    </View>
                )}

                {/* Stats */}
                <View style={styles.statsRow}>
                    <Text style={styles.statsText}>{likesCount} curtidas</Text>
                    <Text style={styles.statsDot}>•</Text>
                    <Text style={styles.statsText}>{post.comments_count || 0} comentários</Text>
                </View>

                {/* Actions */}
                <View style={styles.actionsRow}>
                    <Pressable style={styles.actionButton} onPress={handleLike}>
                        <Heart
                            size={26}
                            color={isLiked ? "#EF4444" : "#000"}
                            fill={isLiked ? "#EF4444" : "transparent"}
                        />
                        <Text style={[styles.actionText, isLiked && styles.likedText]}>Curtir</Text>
                    </Pressable>
                    <Pressable
                        style={styles.actionButton}
                        onPress={() => router.push(`/post/${id}/comments` as any)}
                    >
                        <MessageSquare size={26} color="#000" />
                        <Text style={styles.actionText}>Comentar</Text>
                    </Pressable>
                    <Pressable style={styles.actionButton} onPress={handleShare}>
                        <Share2 size={26} color="#000" />
                        <Text style={styles.actionText}>Compartilhar</Text>
                    </Pressable>
                    <Pressable style={styles.actionButton}>
                        <Bookmark size={26} color="#000" />
                        <Text style={styles.actionText}>Salvar</Text>
                    </Pressable>
                </View>

                {/* Comments Preview */}
                <Pressable
                    style={styles.commentsPreview}
                    onPress={() => router.push(`/post/${id}/comments` as any)}
                >
                    <Text style={styles.commentsPreviewText}>
                        Ver todos os {post.comments_count || 0} comentários
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E5E5',
    },
    headerButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    content: {
        flex: 1,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E5E5E5',
    },
    userInfo: {
        marginLeft: 12,
    },
    userName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
    },
    postTime: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    postContent: {
        fontSize: 16,
        color: '#000',
        lineHeight: 24,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#F5F5F5',
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E5E5',
    },
    statsText: {
        fontSize: 14,
        color: '#666',
    },
    statsDot: {
        marginHorizontal: 8,
        color: '#666',
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E5E5',
    },
    actionButton: {
        alignItems: 'center',
        gap: 4,
    },
    actionText: {
        fontSize: 12,
        color: '#666',
    },
    likedText: {
        color: '#EF4444',
    },
    commentsPreview: {
        padding: 16,
    },
    commentsPreviewText: {
        fontSize: 14,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    backButtonAlt: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
});
