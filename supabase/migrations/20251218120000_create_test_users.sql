-- Create test users for Maestro automation
-- This seed creates the users needed for automated testing
-- Insert test users into auth.users (bypassing auth flows for testing)
INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role
    )
VALUES -- Maestro user (for core loop tests)
    (
        '11111111-1111-1111-1111-111111111111',
        'maestro@kourt.app',
        crypt('password123', gen_salt('bf')),
        -- Encrypted password
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Maestro User"}',
        false,
        'authenticated'
    ),
    -- Onboarding user (for onboarding tests)
    (
        '22222222-2222-2222-2222-222222222222',
        'user_onboarding@kourt.app',
        crypt('password123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Onboarding User"}',
        false,
        'authenticated'
    ) ON CONFLICT (id) DO NOTHING;
-- Create profiles for test users
INSERT INTO public.profiles (
        id,
        username,
        full_name,
        avatar_url,
        bio,
        is_verified,
        rating,
        matches_played
    )
VALUES -- Maestro user profile (completed onboarding)
    (
        '11111111-1111-1111-1111-111111111111',
        'maestro_user',
        'Maestro User',
        'https://i.pravatar.cc/150?u=maestro',
        'Test user for Maestro automation',
        true,
        4.5,
        10
    ),
    -- Onboarding user profile (for onboarding tests)
    (
        '22222222-2222-2222-2222-222222222222',
        'onboarding_user',
        'Onboarding User',
        'https://i.pravatar.cc/150?u=onboarding',
        'Test user for onboarding flow',
        false,
        0,
        0
    ) ON CONFLICT (id) DO NOTHING;