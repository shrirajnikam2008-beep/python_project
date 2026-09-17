import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  className?: string
  trackClassName?: string
  fillClassName?: string
  size?: 'xs' | 'sm' | 'md'
  animated?: boolean
}

const heights = { xs: 'h-1', sm: 'h-1.5', md: 'h-2' }

export function ProgressBar({
  value,
  max = 100,
  className,
  trackClassName,
  fillClassName,
  size = 'sm',
  animated = true,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div
      className={cn('w-full rounded-full bg-slate-100', heights[size], trackClassName, className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
      aria-valuemin={0}
    >
      <div
        className={cn(
          'rounded-full transition-all duration-700 ease-out',
          heights[size],
          fillClassName ?? 'bg-blue-500'
        )}
        style={{ width: animated ? `${pct}%` : `${pct}%` }}
      />
    </div>
  )
}
