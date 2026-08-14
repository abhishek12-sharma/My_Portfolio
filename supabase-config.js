/* ============================================================
   supabase-config.js
   ─────────────────────────────────────────────────────────────
   HOW TO GET YOUR CREDENTIALS (one-time setup, ~3 minutes):
   1. Go to https://supabase.com → Sign Up (free)
   2. Click "New Project" → give it a name like "my-portfolio"
   3. After project loads → Settings → API
   4. Copy:
        • Project URL   → paste below as SUPABASE_URL
        • anon / public key → paste below as SUPABASE_ANON_KEY
   5. Go to SQL Editor in Supabase → run this SQL:

      CREATE TABLE IF NOT EXISTS portfolio_config (
        id   integer PRIMARY KEY DEFAULT 1,
        data jsonb   NOT NULL DEFAULT '{}'::jsonb,
        updated_at timestamptz DEFAULT now()
      );
      INSERT INTO portfolio_config (id, data)
      VALUES (1, '{}'::jsonb)
      ON CONFLICT (id) DO NOTHING;

   6. Go to Authentication → Policies → Enable Row Level Security OFF
      (or add a policy to allow public read and authenticated write)
      For simplest setup: disable RLS on the table:
      ALTER TABLE portfolio_config DISABLE ROW LEVEL SECURITY;

   ============================================================ */

const SUPABASE_URL      = 'YOUR_SUPABASE_URL';       // e.g. 'https://abcxyz.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';  // e.g. 'eyJhbGciOiJIUzI1NiIsI...'
