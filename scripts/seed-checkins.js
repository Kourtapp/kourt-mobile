const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rsqvterlzpopwnsducmx.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwNTUxOSwiZXhwIjoyMDgwMjgxNTE5fQ.4lX82BKA9nrvn-WYvPOp0Nz7XUgSY1kXLYYuevsrTvA';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

async function main() {
  console.log('Fetching a public court...');

  // Get a public court (type = 'public')
  const { data: courts, error: courtError } = await supabase
    .from('courts')
    .select('id, name')
    .eq('type', 'public')
    .eq('is_active', true)
    .limit(1);

  if (courtError || !courts || courts.length === 0) {
    console.error('No public court found:', courtError);
    return;
  }

  const court = courts[0];
  console.log('Found court:', court.name, court.id);

  // Get some users
  console.log('Fetching users...');
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, name')
    .limit(5);

  if (profileError || !profiles || profiles.length === 0) {
    console.error('No profiles found:', profileError);
    return;
  }

  console.log('Found profiles:', profiles.map(p => p.name).join(', '));

  // Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  console.log('Today:', today);

  // Clear existing test checkins for today
  console.log('Clearing existing checkins for today...');
  await supabase
    .from('court_checkins')
    .delete()
    .eq('court_id', court.id)
    .eq('checkin_date', today);

  // Insert checkins at different hours
  const checkins = [
    // 10h - 2 people
    { court_id: court.id, user_id: profiles[0].id, checkin_date: today, time_slot: '10:00', status: 'confirmed' },
    { court_id: court.id, user_id: profiles[1]?.id || profiles[0].id, checkin_date: today, time_slot: '10:00', status: 'confirmed' },
    // 14h - 3 people
    { court_id: court.id, user_id: profiles[0].id, checkin_date: today, time_slot: '14:00', status: 'confirmed' },
    { court_id: court.id, user_id: profiles[1]?.id || profiles[0].id, checkin_date: today, time_slot: '14:00', status: 'confirmed' },
    { court_id: court.id, user_id: profiles[2]?.id || profiles[0].id, checkin_date: today, time_slot: '14:00', status: 'confirmed' },
    // 18h - 4 people
    { court_id: court.id, user_id: profiles[0].id, checkin_date: today, time_slot: '18:00', status: 'confirmed' },
    { court_id: court.id, user_id: profiles[1]?.id || profiles[0].id, checkin_date: today, time_slot: '18:00', status: 'confirmed' },
    { court_id: court.id, user_id: profiles[2]?.id || profiles[0].id, checkin_date: today, time_slot: '18:00', status: 'confirmed' },
    { court_id: court.id, user_id: profiles[3]?.id || profiles[0].id, checkin_date: today, time_slot: '18:00', status: 'confirmed' },
    // 20h - 1 person
    { court_id: court.id, user_id: profiles[0].id, checkin_date: today, time_slot: '20:00', status: 'confirmed' },
  ];

  // Filter to unique user_id + time_slot combinations
  const uniqueCheckins = [];
  const seen = new Set();
  for (const c of checkins) {
    const key = `${c.user_id}-${c.time_slot}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueCheckins.push(c);
    }
  }

  console.log('Inserting', uniqueCheckins.length, 'checkins...');

  const { data, error } = await supabase
    .from('court_checkins')
    .insert(uniqueCheckins)
    .select();

  if (error) {
    console.error('Error inserting checkins:', error);
  } else {
    console.log('Successfully inserted', data.length, 'checkins!');
    console.log('Summary:');
    console.log('  - 10h: 2 pessoas');
    console.log('  - 14h: 3 pessoas');
    console.log('  - 18h: 4 pessoas');
    console.log('  - 20h: 1 pessoa');
    console.log('\nOpen the court page in the app to see the preview!');
  }
}

main();
