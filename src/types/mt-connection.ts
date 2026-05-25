// ─── MT Connection ────────────────────────────────────────────────────────────

export type MTPlatform = 'mt4' | 'mt5'

export type MTConnectionStatus =
  | 'pending'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error'

export interface MTConnection {
  id: string
  user_id: string
  platform: MTPlatform
  broker_server: string
  account_number: string
  metaapi_account_id: string | null
  status: MTConnectionStatus
  sync_error: string | null
  last_sync_at: string | null
  created_at: string
  updated_at: string
}

// ─── MetaApi raw responses ────────────────────────────────────────────────────

export interface MetaApiAccountInfo {
  platform: string         // 'mt4' | 'mt5'
  broker: string
  currency: string
  server: string
  balance: number
  equity: number
  margin: number
  freeMargin: number
  leverage: number
  marginLevel?: number
  profit?: number
  name?: string
  login?: number
  type?: string            // 'ACCOUNT_TRADE_MODE_DEMO' | 'ACCOUNT_TRADE_MODE_REAL'
}

export interface MetaApiPosition {
  id: string               // position ticket as string
  type: string             // 'POSITION_TYPE_BUY' | 'POSITION_TYPE_SELL'
  symbol: string
  magic: number
  time: string             // ISO open time
  openPrice: number
  currentPrice: number
  currentTickValue: number
  stopLoss?: number
  takeProfit?: number
  volume: number
  swap: number
  commission?: number
  profit: number
  comment?: string
  clientId?: string
  platform: string
  updateTime?: string
}

export interface MetaApiDeal {
  id: string               // deal ticket
  type: string             // 'DEAL_TYPE_BUY' | 'DEAL_TYPE_SELL' | 'DEAL_TYPE_BALANCE' …
  entryType: string        // 'DEAL_ENTRY_IN' | 'DEAL_ENTRY_OUT' | 'DEAL_ENTRY_INOUT'
  symbol?: string
  magic?: number
  time: string             // close time ISO
  volume?: number
  price?: number
  commission?: number
  swap?: number
  profit?: number
  comment?: string
  platform: string
  positionId?: string
}

export interface MetaApiProvisioningAccount {
  id: string
  state: string            // 'DEPLOYING' | 'DEPLOYED' | 'UNDEPLOYING' | 'UNDEPLOYED' | 'DELETING'
  connectionStatus: string // 'CONNECTED' | 'DISCONNECTED' | 'DISCONNECTED_FROM_BROKER'
  login?: string
  name?: string
  server?: string
  platform?: string
}

// ─── Our DB representations ───────────────────────────────────────────────────

export interface MTAccountStats {
  id: string
  connection_id: string
  user_id: string
  balance: number | null
  equity: number | null
  margin: number | null
  free_margin: number | null
  margin_level: number | null
  profit: number | null
  currency: string | null
  leverage: number | null
  snapshot_at: string
}

export interface MTOpenPosition {
  id: string
  connection_id: string
  user_id: string
  position_id: string
  symbol: string
  platform: MTPlatform
  order_type: 'buy' | 'sell'
  volume: number
  open_price: number | null
  current_price: number | null
  stop_loss: number | null
  take_profit: number | null
  profit: number | null
  swap: number | null
  commission: number | null
  magic_number: number | null
  comment: string | null
  open_time: string | null
  last_updated: string
}

export interface MTClosedTrade {
  id: string
  connection_id: string
  user_id: string
  deal_id: string
  position_id: string | null
  symbol: string
  platform: MTPlatform
  order_type: 'buy' | 'sell'
  volume: number | null
  open_price: number | null
  close_price: number | null
  stop_loss: number | null
  take_profit: number | null
  profit: number | null
  swap: number | null
  commission: number | null
  magic_number: number | null
  comment: string | null
  open_time: string | null
  close_time: string | null
  duration_seconds: number | null
  synced_at: string
}

// ─── API request / response shapes ───────────────────────────────────────────

export interface ConnectMTRequest {
  platform: MTPlatform
  brokerServer: string
  accountNumber: string
  investorPassword: string
}

export interface SyncResult {
  connectionId: string
  accountStats: Partial<MTAccountStats>
  openPositions: number    // count upserted
  closedTrades: number     // count inserted
  syncedAt: string
}
