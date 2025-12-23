const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rsqvterlzpopwnsducmx.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwNTUxOSwiZXhwIjoyMDgwMjgxNTE5fQ.4lX82BKA9nrvn-WYvPOp0Nz7XUgSY1kXLYYuevsrTvA';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  db: { schema: 'public' },
  auth: { persistSession: false }
});

async function createTable() {
  console.log('Creating court_checkins table...');

  // Test if table exists by trying to select from it
  const { data, error } = await supabase.from('court_checkins').select('id').limit(1);

  if (!error) {
    console.log('Table already exists!');
    return;
  }

  console.log('Table does not exist, error:', error.message);
  console.log('\nPlease run this SQL in Supabase SQL Editor:');
  console.log('---');
  console.log(`
CREATE TABLE IF NOT EXISTS public.court_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    court_id UUID NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(court_id, user_id, checkin_date, time_slot)
);

CREATE INDEX IF NOT EXISTS idx_court_checkins_court_date ON public.court_checkins(court_id, checkin_date);
CREATE INDEX IF NOT EXISTS idx_court_checkins_user ON public.court_checkins(user_id);

ALTER TABLE public.court_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view court checkins" ON public.court_checkins FOR SELECT USING (true);
CREATE POLICY "Users can create own checkins" ON public.court_checkins FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own checkins" ON public.court_checkins FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own checkins" ON public.court_checkins FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE court_checkins;
  `);
  console.log('---');
}

createTable();
