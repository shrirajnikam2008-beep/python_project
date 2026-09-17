'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Check,
  Lock,
  Play,
  Info,
  Sparkles,
  BookOpen,
  Clock,
  ArrowRight,
  Layers,
  ExternalLink,
  GraduationCap,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn, priorityVariant, formatPriority } from '@/lib/utils'
import type { Skill } from '@/lib/types'

const levelValue: Record<string, number> = { None: 0, Beginner: 33, Intermediate: 66, Advanced: 100 }
const levelColor: Record<string, string> = {
  None: 'bg-slate-200',
  Beginner: 'bg-amber-400',
  Intermediate: 'bg-blue-600',
  Advanced: 'bg-emerald-500',
}

interface SkillDetailPanelProps {
  skill: Skill | null
  onClose: () => void
}

export function SkillDetailPanel({ skill, onClose }: SkillDetailPanelProps) {
  return (
    <AnimatePresence>
      {skill && (
        <motion.div
          key={skill.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="absolute top-0 right-0 h-full w-full sm:w-96 bg-white/95 backdrop-blur-md border-l border-slate-200/90 shadow-2xl z-40 flex flex-col overflow-hidden"
        >
          {/* Panel Header */}
          <div className="flex items-start justify-between p-5 border-b border-slate-200/80 bg-white">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {skill.category}
                </span>
                <StatusBadge status={skill.status} />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                {skill.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-3 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors border border-transparent hover:border-slate-200"
              aria-label="Close detail panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Panel Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Description */}
            <div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {skill.description}
              </p>
            </div>

            {/* Proficiency Levels */}
            <div className="space-y-3 p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Proficiency Differential
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">Your Level</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{skill.currentLevel}</p>
                </div>
                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 shadow-2xs">
                  <p className="text-[10px] font-semibold text-blue-600 uppercase">Target Level</p>
                  <p className="text-sm font-bold text-blue-800 mt-0.5">{skill.requiredLevel}</p>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Current Mastery</span>
                  <span>{levelValue[skill.currentLevel] ?? 0}%</span>
                </div>
                <ProgressBar
                  value={levelValue[skill.currentLevel] ?? 0}
                  fillClassName={levelColor[skill.currentLevel] ?? 'bg-slate-300'}
                  size="sm"
                />
              </div>
            </div>

            {/* Why it Matters in the Journey */}
            <div className="p-4 bg-gradient-to-br from-indigo-50/80 to-blue-50/80 rounded-2xl border border-indigo-100/90 shadow-2xs">
              <div className="flex items-center gap-1.5 mb-2 text-indigo-700">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <p className="text-xs font-bold uppercase tracking-wider">Why it matters</p>
              </div>
              <p className="text-xs text-indigo-900 leading-relaxed font-normal">
                {skill.whyItMatters}
              </p>
            </div>

            {/* Curated Resources Section */}
            {skill.resources && skill.resources.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Curated Learning Resources
                </p>
                <div className="space-y-2">
                  {skill.resources.map((res, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 hover:border-blue-300 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
                          {res.type}
                        </span>
                        <p className="text-xs font-bold text-slate-900 mt-1 truncate">
                          {res.title}
                        </p>
                        {res.provider && (
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            via {res.provider}
                          </p>
                        )}
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites & Unlocks */}
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" /> Prerequisites
                </p>
                {skill.prerequisites.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {skill.prerequisites.map((p) => (
                      <span
                        key={p}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 capitalize"
                      >
                        {p.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-600 font-medium">
                    ✓ None — You are eligible to start this node immediately.
                  </p>
                )}
              </div>

              {skill.dependents.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" /> Unlocks Downstream
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.dependents.map((d) => (
                      <span
                        key={d}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 capitalize"
                      >
                        {d.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Time Estimate */}
            {skill.estimatedWeeks > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <p className="text-xs text-slate-600">
                  Estimated dedication: <strong className="text-slate-900">{skill.estimatedWeeks} weeks</strong> (5-8 hrs/week)
                </p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-5 border-t border-slate-200/80 bg-white">
            {skill.status === 'completed' ? (
              <div className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Skill Acquired (Verified in Profile)</span>
              </div>
            ) : skill.status === 'locked' ? (
              <div className="flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-slate-500 bg-slate-100 rounded-xl border border-slate-200">
                <Lock className="w-3.5 h-3.5" />
                <span>Prerequisites not yet completed</span>
              </div>
            ) : (
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Mark as Active In-Progress</span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; style: string }> = {
    completed: { label: 'Acquired', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'in-progress': { label: 'In Progress', style: 'bg-blue-50 text-blue-700 border-blue-200' },
    next: { label: 'Up Next', style: 'bg-blue-600 text-white border-blue-600' },
    locked: { label: 'Locked', style: 'bg-slate-100 text-slate-500 border-slate-200' },
  }
  const config = configs[status] ?? { label: status, style: 'bg-slate-100 text-slate-500 border-slate-200' }
  return (
    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', config.style)}>
      {config.label}
    </span>
  )
}
