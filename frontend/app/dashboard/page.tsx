'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { Badge } from '@/components/ui/Badge'
import { SkeletonCard } from '@/components/ui/SkeletonLoader'
import { ErrorState } from '@/components/ui/ErrorState'
import { getStudentProfile, getRoutes } from '@/lib/api'
import type { StudentProfile, Route } from '@/lib/types'
import { getHour } from '@/lib/utils'
import Link from 'next/link'
import {
  MapPin,
  ArrowRight,
  Zap,
  Clock,
  BookOpen,
  Check,
  Circle,
  Lock,
  Compass,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35 },
  }),
}

const journeyNodes = [
  { label: 'Python', status: 'done', category: 'Programming' },
  { label: 'Git', status: 'done', category: 'Tools' },
  { label: 'Data Structures', status: 'current', category: 'Foundations' },
  { label: 'Linear Algebra', status: 'current', category: 'Mathematics' },
  { label: 'Statistics', status: 'upcoming', category: 'Mathematics' },
  { label: 'Data Analysis', status: 'upcoming', category: 'Data Science' },
  { label: 'Machine Learning', status: 'upcoming', category: 'ML Core' },
  { label: 'AI / ML Engineer', status: 'goal', category: 'Destination' },
]

export default function DashboardPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getStudentProfile(), getRoutes()])
      .then(([p, r]) => {
        setProfile(p)
        setRoutes(r)
      })
      .catch(() => setError('Failed to load your dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  const completedCount = profile?.currentSkills.length ?? 4
  const totalSkills = 19
  const remainingSkills = totalSkills - completedCount
  const progress = Math.round((completedCount / totalSkills) * 100)

  return (
    <AppShell title="Overview" breadcrumb={[{ label: 'Waypoint' }, { label: 'Dashboard' }]}>
      {error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  Good {getHour()}
                </span>
                <span className="text-xs text-slate-400">Semester 5 • B.Tech IT</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {loading ? 'Welcome back' : `Welcome, ${profile?.name ?? 'Alex'} 👋`}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Here is your real-time academic progression toward becoming an <strong>AI / ML Engineer</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/route/balanced"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all hover:shadow-md"
              >
                <Compass className="w-4 h-4" /> Open Interactive Route Map
              </Link>
            </div>
          </motion.div>

          {/* Top Metric Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Primary Journey Hero Card (8 cols) */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="lg:col-span-8"
            >
              {loading ? (
                <SkeletonCard />
              ) : (
                <div className="h-full bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Current Destination Target
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                        Balanced Route
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                          AI / ML Engineer
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md">
                          Build intelligent systems using data, linear algebra, statistics, and machine learning models.
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center justify-center">
                        <ProgressRing
                          value={progress}
                          size={96}
                          strokeWidth={8}
                          color="#2563EB"
                          trackColor="#E2E8F0"
                          label={
                            <div className="text-center">
                              <p className="text-lg font-black text-slate-900">{progress}%</p>
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Progress</p>
                            </div>
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Acquired Skills</p>
                      <p className="text-lg font-bold text-slate-900 mt-0.5">
                        {completedCount} <span className="text-xs font-normal text-slate-400">/ {totalSkills}</span>
                      </p>
                    </div>
                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100">
                      <p className="text-xs text-amber-800 font-medium">Identified Gaps</p>
                      <p className="text-lg font-bold text-amber-900 mt-0.5">{remainingSkills} skills</p>
                    </div>
                    <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
                      <p className="text-xs text-blue-800 font-medium">Est. Timeline</p>
                      <p className="text-lg font-bold text-blue-900 mt-0.5">16 weeks</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Skill Gap Breakdown Summary (4 cols) */}
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="lg:col-span-4"
            >
              {loading ? (
                <SkeletonCard />
              ) : (
                <div className="h-full bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900">Skill Gap Priorities</h3>
                      <Link
                        href="/skill-gaps"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                      >
                        Explore all <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        {
                          label: 'Critical Gaps',
                          count: 3,
                          desc: 'DSA, Linear Algebra, Stats',
                          badge: 'bg-red-50 text-red-700 border-red-200',
                          dot: 'bg-red-500',
                        },
                        {
                          label: 'High Priority',
                          count: 4,
                          desc: 'ML Core, SQL, Data Analysis',
                          badge: 'bg-amber-50 text-amber-700 border-amber-200',
                          dot: 'bg-amber-500',
                        },
                        {
                          label: 'Recommended',
                          count: 4,
                          desc: 'Deep Learning, NLP, MLOps',
                          badge: 'bg-blue-50 text-blue-700 border-blue-200',
                          dot: 'bg-blue-500',
                        },
                      ].map((gap) => (
                        <div
                          key={gap.label}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full ${gap.dot}`} />
                            <div>
                              <p className="text-xs font-bold text-slate-900">{gap.label}</p>
                              <p className="text-[10px] text-slate-500">{gap.desc}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${gap.badge}`}>
                            {gap.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/skill-gaps"
                    className="mt-4 block w-full text-center py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
                  >
                    View detailed gap analysis →
                  </Link>
                </div>
              )}
            </motion.div>
          </div>

          {/* Horizontal Journey Sequence */}
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
            {loading ? (
              <SkeletonCard />
            ) : (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Your Journey Sequence</h3>
                    <p className="text-xs text-slate-500">Prerequisite progression on the Balanced Route</p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Step 3 in progress
                  </span>
                </div>

                <div className="flex items-center overflow-x-auto pb-3 pt-1">
                  {journeyNodes.map((node, idx) => {
                    const isDone = node.status === 'done'
                    const isCurrent = node.status === 'current'
                    const isGoal = node.status === 'goal'

                    return (
                      <div key={node.label} className="flex items-center shrink-0">
                        <div className="flex flex-col items-center gap-2 group cursor-pointer">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-transform group-hover:scale-110 ${
                              isDone
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                                : isCurrent
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 ring-4 ring-blue-100'
                                : isGoal
                                ? 'bg-[#0B0F19] border-slate-900 text-amber-400'
                                : 'bg-white border-slate-200 text-slate-400'
                            }`}
                          >
                            {isDone ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : isCurrent ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                            ) : isGoal ? (
                              <Sparkles className="w-4 h-4" />
                            ) : (
                              <Lock className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="text-center max-w-[84px]">
                            <p
                              className={`text-xs font-bold leading-tight ${
                                isDone
                                  ? 'text-emerald-700'
                                  : isCurrent
                                  ? 'text-blue-700'
                                  : isGoal
                                  ? 'text-slate-900'
                                  : 'text-slate-500'
                              }`}
                            >
                              {node.label}
                            </p>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{node.category}</span>
                          </div>
                        </div>

                        {idx < journeyNodes.length - 1 && (
                          <div
                            className={`mx-2 h-1 w-8 sm:w-12 shrink-0 mb-6 rounded-full ${
                              idx < 2
                                ? 'bg-emerald-400'
                                : idx < 4
                                ? 'bg-blue-400'
                                : 'bg-slate-200'
                            }`}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* Recommended Next Step Callout */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
            {loading ? (
              <SkeletonCard />
            ) : (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B0F19] via-slate-900 to-blue-950 p-6 sm:p-7 text-white shadow-lg border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500 text-white">
                        <Zap className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        Recommended Next Immediate Step
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                      Start with: <u>Data Structures &amp; Algorithms</u>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Data Structures is the fundamental prerequisite unlocking <strong>Machine Learning implementations</strong> and <strong>SQL query optimization</strong>. Estimated effort: 3 weeks.
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Link
                      href="/route/balanced"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      View on Route Map <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Available Routes Preview Row */}
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Alternative Learning Routes</h2>
                <p className="text-xs text-slate-500">Pick a route matching your timeline and target workload</p>
              </div>
              <Link
                href="/routes"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                Compare all routes <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    className={`bg-white border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-200 flex flex-col justify-between ${
                      route.isRecommended ? 'border-blue-400/80 ring-2 ring-blue-50' : 'border-slate-200/90'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-400">Route {route.id === 'balanced' ? '01' : route.id === 'fast-track' ? '02' : '03'}</span>
                        {route.isRecommended && (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            Recommended
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-slate-900 mb-1">{route.name}</h4>
                      <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">{route.tagline}</p>

                      <div className="flex items-center gap-3 py-2 px-3 bg-slate-50 rounded-xl mb-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span><strong>{route.totalWeeks}</strong> wks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span><strong>{route.skillCount}</strong> skills</span>
                        </div>
                        <span className="ml-auto font-medium text-slate-700">{route.workload} workload</span>
                      </div>
                    </div>

                    <Link
                      href={`/route/${route.id}`}
                      className="inline-flex items-center justify-between w-full pt-3 border-t border-slate-100 text-xs font-bold text-blue-600 hover:text-blue-700 group"
                    >
                      <span>Explore Route Map</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AppShell>
  )
}
