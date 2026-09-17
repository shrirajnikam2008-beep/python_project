'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { RouteCard } from '@/components/routes/RouteCard'
import { SkeletonCard } from '@/components/ui/SkeletonLoader'
import { ErrorState } from '@/components/ui/ErrorState'
import { getRoutes } from '@/lib/api'
import type { Route } from '@/lib/types'
import { Compass, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState('balanced')

  useEffect(() => {
    getRoutes()
      .then(setRoutes)
      .catch(() => setError('Could not load routes.'))
      .finally(() => setLoading(false))
  }, [])

  const selectedRoute = routes.find((r) => r.id === selectedId)

  return (
    <AppShell title="Routes" breadcrumb={[{ label: 'Dashboard' }, { label: 'Routes' }]}>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
            Choose Your Learning Route
          </h1>
          <p className="text-sm text-slate-500">
            There is more than one pathway to reach <strong>AI / ML Engineer</strong>. Select a route calibrated to your schedule.
          </p>
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
                      {selectedRoute.description} Spans <strong>{selectedRoute.totalWeeks} weeks</strong> covering <strong>{selectedRoute.skillCount} prerequisite skills</strong>.
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <Link
                      href={`/route/${selectedRoute.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg transition-all"
                    >
                      <Compass className="w-4 h-4" />
                      Explore Interactive Route Map
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </AppShell>
  )
}
