-- Add location columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Add index for better geo queries
CREATE INDEX IF NOT EXISTS idx_profiles_location
ON public.profiles (latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
