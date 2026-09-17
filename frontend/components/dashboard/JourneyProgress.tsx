import { Check, Circle, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface JourneyNode {
  label: string
  status: 'done' | 'current' | 'upcoming'
}

const journeyNodes: JourneyNode[] = [
  { label: 'Python', status: 'done' },
  { label: 'Git', status: 'done' },
  { label: 'Data Structures', status: 'current' },
  { label: 'Linear Algebra', status: 'current' },
  { label: 'Statistics', status: 'upcoming' },
  { label: 'Data Analysis', status: 'upcoming' },
  { label: 'Machine Learning', status: 'upcoming' },
  { label: 'AI / ML Engineer', status: 'upcoming' },
]

export function JourneyProgress() {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Your Journey</h3>
        <span className="text-xs text-slate-400">Balanced Route</span>
      </div>
      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {journeyNodes.map((node, i) => (
          <div key={node.label} className="flex items-center shrink-0">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center border-2',
                  node.status === 'done'
                    ? 'bg-green-500 border-green-500'
                    : node.status === 'current'
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-slate-200'
                )}
              >
                {node.status === 'done' ? (
                  <Check className="w-3 h-3 text-white" />
                ) : node.status === 'current' ? (
                  <Circle className="w-3 h-3 text-white fill-white" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-300" />
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium text-center max-w-[64px] leading-tight',
                  node.status === 'done'
                    ? 'text-green-600'
                    : node.status === 'current'
                    ? 'text-blue-600'
                    : 'text-slate-400'
                )}
              >
                {node.label}
              </span>
            </div>
            {i < journeyNodes.length - 1 && (
              <div
                className={cn(
                  'mx-1 h-0.5 w-6 shrink-0 mb-4',
                  i < 2 ? 'bg-green-300' : i < 4 ? 'bg-blue-200' : 'bg-slate-100'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
