import { cn } from '@/lib/utils'
import type { Destination } from '@/lib/types'
import { Check, Sparkles, ArrowRight } from 'lucide-react'

interface DestinationCardProps {
  destination: Destination
  selected: boolean
  onSelect: () => void
}

export function DestinationCard({ destination, selected, onSelect }: DestinationCardProps) {
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className={cn(
        'group relative w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        selected
          ? 'border-blue-600 bg-blue-50/60 shadow-md shadow-blue-500/10'
          : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl border border-slate-200/60 group-hover:scale-105 transition-transform">
            {destination.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                {destination.title}
              </h3>
              {destination.avgSalary && (
                <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {destination.avgSalary}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              {destination.description}
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
              {destination.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-slate-100/80 text-slate-600 text-[11px] font-medium rounded-md border border-slate-200/60"
                >
                  {tag}
                </span>
              ))}
              <span className="px-2 py-0.5 bg-blue-100/60 text-blue-700 text-[11px] font-semibold rounded-md border border-blue-200/50">
                {destination.requiredSkillCount} Core Skills
              </span>
            </div>
          </div>
        </div>

        {/* Selected Checkmark Ring */}
        <div
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all',
            selected
              ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
              : 'border-slate-300 bg-transparent text-transparent group-hover:border-slate-400'
          )}
        >
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </div>
      </div>
    </div>
  )
}
