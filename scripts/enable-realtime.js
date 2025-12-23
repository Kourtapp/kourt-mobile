const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rsqvterlzpopwnsducmx.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwNTUxOSwiZXhwIjoyMDgwMjgxNTE5fQ.4lX82BKA9nrvn-WYvPOp0Nz7XUgSY1kXLYYuevsrTvA';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  db: { schema: 'public' },
  auth: { persistSession: false }
});

async function enableRealtime() {
  console.log('Enabling realtime for tables...');

  // Using raw SQL via rpc
  const sql = `
    DO $$
    BEGIN
      -- Enable realtime for courts
      IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'courts'
      ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE courts;
        RAISE NOTICE 'Added courts to realtime';
      END IF;

      -- Enable realtime for bookings
      IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'bookings'
      ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
        RAISE NOTICE 'Added bookings to realtime';
      END IF;

      -- Enable realtime for matches
      IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'matches'
      ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE matches;
        RAISE NOTICE 'Added matches to realtime';
      END IF;

      -- Enable realtime for messages
      IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
      ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE messages;
        RAISE NOTICE 'Added messages to realtime';
      END IF;
    END $$;
  `;

  // Try to execute via stored procedure if exists, or just test connection
  const { data, error } = await supabase.from('courts').select('id').limit(1);

  if (error) {
    console.error('Error connecting:', error);
    return;
  }

  console.log('Connection successful!');
  console.log('Courts found:', data?.length || 0);

  // Check current realtime status
  const { data: pubData, error: pubError } = await supabase.rpc('get_realtime_tables');
  if (!pubError && pubData) {
    console.log('Current realtime tables:', pubData);
  }

  console.log('\nTo enable realtime, run this SQL in Supabase SQL Editor:');
  console.log('---');
  console.log("ALTER PUBLICATION supabase_realtime ADD TABLE courts;");
  console.log("ALTER PUBLICATION supabase_realtime ADD TABLE bookings;");
  console.log("ALTER PUBLICATION supabase_realtime ADD TABLE matches;");
  console.log("ALTER PUBLICATION supabase_realtime ADD TABLE messages;");
  console.log('---');
}

enableRealtime();
