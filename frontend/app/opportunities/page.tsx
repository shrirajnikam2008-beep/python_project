'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { SkeletonCard } from '@/components/ui/SkeletonLoader'
import { ErrorState } from '@/components/ui/ErrorState'
import { getOpportunities, getStudentProfile } from '@/lib/api'
import { getDestinationById } from '@/lib/mock-data/destinations'
import type { Opportunity, OpportunityType, StudentProfile, Destination } from '@/lib/types'
import {
  Sparkles,
  Trophy,
  Briefcase,
  GraduationCap,
  Rocket,
  Calendar,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Filter,
  Search,
  Zap,
  Globe,
  Award,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Clock,
  Flame,
  Share2,
  Users,
} from 'lucide-react'

type TabFilter = 'all' | OpportunityType
type DailyFilter = 'all' | 'trending' | 'closing-soon' | 'new-today' | 'saved'

const typeIcons: Record<OpportunityType, React.ElementType> = {
  Hackathon: Trophy,
  Internship: Briefcase,
  Research: GraduationCap,
  Incubator: Rocket,
  Competition: Award,
}

const typeStyles: Record<OpportunityType, { badge: string; border: string; bg: string }> = {
  Hackathon: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    border: 'hover:border-blue-300',
    bg: 'bg-blue-50/50',
  },
  Internship: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    border: 'hover:border-emerald-300',
    bg: 'bg-emerald-50/50',
  },
  Research: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    border: 'hover:border-purple-300',
    bg: 'bg-purple-50/50',
  },
  Incubator: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    border: 'hover:border-rose-300',
    bg: 'bg-rose-50/50',
  },
  Competition: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    border: 'hover:border-amber-300',
    bg: 'bg-amber-50/50',
  },
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [dailyFilter, setDailyFilter] = useState<DailyFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    // Load saved bookmarks from localStorage
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('waypoint_saved_opps')
        if (raw) setSavedIds(JSON.parse(raw))
      } catch {}
    }

    getStudentProfile()
      .then((p) => {
        setProfile(p)
        return getOpportunities(p?.selectedDestinationId)
      })
      .then(setOpportunities)
      .catch(() => setError('Failed to load opportunities.'))
      .finally(() => setLoading(false))
  }, [])

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      if (typeof window !== 'undefined') {
        localStorage.setItem('waypoint_saved_opps', JSON.stringify(next))
      }
      return next
    })
  }

  const handleShare = (id: string, url: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const destination: Destination = getDestinationById(profile?.selectedDestinationId)

  // Filter based on active category, daily pulse filter, and search query
  const filtered = opportunities.filter((op) => {
    const matchesCategory = activeTab === 'all' || op.type === activeTab

    let matchesDaily = true
    if (dailyFilter === 'trending') {
      matchesDaily = Boolean(op.isTrending || (op.trendingScore ?? 0) >= 90)
    } else if (dailyFilter === 'closing-soon') {
      matchesDaily = Boolean(op.isClosingSoon || (op.daysRemaining ?? 30) <= 5)
    } else if (dailyFilter === 'new-today') {
      matchesDaily = Boolean(op.isNewToday || (op.postedAt ?? '').includes('Today'))
    } else if (dailyFilter === 'saved') {
      matchesDaily = savedIds.includes(op.id)
    }

    const matchesSearch =
      searchQuery.trim() === '' ||
      op.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesDaily && matchesSearch
  })

  // Sort if trending is selected
  const displayedOpportunities = [...filtered].sort((a, b) => {
    if (dailyFilter === 'trending') {
      return (b.trendingScore ?? 0) - (a.trendingScore ?? 0)
    }
    if (dailyFilter === 'closing-soon') {
      return (a.daysRemaining ?? 30) - (b.daysRemaining ?? 30)
    }
    return 0
  })

  const hackathonCount = opportunities.filter((op) => op.type === 'Hackathon').length
  const internshipCount = opportunities.filter((op) => op.type === 'Internship').length
  const researchCount = opportunities.filter((op) => op.type === 'Research').length
  const incubatorCount = opportunities.filter((op) => op.type === 'Incubator' || op.type === 'Competition').length
  const trendingCount = opportunities.filter((op) => op.isTrending || (op.trendingScore ?? 0) >= 90).length
  const closingSoonCount = opportunities.filter((op) => op.isClosingSoon || (op.daysRemaining ?? 30) <= 5).length

  return (
    <AuthGuard>
      <AppShell title="Opportunities" breadcrumb={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Opportunities' }]}>
        <div className="space-y-6">
          {/* Header Title Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    Real-World Action Hub
                  </span>
                  <span className="text-xs text-slate-400">Verified Portals &amp; Official Grants</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Ecosystem Opportunities &amp; Radar
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Real, verifiable hackathons, research fellowships, internships, and startup grant programs specifically curated for your active goal: <strong>{destination.title}</strong>.
                </p>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-xl border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Goal: {destination.title}
                </span>
              </div>
            </div>

            {/* Live Daily Radar Pulse Bar */}
            <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white border border-blue-800/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live Daily Radar</span>
                    <span className="text-[11px] text-slate-400">• Refreshed Today</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Showing daily trending programs, upcoming deadlines, and fresh batches.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-amber-300 font-semibold border border-white/10 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> {trendingCount} Trending Today
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-rose-300 font-semibold border border-white/10 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-400" /> {closingSoonCount} Closing Soon
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
                    <p className="text-lg font-bold text-slate-900">{hackathonCount} active</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Internships</p>
                    <p className="text-lg font-bold text-slate-900">{internshipCount} drives</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Research Grants</p>
                    <p className="text-lg font-bold text-slate-900">{researchCount} programs</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Startup Grants</p>
                    <p className="text-lg font-bold text-slate-900">{incubatorCount} calls</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Daily Status Filter Tabs (Trending / Closing Soon / New / Saved) */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80">
            {[
              { id: 'all', label: 'All Opportunities', icon: Sparkles },
              { id: 'trending', label: '🔥 Trending Today', icon: Flame },
              { id: 'closing-soon', label: '⚡ Closing Soon (<7d)', icon: Clock },
              { id: 'new-today', label: '🟢 Just Opened Today', icon: Zap },
              { id: 'saved', label: `⭐ Saved (${savedIds.length})`, icon: Bookmark },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setDailyFilter(f.id as DailyFilter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  dailyFilter === f.id
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search & Domain Category Tabs Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: `All Domains (${opportunities.length})` },
                { id: 'Hackathon', label: `Hackathons (${hackathonCount})` },
                { id: 'Internship', label: `Internships (${internshipCount})` },
                { id: 'Research', label: `Research & PMRF (${researchCount})` },
                { id: 'Incubator', label: `Startups & Incubators (${incubatorCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabFilter)}
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

            {/* Keyword Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, tag, or org..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Opportunities Cards Grid */}
          {error ? (
            <ErrorState message={error} onRetry={() => window.location.reload()} />
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : displayedOpportunities.length === 0 ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No matching opportunities found</h3>
              <p className="text-xs text-slate-400 mt-1">Try switching to &quot;All Opportunities&quot; or clearing your active filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedOpportunities.map((op) => {
                const Icon = typeIcons[op.type] || Trophy
                const style = typeStyles[op.type] || typeStyles.Hackathon
                const isSaved = savedIds.includes(op.id)

                return (
                  <motion.div
                    key={op.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${style.border}`}
                  >
                    <div>
                      {/* Top Row: Type Badge + Daily Badge + Bookmark */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border ${style.badge}`}>
                            <Icon className="w-3 h-3" />
                            {op.type}
                          </span>
                          {op.dailyBadge && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              op.dailyBadge.includes('Trending')
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : op.dailyBadge.includes('Closing')
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}>
                              {op.dailyBadge}
                            </span>
                          )}
                        </div>

                        {/* Save Bookmark Action */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleShare(op.id, op.url)}
                            title="Copy Official Link"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleSave(op.id)}
                            title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isSaved
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Title & Organization */}
                      <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                        {op.title}
                      </h3>
                      <p className="text-xs font-semibold text-blue-600 mb-2">{op.organization}</p>

                      {/* Daily Activity Pulse Row */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-3 pb-2 border-b border-slate-100">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          <strong>+{op.applicantsToday ?? 210}</strong> applied today
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          {op.postedAt ?? 'Recently verified'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                        {op.description}
                      </p>

                      {/* Criteria Highlights */}
                      <div className="space-y-2 py-3 px-3 bg-slate-50 rounded-xl mb-4 text-[11px]">
                        {op.stipendOrPrize && (
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-slate-400 font-medium">Stipend / Prize:</span>
                            <span className="font-bold text-emerald-700">{op.stipendOrPrize}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-slate-700">
                          <span className="text-slate-400 font-medium">Timeline / Deadline:</span>
                          <span className="font-semibold text-slate-800">{op.deadline}</span>
                        </div>
                        <div className="pt-1 border-t border-slate-200/60">
                          <p className="text-[10px] text-slate-400 font-medium">Eligibility:</p>
                          <p className="text-[11px] text-slate-600 font-medium mt-0.5 line-clamp-1">{op.eligibility}</p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {op.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Official Portal Link */}
                    <div className="pt-3 border-t border-slate-100">
                      <a
                        href={op.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition-all border border-slate-200/80 group"
                      >
                        <span className="flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                          Official Portal &amp; Guidelines
                        </span>
                        <span className="text-[10px] text-blue-600 group-hover:underline">Visit →</span>
                      </a>
                      {copiedId === op.id && (
                        <p className="text-center text-[10px] text-emerald-600 font-semibold mt-1">
                          Link copied to clipboard!
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </AppShell>
    </AuthGuard>
  )
}
