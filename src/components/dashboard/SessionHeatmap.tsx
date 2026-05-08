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

  // Build 7x4 grid
  const grid = DAYS.map((day, dayIndex) =>
    SESSIONS.map((session) => {
      const cell = data.find(
        (c) => c.dayOfWeek === dayIndex && c.session === session
      );
      return { day, session, ...cell };
    })
  );

  // Calculate color for cell based on PnL
  const getCellColor = (pnl: number | undefined) => {
    if (pnl === undefined || pnl === 0) return 'bg-gray-100';

    const maxPnL = Math.max(
      ...data.map((c) => Math.abs(c.totalPnl)),
      1000
    );
    const intensity = Math.min(Math.abs(pnl) / maxPnL, 1);

    if (pnl < 0) {
      // Red gradient for losses
      const opacity = 0.2 + intensity * 0.6;
      return `rgba(239, 68, 68, ${opacity})`;
    } else {
      // Green gradient for profits
      const opacity = 0.2 + intensity * 0.6;
      return `rgba(34, 197, 94, ${opacity})`;
    }
  };

  const formatPnL = (pnl: number | undefined) => {
    if (pnl === undefined) return '-';
    return `$${pnl >= 0 ? '+' : ''}${pnl.toFixed(0)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Analytics</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-sm font-medium text-gray-500 p-2 w-12"></th>
              {SESSIONS.map((s) => (
                <th
                  key={s}
                  className="text-center text-sm font-medium text-gray-700 p-2 min-w-[80px]"
                >
                  <span className="capitalize">{s}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, i) => (
              <tr key={i}>
                <td className="text-sm font-medium text-gray-600 p-2">
                  {row[0].day}
                </td>
                {row.map((cell, j) => (
                  <td key={j} className="p-1">
                    <div
                      className="rounded-md p-3 text-center cursor-pointer hover:opacity-80 transition-opacity min-h-[60px] flex items-center justify-center"
                      style={{
                        backgroundColor: getCellColor(cell.totalPnl),
                      }}
                      onMouseEnter={() =>
                        setHoveredCell({
                          day: cell.day,
                          session: cell.session,
                          info: cell.totalTrades
                            ? `${cell.session}: ${cell.totalTrades} trades, P&L: ${formatPnL(cell.totalPnl)}, WR: ${(cell.winRate ?? 0).toFixed(0)}%`
                            : 'No data',
                        })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {(cell.totalTrades !== undefined && cell.totalTrades > 0) ? (
                        <div className="text-xs">
                          <div className="font-medium text-gray-800">
                            {cell.totalTrades}
                          </div>
                          <div
                            className={
                              (cell.totalPnl ?? 0) >= 0
                                ? 'text-green-700'
                                : 'text-red-700'
                            }
                          >
                            {formatPnL(cell.totalPnl)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div className="mt-3 p-2 bg-gray-800 text-white text-xs rounded-lg">
          {hoveredCell.info}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center mt-4 gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-200"></div>
          <span className="text-xs text-gray-600">Loss</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200"></div>
          <span className="text-xs text-gray-600">Breakeven</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-200"></div>
          <span className="text-xs text-gray-600">Profit</span>
        </div>
      </div>
    </div>
  );
}
