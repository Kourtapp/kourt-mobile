const https = require('https');

const projectRef = 'rsqvterlzpopwnsducmx';
const accessToken = 'sbp_3b9cdb5f35a6f48a395f5b0b9afb77e39f81a820';

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

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'court_checkins' AND policyname = 'Users can create own checkins') THEN
    CREATE POLICY "Users can create own checkins" ON public.court_checkins FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'court_checkins' AND policyname = 'Users can update own checkins') THEN
    CREATE POLICY "Users can update own checkins" ON public.court_checkins FOR UPDATE TO authenticated USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'court_checkins' AND policyname = 'Users can delete own checkins') THEN
    CREATE POLICY "Users can delete own checkins" ON public.court_checkins FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;
`;

const data = JSON.stringify({ query: sql });

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: `/v1/projects/${projectRef}/database/query`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('Creating court_checkins table via Management API...');

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    if (res.statusCode === 201 || res.statusCode === 200) {
      console.log('Success! Table created.');
      try {
        const result = JSON.parse(body);
        console.log('Result:', JSON.stringify(result, null, 2));
      } catch (e) {
        console.log('Response:', body);
      }
    } else {
      console.log('Response:', body);
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
