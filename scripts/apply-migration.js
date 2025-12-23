const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  'https://rsqvterlzpopwnsducmx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwNTUxOSwiZXhwIjoyMDgwMjgxNTE5fQ.4lX82BKA9nrvn-WYvPOp0Nz7XUgSY1kXLYYuevsrTvA'
);

async function applyMigration() {
  console.log('Applying migration...');

  // Read the migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/20251218_location_and_invites.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Split into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    if (!statement || statement.startsWith('--')) continue;

    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
      if (error) {
        console.log('Statement error (may be expected):', error.message.substring(0, 100));
        errorCount++;
      } else {
        successCount++;
        console.log('✓ Statement executed');
      }
    } catch (err) {
      // Try direct fetch instead
      console.log('Note:', err.message?.substring(0, 50) || 'Unknown error');
    }
  }

  console.log(`\nMigration complete: ${successCount} success, ${errorCount} errors (some errors are expected for IF EXISTS)`);
}

// Alternative: test the tables exist
async function testTables() {
  console.log('\nTesting tables...');

  // Test profiles has lat/lon
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('id, latitude, longitude')
    .limit(1);

  if (pErr) {
    console.log('❌ Profiles lat/lon not available:', pErr.message);
  } else {
    console.log('✓ Profiles lat/lon columns exist');
  }

  // Test match_invites table
  const { data: invites, error: iErr } = await supabase
    .from('match_invites')
    .select('id')
    .limit(1);

  if (iErr) {
    console.log('❌ match_invites table not available:', iErr.message);
  } else {
    console.log('✓ match_invites table exists');
  }
}

async function main() {
  await testTables();
}

main().catch(console.error);
