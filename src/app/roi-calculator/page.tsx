'use client'

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Calculator, TrendingUp, DollarSign, BarChart3, ArrowUp, ArrowDown } from "lucide-react"

export default function RoiCalculatorPage() {
  const [tradesPerMonth, setTradesPerMonth] = useState(50)
  const [avgTradeSize, setAvgTradeSize] = useState(500)
  const [winRate, setWinRate] = useState(45)
  const [avgWin, setAvgWin] = useState(8)
  const [avgLoss, setAvgLoss] = useState(5)
  const [improvement, setImprovement] = useState(15)

  const currentWinCount = tradesPerMonth * (winRate / 100)
  const currentLossCount = tradesPerMonth - currentWinCount
  const currentProfit = (currentWinCount * avgTradeSize * (avgWin / 100)) - (currentLossCount * avgTradeSize * (avgLoss / 100))

  const improvedWinRate = Math.min(winRate + (improvement / 100) * (100 - winRate), 100)
  const improvedWinCount = tradesPerMonth * (improvedWinRate / 100)
  const improvedLossCount = tradesPerMonth - improvedWinCount
  const improvedProfit = (improvedWinCount * avgTradeSize * (avgWin / 100)) - (improvedLossCount * avgTradeSize * (avgLoss / 100))

  const monthlyGain = improvedProfit - currentProfit
  const yearlyGain = monthlyGain * 12

  return (
    <div className="min-h-screen bg-[#0b0e11] text-[#eaecef]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2b3139] bg-[#1e2329] px-4 py-1.5 text-xs font-medium text-[#848e9c]">
            <Calculator className="h-3.5 w-3.5 text-[#fcd535]" />
            Interactive Tool
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tighter text-white md:text-5xl">
            ROI <span className="text-[#fcd535]">Calculator</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[#848e9c]">
            See how improving your trading consistency with ProStep2Market impacts your bottom line.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Inputs */}
          <div className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">Your Trading Profile</h2>
            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[#848e9c]">Trades per month</span>
                  <span className="font-medium text-white">{tradesPerMonth}</span>
                </div>
                <input type="range" min="5" max="200" value={tradesPerMonth} onChange={e => setTradesPerMonth(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: '#2b3139', accentColor: '#fcd535' }} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[#848e9c]">Avg trade size ($)</span>
                  <span className="font-medium text-white">${avgTradeSize}</span>
                </div>
                <input type="range" min="50" max="10000" step="50" value={avgTradeSize} onChange={e => setAvgTradeSize(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: '#2b3139', accentColor: '#fcd535' }} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[#848e9c]">Current win rate (%)</span>
                  <span className="font-medium text-white">{winRate}%</span>
                </div>
                <input type="range" min="10" max="90" value={winRate} onChange={e => setWinRate(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: '#2b3139', accentColor: '#fcd535' }} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[#848e9c]">Avg win (%)</span>
                  <span className="font-medium text-white">{avgWin}%</span>
                </div>
                <input type="range" min="1" max="20" step="0.5" value={avgWin} onChange={e => setAvgWin(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: '#2b3139', accentColor: '#fcd535' }} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[#848e9c]">Avg loss (%)</span>
                  <span className="font-medium text-white">{avgLoss}%</span>
                </div>
                <input type="range" min="1" max="20" step="0.5" value={avgLoss} onChange={e => setAvgLoss(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: '#2b3139', accentColor: '#fcd535' }} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[#848e9c]">Consistency improvement (%)</span>
                  <span className="font-medium text-[#fcd535]">{improvement}%</span>
                </div>
                <input type="range" min="5" max="60" step="1" value={improvement} onChange={e => setImprovement(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: '#2b3139', accentColor: '#fcd535' }} />
                <p className="mt-1 text-xs text-[#848e9c]">Adjust expected improvement to estimate potential gains</p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">Your Projected Results</h2>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-[10px] border border-[#2b3139] bg-[#0b0e11] p-4">
                <div className="text-xs text-[#848e9c]">Current Monthly P&L</div>
                <div className={`mt-1 text-xl font-bold ${currentProfit >= 0 ? 'text-[#10b981]' : 'text-[#f6465d]'}`}>
                  {currentProfit >= 0 ? '+' : ''}${Math.round(currentProfit).toLocaleString()}
                </div>
              </div>
              <div className="rounded-[10px] border border-[#2b3139] bg-[#0b0e11] p-4">
                <div className="text-xs text-[#848e9c]">Projected Monthly P&L</div>
                <div className={`mt-1 text-xl font-bold ${improvedProfit >= 0 ? 'text-[#10b981]' : 'text-[#f6465d]'}`}>
                  {improvedProfit >= 0 ? '+' : ''}${Math.round(improvedProfit).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-[10px] border border-[#2b3139] bg-[#0b0e11] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#848e9c]">Monthly Gain</div>
                  <div className="mt-1 text-2xl font-bold text-[#fcd535]">+${Math.round(monthlyGain).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#848e9c]">Yearly Gain</div>
                  <div className="mt-1 text-2xl font-bold text-[#fcd535]">+${Math.round(yearlyGain).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#848e9c]">Current win rate</span>
                <span className="font-medium text-white">{winRate}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#848e9c]">Projected win rate</span>
                <span className="font-medium text-[#fcd535]">{Math.round(improvedWinRate)}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#848e9c]">Wins per month</span>
                <span className="font-medium text-white">{Math.round(currentWinCount)} → {Math.round(improvedWinCount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#848e9c]">Losses per month</span>
                <span className="font-medium text-white">{Math.round(currentLossCount)} → {Math.round(improvedLossCount)}</span>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/signup" className="flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#fcd535] px-4 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
                Start Your Free Trial <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
