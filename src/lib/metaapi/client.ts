/**
 * Thin wrapper around MetaApi Cloud REST APIs.
 * Docs: https://metaapi.cloud/docs/client/
 *
 * Environment variable required:
 *   METAAPI_TOKEN  — your MetaApi API token (from metaapi.cloud dashboard)
 */

import type {
  MetaApiAccountInfo,
  MetaApiDeal,
  MetaApiPosition,
  MetaApiProvisioningAccount,
  MTPlatform,
} from '@/types/mt-connection'

const PROVISIONING_BASE = 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai'
const CLIENT_BASE        = 'https://mt-client-api-v1.agiliumtrade.agiliumtrade.ai'

function token(): string {
  const t = process.env.METAAPI_TOKEN
  if (!t) throw new Error('METAAPI_TOKEN environment variable is not set')
  return t
}

function authHeaders() {
  return {
    'auth-token': token(),
    'Content-Type': 'application/json',
  }
}

async function maFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { ...authHeaders(), ...(init?.headers ?? {}) } })
  if (!res.ok) {
    let detail = ''
    try { detail = await res.text() } catch { /* ignore */ }
    throw new Error(`MetaApi ${init?.method ?? 'GET'} ${url} → ${res.status}: ${detail}`)
  }
  // 204 No Content
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

// ─── Provisioning API ─────────────────────────────────────────────────────────

/**
 * Create (provision) a new MetaApi cloud terminal for the given MT account.
 * Uses investor (read-only) password so the terminal can never place/modify orders.
 */
export async function provisionAccount(opts: {
  platform: MTPlatform
  server: string
  login: string
  password: string   // investor password
  name?: string
}): Promise<MetaApiProvisioningAccount> {
  return maFetch(`${PROVISIONING_BASE}/users/current/accounts`, {
    method: 'POST',
    body: JSON.stringify({
      login: opts.login,
      password: opts.password,
      name: opts.name ?? `ProStep-${opts.login}`,
      server: opts.server,
      platform: opts.platform,
      type: 'cloud',
      // quoteStreamingIntervalInSeconds controls how fast positions update
      quoteStreamingIntervalInSeconds: 2,
    }),
  })
}

/** Get provisioning status of an account (DEPLOYED / DEPLOYING / etc.). */
export async function getProvisioningAccount(metaapiAccountId: string): Promise<MetaApiProvisioningAccount> {
  return maFetch(`${PROVISIONING_BASE}/users/current/accounts/${metaapiAccountId}`)
}

/** Undeploy (soft-disconnect) a MetaApi terminal. */
export async function undeployAccount(metaapiAccountId: string): Promise<void> {
  return maFetch(`${PROVISIONING_BASE}/users/current/accounts/${metaapiAccountId}/undeploy`, {
    method: 'POST',
  })
}

/** Permanently delete a MetaApi terminal. */
export async function deleteProvisioningAccount(metaapiAccountId: string): Promise<void> {
  return maFetch(`${PROVISIONING_BASE}/users/current/accounts/${metaapiAccountId}`, {
    method: 'DELETE',
  })
}

// ─── Client RPC API ───────────────────────────────────────────────────────────

/** Account information: balance, equity, margin, leverage … */
export async function getAccountInformation(metaapiAccountId: string): Promise<MetaApiAccountInfo> {
  return maFetch(`${CLIENT_BASE}/users/current/accounts/${metaapiAccountId}/account-information`)
}

/** Current open positions. */
export async function getPositions(metaapiAccountId: string): Promise<MetaApiPosition[]> {
  const data = await maFetch<MetaApiPosition[] | { positions: MetaApiPosition[] }>(
    `${CLIENT_BASE}/users/current/accounts/${metaapiAccountId}/positions`
  )
  // MetaApi may return an array or a wrapped object depending on version
  return Array.isArray(data) ? data : (data as { positions: MetaApiPosition[] }).positions ?? []
}

/**
 * History deals within a time range.
 * MetaApi returns ALL deal types (balance, credit, buy, sell …).
 * We filter to entry/exit trade deals in the sync layer.
 */
export async function getHistoryDeals(
  metaapiAccountId: string,
  fromDate: Date,
  toDate: Date = new Date()
): Promise<MetaApiDeal[]> {
  const from = fromDate.toISOString()
  const to   = toDate.toISOString()
  const data = await maFetch<MetaApiDeal[] | { deals: MetaApiDeal[] }>(
    `${CLIENT_BASE}/users/current/accounts/${metaapiAccountId}/history-deals/time/${from}/${to}`
  )
  return Array.isArray(data) ? data : (data as { deals: MetaApiDeal[] }).deals ?? []
}
