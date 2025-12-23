const { createClient } = require('@supabase/supabase-js');

// Direct connection using anon key from eas.json
const supabase = createClient(
  'https://rsqvterlzpopwnsducmx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXZ0ZXJsenBvcHduc2R1Y214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDU1MTksImV4cCI6MjA4MDI4MTUxOX0.Rgt0Nv7AQNmmuZviejCgdZd86xI9D6iMPDOJcARuMjE'
);

async function checkConstraint() {
  try {
    // Get all columns from existing matches
    const { data: matches, error: matchError } = await supabase
      .from('matches')
      .select('id, status, type, sport')
      .limit(10);

    if (matchError) {
      console.log('Error fetching matches:', matchError);
    } else {
      console.log('Existing matches:');
      matches.forEach(m => console.log(` - ${m.id}: status="${m.status}", type="${m.type}", sport="${m.sport}"`));
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

checkConstraint();
