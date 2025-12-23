const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read migration file
const migrationPath = path.join(__dirname, '../supabase/migrations/20251218170000_create_posts.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

// Create Supabase client with service role key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://rsqvterlzpopwnsducmx.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
    console.log('Note: Service role key not provided. Using anon key - some operations may fail.');
}

const supabase = createClient(
    supabaseUrl,
    serviceRoleKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDU1MTksImV4cCI6MjA4MDI4MTUxOX0.Rgt0Nv7AQNmmuZviejCgdZd86xI9D6iMPDOJcARuMjE'
);

async function checkTablesExist() {
    // Try to query the posts table
    const { data, error } = await supabase
        .from('posts')
        .select('id')
        .limit(1);

    if (error && error.code === '42P01') {
        // Table doesn't exist
        return false;
    }

    // Table exists (or other error we can handle)
    return !error || error.code !== '42P01';
}

async function main() {
    console.log('Checking if posts tables already exist...');

    const tablesExist = await checkTablesExist();

    if (tablesExist) {
        console.log('✅ Posts table already exists in the database!');

        // Let's verify by counting posts
        const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true });

        console.log(`Found ${count || 0} posts in the database.`);
        return;
    }

    console.log('Posts table does not exist yet.');
    console.log('');
    console.log('To create the posts tables, run this SQL in the Supabase Dashboard:');
    console.log('Go to: https://supabase.com/dashboard/project/rsqvterlzpopwnsducmx/sql/new');
    console.log('');
    console.log('Or use the Supabase CLI with proper migration history repair.');
}

main().catch(console.error);
