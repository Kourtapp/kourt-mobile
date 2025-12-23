const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rsqvterlzpopwnsducmx.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwNTUxOSwiZXhwIjoyMDgwMjgxNTE5fQ.4lX82BKA9nrvn-WYvPOp0Nz7XUgSY1kXLYYuevsrTvA';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

async function main() {
  console.log('Checking if court_checkins table exists...');

  // Check if table exists
  const { data, error } = await supabase
    .from('court_checkins')
    .select('id')
    .limit(1);

  if (error) {
    if (error.message.includes('does not exist') || error.code === 'PGRST204' || error.code === '42P01') {
      console.log('Table does not exist. Creating via SQL...');
      console.log('');
      console.log('ERROR: Cannot create tables via PostgREST API.');
      console.log('You MUST run this SQL in Supabase Dashboard:');
      console.log('');
      console.log('https://supabase.com/dashboard/project/rsqvterlzpopwnsducmx/sql/new');
      console.log('');
      process.exit(1);
    } else {
      console.log('Error:', error.message, error.code);
      process.exit(1);
    }
  } else {
    console.log('✅ Table court_checkins already exists!');
    console.log('Data:', data);
  }
}

main();
