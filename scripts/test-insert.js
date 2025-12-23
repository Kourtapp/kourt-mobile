const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://rsqvterlzpopwnsducmx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDU1MTksImV4cCI6MjA4MDI4MTUxOX0.Rgt0Nv7AQNmmuZviejCgdZd86xI9D6iMPDOJcARuMjE'
);

async function testInsert() {
  // Get a valid user ID from profiles
  const { data: profiles } = await supabase.from('profiles').select('id').limit(1);

  if (!profiles || profiles.length === 0) {
    console.log('No profiles found');
    return;
  }

  const userId = profiles[0].id;
  console.log('Using user:', userId);

  const insertData = {
    organizer_id: userId,
    court_id: null,
    sport: 'beach-tennis',
    date: '2025-12-19',
    start_time: '18:00:00',
    title: 'Test Match',
    is_private: false,
    is_public: true,
    status: 'open',  // Using 'open' instead of 'scheduled'
    max_players: 4,
    type: 'casual',
    player1_id: userId
  };

  console.log('Insert data:', JSON.stringify(insertData, null, 2));

  const { data, error } = await supabase
    .from('matches')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Success! Match created:', data.id);
  }
}

testInsert();
