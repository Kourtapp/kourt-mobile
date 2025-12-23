-- Create atomic join_match function to prevent race conditions

CREATE OR REPLACE FUNCTION join_match(
    p_match_id UUID,
    p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_players INTEGER;
    v_max_players INTEGER;
BEGIN
    -- Lock the match row to prevent concurrent modifications
    SELECT current_players, max_players
    INTO v_current_players, v_max_players
    FROM matches
    WHERE id = p_match_id
    FOR UPDATE;  -- ← This locks the row!

    -- Check if match is full
    IF v_current_players >= v_max_players THEN
        RAISE EXCEPTION 'Match is full (% / %)', v_current_players, v_max_players;
    END IF;

    -- Insert player (will fail if already exists due to unique constraint)
    INSERT INTO match_players (match_id, user_id, status, team)
    VALUES (p_match_id, p_user_id, 'confirmed', NULL);

    -- Increment counter
    UPDATE matches
    SET current_players = current_players + 1,
        updated_at = NOW()
    WHERE id = p_match_id;

    RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION join_match IS 
'Atomically joins a match, preventing race condition where multiple users join simultaneously';
