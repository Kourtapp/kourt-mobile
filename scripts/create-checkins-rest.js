const https = require('https');

// Supabase config
const supabaseUrl = 'rsqvterlzpopwnsducmx.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwNTUxOSwiZXhwIjoyMDgwMjgxNTE5fQ.4lX82BKA9nrvn-WYvPOp0Nz7XUgSY1kXLYYuevsrTvA';

// First, let's create a simple table without RLS (then add policies later via dashboard)
async function createTable() {
    // Create table via PostgREST isn't possible, we need to use the query endpoint
    // Let's try inserting a record to see if table exists
    const testData = JSON.stringify({
        court_id: '00000000-0000-0000-0000-000000000000',
        user_id: '00000000-0000-0000-0000-000000000000',
        checkin_date: '2025-01-01',
        time_slot: '10:00',
        status: 'confirmed'
    });

    const options = {
        hostname: supabaseUrl,
        port: 443,
        path: '/rest/v1/court_checkins',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Prefer': 'return=minimal'
        }
    };

    console.log('Testing if court_checkins table exists...');

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log('Status:', res.statusCode);
            console.log('Response:', body);

            if (res.statusCode === 404 || body.includes('relation "public.court_checkins" does not exist')) {
                console.log('\nTable does not exist. Please create it manually in Supabase SQL Editor.');
                console.log('Go to: https://supabase.com/dashboard/project/rsqvterlzpopwnsducmx/sql');
                console.log('\nRun this SQL:\n');
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
                `);
            } else if (res.statusCode === 201) {
                console.log('\nTable exists and is working!');
            } else {
                console.log('\nUnexpected response. You may need to create the table manually.');
            }
        });
    });

    req.on('error', (e) => {
        console.error('Error:', e.message);
    });

    req.write(testData);
    req.end();
}

createTable();
