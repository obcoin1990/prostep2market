/**
 * Admin auth utility
 * Checks if the current request is from a super_admin.
 * Supports two methods (both checked):
 *   1. DB role: trader_profiles.admin_role = 'super_admin'
 *   2. Email whitelist: ADMIN_EMAILS env var (fallback / bootstrap)
 */

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'

export interface AdminContext {
  user: User
  isAdmin: true
}

/**
 * Use in API routes. Returns AdminContext or a 401/403 NextResponse.
 *
 * @example
 * const result = await getAdminContext()
 * if (result instanceof NextResponse) return result
 * const { user } = result
 */
export async function getAdminContext(): Promise<AdminContext | NextResponse> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isAdmin = await checkIsAdmin(user)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 })
  }

  return { user, isAdmin: true }
}

/**
 * Use in Server Components. Returns the user if admin, or null.
 */
export async function getAdminUser(): Promise<User | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const isAdmin = await checkIsAdmin(user)
    return isAdmin ? user : null
  } catch {
    return null
  }
}

/**
 * Core admin check — tries DB role first, falls back to email whitelist.
 */
async function checkIsAdmin(user: User): Promise<boolean> {
  // Method 1: DB role (preferred)
  try {
    const adminClient = createAdminClient()
    const { data } = await adminClient
      .from('trader_profiles')
      .select('admin_role')
      .eq('id', user.id)
      .single()

    if (data?.admin_role === 'super_admin') return true
  } catch {
    // profile may not exist yet — fall through to email whitelist
  }

  // Method 2: Email whitelist (bootstrap / fallback)
  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)

  return adminEmails.length > 0 && adminEmails.includes(user.email ?? '')
}

/**
 * Fetches a setting value from admin_settings table.
 * Returns the parsed JSONB value or the provided default.
 */
export async function getAdminSetting<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const adminClient = createAdminClient()
    const { data } = await adminClient
      .from('admin_settings')
      .select('value')
      .eq('key', key)
      .single()

    return (data?.value ?? defaultValue) as T
  } catch {
    return defaultValue
  }
}

/**
 * Upserts a setting value in admin_settings table.
 */
export async function setAdminSetting(key: string, value: unknown, userId: string): Promise<void> {
  const adminClient = createAdminClient()
  await adminClient
    .from('admin_settings')
    .upsert({ key, value, updated_at: new Date().toISOString(), updated_by: userId })
    .eq('key', key)
}
