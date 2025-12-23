-- Enable Realtime for bookings table
-- ALTER PUBLICATION supabase_realtime ADD TABLE bookings; -- Commenting out - table doesn't exist yet
-- Enable Realtime for existing tables
ALTER PUBLICATION supabase_realtime
ADD TABLE matches;
ALTER PUBLICATION supabase_realtime
ADD TABLE match_players;
ALTER PUBLICATION supabase_realtime
ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime
ADD TABLE courts;
ALTER PUBLICATION supabase_realtime
ADD TABLE arenas;