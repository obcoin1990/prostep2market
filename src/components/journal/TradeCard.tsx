'use client'

import { useState } from 'react'
import { format } from 'date-fns'

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

interface TradeCardProps {
  trade: Trade
}

const SESSION_LABELS: Record<string, string> = {
  asian: 'Asian',
  london: 'London',
  newyork: 'New York',
  sydney: 'Sydney',
}

const EMOTION_LABELS: Record<string, string> = {
  calm: 'Calm',
  excited: 'Excited',
  frustrated: 'Frustrated',
  fearful: 'Fearful',
  greedy: 'Greedy',
}

const RESULT_COLORS: Record<string, string> = {
  win: '#2E7D32',
  loss: '#E53935',
  breakeven: '#0B0B0B',
}

export function TradeCard({ trade }: TradeCardProps) {
  const [expanded, setExpanded] = useState(false)
  
  const pnlColor = trade.result ? RESULT_COLORS[trade.result] : '#0B0B0B'
  const pnlLabel = trade.result 
    ? trade.result.charAt(0).toUpperCase() + trade.result.slice(1)
    : 'Open'

  return (
    <div 
      className="border border-gray-200 rounded-lg overflow-hidden bg-white cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header - Always Visible */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{trade.symbol}</h3>
            {trade.session && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                {SESSION_LABELS[trade.session] || trade.session}
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            {format(new Date(trade.entryTime), 'PPp')}
          </p>
        </div>
        
        <div className="text-right">
          <p 
            className="font-bold text-lg"
            style={{ color: pnlColor }}
          >
            {trade.pnl !== null 
              ? `$${trade.pnl.toFixed(2)}`
              : pnlLabel
            }
          </p>
          <p className="text-gray-500 text-sm">
            {trade.lotSize} lots
          </p>
        </div>
      </div>

      {/* Quick Info Row */}
      <div className="px-4 pb-2 flex gap-4 text-sm text-gray-600">
        <span>Entry: {trade.entryPrice.toFixed(5)}</span>
        {trade.exitPrice && (
          <span>Exit: {trade.exitPrice.toFixed(5)}</span>
        )}
        <span>SL: {trade.stopLoss.toFixed(5)}</span>
        <span>TP: {trade.takeProfit.toFixed(5)}</span>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
          {/* Emotional State */}
          {(trade.emotionalState || trade.confidenceScore || trade.stressScore) && (
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-1">Emotional State</h4>
              <div className="flex gap-4 text-sm">
                {trade.emotionalState && (
                  <span className="px-2 py-1 bg-gray-200 rounded">
                    {EMOTION_LABELS[trade.emotionalState] || trade.emotionalState}
                  </span>
                )}
                {trade.confidenceScore && (
                  <span>Confidence: {trade.confidenceScore}/5</span>
                )}
                {trade.stressScore && (
                  <span>Stress: {trade.stressScore}/5</span>
                )}
              </div>
            </div>
          )}

          {/* Triggers */}
          {trade.triggers && trade.triggers.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-1">Triggers</h4>
              <div className="flex flex-wrap gap-1">
                {trade.triggers.map((trigger, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                    {trigger}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pre-Trade Plan Adherence */}
          {trade.preTradePlanAdherence && (
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-1">Pre-Trade Plan Adherence</h4>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(n => (
                    <div 
                      key={n}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                        n <= trade.preTradePlanAdherence! 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {n}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {trade.preTradePlanAdherence}/5
                </span>
              </div>
            </div>
          )}

          {/* Screenshot */}
          {trade.screenshotUrl && (
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-1">Screenshot</h4>
              <a 
                href={trade.screenshotUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-32 h-20 overflow-hidden rounded border"
              >
                <img 
                  src={trade.screenshotUrl} 
                  alt="Trade screenshot"
                  className="w-full h-full object-cover"
                />
              </a>
            </div>
          )}

          {/* Notes */}
          {trade.notes && (
            <div>
              <h4 className="text-sm font-medium mb-1">Notes</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {trade.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
            <a 
              href={`/journal/${trade.id}`}
              className="text-sm text-red-500 hover:underline"
            >
              View Details
            </a>
            <a 
              href={`/journal/${trade.id}/edit`}
              className="text-sm text-gray-600 hover:underline"
            >
              Edit
            </a>
          </div>
        </div>
      )}

      {/* Expand Indicator */}
      <div className="border-t border-gray-100 px-4 py-1 text-center text-gray-400 text-xs">
        {expanded ? 'Click to collapse' : 'Click to expand'}
      </div>
    </div>
  )
}