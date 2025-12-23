import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';
import { sanitizeString } from '../utils/inputValidator';

export interface Post {
    id: string;
    user_id: string;
    content: string | null;
    image_url: string | null;
    type: string | null;
    likes_count: number | null;
    comments_count: number | null;
    created_at: string;
    user?: {
        id: string;
        full_name: string | null;
        avatar_url: string | null;
    };
    is_liked?: boolean;
}

export interface PostComment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    parent_id: string | null;
    created_at: string;
    user?: {
        id: string;
        full_name: string | null;
        avatar_url: string | null;
    };
}

export interface CreatePostData {
    content?: string;
    image_url?: string;
    type?: string;
}

export const postService = {
    // Get posts by user ID
    async getUserPosts(userId: string, page: number = 1, limit: number = 20): Promise<{ posts: Post[], hasMore: boolean }> {
        const { data: { user } } = await supabase.auth.getUser();
        const offset = (page - 1) * limit;

        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    user:profiles!posts_user_id_fkey (
                        id,
                        full_name,
                        avatar_url
                    )
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit);

            if (error) {
                logger.error('[postService] Error fetching user posts:', error);
                return { posts: [], hasMore: false };
            }

            const posts = (data || []) as any[];
            if (posts.length === 0) {
                return { posts: [], hasMore: false };
            }

            // Check if current user has liked each post
            if (user) {
                const postIds = posts.map(p => p.id);
                const { data: likes } = await supabase
                    .from('post_likes')
                    .select('post_id')
                    .eq('user_id', user.id)
                    .in('post_id', postIds);

                const likedPostIds = new Set((likes as any[] || []).map(l => l.post_id));
                posts.forEach(post => {
                    post.is_liked = likedPostIds.has(post.id);
                });
            }

            return {
                posts: posts as Post[],
                hasMore: posts.length === limit
            };
        } catch (error) {
            logger.error('[postService] Exception fetching posts:', error);
            return { posts: [], hasMore: false };
        }
    },

    // Get feed posts (from followed users + own posts)
    async getFeedPosts(page: number = 1, limit: number = 20): Promise<{ posts: Post[], hasMore: boolean }> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { posts: [], hasMore: false };

        const offset = (page - 1) * limit;

        try {
            // Get users the current user follows
            const { data: following } = await supabase
                .from('follows')
                .select('following_id')
                .eq('follower_id', user.id);

            const followingIds = ((following as any[]) || []).map(f => f.following_id);
            followingIds.push(user.id); // Include own posts

            const { data, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    user:profiles!posts_user_id_fkey (
                        id,
                        full_name,
                        avatar_url
                    )
                `)
                .in('user_id', followingIds)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit);

            if (error) {
                logger.error('[postService] Error fetching feed:', error);
                return { posts: [], hasMore: false };
            }

            const posts = (data || []) as any[];

            // Check if current user has liked each post
            if (posts.length > 0) {
                const postIds = posts.map(p => p.id);
                const { data: likes } = await supabase
                    .from('post_likes')
                    .select('post_id')
                    .eq('user_id', user.id)
                    .in('post_id', postIds);

                const likedPostIds = new Set((likes as any[] || []).map(l => l.post_id));
                posts.forEach(post => {
                    post.is_liked = likedPostIds.has(post.id);
                });
            }

            return {
                posts: posts as Post[],
                hasMore: posts.length === limit
            };
        } catch (error) {
            logger.error('[postService] Exception:', error);
            return { posts: [], hasMore: false };
        }
    },

    // Get explore/discover posts (all recent posts)
    async getExplorePosts(page: number = 1, limit: number = 20): Promise<{ posts: Post[], hasMore: boolean }> {
        const { data: { user } } = await supabase.auth.getUser();
        const offset = (page - 1) * limit;

        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    user:profiles!posts_user_id_fkey (
                        id,
                        full_name,
                        avatar_url
                    )
                `)
                .order('likes_count', { ascending: false, nullsFirst: false })
                .order('created_at', { ascending: false })
                .range(offset, offset + limit);

            if (error) {
                logger.error('[postService] Error fetching explore:', error);
                return { posts: [], hasMore: false };
            }

            const posts = (data || []) as any[];

            // Check if current user has liked each post
            if (user && posts.length > 0) {
                const postIds = posts.map(p => p.id);
                const { data: likes } = await supabase
                    .from('post_likes')
                    .select('post_id')
                    .eq('user_id', user.id)
                    .in('post_id', postIds);

                const likedPostIds = new Set((likes as any[] || []).map(l => l.post_id));
                posts.forEach(post => {
                    post.is_liked = likedPostIds.has(post.id);
                });
            }

            return {
                posts: posts as Post[],
                hasMore: posts.length === limit
            };
        } catch (error) {
            logger.error('[postService] Exception:', error);
            return { posts: [], hasMore: false };
        }
    },

    // Get single post
    async getPost(postId: string): Promise<Post | null> {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                user:profiles!posts_user_id_fkey (
                    id,
                    full_name,
                    avatar_url
                )
            `)
            .eq('id', postId)
            .single();

        if (error) {
            logger.error('[postService] Error fetching post:', error);
            return null;
        }

        const post = data as any;

        // Check if liked
        if (user && post) {
            const { data: like } = await supabase
                .from('post_likes')
                .select('id')
                .eq('post_id', postId)
                .eq('user_id', user.id)
                .single();

            post.is_liked = !!like;
        }

        return post as Post;
    },

    // Create post
    async createPost(postData: CreatePostData): Promise<{ success: boolean; post?: Post; error?: string }> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Não autenticado' };

        // Sanitize inputs
        const sanitizedContent = postData.content ? sanitizeString(postData.content) : null;
        const sanitizedType = postData.type ? sanitizeString(postData.type) : 'text';

        const { data, error } = await supabase
            .from('posts')
            .insert({
                user_id: user.id,
                content: sanitizedContent,
                image_url: postData.image_url || null,
                type: sanitizedType,
            } as any)
            .select(`
                *,
                user:profiles!posts_user_id_fkey (
                    id,
                    full_name,
                    avatar_url
                )
            `)
            .single();

        if (error) {
            logger.error('[postService] Error creating post:', error);
            return { success: false, error: error.message };
        }

        return { success: true, post: data as Post };
    },

    // Delete post
    async deletePost(postId: string): Promise<{ success: boolean; error?: string }> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Não autenticado' };

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)
            .eq('user_id', user.id);

        if (error) {
            logger.error('[postService] Error deleting post:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    },

    // Like/Unlike post
    async toggleLike(postId: string): Promise<{ success: boolean; isLiked: boolean; error?: string }> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, isLiked: false, error: 'Não autenticado' };

        // Check if already liked
        const { data: existingLike } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .single();

        const like = existingLike as any;

        if (like) {
            // Unlike
            const { error } = await supabase
                .from('post_likes')
                .delete()
                .eq('id', like.id);

            if (error) {
                return { success: false, isLiked: true, error: error.message };
            }
            return { success: true, isLiked: false };
        } else {
            // Like
            const { error } = await supabase
                .from('post_likes')
                .insert({ post_id: postId, user_id: user.id } as any);

            if (error) {
                return { success: false, isLiked: false, error: error.message };
            }
            return { success: true, isLiked: true };
        }
    },

    // Get post comments
    async getComments(postId: string, page: number = 1, limit: number = 20): Promise<{ comments: PostComment[], hasMore: boolean }> {
        const offset = (page - 1) * limit;

        const { data, error } = await supabase
            .from('post_comments')
            .select(`
                *,
                user:profiles!post_comments_user_id_fkey (
                    id,
                    full_name,
                    avatar_url
                )
            `)
            .eq('post_id', postId)
            .is('parent_id', null)
            .order('created_at', { ascending: true })
            .range(offset, offset + limit);

        if (error) {
            logger.error('[postService] Error fetching comments:', error);
            return { comments: [], hasMore: false };
        }

        return {
            comments: (data || []) as PostComment[],
            hasMore: (data?.length || 0) === limit
        };
    },

    // Add comment
    async addComment(postId: string, content: string, parentId?: string): Promise<{ success: boolean; comment?: PostComment; error?: string }> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Não autenticado' };

        const { data, error } = await supabase
            .from('post_comments')
            .insert({
                post_id: postId,
                user_id: user.id,
                content,
                parent_id: parentId || null,
            } as any)
            .select(`
                *,
                user:profiles!post_comments_user_id_fkey (
                    id,
                    full_name,
                    avatar_url
                )
            `)
            .single();

        if (error) {
            logger.error('[postService] Error adding comment:', error);
            return { success: false, error: error.message };
        }

        return { success: true, comment: data as PostComment };
    },

    // Delete comment
    async deleteComment(commentId: string): Promise<{ success: boolean; error?: string }> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Não autenticado' };

        const { error } = await supabase
            .from('post_comments')
            .delete()
            .eq('id', commentId)
            .eq('user_id', user.id);

        if (error) {
            logger.error('[postService] Error deleting comment:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    },

    // Get posts count for user
    async getUserPostsCount(userId: string): Promise<number> {
        const { count, error } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (error) {
            logger.error('[postService] Error getting posts count:', error);
            return 0;
        }

        return count || 0;
    }
};
