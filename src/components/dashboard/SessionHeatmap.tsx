'use client';

import { useState } from 'react';
import type { HeatmapCell } from '@/types/analysis';

interface SessionHeatmapProps {
  data: HeatmapCell[];
}

const SESSIONS = ['asian', 'london', 'newyork', 'sydney'] as const;
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function SessionHeatmap({ data }: SessionHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    day: string;
    session: string;
    info: string;
  } | null>(null);

  const grid = DAYS.map((day, dayIndex) =>
    SESSIONS.map((session) => {
      const cell = data.find(
        (c) => c.dayOfWeek === dayIndex && c.session === session
      );
      return { day, session, ...cell };
    })
  );

  const getCellColor = (pnl: number | undefined) => {
    if (pnl === undefined || pnl === 0) return '#2b3139';
    const maxPnL = Math.max(...data.map((c) => Math.abs(c.totalPnl)), 1000);
    const intensity = Math.min(Math.abs(pnl) / maxPnL, 1);
    if (pnl < 0) return `rgba(246,70,93,${0.2 + intensity * 0.6})`;
    return `rgba(14,203,129,${0.2 + intensity * 0.6})`;
  };

  const formatPnL = (pnl: number | undefined) => {
    if (pnl === undefined) return '-';
    return `$${pnl >= 0 ? '+' : ''}${pnl.toFixed(0)}`;
  };

  return (
    <div className="rounded-[12px] p-6" style={{ backgroundColor: '#1e2329', border: '1px solid #2b3139' }}>
      <h3 className="text-base font-semibold mb-4" style={{ color: '#ffffff' }}>Session Analytics</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2 w-12 text-xs font-medium" style={{ color: '#707a8a' }}></th>
              {SESSIONS.map((s) => (
                <th key={s} className="text-center p-2 min-w-[80px] text-xs font-medium capitalize" style={{ color: '#eaecef' }}>
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, i) => (
              <tr key={i}>
                <td className="text-sm font-medium p-2" style={{ color: '#707a8a' }}>{row[0].day}</td>
                {row.map((cell, j) => (
                  <td key={j} className="p-1">
                    <div
                      className="rounded-[6px] p-3 text-center cursor-pointer hover:opacity-80 transition-opacity min-h-[60px] flex items-center justify-center"
                      style={{ backgroundColor: getCellColor(cell.totalPnl) }}
                      onMouseEnter={() => setHoveredCell({
                        day: cell.day,
                        session: cell.session,
                        info: cell.totalTrades
                          ? `${cell.session}: ${cell.totalTrades} trades, P&L: ${formatPnL(cell.totalPnl)}, WR: ${(cell.winRate ?? 0).toFixed(0)}%`
                          : 'No data',
                      })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {(cell.totalTrades !== undefined && cell.totalTrades > 0) ? (
                        <div className="text-xs">
                          <div className="font-medium" style={{ color: '#eaecef' }}>{cell.totalTrades}</div>
                          <div style={{ color: (cell.totalPnl ?? 0) >= 0 ? '#0ecb81' : '#f6465d' }}>
                            {formatPnL(cell.totalPnl)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs" style={{ color: '#707a8a' }}>-</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hoveredCell && (
        <div className="mt-3 p-2 rounded-[6px] text-xs" style={{ backgroundColor: '#2b3139', color: '#eaecef' }}>
          {hoveredCell.info}
        </div>
      )}

      <div className="flex items-center justify-center mt-4 gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(246,70,93,0.4)' }}></div>
          <span className="text-xs" style={{ color: '#707a8a' }}>Loss</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2b3139' }}></div>
          <span className="text-xs" style={{ color: '#707a8a' }}>Breakeven</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(14,203,129,0.4)' }}></div>
          <span className="text-xs" style={{ color: '#707a8a' }}>Profit</span>
        </div>
      </div>
    </div>
  );
}
