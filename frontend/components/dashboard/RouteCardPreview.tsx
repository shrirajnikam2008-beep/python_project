import Link from 'next/link'
import { ArrowRight, Clock, BookOpen } from 'lucide-react'
import type { Route } from '@/lib/types'
import { cn } from '@/lib/utils'

const workloadColors = {
  Low: 'text-green-600 bg-green-50',
  Medium: 'text-blue-600 bg-blue-50',
  High: 'text-amber-600 bg-amber-50',
}

export function RouteCardPreview({ route }: { route: Route }) {
  return (
    <div className={cn(
      'bg-white border rounded-xl p-4 shadow-sm transition-all hover:shadow-md',
      route.isRecommended ? 'border-blue-200' : 'border-slate-100'
    )}>
      {route.isRecommended && (
        <div className="mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Recommended</span>
        </div>
      )}
      <h4 className="text-sm font-semibold text-slate-900 mb-1">{route.name}</h4>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">{route.tagline}</p>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          {route.totalWeeks}w
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <BookOpen className="w-3.5 h-3.5" />
          {route.skillCount} skills
        </div>
        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', workloadColors[route.workload])}>
          {route.workload}
        </span>
      </div>
      <Link
        href={`/route/${route.id}`}
        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
      >
        Explore Route <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  )
}
