-- Create analytics_events table for tracking user behavior
-- This enables real analytics instead of just logging

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_name TEXT NOT NULL,
    properties JSONB DEFAULT '{}',
    device_info JSONB DEFAULT '{}',
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);

-- Composite index for user event history
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_event
ON analytics_events(user_id, event_name, created_at DESC);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only insert their own events
CREATE POLICY "Users can insert own events"
ON analytics_events FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can read their own events (for debugging)
CREATE POLICY "Users can read own events"
ON analytics_events FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Service role can do everything (for admin dashboards)
-- Note: service_role bypasses RLS by default

-- Create a function to auto-set user_id from auth context
CREATE OR REPLACE FUNCTION set_analytics_user_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_id IS NULL THEN
        NEW.user_id := auth.uid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_analytics_user_id_trigger
    BEFORE INSERT ON analytics_events
    FOR EACH ROW
    EXECUTE FUNCTION set_analytics_user_id();

-- Create a view for common analytics queries
CREATE OR REPLACE VIEW analytics_summary AS
SELECT
    event_name,
    COUNT(*) as total_count,
    COUNT(DISTINCT user_id) as unique_users,
    DATE(created_at) as event_date
FROM analytics_events
GROUP BY event_name, DATE(created_at)
ORDER BY event_date DESC, total_count DESC;

-- Add comment
COMMENT ON TABLE analytics_events IS 'Stores user behavior analytics for product insights';
