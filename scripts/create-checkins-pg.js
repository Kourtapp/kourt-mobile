const { Pool } = require('pg');

// Using session pooler for compatibility
const pool = new Pool({
  host: 'aws-0-us-east-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.rsqvterlzpopwnsducmx',
  password: 'UBhMdrHpPobuzInEFRBFcEoVSzPmQnHM',
  ssl: { rejectUnauthorized: false }
});

const sql = `
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

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'court_checkins' AND policyname = 'Anyone can view court checkins') THEN
    CREATE POLICY "Anyone can view court checkins" ON public.court_checkins FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'court_checkins' AND policyname = 'Users can create own checkins') THEN
    CREATE POLICY "Users can create own checkins" ON public.court_checkins FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'court_checkins' AND policyname = 'Users can update own checkins') THEN
    CREATE POLICY "Users can update own checkins" ON public.court_checkins FOR UPDATE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'court_checkins' AND policyname = 'Users can delete own checkins') THEN
    CREATE POLICY "Users can delete own checkins" ON public.court_checkins FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;
`;

async function createTable() {
  console.log('Connecting to database...');
  const client = await pool.connect();

  try {
    console.log('Creating court_checkins table...');
    await client.query(sql);
    console.log('Success! Table created.');

    // Verify table exists
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'court_checkins'
    `);
    console.log('Verification:', result.rows.length > 0 ? 'Table exists' : 'Table not found');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createTable();
