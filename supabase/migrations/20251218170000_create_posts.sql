-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT,
    media_urls TEXT [] DEFAULT '{}',
    media_type TEXT DEFAULT 'image',
    -- 'image', 'video', 'mixed'
    location TEXT,
    location_coords POINT,
    sport TEXT,
    match_id UUID REFERENCES public.matches(id) ON DELETE
    SET NULL,
        court_id UUID REFERENCES public.courts(id) ON DELETE
    SET NULL,
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        shares_count INTEGER DEFAULT 0,
        is_public BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create post_likes table
CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);
-- Create post_comments table
CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
-- CREATE INDEX IF NOT EXISTS idx_posts_sport ON public.posts(sport); -- Commented out - sport column doesn't exist in existing posts table
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON public.post_comments(post_id);
-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
-- RLS Policies for posts
-- Commented out - posts table from earlier migration doesn't have is_public column
-- CREATE POLICY "Public posts are viewable by everyone" ON public.posts
--     FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own posts" ON public.posts FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own posts" ON public.posts FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.posts FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);
-- RLS Policies for post_likes
CREATE POLICY "Anyone can view likes" ON public.post_likes FOR
SELECT USING (true);
CREATE POLICY "Users can like posts" ON public.post_likes FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike posts" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);
-- RLS Policies for post_comments
CREATE POLICY "Anyone can view comments" ON public.post_comments FOR
SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.post_comments FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.post_comments FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.post_comments FOR DELETE USING (auth.uid() = user_id);
-- Function to update likes count
CREATE OR REPLACE FUNCTION update_post_likes_count() RETURNS TRIGGER AS $$ BEGIN IF TG_OP = 'INSERT' THEN
UPDATE public.posts
SET likes_count = likes_count + 1
WHERE id = NEW.post_id;
ELSIF TG_OP = 'DELETE' THEN
UPDATE public.posts
SET likes_count = likes_count - 1
WHERE id = OLD.post_id;
END IF;
RETURN NULL;
END;
$$ LANGUAGE plpgsql;
-- Function to update comments count
CREATE OR REPLACE FUNCTION update_post_comments_count() RETURNS TRIGGER AS $$ BEGIN IF TG_OP = 'INSERT' THEN
UPDATE public.posts
SET comments_count = comments_count + 1
WHERE id = NEW.post_id;
ELSIF TG_OP = 'DELETE' THEN
UPDATE public.posts
SET comments_count = comments_count - 1
WHERE id = OLD.post_id;
END IF;
RETURN NULL;
END;
$$ LANGUAGE plpgsql;
-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_post_likes_count ON public.post_likes;
CREATE TRIGGER trigger_update_post_likes_count
AFTER
INSERT
    OR DELETE ON public.post_likes FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();
DROP TRIGGER IF EXISTS trigger_update_post_comments_count ON public.post_comments;
CREATE TRIGGER trigger_update_post_comments_count
AFTER
INSERT
    OR DELETE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();
-- Insert some demo posts - commented out since it uses columns not in existing posts table
-- INSERT INTO public.posts (
--         user_id,
--         content,
--         media_urls,
--         media_type,
--         sport,
--         is_public
--     )
-- SELECT id,
--     'Partida incrível hoje! 🎾',
--     ARRAY ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800'],
--     'image',
--     'beach_tennis',
--     true
-- FROM public.profiles
-- LIMIT 1 ON CONFLICT DO NOTHING;