-- Migration: Add location coordinates to profiles and create match_invites table
-- Date: 2025-12-18
-- 1. Location columns (latitude/longitude for precise location)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
    ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
-- Create index for location-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(latitude, longitude);
-- 2. Create match_invites table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.match_invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(match_id, recipient_id)
);
-- Enable RLS on match_invites (if not already enabled)
ALTER TABLE public.match_invites ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist and recreate with correct column names
DROP POLICY IF EXISTS "Users can view their own invites" ON public.match_invites;
DROP POLICY IF EXISTS "Match organizers can invite" ON public.match_invites;
DROP POLICY IF EXISTS "Invitees can respond to invites" ON public.match_invites;
DROP POLICY IF EXISTS "Inviters can delete invites" ON public.match_invites;
-- RLS Policies for match_invites (using correct column names: sender_id, recipient_id)
CREATE POLICY "Users can view their own invites" ON public.match_invites FOR
SELECT USING (
        auth.uid() = sender_id
        OR auth.uid() = recipient_id
    );
CREATE POLICY "Match organizers can invite" ON public.match_invites FOR
INSERT WITH CHECK (
        auth.uid() = sender_id
        AND EXISTS (
            SELECT 1
            FROM public.matches
            WHERE id = match_id
                AND organizer_id = auth.uid()
        )
    );
CREATE POLICY "Invitees can respond to invites" ON public.match_invites FOR
UPDATE USING (auth.uid() = recipient_id);
CREATE POLICY "Inviters can delete invites" ON public.match_invites FOR DELETE USING (auth.uid() = sender_id);
-- Enable realtime for match_invites (ignore if already added)
DO $$ BEGIN ALTER PUBLICATION supabase_realtime
ADD TABLE public.match_invites;
EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;
-- 3. Create function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION public.calculate_distance_km(
        lat1 DOUBLE PRECISION,
        lon1 DOUBLE PRECISION,
        lat2 DOUBLE PRECISION,
        lon2 DOUBLE PRECISION
    ) RETURNS DOUBLE PRECISION AS $$
DECLARE R DOUBLE PRECISION := 6371;
-- Earth's radius in km
dlat DOUBLE PRECISION;
dlon DOUBLE PRECISION;
a DOUBLE PRECISION;
c DOUBLE PRECISION;
BEGIN IF lat1 IS NULL
OR lon1 IS NULL
OR lat2 IS NULL
OR lon2 IS NULL THEN RETURN NULL;
END IF;
dlat := RADIANS(lat2 - lat1);
dlon := RADIANS(lon2 - lon1);
a := SIN(dlat / 2) * SIN(dlat / 2) + COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * SIN(dlon / 2) * SIN(dlon / 2);
c := 2 * ATAN2(SQRT(a), SQRT(1 - a));
RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
-- 4. Create view for nearby matches (within radius)
-- Commented out - courts table doesn't have latitude/longitude columns yet
-- CREATE OR REPLACE VIEW public.nearby_matches AS
-- SELECT
--     m.*,
--     c.latitude as court_lat,
--     c.longitude as court_lon,
--     c.name as court_name,
--     c.address as court_address
-- FROM public.matches m
-- LEFT JOIN public.courts c ON m.court_id = c.id
-- WHERE m.is_public = true
--   AND m.date >= CURRENT_DATE
--   AND m.status = 'open';
-- COMMENT ON VIEW public.nearby_matches IS 'View for fetching nearby public matches with court coordinates';