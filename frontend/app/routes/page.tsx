'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { RouteCard } from '@/components/routes/RouteCard'
import { SkeletonCard } from '@/components/ui/SkeletonLoader'
import { ErrorState } from '@/components/ui/ErrorState'
import { getRoutes, getStudentProfile } from '@/lib/api'
import { getDestinationById } from '@/lib/mock-data/destinations'
import type { Route, Destination, StudentProfile } from '@/lib/types'
import {
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Table,
  Zap,
  Clock,
  BookOpen,
  GraduationCap,
  Layers,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

interface ComparisonRow {
  label: string
  icon: React.ElementType
  balanced: string
  fastTrack: string
  foundationFirst: string
}

const comparisonRows: ComparisonRow[] = [
  {
    label: 'Duration',
    icon: Clock,
    balanced: '16 Weeks (~4 Months)',
    fastTrack: '10 Weeks (Intensive 2.5 Months)',
    foundationFirst: '20 Weeks (5 Months Deep-Dive)',
  },
  {
    label: 'Weekly Commitment',
    icon: Zap,
    balanced: '10 – 14 Hours / Week',
    fastTrack: '20 – 25 Hours / Week',
    foundationFirst: '6 – 8 Hours / Week',
  },
  {
    label: 'Workload Intensity',
    icon: Layers,
    balanced: 'Medium (Balanced Pace)',
    fastTrack: 'High (Fast-paced Sprint)',
    foundationFirst: 'Low (Spaced & Thorough)',
  },
  {
    label: 'Skills Covered',
    icon: BookOpen,
    balanced: '12 Prerequisite Skills',
    fastTrack: '10 Essential Skills',
    foundationFirst: '14 Skills (Full Depth)',
  },
  {
    label: 'Best Suited For',
    icon: GraduationCap,
    balanced: 'Students balancing semester courses and lab exams',
    fastTrack: 'Vacation breaks or immediate internship deadlines',
    foundationFirst: 'GATE, M.Tech, research aspirants wanting proof-level depth',
  },
  {
    label: 'Key Milestone Deliverable',
    icon: Sparkles,
    balanced: 'Deployed model with live REST API & EDA portfolio',
    fastTrack: 'Rapid ML prototype with baseline validation',
    foundationFirst: 'End-to-end production pipeline + theoretical report',
  },
]

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState('balanced')

  useEffect(() => {
    Promise.all([getRoutes(), getStudentProfile()])
      .then(([r, p]) => {
        setRoutes(r)
        setProfile(p)
      })
      .catch(() => setError('Could not load routes.'))
      .finally(() => setLoading(false))
  }, [])

  const destination: Destination = getDestinationById(profile?.selectedDestinationId)
  const selectedRoute = routes.find((r) => r.id === selectedId)

  return (
    <AuthGuard>
      <AppShell title="Routes" breadcrumb={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Routes' }]}>
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
                  Choose Your Learning Route
                </h1>
                <p className="text-sm text-slate-500">
                  There is more than one pathway to reach <strong>{destination.title}</strong>. Select a route calibrated to your schedule.
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 self-start sm:self-auto">
                Goal: {destination.title}
              </span>
            </div>
          </motion.div>

          {error ? (
            <ErrorState message={error} onRetry={() => window.location.reload()} />
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <>
              {/* 3 Alternative Route Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {routes.map((route, i) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    selected={selectedId === route.id}
                    onSelect={() => setSelectedId(route.id)}
                    index={i}
                  />
                ))}
              </div>

              {/* Side-by-Side Comparison Matrix */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Table className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Side-by-Side Route Comparison</h3>
                      <p className="text-xs text-slate-500">Compare pace, time commitment, and prerequisites across all 3 routes</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg hidden sm:inline-block">
                    Review 2 Metric Matrix
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-3 px-4 font-semibold w-1/4">Criteria</th>
                        <th className={`py-3 px-4 font-bold rounded-t-xl transition-colors ${selectedId === 'balanced' ? 'bg-blue-50/70 text-blue-700' : 'text-slate-800'}`}>
                          Balanced Route {selectedId === 'balanced' && '✓'}
                        </th>
                        <th className={`py-3 px-4 font-bold rounded-t-xl transition-colors ${selectedId === 'fast-track' ? 'bg-blue-50/70 text-blue-700' : 'text-slate-800'}`}>
                          Fast Track {selectedId === 'fast-track' && '✓'}
                        </th>
                        <th className={`py-3 px-4 font-bold rounded-t-xl transition-colors ${selectedId === 'foundation-first' ? 'bg-blue-50/70 text-blue-700' : 'text-slate-800'}`}>
                          Foundation First {selectedId === 'foundation-first' && '✓'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {comparisonRows.map((row) => {
                        const Icon = row.icon
                        return (
                          <tr key={row.label} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 px-4 font-medium text-slate-700 flex items-center gap-2">
                              <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{row.label}</span>
                            </td>
                            <td className={`py-3.5 px-4 text-slate-600 ${selectedId === 'balanced' ? 'bg-blue-50/40 font-semibold text-blue-900' : ''}`}>
                              {row.balanced}
                            </td>
                            <td className={`py-3.5 px-4 text-slate-600 ${selectedId === 'fast-track' ? 'bg-blue-50/40 font-semibold text-blue-900' : ''}`}>
                              {row.fastTrack}
                            </td>
                            <td className={`py-3.5 px-4 text-slate-600 ${selectedId === 'foundation-first' ? 'bg-blue-50/40 font-semibold text-blue-900' : ''}`}>
                              {row.foundationFirst}
                            </td>
                          </tr>
                        )
                      })}
                      <tr>
                        <td className="py-4 px-4 font-medium text-slate-700">Action</td>
                        <td className={`py-4 px-4 ${selectedId === 'balanced' ? 'bg-blue-50/40' : ''}`}>
                          <button
                            type="button"
                            onClick={() => setSelectedId('balanced')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              selectedId === 'balanced'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {selectedId === 'balanced' ? 'Selected' : 'Select Balanced'}
                          </button>
                        </td>
                        <td className={`py-4 px-4 ${selectedId === 'fast-track' ? 'bg-blue-50/40' : ''}`}>
                          <button
                            type="button"
                            onClick={() => setSelectedId('fast-track')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              selectedId === 'fast-track'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {selectedId === 'fast-track' ? 'Selected' : 'Select Fast Track'}
                          </button>
                        </td>
                        <td className={`py-4 px-4 ${selectedId === 'foundation-first' ? 'bg-blue-50/40' : ''}`}>
                          <button
                            type="button"
                            onClick={() => setSelectedId('foundation-first')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              selectedId === 'foundation-first'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {selectedId === 'foundation-first' ? 'Selected' : 'Select Foundation'}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Selected Route Comparison & Launch Panel */}
              {selectedRoute && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border-2 border-blue-600/30 rounded-2xl p-6 sm:p-7 shadow-lg shadow-blue-500/5 relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="max-w-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Active Selection: {selectedRoute.name}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Ready to start the {selectedRoute.name}?
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {selectedRoute.description} Spans <strong>{selectedRoute.totalWeeks} weeks</strong> covering <strong>{selectedRoute.skillCount} prerequisite skills</strong> targeting <strong>{destination.title}</strong>.
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                      <Link
                        href={`/route/${selectedRoute.id}`}
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg transition-all"
                      >
                        <Compass className="w-4 h-4" />
                        Explore Interactive Route Map
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </AppShell>
    </AuthGuard>
  )
}

