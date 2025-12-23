-- Data Retention Policy for LGPD Compliance
-- Implements "Right to be Forgotten" (LGPD Art. 18)

-- ============================================================================
-- 1. Function to completely delete user data (LGPD Art. 18 - Direito à Exclusão)
-- ============================================================================

CREATE OR REPLACE FUNCTION delete_user_data(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB := '{}'::jsonb;
    v_deleted_count INTEGER;
BEGIN
    -- Verify the user is deleting their own data
    IF auth.uid() != p_user_id AND auth.uid() IS NOT NULL THEN
        RAISE EXCEPTION 'Unauthorized: You can only delete your own data';
    END IF;

    -- 1. Delete analytics events (soft - anonymize)
    UPDATE analytics_events
    SET user_id = NULL,
        properties = jsonb_set(properties, '{anonymized}', 'true'),
        ip_address = NULL,
        user_agent = NULL
    WHERE user_id = p_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    v_result := v_result || jsonb_build_object('analytics_anonymized', v_deleted_count);

    -- 2. Delete user consents
    DELETE FROM user_consents WHERE user_id = p_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    v_result := v_result || jsonb_build_object('consents_deleted', v_deleted_count);

    -- 3. Delete match participations
    DELETE FROM match_players WHERE user_id = p_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    v_result := v_result || jsonb_build_object('match_players_deleted', v_deleted_count);

    -- 4. Delete match invites (sent and received)
    DELETE FROM match_invites WHERE inviter_id = p_user_id OR invitee_id = p_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    v_result := v_result || jsonb_build_object('invites_deleted', v_deleted_count);

    -- 5. Delete matches created by user
    DELETE FROM matches WHERE organizer_id = p_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    v_result := v_result || jsonb_build_object('matches_deleted', v_deleted_count);

    -- 6. Delete follows (both directions)
    DELETE FROM follows WHERE follower_id = p_user_id OR following_id = p_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    v_result := v_result || jsonb_build_object('follows_deleted', v_deleted_count);

    -- 7. Delete court check-ins
    DELETE FROM court_checkins WHERE user_id = p_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    v_result := v_result || jsonb_build_object('checkins_deleted', v_deleted_count);

    -- 8. Delete posts and post likes
    DELETE FROM post_likes WHERE user_id = p_user_id;
    DELETE FROM posts WHERE user_id = p_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    v_result := v_result || jsonb_build_object('posts_deleted', v_deleted_count);

    -- 9. Delete bookings (keep for 5 years for fiscal records - anonymize instead)
    UPDATE bookings
    SET user_id = NULL,
        notes = 'User deleted - anonymized for fiscal records'
    WHERE user_id = p_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    v_result := v_result || jsonb_build_object('bookings_anonymized', v_deleted_count);

    -- 10. Delete profile (this will cascade to many tables via FK)
    DELETE FROM profiles WHERE id = p_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    v_result := v_result || jsonb_build_object('profile_deleted', v_deleted_count);

    -- Log the deletion for audit purposes
    INSERT INTO analytics_events (event_name, properties, created_at)
    VALUES ('user_data_deleted', v_result, NOW());

    RETURN v_result;
END;
$$;

COMMENT ON FUNCTION delete_user_data IS
'LGPD Art. 18 - Completely deletes or anonymizes all user data.
Bookings are anonymized (not deleted) for fiscal compliance (5 year retention).';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION delete_user_data(UUID) TO authenticated;


-- ============================================================================
-- 2. Function to export user data (LGPD Art. 18 - Portabilidade)
-- ============================================================================

CREATE OR REPLACE FUNCTION export_user_data(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB := '{}'::jsonb;
    v_profile JSONB;
    v_matches JSONB;
    v_bookings JSONB;
    v_posts JSONB;
    v_follows JSONB;
    v_consents JSONB;
BEGIN
    -- Verify the user is exporting their own data
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Unauthorized: You can only export your own data';
    END IF;

    -- 1. Profile data
    SELECT to_jsonb(p.*) INTO v_profile
    FROM profiles p WHERE p.id = p_user_id;
    v_result := v_result || jsonb_build_object('profile', v_profile);

    -- 2. Matches participated
    SELECT COALESCE(jsonb_agg(m.*), '[]'::jsonb) INTO v_matches
    FROM matches m
    WHERE m.organizer_id = p_user_id
       OR m.id IN (SELECT match_id FROM match_players WHERE user_id = p_user_id);
    v_result := v_result || jsonb_build_object('matches', v_matches);

    -- 3. Bookings
    SELECT COALESCE(jsonb_agg(b.*), '[]'::jsonb) INTO v_bookings
    FROM bookings b WHERE b.user_id = p_user_id;
    v_result := v_result || jsonb_build_object('bookings', v_bookings);

    -- 4. Posts
    SELECT COALESCE(jsonb_agg(p.*), '[]'::jsonb) INTO v_posts
    FROM posts p WHERE p.user_id = p_user_id;
    v_result := v_result || jsonb_build_object('posts', v_posts);

    -- 5. Follows
    SELECT jsonb_build_object(
        'following', COALESCE((SELECT jsonb_agg(following_id) FROM follows WHERE follower_id = p_user_id), '[]'::jsonb),
        'followers', COALESCE((SELECT jsonb_agg(follower_id) FROM follows WHERE following_id = p_user_id), '[]'::jsonb)
    ) INTO v_follows;
    v_result := v_result || jsonb_build_object('social', v_follows);

    -- 6. Consents
    SELECT COALESCE(jsonb_agg(c.*), '[]'::jsonb) INTO v_consents
    FROM user_consents c WHERE c.user_id = p_user_id;
    v_result := v_result || jsonb_build_object('consents', v_consents);

    -- Add metadata
    v_result := v_result || jsonb_build_object(
        'export_metadata', jsonb_build_object(
            'exported_at', NOW(),
            'user_id', p_user_id,
            'format_version', '1.0'
        )
    );

    -- Log export for audit
    INSERT INTO analytics_events (user_id, event_name, properties, created_at)
    VALUES (p_user_id, 'user_data_exported', '{"action": "export"}'::jsonb, NOW());

    RETURN v_result;
END;
$$;

COMMENT ON FUNCTION export_user_data IS
'LGPD Art. 18 - Exports all user data in JSON format for portability.';

GRANT EXECUTE ON FUNCTION export_user_data(UUID) TO authenticated;


-- ============================================================================
-- 3. Automatic data cleanup job (for old analytics, etc.)
-- ============================================================================

-- Create a function to clean up old anonymous analytics (older than 2 years)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    -- Delete anonymous analytics older than 2 years
    DELETE FROM analytics_events
    WHERE user_id IS NULL
      AND created_at < NOW() - INTERVAL '2 years';

    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

    RETURN v_deleted_count;
END;
$$;

COMMENT ON FUNCTION cleanup_old_analytics IS
'Removes anonymous analytics data older than 2 years for LGPD compliance.';


-- ============================================================================
-- 4. Add deletion audit log table
-- ============================================================================

CREATE TABLE IF NOT EXISTS data_deletion_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Can be NULL after deletion
    email_hash TEXT, -- Hashed email for audit reference
    deletion_reason TEXT,
    deleted_items JSONB,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    requested_by TEXT -- 'user' or 'admin'
);

-- Index for audit queries
CREATE INDEX IF NOT EXISTS idx_deletion_log_date ON data_deletion_log(requested_at DESC);

-- RLS - Only admins can read deletion logs
ALTER TABLE data_deletion_log ENABLE ROW LEVEL SECURITY;

-- No public access to deletion logs
CREATE POLICY "No public access to deletion logs"
ON data_deletion_log FOR ALL
USING (false);

COMMENT ON TABLE data_deletion_log IS
'Audit log for LGPD data deletion requests. Retained for compliance verification.';
