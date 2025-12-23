const https = require('https');

const supabaseUrl = 'rsqvterlzpopwnsducmx.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwNTUxOSwiZXhwIjoyMDgwMjgxNTE5fQ.4lX82BKA9nrvn-WYvPOp0Nz7XUgSY1kXLYYuevsrTvA';

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

DROP POLICY IF EXISTS "Anyone can view court checkins" ON public.court_checkins;
CREATE POLICY "Anyone can view court checkins" ON public.court_checkins FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create own checkins" ON public.court_checkins;
CREATE POLICY "Users can create own checkins" ON public.court_checkins FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own checkins" ON public.court_checkins;
CREATE POLICY "Users can update own checkins" ON public.court_checkins FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own checkins" ON public.court_checkins;
CREATE POLICY "Users can delete own checkins" ON public.court_checkins FOR DELETE TO authenticated USING (auth.uid() = user_id);
`;

const data = JSON.stringify({ query: sql });

const options = {
  hostname: supabaseUrl,
  port: 443,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': serviceRoleKey,
    'Authorization': `Bearer ${serviceRoleKey}`,
    'Content-Length': data.length
  }
};

console.log('Attempting to create court_checkins table...');

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);

    if (res.statusCode === 404) {
      console.log('\nThe exec_sql function does not exist.');
      console.log('Please run the SQL manually in Supabase SQL Editor:');
      console.log('---');
      console.log(sql);
      console.log('---');
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
