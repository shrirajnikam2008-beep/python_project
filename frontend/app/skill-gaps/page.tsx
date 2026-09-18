'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { SkillCard } from '@/components/skill-gaps/SkillCard'
import { SkeletonCard } from '@/components/ui/SkeletonLoader'
import { ErrorState } from '@/components/ui/ErrorState'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { getAllSkills, getStudentProfile } from '@/lib/api'
import type { Skill, StudentProfile } from '@/lib/types'
import { Filter, Sparkles, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react'

type FilterTab = 'all' | 'critical' | 'high' | 'recommended' | 'completed'

export default function SkillGapsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  useEffect(() => {
    Promise.all([getAllSkills(), getStudentProfile()])
      .then(([s, p]) => {
        setSkills(s)
        setProfile(p)
      })
      .catch(() => setError('Failed to load skill gaps.'))
      .finally(() => setLoading(false))
  }, [])

  const currentSkillIds = profile?.currentSkills ?? []
  const currentSkills = skills.filter((s) => currentSkillIds.includes(s.id))
  const gapSkills = skills.filter((s) => !currentSkillIds.includes(s.id))
  const critical = gapSkills.filter((s) => s.priority === 'critical')
  const high = gapSkills.filter((s) => s.priority === 'high')
  const recommended = gapSkills.filter((s) => s.priority === 'recommended')

  const total = skills.length
  const completedCount = currentSkills.length

  // Filter skills based on tab
  const displayedSkills =
    activeTab === 'completed'
      ? currentSkills
      : activeTab === 'critical'
      ? critical
      : activeTab === 'high'
      ? high
      : activeTab === 'recommended'
      ? recommended
      : skills

  return (
    <AuthGuard>
    <AppShell title="Skill Gaps" breadcrumb={[{ label: 'Dashboard' }, { label: 'Skill Gaps' }]}>
      <div className="space-y-8">
        {/* Header Title Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Your Skill Gaps
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Skills standing between your current profile and your target destination: <strong>AI / ML Engineer</strong>.
              </p>
            </div>
          </div>

          {/* Overall Progress & Priority Stats Card */}
          {!loading && (
            <div className="mt-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="text-sm font-bold text-slate-800">
                  Overall Skill Acquisition Progress
                </span>
                <span className="text-sm font-extrabold text-blue-600">
                  {completedCount} of {total} skills ({Math.round((completedCount / total) * 100)}%)
                </span>
              </div>

              <ProgressBar
                value={completedCount}
                max={total}
                size="md"
                fillClassName="bg-gradient-to-r from-blue-600 to-indigo-600"
              />

              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">{completedCount} Acquired</p>
                    <p className="text-[10px] text-emerald-700">Python, Git, etc.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-red-50/70 border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-xs font-bold text-red-900">{critical.length} Critical</p>
                    <p className="text-[10px] text-red-700">Immediate blockers</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-amber-50/70 border border-amber-100">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">{high.length} High Priority</p>
                    <p className="text-[10px] text-amber-700">Core requirements</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-blue-50/70 border border-blue-100">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-blue-900">{recommended.length} Recommended</p>
                    <p className="text-[10px] text-blue-700">Enhance profile</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
          {[
            { id: 'all', label: `All Skills (${total})` },
            { id: 'critical', label: `Critical (${critical.length})` },
            { id: 'high', label: `High Priority (${high.length})` },
            { id: 'recommended', label: `Recommended (${recommended.length})` },
            { id: 'completed', label: `Completed (${completedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as FilterTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Skill Cards Grid */}
        {error ? (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                isCurrentSkill={currentSkillIds.includes(skill.id)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
    </AuthGuard>
  )
}
