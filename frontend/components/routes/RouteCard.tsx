'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, BookOpen, Zap, ArrowRight, Check, Compass, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn } from '@/lib/utils'
import type { Route } from '@/lib/types'

const workloadConfig = {
  Low: { variant: 'success' as const, label: 'Lighter weekly pace', barColor: 'bg-emerald-500', barValue: 33 },
  Medium: { variant: 'info' as const, label: 'Balanced weekly pace', barColor: 'bg-blue-600', barValue: 60 },
  High: { variant: 'warning' as const, label: 'Intensive weekly pace', barColor: 'bg-amber-500', barValue: 90 },
}

interface RouteCardProps {
  route: Route
  selected: boolean
  onSelect: () => void
  index: number
}

export function RouteCard({ route, selected, onSelect, index }: RouteCardProps) {
  const wl = workloadConfig[route.workload]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className={cn(
        'group relative bg-white rounded-2xl border-2 p-6 shadow-sm cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 flex flex-col justify-between',
        selected
          ? 'border-blue-600 shadow-md shadow-blue-500/10 ring-4 ring-blue-50'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      )}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Route {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5 leading-tight">
              {route.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {route.isRecommended && (
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Recommended
              </span>
            )}
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all',
                selected
                  ? 'border-blue-600 bg-blue-600 text-white shadow-2xs'
                  : 'border-slate-300 bg-transparent text-transparent group-hover:border-slate-400'
              )}
            >
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-5 leading-relaxed min-h-[36px]">
          {route.description}
        </p>

        {/* Route Metrics Row */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-bold text-slate-900">{route.totalWeeks} Weeks</p>
              <p className="text-[10px] text-slate-400">Total duration</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-bold text-slate-900">{route.skillCount} Skills</p>
              <p className="text-[10px] text-slate-400">Prerequisite nodes</p>
            </div>
          </div>
        </div>

        {/* Workload Progress */}
        <div className="mb-6 space-y-1.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-slate-400" /> {wl.label}
            </span>
            <span className="font-bold text-slate-800">{route.workload}</span>
          </div>
          <ProgressBar value={wl.barValue} size="xs" fillClassName={wl.barColor} />
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          href={`/route/${route.id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group-hover:translate-x-1 duration-150"
        >
          <span>Open in Route Map</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  )
}
