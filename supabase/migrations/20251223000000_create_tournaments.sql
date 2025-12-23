-- Create tournaments table
CREATE TABLE IF NOT EXISTS public.tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sport TEXT NOT NULL,
    competition_type TEXT NOT NULL DEFAULT 'duplas',
    category TEXT NOT NULL DEFAULT 'masculino',
    level TEXT NOT NULL DEFAULT 'todos',
    description TEXT,
    banner_url TEXT,
    format TEXT NOT NULL DEFAULT 'eliminatoria_simples',
    max_teams INTEGER NOT NULL DEFAULT 16,
    registered_teams INTEGER NOT NULL DEFAULT 0,
    use_seeds BOOLEAN NOT NULL DEFAULT true,
    third_place_match BOOLEAN NOT NULL DEFAULT true,
    location_type TEXT NOT NULL DEFAULT 'manual' CHECK (location_type IN ('kourt', 'manual')),
    court_id UUID REFERENCES public.courts(id) ON DELETE SET NULL,
    address TEXT,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL DEFAULT '08:00',
    is_free BOOLEAN NOT NULL DEFAULT false,
    price_per_team DECIMAL(10,2),
    payment_online BOOLEAN NOT NULL DEFAULT true,
    payment_local BOOLEAN NOT NULL DEFAULT true,
    wait_list_enabled BOOLEAN NOT NULL DEFAULT true,
    auto_approval BOOLEAN NOT NULL DEFAULT true,
    sets_to_win INTEGER NOT NULL DEFAULT 2,
    games_to_win INTEGER NOT NULL DEFAULT 6,
    super_tiebreak BOOLEAN NOT NULL DEFAULT true,
    match_duration_minutes INTEGER NOT NULL DEFAULT 30,
    late_tolerance_minutes INTEGER NOT NULL DEFAULT 10,
    has_prize_money BOOLEAN NOT NULL DEFAULT false,
    prize_1st DECIMAL(10,2),
    prize_2nd DECIMAL(10,2),
    prize_3rd DECIMAL(10,2),
    has_trophy BOOLEAN NOT NULL DEFAULT true,
    has_products BOOLEAN NOT NULL DEFAULT false,
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')),
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create tournament_teams table for team registrations
CREATE TABLE IF NOT EXISTS public.tournament_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    player_ids UUID[] NOT NULL,
    team_name TEXT,
    seed INTEGER,
    registered_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create tournament_matches table for bracket/match management
CREATE TABLE IF NOT EXISTS public.tournament_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    round INTEGER NOT NULL,
    match_number INTEGER NOT NULL,
    team1_id UUID REFERENCES public.tournament_teams(id) ON DELETE SET NULL,
    team2_id UUID REFERENCES public.tournament_teams(id) ON DELETE SET NULL,
    winner_id UUID REFERENCES public.tournament_teams(id) ON DELETE SET NULL,
    score_team1 JSONB, -- Array of set scores, e.g., [6, 4, 7]
    score_team2 JSONB, -- Array of set scores, e.g., [4, 6, 5]
    scheduled_time TIMESTAMPTZ,
    court_number INTEGER,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'walkover', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tournament_id, round, match_number)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tournaments_sport ON public.tournaments(sport);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON public.tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_created_by ON public.tournaments(created_by);
CREATE INDEX IF NOT EXISTS idx_tournaments_date ON public.tournaments(date);
CREATE INDEX IF NOT EXISTS idx_tournament_teams_tournament ON public.tournament_teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_teams_player ON public.tournament_teams USING GIN (player_ids);
CREATE INDEX IF NOT EXISTS idx_tournament_matches_tournament ON public.tournament_matches(tournament_id);

-- Enable RLS
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tournaments
CREATE POLICY "Public tournaments are viewable by everyone"
    ON public.tournaments FOR SELECT
    USING (visibility = 'public' OR created_by = auth.uid());

CREATE POLICY "Users can create tournaments"
    ON public.tournaments FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Tournament creators can update their tournaments"
    ON public.tournaments FOR UPDATE
    USING (auth.uid() = created_by);

CREATE POLICY "Tournament creators can delete their tournaments"
    ON public.tournaments FOR DELETE
    USING (auth.uid() = created_by);

-- RLS Policies for tournament_teams
CREATE POLICY "Teams are viewable by tournament participants"
    ON public.tournament_teams FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tournaments t
            WHERE t.id = tournament_id
            AND (t.visibility = 'public' OR t.created_by = auth.uid())
        )
        OR auth.uid() = registered_by
        OR auth.uid() = ANY(player_ids)
    );

CREATE POLICY "Authenticated users can register teams"
    ON public.tournament_teams FOR INSERT
    WITH CHECK (auth.uid() = registered_by);

CREATE POLICY "Team registrants or tournament creators can update teams"
    ON public.tournament_teams FOR UPDATE
    USING (
        auth.uid() = registered_by
        OR EXISTS (
            SELECT 1 FROM public.tournaments t
            WHERE t.id = tournament_id AND t.created_by = auth.uid()
        )
    );

CREATE POLICY "Team registrants or tournament creators can delete teams"
    ON public.tournament_teams FOR DELETE
    USING (
        auth.uid() = registered_by
        OR EXISTS (
            SELECT 1 FROM public.tournaments t
            WHERE t.id = tournament_id AND t.created_by = auth.uid()
        )
    );

-- RLS Policies for tournament_matches
CREATE POLICY "Matches are viewable by tournament participants"
    ON public.tournament_matches FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tournaments t
            WHERE t.id = tournament_id
            AND (t.visibility = 'public' OR t.created_by = auth.uid())
        )
    );

CREATE POLICY "Tournament creators can manage matches"
    ON public.tournament_matches FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.tournaments t
            WHERE t.id = tournament_id AND t.created_by = auth.uid()
        )
    );

-- Function to increment registered_teams count
CREATE OR REPLACE FUNCTION public.increment_tournament_teams(p_tournament_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.tournaments
    SET registered_teams = registered_teams + 1,
        updated_at = NOW()
    WHERE id = p_tournament_id;
END;
$$;

-- Function to decrement registered_teams count
CREATE OR REPLACE FUNCTION public.decrement_tournament_teams(p_tournament_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.tournaments
    SET registered_teams = GREATEST(0, registered_teams - 1),
        updated_at = NOW()
    WHERE id = p_tournament_id;
END;
$$;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tournaments_updated_at
    BEFORE UPDATE ON public.tournaments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tournament_teams_updated_at
    BEFORE UPDATE ON public.tournament_teams
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tournament_matches_updated_at
    BEFORE UPDATE ON public.tournament_matches
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
