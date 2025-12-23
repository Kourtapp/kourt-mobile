-- Add database constraints for data integrity

-- 1. Ensure max_players is never exceeded
ALTER TABLE matches 
ADD CONSTRAINT check_current_players_not_exceed_max 
CHECK (current_players <= max_players);

-- 2. Ensure max_players is reasonable (2-100)
ALTER TABLE matches
ADD CONSTRAINT check_max_players_range
CHECK (max_players >= 2 AND max_players <= 100);

-- 3. Ensure dates are not in the past (optional, comment if needed)
-- ALTER TABLE matches
-- ADD CONSTRAINT check_date_not_past
-- CHECK (date >= CURRENT_DATE);

-- 4. Ensure check-in time_slot format is valid
ALTER TABLE court_checkins
ADD CONSTRAINT check_time_slot_format
CHECK (time_slot ~ '^[0-2][0-9]:[0-5][0-9]-[0-2][0-9]:[0-5][0-9]$');

COMMENT ON CONSTRAINT check_current_players_not_exceed_max ON matches IS 
'Prevents race condition where more players join than max_players allows';

COMMENT ON CONSTRAINT check_max_players_range ON matches IS 
'Ensures reasonable player limits (2-100)';

COMMENT ON CONSTRAINT check_time_slot_format ON court_checkins IS 
'Validates time slot format: HH:MM-HH:MM';
