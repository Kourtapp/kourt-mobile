const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rsqvterlzpopwnsducmx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDU1MTksImV4cCI6MjA4MDI4MTUxOX0.Rgt0Nv7AQNmmuZviejCgdZd86xI9D6iMPDOJcARuMjE';

const supabase = createClient(supabaseUrl, supabaseKey);

// IDs dos duplicados (manter os mais antigos de cada grupo)
const idsToDelete = [
    'ef9d8a0c-c3c8-443e-bf12-d789ab7c0ca5', // Quadra teste (mais novo)
    '46d96db9-cf46-41be-8e78-2ee8f22171c8', // Teste (mais novo)
];

async function forceDelete() {
    console.log('Deletando duplicados específicos...\n');

    for (const id of idsToDelete) {
        console.log(`Tentando deletar: ${id}`);

        const { data, error, count } = await supabase
            .from('courts')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.log(`  Erro: ${error.message}`);
        } else {
            console.log(`  Resultado: ${data?.length || 0} rows deleted`);
        }
    }

    // Listar o que sobrou
    console.log('\n--- Quadras restantes ---');
    const { data: courts } = await supabase
        .from('courts')
        .select('id, name, city')
        .order('created_at');

    courts?.forEach(c => console.log(`${c.name} (${c.city}) - ${c.id}`));
}

forceDelete();
