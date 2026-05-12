import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function formatProgress(value: number): string {
  return `${Math.round(value)}%`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export function paginate<T>(items: T[], page: number, perPage = 10) {
  const total = items.length
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  return {
    data: items.slice(start, start + perPage),
    total,
    page,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}
