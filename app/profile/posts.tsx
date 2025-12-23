import { View, Text, StyleSheet, Pressable, FlatList, Image, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import {
    ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal,
    Grid3X3, Bookmark, Trophy, Image as ImageIcon
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_SIZE = (SCREEN_WIDTH - 4) / 3;

// View modes
const VIEW_MODES = [
    { id: 'grid', icon: Grid3X3 },
    { id: 'list', icon: ImageIcon },
    { id: 'saved', icon: Bookmark },
    { id: 'tagged', icon: Trophy },
];

// Mock posts data
const MOCK_POSTS = [
    {
        id: '1',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400',
        caption: 'Grande vitória hoje! 🏆 Semifinal do torneio',
        likes: 124,
        comments: 18,
        date: '14 Dez',
        location: 'Arena Beach SP',
    },
    {
        id: '2',
        type: 'match_result',
        imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dbd5142e1c?w=400',
        caption: 'Match point! Vitória por 6-4, 7-5',
        likes: 89,
        comments: 12,
        date: '12 Dez',
        result: { score: '6-4, 7-5', outcome: 'victory' },
    },
    {
        id: '3',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1530915365347-e47fa8e7d6d8?w=400',
        caption: 'Treino matinal com a galera 💪',
        likes: 156,
        comments: 24,
        date: '10 Dez',
    },
    {
        id: '4',
        type: 'tournament',
        imageUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400',
        caption: '3º lugar na Copa Beach Pinheiros!',
        likes: 234,
        comments: 42,
        date: '8 Dez',
        tournament: { name: 'Copa Beach Pinheiros', position: '3º' },
    },
    {
        id: '5',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
        caption: 'Nova raquete chegou! 🎾',
        likes: 78,
        comments: 8,
        date: '5 Dez',
    },
    {
        id: '6',
        type: 'match_result',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        caption: 'Jogo difícil mas conseguimos!',
        likes: 112,
        comments: 16,
        date: '3 Dez',
        result: { score: '7-6, 3-6, 6-4', outcome: 'victory' },
    },
];

const STATS = {
    posts: 47,
    followers: 892,
    following: 234,
};

export default function PostsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [viewMode, setViewMode] = useState('grid');

    const renderGridItem = ({ item, index }: { item: typeof MOCK_POSTS[0]; index: number }) => (
        <Animated.View entering={FadeIn.delay(index * 50)}>
            <Pressable style={styles.gridItem}>
                <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
                {item.type === 'match_result' && (
                    <View style={styles.gridBadge}>
                        <Trophy size={12} color="#FFF" />
                    </View>
                )}
                {item.type === 'tournament' && (
                    <View style={[styles.gridBadge, styles.gridBadgeTournament]}>
                        <Trophy size={12} color="#FFF" />
                    </View>
                )}
            </Pressable>
        </Animated.View>
    );

    const renderListItem = ({ item, index }: { item: typeof MOCK_POSTS[0]; index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100)}>
            <View style={styles.listItem}>
                {/* Post Header */}
                <View style={styles.postHeader}>
                    <View style={styles.postAuthor}>
                        <View style={styles.authorAvatar}>
                            <Text style={styles.authorInitial}>B</Text>
                        </View>
                        <View>
                            <Text style={styles.authorName}>Bruno Silva</Text>
                            {item.location && (
                                <Text style={styles.postLocation}>{item.location}</Text>
                            )}
                        </View>
                    </View>
                    <Pressable style={styles.moreButton}>
                        <MoreHorizontal size={20} color="#6B7280" />
                    </Pressable>
                </View>

                {/* Post Image */}
                <Image source={{ uri: item.imageUrl }} style={styles.postImage} />

                {/* Match Result Overlay */}
                {item.type === 'match_result' && item.result && (
                    <View style={[
                        styles.resultOverlay,
                        item.result.outcome === 'victory' ? styles.resultVictory : styles.resultDefeat
                    ]}>
                        <Text style={styles.resultScore}>{item.result.score}</Text>
                        <Text style={styles.resultOutcome}>
                            {item.result.outcome === 'victory' ? 'Vitória' : 'Derrota'}
                        </Text>
                    </View>
                )}

                {/* Tournament Badge */}
                {item.type === 'tournament' && item.tournament && (
                    <View style={styles.tournamentOverlay}>
                        <Trophy size={16} color="#F59E0B" />
                        <Text style={styles.tournamentPosition}>{item.tournament.position}</Text>
                        <Text style={styles.tournamentName}>{item.tournament.name}</Text>
                    </View>
                )}

                {/* Post Actions */}
                <View style={styles.postActions}>
                    <View style={styles.leftActions}>
                        <Pressable style={styles.actionButton}>
                            <Heart size={24} color="#111827" />
                        </Pressable>
                        <Pressable style={styles.actionButton}>
                            <MessageCircle size={24} color="#111827" />
                        </Pressable>
                        <Pressable style={styles.actionButton}>
                            <Share2 size={24} color="#111827" />
                        </Pressable>
                    </View>
                    <Pressable style={styles.actionButton}>
                        <Bookmark size={24} color="#111827" />
                    </Pressable>
                </View>

                {/* Likes */}
                <Text style={styles.likesCount}>{item.likes} curtidas</Text>

                {/* Caption */}
                <Text style={styles.caption}>
                    <Text style={styles.captionAuthor}>brunosilva </Text>
                    {item.caption}
                </Text>

                {/* Comments */}
                {item.comments > 0 && (
                    <Pressable>
                        <Text style={styles.viewComments}>
                            Ver todos os {item.comments} comentários
                        </Text>
                    </Pressable>
                )}

                {/* Date */}
                <Text style={styles.postDate}>{item.date}</Text>
            </View>
        </Animated.View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Posts</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Stats Row */}
            <Animated.View entering={FadeIn.delay(100)} style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{STATS.posts}</Text>
                    <Text style={styles.statLabel}>posts</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{STATS.followers}</Text>
                    <Text style={styles.statLabel}>seguidores</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{STATS.following}</Text>
                    <Text style={styles.statLabel}>seguindo</Text>
                </View>
            </Animated.View>

            {/* View Mode Tabs */}
            <View style={styles.viewModeTabs}>
                {VIEW_MODES.map((mode) => {
                    const Icon = mode.icon;
                    return (
                        <Pressable
                            key={mode.id}
                            style={[
                                styles.viewModeTab,
                                viewMode === mode.id && styles.viewModeTabActive
                            ]}
                            onPress={() => setViewMode(mode.id)}
                        >
                            <Icon
                                size={24}
                                color={viewMode === mode.id ? '#111827' : '#9CA3AF'}
                            />
                        </Pressable>
                    );
                })}
            </View>

            {/* Posts */}
            {viewMode === 'grid' ? (
                <FlatList
                    data={MOCK_POSTS}
                    renderItem={renderGridItem}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    contentContainerStyle={styles.gridContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : viewMode === 'list' ? (
                <FlatList
                    data={MOCK_POSTS}
                    renderItem={renderListItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Bookmark size={48} color="#D1D5DB" />
                    <Text style={styles.emptyTitle}>
                        {viewMode === 'saved' ? 'Nenhum post salvo' : 'Nenhuma marcação'}
                    </Text>
                    <Text style={styles.emptyText}>
                        {viewMode === 'saved'
                            ? 'Posts salvos aparecerão aqui'
                            : 'Posts onde você foi marcado aparecerão aqui'
                        }
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    viewModeTabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    viewModeTab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    viewModeTabActive: {
        borderBottomColor: '#111827',
    },
    gridContent: {
        paddingTop: 2,
    },
    gridItem: {
        width: GRID_SIZE,
        height: GRID_SIZE,
        margin: 1,
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    gridBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#22C55E',
        borderRadius: 12,
        padding: 4,
    },
    gridBadgeTournament: {
        backgroundColor: '#F59E0B',
    },
    listContent: {
        paddingBottom: 100,
    },
    listItem: {
        marginBottom: 16,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
    },
    postAuthor: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    authorAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#111827',
        alignItems: 'center',
        justifyContent: 'center',
    },
    authorInitial: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    authorName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    postLocation: {
        fontSize: 12,
        color: '#6B7280',
    },
    moreButton: {
        padding: 4,
    },
    postImage: {
        width: '100%',
        aspectRatio: 1,
    },
    resultOverlay: {
        position: 'absolute',
        bottom: 120,
        left: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    resultVictory: {
        backgroundColor: 'rgba(34, 197, 94, 0.9)',
    },
    resultDefeat: {
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
    },
    resultScore: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
    },
    resultOutcome: {
        fontSize: 12,
        color: '#FFF',
        opacity: 0.9,
    },
    tournamentOverlay: {
        position: 'absolute',
        bottom: 120,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    tournamentPosition: {
        fontSize: 16,
        fontWeight: '700',
        color: '#F59E0B',
    },
    tournamentName: {
        fontSize: 14,
        color: '#FFF',
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    leftActions: {
        flexDirection: 'row',
        gap: 16,
    },
    actionButton: {
        padding: 4,
    },
    likesCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        paddingHorizontal: 16,
        marginBottom: 4,
    },
    caption: {
        fontSize: 14,
        color: '#374151',
        paddingHorizontal: 16,
        lineHeight: 20,
    },
    captionAuthor: {
        fontWeight: '600',
        color: '#111827',
    },
    viewComments: {
        fontSize: 14,
        color: '#6B7280',
        paddingHorizontal: 16,
        marginTop: 4,
    },
    postDate: {
        fontSize: 12,
        color: '#9CA3AF',
        paddingHorizontal: 16,
        marginTop: 4,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
        textAlign: 'center',
    },
});
