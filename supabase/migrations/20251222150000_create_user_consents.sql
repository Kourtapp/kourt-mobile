-- Create user_consents table for LGPD compliance
CREATE TABLE IF NOT EXISTS user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('location', 'camera', 'notifications', 'analytics', 'marketing')),
  granted BOOLEAN DEFAULT FALSE,
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one record per user per consent type
  UNIQUE(user_id, consent_type)
);

-- Create index for faster lookups
CREATE INDEX idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX idx_user_consents_type ON user_consents(consent_type);
CREATE INDEX idx_user_consents_granted ON user_consents(granted);

-- Enable RLS
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only see and manage their own consents
CREATE POLICY "Users can view their own consents"
  ON user_consents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consents"
  ON user_consents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consents"
  ON user_consents
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own consents"
  ON user_consents
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_consents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_consents_timestamp
  BEFORE UPDATE ON user_consents
  FOR EACH ROW
  EXECUTE FUNCTION update_user_consents_updated_at();

-- Function to revoke all consents for a user (LGPD Art. 18)
CREATE OR REPLACE FUNCTION revoke_all_user_consents(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_consents
  SET granted = FALSE,
      revoked_at = NOW(),
      updated_at = NOW()
  WHERE user_id = p_user_id
    AND granted = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION revoke_all_user_consents(UUID) TO authenticated;
