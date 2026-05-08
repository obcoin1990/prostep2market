'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  progress,
  label,
  showPercentage = true,
  size = 'md',
  className,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  return (
    <div className={cn('space-y-1', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && (
            <span className={cn(
              'font-medium',
              clampedProgress === 100 ? 'text-green-500' : 'text-muted-foreground'
            )}>
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-muted rounded-full overflow-hidden', heightClass)}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            clampedProgress === 100 
              ? 'bg-green-500' 
              : 'bg-primary'
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}