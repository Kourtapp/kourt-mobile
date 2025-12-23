const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://rsqvterlzpopwnsducmx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwNTUxOSwiZXhwIjoyMDgwMjgxNTE5fQ.4lX82BKA9nrvn-WYvPOp0Nz7XUgSY1kXLYYuevsrTvA'
);

async function addLocationColumns() {
  console.log('Adding latitude and longitude columns to profiles...');

  // Use raw SQL via REST API
  const response = await fetch('https://rsqvterlzpopwnsducmx.supabase.co/rest/v1/rpc/exec_sql', {
    method: 'POST',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwNTUxOSwiZXhwIjoyMDgwMjgxNTE5fQ.4lX82BKA9nrvn-WYvPOp0Nz7XUgSY1kXLYYuevsrTvA',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwNTUxOSwiZXhwIjoyMDgwMjgxNTE5fQ.4lX82BKA9nrvn-WYvPOp0Nz7XUgSY1kXLYYuevsrTvA',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sql: `
        ALTER TABLE public.profiles
        ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
        ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
      `
    })
  });

  console.log('Response status:', response.status);

  if (!response.ok) {
    const text = await response.text();
    console.log('Response:', text);
  }

  // Verify columns exist now
  const { data, error } = await supabase
    .from('profiles')
    .select('id, latitude, longitude')
    .limit(1);

  if (error) {
    console.log('❌ Still not available:', error.message);
    console.log('\nPlease run this SQL in Supabase Dashboard SQL Editor:');
    console.log(`
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
    `);
  } else {
    console.log('✓ Columns added successfully!');
  }
}

addLocationColumns().catch(console.error);
