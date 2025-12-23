import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Heart, MessageSquare, Share2, MoreHorizontal, CheckCircle2 } from 'lucide-react-native';
import { MatchResultPost } from './post-types/MatchResultPost';
import { TrainingPost } from './post-types/TrainingPost';
import { GalleryPost } from './post-types/GalleryPost';
import { LFPPost } from './post-types/LFPPost';
import { TournamentPost } from './post-types/TournamentPost';

export function FeedPost({ post }: { post: any }) {

    const renderContent = () => {
        switch (post.type) {
            case 'match_result': return <MatchResultPost data={post.data} />;
            case 'training': return <TrainingPost data={post.data} />;
            case 'gallery': return <GalleryPost data={post.data} />;
            case 'lfp': return <LFPPost data={post.data} />;
            case 'tournament': return <TournamentPost data={post.data} />;
            default: return null;
        }
    };

    return (
        <View style={styles.container} accessible={true} accessibilityRole="none">
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.push(`/user/${post.user.id}`)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Ver perfil de ${post.user.name}${post.user.verified ? ', verificado' : ''}`}
                    accessibilityHint="Toque duas vezes para abrir o perfil"
                    style={{ minHeight: 44, justifyContent: 'center' }}
                >
                    <View style={styles.userInfo} accessible={false}>
                        <Image
                            source={post.user.image}
                            style={styles.avatar}
                            contentFit="cover"
                            transition={1000}
                            accessible={true}
                            accessibilityLabel={`Foto de perfil de ${post.user.name}`}
                        />
                        <View accessibilityElementsHidden={true}>
                            <View style={styles.nameRow}>
                                <Text style={styles.userName}>{post.user.name}</Text>
                                {post.user.verified && <CheckCircle2 size={12} color="black" fill="black" />}
                            </View>
                            <Text style={styles.meta}>{post.time} · {post.sport}</Text>
                        </View>
                    </View>
                </Pressable>
                <View style={styles.headerRight}>
                    {post.tag && (
                        <View style={styles.tag} accessible={true} accessibilityRole="text" accessibilityLabel={`Tag: ${post.tag}`}>
                            <Text style={styles.tagText}>{post.tag}</Text>
                        </View>
                    )}
                    <Pressable
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="Mais opções"
                        accessibilityHint="Toque duas vezes para abrir menu de opções do post"
                        style={{ minHeight: 44, minWidth: 44, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <MoreHorizontal size={20} color="#666" />
                    </Pressable>
                </View>
            </View>

            {/* Description */}
            <Text style={styles.content} accessibilityRole="text">
                {post.content}
            </Text>

            {/* Dynamic Content */}
            <View style={styles.dynamicContent} accessible={false}>
                {renderContent()}
            </View>

            {/* Actions */}
            <View style={styles.actions} accessible={false}>
                <Pressable
                    style={styles.actionItem}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`${post.stats.likes} curtidas`}
                    accessibilityHint="Toque duas vezes para curtir este post"
                >
                    <Heart size={22} color="#171717" />
                    <Text style={styles.actionText}>{post.stats.likes}</Text>
                </Pressable>
                <Pressable
                    style={styles.actionItem}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`${post.stats.comments} comentários`}
                    accessibilityHint="Toque duas vezes para ver os comentários"
                >
                    <MessageSquare size={22} color="#171717" />
                    <Text style={styles.actionText}>{post.stats.comments}</Text>
                </Pressable>
                <Pressable
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Compartilhar post"
                    accessibilityHint="Toque duas vezes para compartilhar"
                    style={{ minHeight: 44, minWidth: 44, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Share2 size={22} color="#171717" />
                </Pressable>
                <View style={{ flex: 1 }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        padding: 16,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E5E5E5',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    userName: {
        fontWeight: 'bold',
        color: '#000000',
        fontSize: 16,
    },
    meta: {
        fontSize: 12,
        color: '#737373',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    tag: {
        backgroundColor: '#000000',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 9999,
    },
    tagText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    content: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 16,
        lineHeight: 24,
    },
    dynamicContent: {
        marginBottom: 16,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#404040',
    },
});
