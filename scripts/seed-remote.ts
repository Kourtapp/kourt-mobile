
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase Environment Variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('🌱 Seeding remote database...');

    // Fixed IDs for idempotency
    const arena1Id = '11111111-1111-1111-1111-111111111111';
    const arena2Id = '22222222-2222-2222-2222-222222222222';

    // 1. Arenas
    console.log('Creating Arenas...');
    const { error: arenaError } = await supabase.from('arenas').upsert([
        {
            id: arena1Id,
            name: 'Arena Beach Pro',
            description: 'A melhor arena de Beach Tennis da região.',
            address: 'Av. Atlântica, 1000',
            city: 'Rio de Janeiro',
            state: 'RJ',
            cover_photo_url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1',
            amenities: ['Wi-Fi', 'Bar', 'Estacionamento'],
            phone: '(21) 99999-0001'
        },
        {
            id: arena2Id,
            name: 'Complexo Esportivo Central',
            description: 'Futebol, Vôlei e muito mais.',
            address: 'Rua do Centro, 500',
            city: 'São Paulo',
            state: 'SP',
            cover_photo_url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68',
            amenities: ['Vestiário', 'Churrasqueira'],
            phone: '(11) 98888-0002'
        }
    ], { onConflict: 'id' });

    if (arenaError) console.error('Error creating arenas:', arenaError);

    // 2. Courts
    console.log('Creating Courts...');
    const court1Id = '33333333-3333-3333-3333-333333333333';
    const court2Id = '44444444-4444-4444-4444-444444444444';
    const court3Id = '55555555-5555-5555-5555-555555555555';

    const { error: courtError } = await supabase.from('courts').upsert([
        {
            id: court1Id,
            arena_id: arena1Id,
            name: 'Quadra 1 (Areia)',
            sport: 'Beach Tennis',
            type: 'Sand',
            price_per_hour: 80.00,
            address: 'Av. Atlântica, 1000',
            city: 'Rio de Janeiro'
        },
        {
            id: court2Id,
            arena_id: arena1Id,
            name: 'Quadra 2 (Areia)',
            sport: 'Beach Tennis',
            type: 'Sand',
            price_per_hour: 80.00,
            address: 'Av. Atlântica, 1000',
            city: 'Rio de Janeiro'
        },
        {
            id: court3Id,
            arena_id: arena2Id,
            name: 'Campo Society A',
            sport: 'Futebol',
            type: 'Grass',
            price_per_hour: 200.00,
            address: 'Rua do Centro, 500',
            city: 'São Paulo'
        }
    ], { onConflict: 'id' });
    if (courtError) console.error('Error creating courts:', courtError);

    // 3. Matches
    console.log('Creating Matches...');

    const { data: users } = await supabase.from('profiles').select('id').limit(1);
    const organizerId = users && users.length > 0 ? users[0].id : null;

    if (organizerId) {
        // Use full ISO dates for start/end time to be safe if they are timestamptz
        // Or if they are strings, assume HH:MM format which matches some schemas.
        // THE ERROR was: invalid input syntax for type timestamp with time zone: "19:30"
        // This means one of the fields (likely start_time or end_time or date) is being interpreted as a timestamp but receiving "19:30".
        // Let's deduce:
        // In database.types.ts: date is string, start_time is string.
        // BUT Postgres error says specific column is timestamptz.
        // Most likely 'start_time' and 'end_time' are TIMESTAMPTZ columns in the actual DB, despite the generated types saying 'string' (Postgrest returns timestamps as strings in JSON).

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];

        const startTimeISO = new Date(tomorrow);
        startTimeISO.setHours(18, 0, 0, 0);

        const endTimeISO = new Date(tomorrow);
        endTimeISO.setHours(19, 30, 0, 0);

        const { error: matchError } = await supabase.from('matches').upsert([
            {
                id: '66666666-6666-6666-6666-666666666666',
                court_id: court1Id,
                organizer_id: organizerId,
                sport: 'Beach Tennis',
                date: dateStr,
                start_time: startTimeISO.toISOString(), // Try ISO string
                end_time: endTimeISO.toISOString(),     // Try ISO string
                max_players: 4,
                current_players: 1,
                status: 'scheduled', // Fixed enum
                description: 'Jogo amistoso, nível iniciante/intermediário.',
                title: 'Beach de Quarta',
                is_public: true,
                is_private: false
            }
        ], { onConflict: 'id' });

        if (matchError) console.error('Error creating matches:', matchError);
    } else {
        console.log('Skipping matches: No users found to assign as organizer.');
    }

    console.log('✅ Seeding complete!');
}

seed();
