const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rsqvterlzpopwnsducmx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDM2OTc3MSwiZXhwIjoyMDQ5OTQ1NzcxfQ.KsxIRXJQUBZZyKQjVQvMt7V7LGkXPyKZG8Y5LNpsgQs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyFollowsMigration() {
    console.log('Applying follows migration...');

    // Create follows table
    const { error: tableError } = await supabase.rpc('exec_sql', {
        sql: `
            CREATE TABLE IF NOT EXISTS public.follows (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
                following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(follower_id, following_id),
                CHECK (follower_id != following_id)
            );

            CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
            CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);
        `
    });

    if (tableError) {
        // Table might already exist or RPC not available, try direct insert test
        console.log('RPC not available, table likely exists or needs manual creation');
    }

    // Add columns to profiles
    const { error: colError } = await supabase.rpc('exec_sql', {
        sql: `
            ALTER TABLE public.profiles
            ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
        `
    });

    if (colError) {
        console.log('Column addition needs manual SQL execution');
    }

    console.log('Done! Please verify in Supabase Dashboard.');
}

applyFollowsMigration().catch(console.error);
