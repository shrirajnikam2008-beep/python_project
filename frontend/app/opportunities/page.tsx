'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { ErrorState } from '@/components/ui/ErrorState'
import { getOpportunities, getStudentProfile, searchOpportunities } from '@/lib/api'
import { getDestinationById } from '@/lib/mock-data/destinations'
import {
  AIOpportunitySearch,
} from '@/components/opportunities/AIOpportunitySearch'
import {
  OpportunityFilters,
  type TabFilter,
  type DailyFilter,
  type SortOption,
} from '@/components/opportunities/OpportunityFilters'
import { OpportunitiesList } from '@/components/opportunities/OpportunitiesList'
import { OpportunityDetailsModal } from '@/components/opportunities/OpportunityDetailsModal'
import { OpportunityTopPicks } from '@/components/opportunities/OpportunityTopPicks'
import type {
  Opportunity,
  OpportunityType,
  StudentProfile,
  Destination,
  OpportunitySearchCriteria,
  TopPicksResponse,
} from '@/lib/types'
import {
  Trophy,
  Briefcase,
  GraduationCap,
  Rocket,
  Flame,
  Clock,
  Zap,
} from 'lucide-react'

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters state
  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [dailyFilter, setDailyFilter] = useState<DailyFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('best_match')
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)
  const [parsedCriteria, setParsedCriteria] = useState<OpportunitySearchCriteria | null>(null)
  const [topPicks, setTopPicks] = useState<TopPicksResponse | null>(null)
  const [isAiActive, setIsAiActive] = useState<boolean>(false)
  const [personalizedSummary, setPersonalizedSummary] = useState<string | null>(null)

  // 1. Initial Load: Profile & Recommended Opportunities
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('waypoint_saved_opps')
        if (raw) setSavedIds(JSON.parse(raw))
      } catch {}
    }

    setLoading(true)
    getStudentProfile()
      .then(async (p) => {
        setProfile(p)
        const result = await searchOpportunities('', p)
        setOpportunities(result.items)
        setTopPicks(result.topPicks ?? null)
        setIsAiActive(result.mode === 'gemini')
        setPersonalizedSummary(result.personalizedSummary ?? null)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load opportunities.')
        setLoading(false)
      })
  }, [])

  // 2. Bookmark / Save handler
  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      if (typeof window !== 'undefined') {
        localStorage.setItem('waypoint_saved_opps', JSON.stringify(next))
      }
      return next
    })
  }

  // 3. Search Handler (Dual Mode: AI Intent Search vs Quick Search)
  const handleSearch = async (query: string, isAiMode: boolean) => {
    if (!query.trim()) {
      handleClearSearch()
      return
    }

    setSearchLoading(true)
    try {
      const result = await searchOpportunities(query, profile, {
        sortBy,
        type: activeTab !== 'all' ? activeTab : undefined,
      })
      setOpportunities(result.items)
      setParsedCriteria(result.parsedCriteria ?? null)
      setTopPicks(result.topPicks ?? null)
      setIsAiActive(result.mode === 'gemini')
      setPersonalizedSummary(result.personalizedSummary ?? null)
    } catch {
      // Fallback: local filter
      const lower = query.toLowerCase()
      setOpportunities((prev) =>
        prev.filter(
          (o) =>
            o.title.toLowerCase().includes(lower) ||
            o.organization.toLowerCase().includes(lower) ||
            o.tags.some((t) => t.toLowerCase().includes(lower))
        )
      )
    } finally {
      setSearchLoading(false)
    }
  }

  const handleClearSearch = async () => {
    setParsedCriteria(null)
    setSearchLoading(true)
    try {
      const result = await searchOpportunities('', profile)
      setOpportunities(result.items)
      setTopPicks(result.topPicks ?? null)
      setIsAiActive(result.mode === 'gemini')
      setPersonalizedSummary(result.personalizedSummary ?? null)
    } finally {
      setSearchLoading(false)
    }
  }

  const destination: Destination = getDestinationById(profile?.selectedDestinationId)

  // 4. Client-side Filter Slice (Category, Daily status, Saved)
  const displayedOpportunities = useMemo(() => {
    return opportunities.filter((op) => {
      const matchesCategory = activeTab === 'all' || op.type === activeTab

      let matchesDaily = true
      if (dailyFilter === 'trending') {
        matchesDaily = Boolean(op.isTrending || (op.trendingScore ?? 0) >= 90)
      } else if (dailyFilter === 'closing-soon') {
        matchesDaily = Boolean(op.isClosingSoon || (op.daysRemaining ?? 30) <= 7)
      } else if (dailyFilter === 'new-today') {
        matchesDaily = Boolean(op.isNewToday || (op.postedAt ?? '').includes('Today'))
      } else if (dailyFilter === 'saved') {
        matchesDaily = savedIds.includes(op.id)
      }

      return matchesCategory && matchesDaily
    })
  }, [opportunities, activeTab, dailyFilter, savedIds])

  // Count aggregates
  const counts = useMemo(() => {
    return {
      total: opportunities.length,
      hackathons: opportunities.filter((op) => op.type === 'Hackathon').length,
      internships: opportunities.filter((op) => op.type === 'Internship').length,
      research: opportunities.filter((op) => op.type === 'Research' || op.type === 'Fellowship').length,
      incubators: opportunities.filter((op) => op.type === 'Incubator' || op.type === 'Competition').length,
      trending: opportunities.filter((op) => op.isTrending || (op.trendingScore ?? 0) >= 90).length,
      closingSoon: opportunities.filter((op) => op.isClosingSoon || (op.daysRemaining ?? 30) <= 7).length,
    }
  }, [opportunities])

  return (
    <AuthGuard>
      <AppShell
        title="Opportunities"
        breadcrumb={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Opportunities' }]}
      >
        <div className="space-y-6">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    Opportunity Intelligence Engine
                  </span>
                  <span className="text-xs text-slate-400">Verified Sources &amp; Official Portals</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Ecosystem Opportunities &amp; Radar
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Real, verified hackathons, research fellowships, internships, and startup grant calls ranked deterministically for your destination: <strong>{destination.title}</strong>.
                </p>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-xl border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Target Goal: {destination.title}
                </span>
              </div>
            </div>

            {/* Live Daily Radar Pulse Strip */}
            <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white border border-blue-800/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live Opportunity Radar</span>
                    <span className="text-[11px] text-slate-400">• Verified 6 Oct 2026</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Showing verified programs matched to your academic standing and skill gaps.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-amber-300 font-semibold border border-white/10 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> {counts.trending} Trending
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-rose-300 font-semibold border border-white/10 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-400" /> {counts.closingSoon} Closing Soon
                </span>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            {!loading && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Hackathons</p>
                    <p className="text-lg font-bold text-slate-900">{counts.hackathons} active</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Internships</p>
                    <p className="text-lg font-bold text-slate-900">{counts.internships} drives</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Research Grants</p>
                    <p className="text-lg font-bold text-slate-900">{counts.research} calls</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Startup Grants</p>
                    <p className="text-lg font-bold text-slate-900">{counts.incubators} funds</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* AI Opportunity Search Component */}
          <AIOpportunitySearch
            onSearch={handleSearch}
            onClear={handleClearSearch}
            parsedCriteria={parsedCriteria}
            isLoading={searchLoading}
          />

          {/* AI Personalized Advisor Summary Banner */}
          {personalizedSummary && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/80 border border-blue-200/80 text-xs text-blue-950 flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
                <span className="font-semibold">{personalizedSummary}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                isAiActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {isAiActive ? '✨ AI Personalized' : '🛡️ Smart Local Match'}
              </span>
            </motion.div>
          )}

          {/* Recommended for You: Top Picks */}
          {!loading && !searchLoading && topPicks && (
            <OpportunityTopPicks
              topPicks={topPicks}
              onSelectDetails={(opp) => setSelectedOpportunity(opp)}
              isAiActive={isAiActive}
            />
          )}

          {/* Opportunity Filters (Daily Status + Domain Categories + Sort) */}
          <OpportunityFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            dailyFilter={dailyFilter}
            onDailyFilterChange={setDailyFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            savedCount={savedIds.length}
            counts={counts}
          />

          {/* Opportunities Cards Grid */}
          {error ? (
            <ErrorState message={error} onRetry={() => window.location.reload()} />
          ) : (
            <OpportunitiesList
              opportunities={displayedOpportunities}
              savedIds={savedIds}
              onToggleSave={toggleSave}
              onSelectDetails={(opp) => setSelectedOpportunity(opp)}
              isLoading={loading || searchLoading}
              onResetFilters={() => {
                setActiveTab('all')
                setDailyFilter('all')
                handleClearSearch()
              }}
            />
          )}

          {/* Detailed Program Modal */}
          <OpportunityDetailsModal
            opportunity={selectedOpportunity}
            onClose={() => setSelectedOpportunity(null)}
            isSaved={selectedOpportunity ? savedIds.includes(selectedOpportunity.id) : false}
            onToggleSave={toggleSave}
          />
        </div>
      </AppShell>
    </AuthGuard>
  )
}
