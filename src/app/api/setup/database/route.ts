import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/setup/database
 * Initialize database tables (one-time setup)
 * Requires authenticated admin user
 */
export async function POST(request: NextRequest) {
  // Auth guard - only authenticated admins may call this
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminEmails: string[] = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean)
  if (!adminEmails.includes(user.email ?? '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const adminSupabase = createAdminClient()

    // Try to insert a test row - if table doesn't exist, this will fail with table not found
    const { error: checkError } = await adminSupabase
      .from('trader_profiles')
      .select('count')
      .limit(1)

    if (!checkError) {
      return NextResponse.json(
        { message: 'trader_profiles table already exists' },
        { status: 200 }
      )
    }

    // Table doesn't exist - need to create it
    // Since Supabase doesn't expose direct SQL execution via client,
    // we need to use the raw fetch API with the REST endpoint
    
    const sqlStatements = [
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
      
      `CREATE POLICY IF NOT EXISTS "Users can read their own profile"
        ON public.trader_profiles
        FOR SELECT
        USING (auth.uid() = id)`,
      
      `CREATE POLICY IF NOT EXISTS "Service role can manage all profiles"
        ON public.trader_profiles
        USING (true)
        WITH CHECK (true)`,
      
      `GRANT SELECT, INSERT, UPDATE, DELETE ON public.trader_profiles TO authenticated`,
      
      `GRANT SELECT, INSERT, UPDATE, DELETE ON public.trader_profiles TO service_role`
    ]

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      )
    }

    // Execute each SQL statement
    let successCount = 0
    for (const sql of sqlStatements) {
      try {
        // Try using the RPC endpoint (if exec_sql function exists)
        const response = await fetch(
          `${supabaseUrl}/rest/v1/rpc/exec_sql`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'Content-Type': 'application/json',
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            },
            body: JSON.stringify({ sql }),
          }
        )

        if (response.ok || response.status === 204) {
          successCount++
        }
      } catch (err) {
        console.error('SQL execution error:', err)
      }
    }

    if (successCount > 0) {
      return NextResponse.json(
        { 
          success: true, 
          message: `Database setup complete (${successCount}/${sqlStatements.length} statements executed)`
        },
        { status: 201 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Could not create tables - manual setup required',
        hint: 'Create the trader_profiles table manually in Supabase SQL Editor'
      },
      { status: 400 }
    )

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: `Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
