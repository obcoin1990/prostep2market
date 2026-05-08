/**
 * Utility function for combining Tailwind classes
 * Based on clsx + tailwind-merge pattern
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export clsx and tailwind-merge for direct use if needed
export { clsx, type ClassValue } from 'clsx'