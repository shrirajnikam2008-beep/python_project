import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getHour(): string {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

export function formatPriority(p: string): string {
  const map: Record<string, string> = {
    critical: 'Critical',
    high: 'High Priority',
    recommended: 'Recommended',
  }
  return map[p] ?? p
}

export function skillStatusColor(status: string): string {
  const map: Record<string, string> = {
    completed: 'text-green-600',
    'in-progress': 'text-blue-600',
    next: 'text-indigo-600',
    locked: 'text-slate-400',
  }
  return map[status] ?? 'text-slate-400'
}

export function priorityVariant(priority: string): 'danger' | 'warning' | 'neutral' {
  if (priority === 'critical') return 'danger'
  if (priority === 'high') return 'warning'
  return 'neutral'
}
