const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rsqvterlzpopwnsducmx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDU1MTksImV4cCI6MjA4MDI4MTUxOX0.Rgt0Nv7AQNmmuZviejCgdZd86xI9D6iMPDOJcARuMjE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listCourts() {
    const { data: courts, error } = await supabase
        .from('courts')
        .select('id, name, address, city, type, is_active, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Total courts: ${courts.length}\n`);
    courts.forEach((c, i) => {
        console.log(`${i + 1}. ${c.name}`);
        console.log(`   ID: ${c.id}`);
        console.log(`   City: ${c.city} | Type: ${c.type} | Active: ${c.is_active}`);
        console.log(`   Created: ${c.created_at}\n`);
    });
}

listCourts();
