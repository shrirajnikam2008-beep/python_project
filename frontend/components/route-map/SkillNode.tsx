'use client'

import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import { Check, Lock, Play, Trophy, Sparkles, Navigation } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RouteNodeData } from '@/lib/types'

const categoryColors: Record<string, string> = {
  Programming: 'text-blue-600 bg-blue-50 border-blue-100',
  Mathematics: 'text-purple-600 bg-purple-50 border-purple-100',
  'Data Science': 'text-teal-600 bg-teal-50 border-teal-100',
  'Machine Learning': 'text-indigo-600 bg-indigo-50 border-indigo-100',
  Tools: 'text-slate-600 bg-slate-100 border-slate-200',
  Databases: 'text-amber-600 bg-amber-50 border-amber-100',
  Foundations: 'text-sky-600 bg-sky-50 border-sky-100',
}

export const SkillNode = memo(function SkillNode({ data, selected }: NodeProps<RouteNodeData>) {
  // 1. START NODE
  if (data.isStart) {
    return (
      <div className="relative group">
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-blue-600 !border-2 !border-white !w-3 !h-3 !-bottom-1.5 shadow-xs"
        />
        <div
          className={cn(
            'flex items-center gap-2.5 px-4 py-2.5 bg-[#0B0F19] text-white rounded-xl shadow-lg border border-slate-700 transition-all group-hover:scale-105',
            selected && 'ring-2 ring-blue-400 ring-offset-2'
          )}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-white">
            <Navigation className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block leading-none">
              Origin
            </span>
            <span className="text-xs font-bold text-white">Current Profile</span>
          </div>
        </div>
      </div>
    )
  }

  // 2. GOAL / DESTINATION NODE
  if (data.isGoal) {
    return (
      <div className="relative group">
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-amber-400 !border-2 !border-white !w-3 !h-3 !-top-1.5 shadow-xs"
        />
        <div
          className={cn(
            'px-5 py-4 bg-gradient-to-br from-[#0B0F19] via-slate-900 to-blue-950 text-white rounded-2xl shadow-xl border-2 border-amber-400/80 text-center min-w-[170px] transition-all group-hover:scale-105',
            selected && 'ring-4 ring-amber-400/30'
          )}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>Target Goal</span>
          </div>
          <p className="text-sm font-extrabold text-white tracking-tight">{data.label}</p>
          <span className="inline-block text-[10px] font-medium text-slate-300 mt-1 bg-white/10 px-2 py-0.5 rounded-full">
            Review 2 Destination
          </span>
        </div>
      </div>
    )
  }

  // 3. STANDARD SKILL NODES
  const isCompleted = data.status === 'completed'
  const isNext = data.status === 'next'
  const isLocked = data.status === 'locked'

  const catStyle = categoryColors[data.category] ?? 'text-slate-600 bg-slate-100 border-slate-200'

  return (
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          '!border-2 !border-white !w-2.5 !h-2.5 !-top-1 shadow-2xs',
          isCompleted ? '!bg-emerald-500' : isNext ? '!bg-blue-600' : '!bg-slate-300'
        )}
      />

      <div
        className={cn(
          'w-[165px] rounded-2xl p-3.5 transition-all duration-200 select-none border-2',
          isCompleted
            ? 'bg-white border-emerald-300 shadow-xs hover:shadow-md hover:border-emerald-400'
            : isNext
            ? 'bg-blue-50/90 border-blue-500 shadow-md shadow-blue-500/10 hover:shadow-lg ring-2 ring-blue-200/60'
            : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs',
          selected && 'scale-105 ring-4 ring-blue-400/40 z-10 shadow-lg'
        )}
      >
        {/* Header Icon + Title */}
        <div className="flex items-start gap-2.5 mb-2">
          <div
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-bold text-xs',
              isCompleted
                ? 'bg-emerald-500 text-white shadow-2xs'
                : isNext
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-400'
            )}
          >
            {isCompleted ? (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            ) : isNext ? (
              <Play className="w-3.5 h-3.5 fill-white" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
              {data.label}
            </h4>
            <span
              className={cn(
                'inline-block text-[9px] font-semibold px-1.5 py-0.2 rounded border mt-0.5',
                catStyle
              )}
            >
              {data.category}
            </span>
          </div>
        </div>

        {/* Status indicator bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
          <span className="text-slate-400 font-medium">Status:</span>
          <span
            className={cn(
              'font-bold capitalize',
              isCompleted ? 'text-emerald-700' : isNext ? 'text-blue-700' : 'text-slate-400'
            )}
          >
            {isCompleted ? 'Acquired' : isNext ? 'Up Next' : 'Locked'}
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          '!border-2 !border-white !w-2.5 !h-2.5 !-bottom-1 shadow-2xs',
          isCompleted ? '!bg-emerald-500' : isNext ? '!bg-blue-600' : '!bg-slate-300'
        )}
      />
    </div>
  )
})
