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
  RotateCcw,
  Edit2,
  Calendar,
  FileText,
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
  onUpdateStatus?: (skillId: string, status: Skill['status']) => void
  onEditTask?: (skill: Skill) => void
}

export function SkillDetailPanel({
  skill,
  onClose,
  onUpdateStatus,
  onEditTask,
}: SkillDetailPanelProps) {
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
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {skill.category}
                </span>
                <StatusBadge status={skill.status} />
                {skill.isCustom && (
                  <span className="text-[9px] font-extrabold text-amber-800 uppercase bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200">
                    Custom
                  </span>
                )}
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                {skill.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-2"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed">{skill.description}</p>

            {/* Why it Matters */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
              <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Strategic Value
              </p>
              <p className="text-xs text-blue-900 leading-relaxed">{skill.whyItMatters}</p>
            </div>

            {/* Level Matrix */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Your Proficiency:</span>
                <span className="font-bold text-slate-900">{skill.currentLevel}</span>
              </div>
              <ProgressBar
                value={levelValue[skill.currentLevel] ?? 0}
                className="h-2"
                fillClassName={levelColor[skill.currentLevel]}
              />

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Target Proficiency:</span>
                <span className="font-bold text-blue-600">{skill.requiredLevel}</span>
              </div>
            </div>

            {/* Prerequisites & Unlocks */}
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" /> Prerequisites
                </p>
                {skill.prerequisites && skill.prerequisites.length > 0 ? (
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
                    ✓ None — You are eligible to work on this node immediately.
                  </p>
                )}
              </div>

              {skill.dependents && skill.dependents.length > 0 && (
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
          <div className="p-4 border-t border-slate-200/80 bg-white space-y-2">
            {skill.status === 'completed' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-700">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Completed / Acquired</span>
                  </div>
                  {onUpdateStatus && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(skill.id, 'in-progress')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-white border border-amber-300 rounded-lg hover:bg-amber-50 shadow-2xs transition-colors"
                      title="Reopen this task to revisit or redo"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reopen Task</span>
                    </button>
                  )}
                </div>

                {onEditTask && (
                  <button
                    type="button"
                    onClick={() => onEditTask(skill)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Task Details &amp; Notes</span>
                  </button>
                )}
              </div>
            ) : skill.status === 'in-progress' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {onUpdateStatus && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(skill.id, 'completed')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Mark Completed</span>
                    </button>
                  )}
                  {onEditTask && (
                    <button
                      type="button"
                      onClick={() => onEditTask(skill)}
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {onUpdateStatus && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(skill.id, 'in-progress')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start Task (In-Progress)</span>
                    </button>
                  )}
                  {onUpdateStatus && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(skill.id, 'completed')}
                      className="px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
                      title="Quick mark completed"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  )}
                  {onEditTask && (
                    <button
                      type="button"
                      onClick={() => onEditTask(skill)}
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
                      title="Edit task details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; style: string }> = {
    completed: { label: 'Completed', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'in-progress': { label: 'In Progress', style: 'bg-amber-50 text-amber-700 border-amber-200' },
    next: { label: 'Up Next', style: 'bg-blue-600 text-white border-blue-600' },
    locked: { label: 'Planned', style: 'bg-slate-100 text-slate-500 border-slate-200' },
  }
  const config = configs[status] ?? { label: status, style: 'bg-slate-100 text-slate-500 border-slate-200' }
  return (
    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', config.style)}>
      {config.label}
    </span>
  )
}
