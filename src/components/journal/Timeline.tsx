'use client'

import { useState, useEffect, useCallback } from 'react'
import { TradeCard } from './TradeCard'

interface Trade {
  id: string
  symbol: string
  entryPrice: number
  exitPrice: number | null
  stopLoss: number
  takeProfit: number
  lotSize: number
  entryTime: string
  exitTime: string | null
  session: string | null
  result: 'win' | 'loss' | 'breakeven' | null
  pnl: number | null
  screenshotUrl: string | null
  confidenceScore: number | null
  stressScore: number | null
  emotionalState: string | null
  triggers: string[] | null
  preTradePlanAdherence: number | null
  notes: string | null
}

interface TimelineProps {
  initialTrades?: Trade[]
  initialPage?: number
  initialTotal?: number
}

const SESSIONS = [
  { value: '', label: 'All Sessions' },
  { value: 'asian', label: 'Asian' },
  { value: 'london', label: 'London' },
  { value: 'newyork', label: 'New York' },
  { value: 'sydney', label: 'Sydney' },
]

const EMOTIONS = [
  { value: '', label: 'All Emotions' },
  { value: 'calm', label: 'Calm' },
  { value: 'excited', label: 'Excited' },
  { value: 'frustrated', label: 'Frustrated' },
  { value: 'fearful', label: 'Fearful' },
  { value: 'greedy', label: 'Greedy' },
]

const PAGE_SIZE = 20

export function Timeline({ initialTrades = [], initialPage = 1, initialTotal = 0 }: TimelineProps) {
  const [trades, setTrades] = useState<Trade[]>(initialTrades)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(initialPage)
  const [total, setTotal] = useState(initialTotal)
  const [filters, setFilters] = useState({
    symbol: '',
    session: '',
    emotion: '',
    dateFrom: '',
    dateTo: '',
    search: '',
  })

  // Build query string
  const buildQuery = useCallback((pageNum: number) => {
    const params = new URLSearchParams()
    params.set('page', pageNum.toString())
    params.set('limit', PAGE_SIZE.toString())
    
    if (filters.symbol) params.set('symbol', filters.symbol)
    if (filters.session) params.set('session', filters.session)
    if (filters.emotion) params.set('emotion', filters.emotion)
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.set('dateTo', filters.dateTo)
    if (filters.search) params.set('notes', filters.search)
    
    return `?${params.toString()}`
  }, [filters])

  // Fetch trades
  const fetchTrades = useCallback(async (pageNum: number) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/trades${buildQuery(pageNum)}`)
      const data = await response.json()
      
      if (response.ok) {
        setTrades(data.trades || [])
        setPage(data.pagination?.page || pageNum)
        setTotal(data.pagination?.total || 0)
      }
    } catch (err) {
      console.error('Failed to fetch trades:', err)
    } finally {
      setLoading(false)
    }
  }, [buildQuery])

  // Fetch on filter change
  useEffect(() => {
    fetchTrades(1)
  }, [filters.symbol, filters.session, filters.emotion, filters.dateFrom, filters.dateTo, filters.search])

  // Handle filter change
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1) // Reset to page 1
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchTrades(newPage)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const startTrade = (page - 1) * PAGE_SIZE + 1
  const endTrade = Math.min(page * PAGE_SIZE, total)

  return (
    <div>
      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Symbol Filter */}
          <div>
            <label className="block text-xs font-medium mb-1">Symbol</label>
            <select
              value={filters.symbol}
              onChange={(e) => handleFilterChange('symbol', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded"
            >
              <option value="">All Symbols</option>
              <option value="EURUSD">EUR/USD</option>
              <option value="GBPUSD">GBP/USD</option>
              <option value="USDJPY">USD/JPY</option>
              <option value="USDCHF">USD/CHF</option>
              <option value="AUDUSD">AUD/USD</option>
              <option value="USDCAD">USD/CAD</option>
            </select>
          </div>

          {/* Session Filter */}
          <div>
            <label className="block text-xs font-medium mb-1">Session</label>
            <select
              value={filters.session}
              onChange={(e) => handleFilterChange('session', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded"
            >
              {SESSIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Emotion Filter */}
          <div>
            <label className="block text-xs font-medium mb-1">Emotion</label>
            <select
              value={filters.emotion}
              onChange={(e) => handleFilterChange('emotion', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded"
            >
              {EMOTIONS.map(e => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-xs font-medium mb-1">From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-xs font-medium mb-1">To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search notes..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">
          {loading ? 'Loading...' : (
            total > 0 
              ? `Showing ${startTrade}-${endTrade} of ${total} trades`
              : 'No trades found'
          )}
        </p>
        <a 
          href="/journal/entry"
          className="py-2 px-4 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600"
        >
          + Log Trade
        </a>
      </div>

      {/* Trade List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : trades.length > 0 ? (
        <div className="space-y-4">
          {trades.map(trade => (
            <TradeCard key={trade.id} trade={trade} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <p className="text-gray-500 mb-4">No trades found</p>
          <a 
            href="/journal/entry"
            className="text-red-500 hover:underline"
          >
            Log your first trade
          </a>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || loading}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}