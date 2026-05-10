const pg = require('pg');

const client = new pg.Client({
  host: 'lujlbjhnwtkjkatgpvzl.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'VT2QpQWwqULfORkY',
  connectionTimeoutMillis: 10000,
  statement_timeout: 10000
});

async function setup() {
  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('✓ Connected!\n');

    const queries = [
      `CREATE TABLE IF NOT EXISTS public.trader_profiles (
        id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        profile_type text NOT NULL CHECK (profile_type IN ('sniper', 'analyst', 'warrior', 'disciplinarian', 'opportunist')),
        risk_personality_score integer DEFAULT 75,
        emotional_stability_score integer DEFAULT 78,
        decision_making_score integer DEFAULT 76,
        trading_behavior_score integer DEFAULT 80,
        learning_style_score integer DEFAULT 77,
        learning_path text DEFAULT 'beginner',
        dashboard_layout jsonb,
        alert_thresholds jsonb,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS idx_trader_profiles_profile_type ON public.trader_profiles(profile_type)`,
      `ALTER TABLE public.trader_profiles ENABLE ROW LEVEL SECURITY`,
      `CREATE POLICY IF NOT EXISTS "Users can read their own profile" ON public.trader_profiles FOR SELECT USING (auth.uid() = id)`,
      `CREATE POLICY IF NOT EXISTS "Service role can manage all profiles" ON public.trader_profiles USING (true) WITH CHECK (true)`,
      `GRANT SELECT, INSERT, UPDATE, DELETE ON public.trader_profiles TO authenticated`,
      `GRANT SELECT, INSERT, UPDATE, DELETE ON public.trader_profiles TO service_role`
    ];

    for (let i = 0; i < queries.length; i++) {
      try {
        await client.query(queries[i]);
        console.log(`✓ Query ${i + 1}/${queries.length} executed`);
      } catch (err) {
        console.log(`⚠ Query ${i + 1} skipped:`, err.message.split('\n')[0]);
      }
    }

    // Verify
    const result = await client.query(
      `SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='trader_profiles')`
    );

    if (result.rows[0].exists) {
      console.log('\n✓✓✓ SUCCESS! trader_profiles table created!');
    } else {
      console.log('\n⚠ Table creation may have failed');
    }
  } catch (err) {
    console.error('\n✗ Error:', err.message);
  } finally {
    await client.end();
  }
}

setup();
