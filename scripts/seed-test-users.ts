import { createClient } from '@supabase/supabase-js';

// Local Supabase instance
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'; // Service role key for local dev

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function seedTestUsers() {
    console.log('🌱 Seeding test users...');

    try {
        // Create Maestro user profile
        const { data: maestroProfile, error: maestroError } = await supabase
            .from('profiles')
            .upsert({
                id: '11111111-1111-1111-1111-111111111111',
                email: 'maestro@kourt.app',
                name: 'Maestro User',
                username: 'maestro_user',
                avatar_url: 'https://i.pravatar.cc/150?u=maestro',
                onboarding_completed: true,
                onboarding_completed_at: new Date().toISOString(),
                matches_count: 0,
                followers_count: 0,
                following_count: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (maestroError) {
            console.error('❌ Error creating Maestro user:', maestroError);
        } else {
            console.log('✅ Maestro user created/updated');
        }

        // Create Onboarding user profile (NOT completed onboarding)
        const { data: onboardingProfile, error: onboardingError } = await supabase
            .from('profiles')
            .upsert({
                id: '22222222-2222-2222-2222-222222222222',
                email: 'user_onboarding@kourt.app',
                name: 'Onboarding User',
                username: 'onboarding_user',
                avatar_url: 'https://i.pravatar.cc/150?u=onboarding',
                onboarding_completed: false, // Important: NOT completed
                onboarding_completed_at: null,
                matches_count: 0,
                followers_count: 0,
                following_count: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (onboardingError) {
            console.error('❌ Error creating Onboarding user:', onboardingError);
        } else {
            console.log('✅ Onboarding user created/updated');
        }

        console.log('🎉 Test users seeded successfully!');
        console.log('\nTest credentials:');
        console.log('  1. maestro@kourt.app / password123 (completed onboarding)');
        console.log('  2. user_onboarding@kourt.app / password123 (needs onboarding)');

    } catch (error) {
        console.error('💥 Fatal error:', error);
        process.exit(1);
    }
}

seedTestUsers();
