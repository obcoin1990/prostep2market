'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';

/**
 * AlertBadge - Navigation badge with unread alert count
 * Shows red dot with number overlay on the alerts nav icon
 */
interface AlertBadgeProps {
  count: number;
}

export function AlertBadge({ count }: AlertBadgeProps) {
  if (count <= 0) {
    // Still show the icon but without badge when count is 0
    return (
      <Link 
        href="/alerts" 
        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Bell className="w-5 h-5" />
      </Link>
    );
  }

  return (
    <Link 
      href="/alerts" 
      className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
    >
      <Bell className="w-5 h-5" />
      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
        {count > 99 ? '99+' : count}
      </span>
    </Link>
  );
}