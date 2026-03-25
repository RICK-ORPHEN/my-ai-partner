/**
 * Supabase Client Configuration
 * Initializes Supabase client with service role key
 */

const { createClient } = require('@supabase/supabase-js');

// Validate environment variables
if (!process.env.SUPABASE_URL) {
  throw new Error('Missing required environment variable: SUPABASE_URL');
}

if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing required environment variable: SUPABASE_SERVICE_KEY');
}

// Initialize Supabase client with service role key
// This allows us to bypass RLS for admin operations when needed
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Verify connection on startup
async function verifyConnection() {
  try {
    const { data, error } = await supabase
      .from('industries')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      return false;
    }

    console.log('✅ Supabase connection verified');
    return true;
  } catch (error) {
    console.error('❌ Failed to verify Supabase connection:', error.message);
    return false;
  }
}

// Test connection on module load
if (process.env.NODE_ENV !== 'test') {
  verifyConnection().catch(console.error);
}

module.exports = {
  supabase,
  verifyConnection,
};
