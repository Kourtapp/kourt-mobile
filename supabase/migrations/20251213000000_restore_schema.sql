-- RESTORE SCHEMA: Based on database.types.ts and seed usage
-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    rating FLOAT DEFAULT 0,
    matches_played INT DEFAULT 0,
    -- Onboarding fields (from 20251215_add_onboarding_fields.sql)
    play_frequency TEXT,
    play_style TEXT,
    main_goal TEXT,
    skill_level TEXT,
    bio TEXT,
    cover_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    matches_count INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR
SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR
INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR
UPDATE USING (auth.uid() = id);
-- 2. ARENAS
CREATE TABLE IF NOT EXISTS public.arenas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    cover_photo_url TEXT,
    amenities TEXT [],
    phone TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.arenas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Arenas are viewable by everyone" ON public.arenas FOR
SELECT USING (true);
CREATE POLICY "Users can insert arenas" ON public.arenas FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
-- Allow created by simple auth for now
-- 3. COURTS
CREATE TABLE IF NOT EXISTS public.courts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    arena_id UUID REFERENCES public.arenas(id),
    owner_id UUID REFERENCES public.profiles(id),
    -- For private courts without arena
    name TEXT NOT NULL,
    sport TEXT NOT NULL,
    type TEXT,
    price_per_hour DECIMAL(10, 2),
    is_indoor BOOLEAN DEFAULT false,
    surface TEXT,
    images TEXT [],
    cover_image TEXT,
    description TEXT,
    rating FLOAT,
    rating_count INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courts are viewable by everyone" ON public.courts FOR
SELECT USING (true);
CREATE POLICY "Authenticated users can create courts" ON public.courts FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Owners can update courts" ON public.courts FOR
UPDATE USING (auth.uid() = owner_id);
-- 4. MATCHES
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    court_id UUID REFERENCES public.courts(id),
    organizer_id UUID REFERENCES public.profiles(id),
    -- Matches database.types.ts
    sport TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    price_per_person DECIMAL(10, 2),
    max_players INT,
    current_players INT DEFAULT 0,
    status TEXT DEFAULT 'open',
    description TEXT,
    title TEXT,
    is_public BOOLEAN DEFAULT true,
    is_private BOOLEAN DEFAULT false,
    level TEXT,
    location_name TEXT,
    location_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Matches are viewable by everyone" ON public.matches FOR
SELECT USING (true);
CREATE POLICY "Authenticated users can create matches" ON public.matches FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Organizers can update matches" ON public.matches FOR
UPDATE USING (auth.uid() = organizer_id);
-- 4.5 MATCH_PLAYERS (join table for match participants)
CREATE TABLE IF NOT EXISTS public.match_players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    team TEXT,
    status TEXT DEFAULT 'pending',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(match_id, user_id)
);
ALTER TABLE public.match_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Match players viewable by everyone" ON public.match_players FOR
SELECT USING (true);
CREATE POLICY "Users can join matches" ON public.match_players FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave matches" ON public.match_players FOR DELETE USING (auth.uid() = user_id);
-- 5. POSTS
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    content TEXT,
    image_url TEXT,
    -- database.types.ts uses photo_url in some places, checking Row definition at line 2268: photo_url. Insert at 2287: photo_url.
    -- Wait, let me check database.types.ts again for posts.
    -- Row: photo_url. Insert: photo_url.
    -- But create.tsx uses image_url in insert! (line 105 in create.tsx: image_url: imageUrl).
    -- This implies a mismatch between types and code. 
    -- I will add BOTH or check which one is generated.
    -- database.types.ts is GENERATED from DB. If it says photo_url, the DB had photo_url.
    -- But create.tsx tries to insert image_url. This would fail if column doesn't exist.
    -- I will create BOTH to be safe or alias one.
    -- Actually, I will create photo_url as primary and maybe image_url as alias or just image_url if code demands it.
    -- Given Create.tsx is manually written code, it might be wrong.
    -- I will Create image_url to match the CODE I analyzed.
    photo_url TEXT,
    type TEXT DEFAULT 'text',
    metrics JSONB,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Adding image_url column to posts as code uses it
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY " Posts are viewable by everyone " ON public.posts FOR
SELECT USING (true);
CREATE POLICY " Users can
insert posts " ON public.posts FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY " Users can
update own posts " ON public.posts FOR
UPDATE USING (auth.uid() = user_id);