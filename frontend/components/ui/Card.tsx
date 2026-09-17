import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  onClick?: () => void
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export function Card({ children, className, padding = 'md', hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={cn(
        'bg-white border border-slate-100 rounded-xl shadow-sm',
        paddings[padding],
        hover && 'transition-all duration-200 hover:shadow-md hover:border-slate-200 cursor-pointer',
        onClick && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        className
      )}
    >
      {children}
    </div>
  )
}
