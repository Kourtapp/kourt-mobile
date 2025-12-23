import { useState, useEffect, useCallback } from 'react';
import { FlatList, RefreshControl, View, ActivityIndicator } from 'react-native';
import { FeedPost } from './FeedPost';
import { EmptyState } from '@/components/ui/EmptyState';
import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

interface Post {
    id: string;
    type: string;
    user: {
        id: string;
        name: string;
        avatar?: string;
        level?: number;
    };
    content?: string;
    image?: string;
    likes: number;
    comments: number;
    time: string;
    data?: any;
}

export function FeedTab() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadPosts = useCallback(async () => {
        try {
            // First get posts
            const { data: postsData, error: postsError } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (postsError) throw postsError;

            if (!postsData || postsData.length === 0) {
                setPosts([]);
                return;
            }

            // Get unique user IDs
            const userIds = [...new Set((postsData as any[]).map(p => p.user_id))];

            // Fetch profiles for those users
            const { data: profilesData } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, level')
                .in('id', userIds);

            // Create a map of profiles
            const profilesMap = new Map(
                ((profilesData || []) as any[]).map(p => [p.id, p])
            );

            const formattedPosts = postsData.map((post: any) => {
                const profile = profilesMap.get(post.user_id) as any;
                return {
                    id: post.id,
                    type: post.type || 'text',
                    user: {
                        id: profile?.id || post.user_id,
                        name: profile?.full_name || 'Usuário',
                        avatar: profile?.avatar_url,
                        level: profile?.level || 1,
                    },
                    content: post.content,
                    image: post.image_url,
                    likes: post.likes_count || 0,
                    comments: post.comments_count || 0,
                    time: formatTime(post.created_at),
                    data: post.metadata,
                };
            });

            setPosts(formattedPosts);
        } catch (error) {
            logger.error('[FeedTab] Error loading posts:', error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadPosts();
        setRefreshing(false);
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
                <ActivityIndicator size="large" color="#22c55e" />
            </View>
        );
    }

    if (posts.length === 0) {
        return (
            <EmptyState
                type="noPosts"
                title="Nenhuma publicação ainda"
                description="Siga jogadores para ver suas publicações"
            />
        );
    }

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FeedPost post={item} />}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            accessible={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    accessibilityLabel="Atualizar feed"
                />
            }
        />
    );
}
