'use client';

import Link from 'next/link';
import { FlaskConical, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Strategy } from '@/hooks/useWatchlist';

interface WatchlistWidgetProps {
  strategies: Strategy[];
  isLoading: boolean;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function WatchlistWidget({ strategies, isLoading }: WatchlistWidgetProps) {
  return (
    <Card style={{ backgroundColor: '#1e2329', border: '1px solid #2b3139' }}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4" style={{ color: '#fcd535' }} />
          <CardTitle className="text-sm font-semibold" style={{ color: '#eaecef' }}>
            My Strategies
          </CardTitle>
          {!isLoading && strategies.length > 0 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(252,213,53,0.15)', color: '#fcd535' }}
            >
              {strategies.length}
            </span>
          )}
        </div>
        <Link
          href="/strategy-lab"
          className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: '#fcd535' }}
        >
          Strategy Lab <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="pt-1">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-12 w-full rounded" style={{ backgroundColor: '#2b3139' }} />
            ))}
          </div>
        ) : strategies.length === 0 ? (
          <div className="py-6 text-center">
            <FlaskConical className="w-8 h-8 mx-auto mb-2" style={{ color: '#2b3139' }} />
            <p className="text-xs" style={{ color: '#9ea3ad' }}>No strategies saved yet.</p>
            <Link
              href="/strategy-lab/builder"
              className="text-xs font-medium mt-1 inline-block transition-opacity hover:opacity-70"
              style={{ color: '#fcd535' }}
            >
              Build your first strategy
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {strategies.slice(0, 5).map((strategy) => (
              <Link
                key={strategy.id}
                href={`/strategy-lab/builder/${strategy.id}`}
                className="flex items-center gap-3 p-2.5 rounded-lg group transition-colors"
                style={{ border: '1px solid #2b3139' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(252,213,53,0.3)';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(252,213,53,0.04)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#2b3139';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                {/* Icon */}
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(252,213,53,0.1)' }}
                >
                  <FlaskConical className="w-3.5 h-3.5" style={{ color: '#fcd535' }} />
                </div>

                {/* Name + desc */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold truncate transition-colors"
                    style={{ color: '#eaecef' }}
                  >
                    {strategy.name}
                  </p>
                  {strategy.description && (
                    <p className="text-[10px] truncate" style={{ color: '#9ea3ad' }}>
                      {strategy.description}
                    </p>
                  )}
                </div>

                {/* Time ago */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Clock className="w-3 h-3" style={{ color: '#9ea3ad' }} />
                  <span className="text-[10px]" style={{ color: '#9ea3ad' }}>
                    {timeAgo(strategy.created_at)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
