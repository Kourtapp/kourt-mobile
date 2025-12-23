import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    Pressable,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft,
    Heart,
    MessageCircle,
    Share2,
    Play,
    MoreHorizontal,
    MapPin,
    X,
    Grid3X3,
    Bookmark,
} from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { postService, Post } from '@/services/postService';
import { userService } from '@/services/userService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 2;
const GRID_ITEM_SIZE = (SCREEN_WIDTH - GRID_GAP * 2) / 3;

export default function UserPostsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [user, setUser] = useState<any>(null);

    const fetchPosts = useCallback(async (pageNum: number = 1, refresh: boolean = false) => {
        if (!id) return;

        try {
            if (pageNum === 1) setLoading(true);

            const result = await postService.getUserPosts(id, pageNum, 30);

            if (refresh || pageNum === 1) {
                setPosts(result.posts);
            } else {
                setPosts(prev => [...prev, ...result.posts]);
            }
            setHasMore(result.hasMore);
            setPage(pageNum);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [id]);

    const fetchUser = useCallback(async () => {
        if (!id) return;
        try {
            // For demo users, create mock user data
            if (id.startsWith('00000000-0000-0000-0000')) {
                const demoNum = parseInt(id.split('-').pop() || '1');
                const names = ['Carlos Silva', 'Ana Costa', 'Pedro Santos', 'Julia Oliveira', 'Rafael Lima'];
                setUser({
                    id,
                    name: names[(demoNum - 1) % names.length],
                    avatar_url: `https://i.pravatar.cc/150?img=${10 + demoNum}`,
                });
                return;
            }
            const profile = await userService.getProfile(id);
            setUser(profile);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }, [id]);

    useEffect(() => {
        fetchPosts(1);
        fetchUser();
    }, [fetchPosts, fetchUser]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPosts(1, true);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchPosts(page + 1);
        }
    };

    const handleLike = async (postId: string) => {
        const result = await postService.toggleLike(postId);
        if (result.success) {
            setPosts(prev => prev.map(p => {
                if (p.id === postId) {
                    return {
                        ...p,
                        is_liked: result.isLiked,
                        likes_count: (p.likes_count || 0) + (result.isLiked ? 1 : -1)
                    };
                }
                return p;
            }));
            if (selectedPost?.id === postId) {
                setSelectedPost(prev => prev ? {
                    ...prev,
                    is_liked: result.isLiked,
                    likes_count: (prev.likes_count || 0) + (result.isLiked ? 1 : -1)
                } : null);
            }
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR });
        } catch {
            return '';
        }
    };

    const PostDetailModal = () => {
        if (!selectedPost) return null;

        return (
            <Modal
                visible={!!selectedPost}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedPost(null)}
            >
                <View style={{ flex: 1, backgroundColor: '#000' }}>
                    <SafeAreaView style={{ flex: 1 }}>
                        {/* Header */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
                            <Pressable onPress={() => setSelectedPost(null)}>
                                <X size={24} color="#fff" />
                            </Pressable>
                            <Pressable>
                                <MoreHorizontal size={24} color="#fff" />
                            </Pressable>
                        </View>

                        {/* Image */}
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Image
                                source={{ uri: (selectedPost as any).media_urls[0] }}
                                style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Bottom Info */}
                        <View style={{ padding: 16 }}>
                            {/* User Info */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                <Image
                                    source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150' }}
                                    style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>{user?.name}</Text>
                                    <Text style={{ color: '#9CA3AF', fontSize: 12 }}>{formatDate(selectedPost.created_at)}</Text>
                                </View>
                            </View>

                            {/* Content */}
                            {selectedPost.content && (
                                <Text style={{ color: '#fff', fontSize: 14, marginBottom: 12 }}>{selectedPost.content}</Text>
                            )}

                            {/* Location */}
                            {(selectedPost as any).location && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                    <MapPin size={14} color="#9CA3AF" />
                                    <Text style={{ color: '#9CA3AF', fontSize: 12, marginLeft: 4 }}>{(selectedPost as any).location}</Text>
                                </View>
                            )}

                            {/* Actions */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                                <Pressable onPress={() => handleLike(selectedPost.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Heart size={24} color={selectedPost.is_liked ? '#EF4444' : '#fff'} fill={selectedPost.is_liked ? '#EF4444' : 'transparent'} />
                                    <Text style={{ color: '#fff', fontWeight: '500' }}>{selectedPost.likes_count}</Text>
                                </Pressable>
                                <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <MessageCircle size={24} color="#fff" />
                                    <Text style={{ color: '#fff', fontWeight: '500' }}>{selectedPost.comments_count}</Text>
                                </Pressable>
                                <Pressable>
                                    <Share2 size={24} color="#fff" />
                                </Pressable>
                                <View style={{ flex: 1 }} />
                                <Pressable>
                                    <Bookmark size={24} color="#fff" />
                                </Pressable>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
        );
    };

    const renderGridItem = (post: Post, index: number) => (
        <Pressable
            key={post.id}
            onPress={() => setSelectedPost(post)}
            style={{
                width: GRID_ITEM_SIZE,
                height: GRID_ITEM_SIZE,
                backgroundColor: '#F3F4F6',
            }}
        >
            <Image
                source={{ uri: (post as any).media_urls[0] }}
                style={{ width: '100%', height: '100%' }}
            />
            {/* Video indicator */}
            {(post as any).media_type === 'video' && (
                <View style={{ position: 'absolute', top: 8, right: 8 }}>
                    <Play size={16} color="#fff" fill="#fff" />
                </View>
            )}
            {/* Multiple images indicator */}
            {(post as any).media_urls.length > 1 && (
                <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', padding: 4, borderRadius: 4 }}>
                    <Grid3X3 size={14} color="#fff" />
                </View>
            )}
        </Pressable>
    );

    const renderListItem = (post: Post) => (
        <View key={post.id} style={{ marginBottom: 16, backgroundColor: '#fff', borderRadius: 16 }}>
            {/* User Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
                <Image
                    source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150' }}
                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', fontSize: 14, color: '#111827' }}>{user?.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        {(post as any).location && (
                            <>
                                <MapPin size={12} color="#6B7280" />
                                <Text style={{ fontSize: 12, color: '#6B7280' }}>{(post as any).location}</Text>
                                <Text style={{ fontSize: 12, color: '#6B7280' }}>•</Text>
                            </>
                        )}
                        <Text style={{ fontSize: 12, color: '#6B7280' }}>{formatDate(post.created_at)}</Text>
                    </View>
                </View>
                <Pressable>
                    <MoreHorizontal size={20} color="#6B7280" />
                </Pressable>
            </View>

            {/* Image */}
            <Pressable onPress={() => setSelectedPost(post)}>
                <Image
                    source={{ uri: (post as any).media_urls[0] }}
                    style={{ width: '100%', aspectRatio: 1, backgroundColor: '#F3F4F6' }}
                />
                {(post as any).media_type === 'video' && (
                    <View style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -24, marginLeft: -24, width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={24} color="#fff" fill="#fff" />
                    </View>
                )}
            </Pressable>

            {/* Actions */}
            <View style={{ padding: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                    <Pressable onPress={() => handleLike(post.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Heart size={22} color={post.is_liked ? '#EF4444' : '#111827'} fill={post.is_liked ? '#EF4444' : 'transparent'} />
                        <Text style={{ fontWeight: '600', color: '#111827' }}>{post.likes_count}</Text>
                    </Pressable>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <MessageCircle size={22} color="#111827" />
                        <Text style={{ fontWeight: '600', color: '#111827' }}>{post.comments_count}</Text>
                    </Pressable>
                    <Pressable>
                        <Share2 size={22} color="#111827" />
                    </Pressable>
                    <View style={{ flex: 1 }} />
                    <Pressable>
                        <Bookmark size={22} color="#111827" />
                    </Pressable>
                </View>

                {/* Content */}
                {post.content && (
                    <Text style={{ fontSize: 14, color: '#111827', lineHeight: 20 }}>
                        <Text style={{ fontWeight: '600' }}>{user?.name} </Text>
                        {post.content}
                    </Text>
                )}
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                    <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
                        <ArrowLeft size={24} color="#111827" />
                    </Pressable>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Posts</Text>
                        <Text style={{ fontSize: 13, color: '#6B7280' }}>{user?.name}</Text>
                    </View>
                    {/* View Mode Toggle */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 8, padding: 2 }}>
                        <Pressable
                            onPress={() => setViewMode('grid')}
                            style={{
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 6,
                                backgroundColor: viewMode === 'grid' ? '#fff' : 'transparent',
                            }}
                        >
                            <Grid3X3 size={18} color={viewMode === 'grid' ? '#111827' : '#9CA3AF'} />
                        </Pressable>
                        <Pressable
                            onPress={() => setViewMode('list')}
                            style={{
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 6,
                                backgroundColor: viewMode === 'list' ? '#fff' : 'transparent',
                            }}
                        >
                            <Bookmark size={18} color={viewMode === 'list' ? '#111827' : '#9CA3AF'} />
                        </Pressable>
                    </View>
                </View>

                {loading && posts.length === 0 ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#000" />
                    </View>
                ) : posts.length === 0 ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                            <Grid3X3 size={32} color="#9CA3AF" />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>Nenhum post ainda</Text>
                        <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>Os posts deste usuário aparecerão aqui</Text>
                    </View>
                ) : viewMode === 'grid' ? (
                    <ScrollView
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        onScroll={({ nativeEvent }) => {
                            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                            if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 500) {
                                loadMore();
                            }
                        }}
                        scrollEventThrottle={400}
                    >
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP }}>
                            {posts.map((post, index) => renderGridItem(post, index))}
                        </View>
                        {loading && hasMore && (
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <ActivityIndicator size="small" color="#000" />
                            </View>
                        )}
                    </ScrollView>
                ) : (
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ padding: 16 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        onScroll={({ nativeEvent }) => {
                            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                            if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 500) {
                                loadMore();
                            }
                        }}
                        scrollEventThrottle={400}
                    >
                        {posts.map(post => renderListItem(post))}
                        {loading && hasMore && (
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <ActivityIndicator size="small" color="#000" />
                            </View>
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>

            <PostDetailModal />
        </View>
    );
}
