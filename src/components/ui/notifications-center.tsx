'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { Popover, PopoverItem } from "./popover"
import { EmptyState } from "./empty-state"

export interface Notification {
  id: string
  title: string
  body: string
  read: boolean
  type: string
  link?: string
  created_at: string
}

export interface NotificationsCenterProps {
  notifications: Notification[]
  onMarkRead?: (id: string) => void
  onMarkAllRead?: () => void
  onNotificationClick?: (notification: Notification) => void
  maxVisible?: number
  className?: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const typeIcons: Record<string, string> = {
  EDGE_SCORE_UPDATE: "📈",
  ALERT_TRIGGERED: "⚠️",
  CERT_EARNED: "🎓",
  MT_SYNC: "🔄",
  AI_INSIGHT: "🤖",
}

const NotificationsCenter = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNotificationClick,
  maxVisible = 5,
  className,
}: NotificationsCenterProps) => {
  const unread = notifications.filter((n) => !n.read).length
  const visible = notifications.slice(0, maxVisible)
  const remaining = notifications.length - maxVisible

  return (
    <Popover
      trigger={
        <button type="button" aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"} className={cn("relative p-2 rounded-lg hover:bg-[#2b3139] transition-colors cursor-pointer", className)}>
          <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4.5 h-4.5 text-[10px] font-bold bg-[#f6465d] text-white rounded-full min-w-[18px] h-[18px]">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      }
      align="end"
      className="w-80"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2b3139]">
        <span className="text-sm font-medium text-white">Notifications</span>
        {unread > 0 && onMarkAllRead && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-xs text-[#fcd535] hover:underline cursor-pointer"
          >
            Mark all read
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="py-6">
          <EmptyState
            variant="compact"
            title="No notifications"
            description="You're all caught up."
          />
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto">
          {visible.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                if (!n.read) onMarkRead?.(n.id)
                onNotificationClick?.(n)
              }}
              className={cn(
                "w-full text-left px-4 py-3 transition-colors hover:bg-[#2b3139] cursor-pointer",
                !n.read && "bg-[#fcd535]/5"
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-base shrink-0">{typeIcons[n.type] ?? "🔔"}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm", n.read ? "text-white/60" : "text-white font-medium")}>
                      {n.title}
                    </span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-[#fcd535] shrink-0" />}
                  </div>
                  <p className="text-xs text-[#848e9c] mt-0.5 line-clamp-2">{n.body}</p>
                  <span className="text-[10px] text-[#9ea3ad] mt-1 block">{timeAgo(n.created_at)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {remaining > 0 && (
        <div className="border-t border-[#2b3139] px-4 py-2">
          <span className="text-xs text-[#848e9c]">
            {remaining} more notification{remaining !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </Popover>
  )
}

export { NotificationsCenter }
