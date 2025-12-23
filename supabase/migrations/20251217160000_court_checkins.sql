-- Create court_checkins table for public court check-ins
CREATE TABLE IF NOT EXISTS public.court_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    court_id UUID NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    time_slot TEXT NOT NULL, -- e.g., '06:00-08:00', '08:00-10:00'
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    -- Unique constraint: one check-in per user per court per date per time slot
    UNIQUE(court_id, user_id, checkin_date, time_slot)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_court_checkins_court_date ON public.court_checkins(court_id, checkin_date);
CREATE INDEX IF NOT EXISTS idx_court_checkins_user ON public.court_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_court_checkins_date ON public.court_checkins(checkin_date);

-- Enable RLS
ALTER TABLE public.court_checkins ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view check-ins (to see who's playing)
CREATE POLICY "Anyone can view court checkins"
ON public.court_checkins FOR SELECT
USING (true);

-- Authenticated users can create their own check-ins
CREATE POLICY "Users can create own checkins"
ON public.court_checkins FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own check-ins (e.g., cancel)
CREATE POLICY "Users can update own checkins"
ON public.court_checkins FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own check-ins
CREATE POLICY "Users can delete own checkins"
ON public.court_checkins FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Enable realtime for court_checkins
ALTER PUBLICATION supabase_realtime ADD TABLE court_checkins;
