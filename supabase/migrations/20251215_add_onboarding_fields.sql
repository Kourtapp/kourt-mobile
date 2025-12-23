-- Add new onboarding fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS play_frequency TEXT,
ADD COLUMN IF NOT EXISTS play_style TEXT,
ADD COLUMN IF NOT EXISTS main_goal TEXT,
ADD COLUMN IF NOT EXISTS skill_level TEXT;

-- Add comments for documentation
COMMENT ON COLUMN profiles.play_frequency IS 'How often user plays: 1-2, 3-4, 5+, flexible';
COMMENT ON COLUMN profiles.play_style IS 'Who user plays with: solo, friends, team, mixed';
COMMENT ON COLUMN profiles.main_goal IS 'Main goal in Kourt: find_partners, discover_courts, compete, track_progress';
COMMENT ON COLUMN profiles.skill_level IS 'Skill level: beginner, intermediate, advanced, professional';
