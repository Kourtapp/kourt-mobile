-- Seed Data for Kourt App Demo (Fixed)
-- 1. Create Venues (Arenas)
INSERT INTO public.arenas (
        id,
        name,
        description,
        address,
        city,
        state,
        cover_photo_url,
        amenities,
        phone,
        owner_id
    )
VALUES (
        '11111111-1111-1111-1111-111111111111',
        'Arena Beach Pro',
        'A melhor arena de Beach Tennis da região.',
        'Av. Atlântica, 1000',
        'Rio de Janeiro',
        'RJ',
        'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1',
        ARRAY ['Wi-Fi', 'Bar', 'Estacionamento'],
        '(21) 99999-0001',
        (
            SELECT id
            FROM auth.users
            LIMIT 1
        ) -- Assign to first available user (optional)
    ), (
        '22222222-2222-2222-2222-222222222222', 'Complexo Esportivo Central', 'Futebol, Vôlei e muito mais.', 'Rua do Centro, 500', 'São Paulo', 'SP', 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68', ARRAY ['Vestiário', 'Churrasqueira'], '(11) 98888-0002', (
            SELECT id
            FROM auth.users
            LIMIT 1
        )
    ) ON CONFLICT (id) DO NOTHING;
-- 2. Create Courts (matching actual schema from restore_schema.sql)
INSERT INTO public.courts (
        id,
        arena_id,
        name,
        sport,
        type,
        price_per_hour
    )
VALUES (
        '33333333-3333-3333-3333-333333333333',
        '11111111-1111-1111-1111-111111111111',
        'Quadra 1 (Areia)',
        'Beach Tennis',
        'Sand',
        80.00
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        '11111111-1111-1111-1111-111111111111',
        'Quadra 2 (Areia)',
        'Beach Tennis',
        'Sand',
        80.00
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        '22222222-2222-2222-2222-222222222222',
        'Campo Society A',
        'Futebol',
        'Grass',
        200.00
    ) ON CONFLICT (id) DO NOTHING;
-- 3. Create Matches (Fixed columns)
-- Only run if we have a user
DO $$
DECLARE first_user_id uuid;
BEGIN
SELECT id INTO first_user_id
FROM auth.users
LIMIT 1;
IF first_user_id IS NOT NULL THEN
INSERT INTO public.matches (
        id,
        court_id,
        organizer_id,
        sport,
        date,
        start_time,
        end_time,
        price_per_person,
        max_players,
        current_players,
        status,
        description,
        title,
        is_public,
        is_private
    )
VALUES (
        '66666666-6666-6666-6666-666666666666',
        '33333333-3333-3333-3333-333333333333',
        first_user_id,
        'Beach Tennis',
        (CURRENT_DATE + 1)::text,
        -- Date string
        '18:00:00',
        '19:30:00',
        20.00,
        4,
        1,
        'scheduled',
        'Jogo amistoso, nível iniciante/intermediário.',
        'Beach de Quarta',
        true,
        false
    ),
    (
        '77777777-7777-7777-7777-777777777777',
        '55555555-5555-5555-5555-555555555555',
        first_user_id,
        'Futebol',
        (CURRENT_DATE + 2)::text,
        '20:00:00',
        '21:00:00',
        35.00,
        10,
        8,
        'scheduled',
        'Futebol toda semana, falta goleiro!',
        'Futebol dos Amigos',
        true,
        false
    ) ON CONFLICT (id) DO NOTHING;
END IF;
END $$;