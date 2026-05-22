'use client';

import Link from 'next/link';
import { GraduationCap, ArrowRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Enrollment } from '@/hooks/useLearningProgress';

const STATUS_CONFIG: Record<
  Enrollment['status'],
  { label: string; color: string; Icon: React.ElementType }
> = {
  ACTIVE:    { label: 'In Progress', color: '#fcd535',  Icon: Clock         },
  COMPLETED: { label: 'Completed',   color: '#2E7D32',  Icon: CheckCircle2  },
  DROPPED:   { label: 'Dropped',     color: '#707a8a',  Icon: AlertTriangle },
  OVERDUE:   { label: 'Overdue',     color: '#f6465d',  Icon: AlertTriangle },
};

interface LearningProgressWidgetProps {
  enrollments: Enrollment[];
  isLoading: boolean;
}

export function LearningProgressWidget({ enrollments, isLoading }: LearningProgressWidgetProps) {
  return (
    <Card style={{ backgroundColor: '#1e2329', border: '1px solid #2b3139' }}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4" style={{ color: '#fcd535' }} />
          <CardTitle className="text-sm font-semibold" style={{ color: '#eaecef' }}>
            Learning Progress
          </CardTitle>
        </div>
        <Link
          href="/education"
          className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: '#fcd535' }}
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="pt-1">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="space-y-1.5">
                <Skeleton className="h-4 w-3/4" style={{ backgroundColor: '#2b3139' }} />
                <Skeleton className="h-2 w-full" style={{ backgroundColor: '#2b3139' }} />
              </div>
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="py-6 text-center">
            <GraduationCap className="w-8 h-8 mx-auto mb-2" style={{ color: '#2b3139' }} />
            <p className="text-xs" style={{ color: '#707a8a' }}>No courses yet.</p>
            <Link
              href="/education"
              className="text-xs font-medium mt-1 inline-block transition-opacity hover:opacity-70"
              style={{ color: '#fcd535' }}
            >
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {enrollments.slice(0, 5).map((enrollment) => {
              const cfg = STATUS_CONFIG[enrollment.status] ?? STATUS_CONFIG.ACTIVE;
              const StatusIcon = cfg.Icon;
              return (
                <div key={enrollment.id}>
                  <div className="flex items-center justify-between mb-1">
                    <p
                      className="text-xs font-medium truncate flex-1 mr-2"
                      style={{ color: '#eaecef' }}
                    >
                      {enrollment.course.title}
                    </p>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <StatusIcon className="w-3 h-3" style={{ color: cfg.color }} />
                      <span className="text-[10px] font-medium" style={{ color: cfg.color }}>
                        {enrollment.progress}%
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div
                    className="h-1.5 w-full rounded-full overflow-hidden"
                    style={{ backgroundColor: '#2b3139' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${enrollment.progress}%`,
                        backgroundColor: cfg.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
