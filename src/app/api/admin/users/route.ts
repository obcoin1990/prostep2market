import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/admin/users
 * Create a new user with trader profile
 * Requires admin authentication
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized: Must be logged in' },
        { status: 401 }
      )
    }

    // Check if user is admin (you can add role check here)
    const { data: userData } = await supabase
      .from('trader_profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    // For now, allow the first user to be admin, or check email whitelist
    const adminEmails = ['ob6013@gmail.com'] // Add your admin emails here
    if (!adminEmails.includes(authUser.email || '')) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can create users' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { email, password, profile_type, full_name } = body

    // Validate required fields
    if (!email || !password || !profile_type) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, profile_type' },
        { status: 400 }
      )
    }

    // Create auth user via Admin API
    const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: full_name || email.split('@')[0],
      },
    })

    if (authError) {
      return NextResponse.json(
        { error: `Auth error: ${authError.message}` },
        { status: 400 }
      )
    }

    // Create trader profile
    const profileData = {
      id: newUser.user.id,
      profile_type,
      risk_personality_score: 75,
      emotional_stability_score: 78,
      decision_making_score: 76,
      trading_behavior_score: 80,
      learning_style_score: 77,
      learning_path: 'beginner',
      dashboard_layout: {
        widgets: ['edgeScore', 'alerts', 'quickActions', 'tradeStats', 'insights'],
      },
      alert_thresholds: {
        risk: 2.0,
        consistency: 1.5,
        emotion: 3.0,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: profile, error: profileError } = await supabase
      .from('trader_profiles')
      .insert([profileData])
      .select()

    if (profileError) {
      // Delete the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(newUser.user.id)
      return NextResponse.json(
        { error: `Profile error: ${profileError.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.user.id,
          email: newUser.user.email,
          profile_type,
          created_at: newUser.user.created_at,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/users
 * List all users (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check admin permission
    const adminEmails = ['ob6013@gmail.com']
    if (!adminEmails.includes(authUser.email || '')) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can view users' },
        { status: 403 }
      )
    }

    // Fetch all trader profiles
    const { data: profiles, error } = await supabase
      .from('trader_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      users: profiles || [],
      total: profiles?.length || 0,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
