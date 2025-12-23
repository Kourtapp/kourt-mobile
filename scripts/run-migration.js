const { Pool } = require('pg');

// Use the direct connection string for Supabase (Session Mode on port 5432)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.rsqvterlzpopwnsducmx:Kourt2024App!Secure@aws-0-us-east-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('Adding latitude and longitude columns to profiles...');

    await client.query(`
      ALTER TABLE public.profiles
      ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
      ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
    `);

    console.log('Columns added successfully!');

    // Verify
    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'profiles'
      AND column_name IN ('latitude', 'longitude');
    `);

    console.log('Verification:', result.rows);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
