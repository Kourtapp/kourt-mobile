const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function createFutureMatches() {
  // Get a court to use
  const { data: courts } = await supabase
    .from('courts')
    .select('id, name')
    .limit(3);

  if (!courts || courts.length === 0) {
    console.log('No courts found');
    return;
  }

  console.log('Found courts:', courts.map(c => c.name));

  // Get admin user to be the creator
  const { data: users } = await supabase
    .from('profiles')
    .select('id, name')
    .limit(1);

  if (!users || users.length === 0) {
    console.log('No users found');
    return;
  }

  console.log('Using creator:', users[0].name);

  const matches = [
    {
      title: 'Beach Tennis no Fim de Semana',
      sport: 'beach-tennis',
      date: '2025-12-21',
      start_time: '16:00:00',
      end_time: '18:00:00',
      court_id: courts[0].id,
      organizer_id: users[0].id,
      is_public: true,
      max_players: 4,
      status: 'open'
    },
    {
      title: 'Padel Amador - Duplas',
      sport: 'padel',
      date: '2025-12-20',
      start_time: '19:00:00',
      end_time: '21:00:00',
      court_id: courts[1] ? courts[1].id : courts[0].id,
      organizer_id: users[0].id,
      is_public: true,
      max_players: 4,
      status: 'open'
    },
    {
      title: 'Partida Casual Hoje',
      sport: 'beach-tennis',
      date: '2025-12-19',
      start_time: '18:00:00',
      end_time: '20:00:00',
      court_id: courts[0].id,
      organizer_id: users[0].id,
      is_public: true,
      max_players: 4,
      status: 'open'
    }
  ];

  for (const match of matches) {
    const { data, error } = await supabase
      .from('matches')
      .insert(match)
      .select()
      .single();

    if (error) {
      console.log('Error creating match:', error.message);
    } else {
      console.log('Created match:', data.title, '-', data.date);

      // Add organizer as player
      await supabase
        .from('match_players')
        .insert({
          match_id: data.id,
          user_id: match.organizer_id,
          status: 'confirmed'
        });
    }
  }

  console.log('Done!');
}

createFutureMatches();
