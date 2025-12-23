const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rsqvterlzpopwnsducmx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDU1MTksImV4cCI6MjA4MDI4MTUxOX0.Rgt0Nv7AQNmmuZviejCgdZd86xI9D6iMPDOJcARuMjE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDuplicates() {
    console.log('Fetching courts...');

    // Get all courts
    const { data: courts, error } = await supabase
        .from('courts')
        .select('id, name, address, city, created_at, type')
        .order('created_at', { ascending: true }); // oldest first so we keep them

    if (error) {
        console.error('Error fetching courts:', error);
        return;
    }

    console.log(`Found ${courts.length} total courts`);

    // Find duplicates by name + address + city
    const seen = new Map();
    const duplicates = [];

    for (const court of courts) {
        const key = `${court.name?.toLowerCase()}-${court.address?.toLowerCase()}-${court.city?.toLowerCase()}`;
        if (seen.has(key)) {
            // This is a duplicate, keep the first one (oldest) and mark newer for deletion
            duplicates.push(court);
        } else {
            seen.set(key, court);
        }
    }

    console.log(`Found ${duplicates.length} duplicate courts:`);
    duplicates.forEach(d => {
        console.log(`  - ${d.id}: ${d.name} (${d.city}) - ${d.created_at}`);
    });

    if (duplicates.length > 0) {
        console.log('\nDeleting duplicates...');

        for (const dup of duplicates) {
            const { error: deleteError } = await supabase
                .from('courts')
                .delete()
                .eq('id', dup.id);

            if (deleteError) {
                console.error(`Error deleting ${dup.id}:`, deleteError);
            } else {
                console.log(`Deleted: ${dup.id} (${dup.name})`);
            }
        }

        console.log('\nDone! Duplicates removed.');
    } else {
        console.log('No duplicates found.');
    }
}

cleanupDuplicates();
