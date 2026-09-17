'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn, priorityVariant, formatPriority } from '@/lib/utils'
import type { Skill } from '@/lib/types'
import { Check, Clock, ChevronDown, Sparkles, ArrowUpRight } from 'lucide-react'

const levelValue: Record<string, number> = { None: 0, Beginner: 33, Intermediate: 66, Advanced: 100 }

interface SkillCardProps {
  skill: Skill
  isCurrentSkill?: boolean
}

export function SkillCard({ skill, isCurrentSkill = false }: SkillCardProps) {
  const [expanded, setExpanded] = useState(false)

  const priorityColor =
    skill.priority === 'critical'
      ? 'border-red-200 bg-red-50/20'
      : skill.priority === 'high'
      ? 'border-amber-200 bg-amber-50/20'
      : 'border-slate-200 bg-slate-50/20'

  return (
    <div
      className={cn(
        'group bg-white border rounded-2xl p-5 shadow-xs transition-all hover:shadow-md',
        isCurrentSkill
          ? 'border-emerald-200/90 bg-emerald-50/20'
          : priorityColor
      )}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              {skill.name}
            </h4>
            {isCurrentSkill && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-slate-400">{skill.category}</p>
        </div>

        {isCurrentSkill ? (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Acquired
          </span>
        ) : (
          <Badge variant={priorityVariant(skill.priority)}>
            {formatPriority(skill.priority)}
          </Badge>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 leading-relaxed mb-4">
        {skill.description}
      </p>

      {/* Level comparison */}
      {!isCurrentSkill && (
        <div className="mb-4 space-y-2 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Current: <strong className="text-slate-800">{skill.currentLevel}</strong></span>
            <span className="text-blue-700 font-bold">Required: {skill.requiredLevel}</span>
          </div>

          <div className="space-y-1">
            <ProgressBar
              value={levelValue[skill.currentLevel] ?? 0}
              fillClassName={
                skill.priority === 'critical'
                  ? 'bg-red-500'
                  : skill.priority === 'high'
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }
              size="sm"
            />
          </div>
        </div>
      )}

      {/* Prerequisites & Unlocks */}
      <div className="space-y-2 text-xs">
        {!isCurrentSkill && (
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-slate-400">Prerequisites:</span>
            <span className="font-semibold text-slate-700">
              {skill.prerequisites.length > 0 ? skill.prerequisites.join(', ') : 'None (Direct Start)'}
            </span>
          </div>
        )}

        {skill.estimatedWeeks > 0 && !isCurrentSkill && (
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-slate-400">Est. Effort:</span>
            <span className="font-semibold text-slate-700">{skill.estimatedWeeks} weeks</span>
          </div>
        )}
      </div>

      {/* Expandable Why It Matters */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>Why this skill matters</span>
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', expanded && 'rotate-180')} />
        </button>

        {expanded && (
          <div className="mt-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-100/80 text-xs text-blue-900 leading-relaxed animate-fade-in">
            {skill.whyItMatters}
          </div>
        )}
      </div>
    </div>
  )
}
