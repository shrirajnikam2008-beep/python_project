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
} from 'lucide-react'

type TabFilter = 'all' | OpportunityType

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
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    border: 'hover:border-amber-300',
    bg: 'bg-amber-50/50',
  },
  Competition: {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    border: 'hover:border-indigo-300',
    bg: 'bg-indigo-50/50',
  },
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    getStudentProfile()
      .then((p) => {
        setProfile(p)
        return getOpportunities(p?.selectedDestinationId)
      })
      .then(setOpportunities)
      .catch(() => setError('Failed to load opportunities.'))
      .finally(() => setLoading(false))
  }, [])

  const destination: Destination = getDestinationById(profile?.selectedDestinationId)

  // Filter based on active tab and search query
  const filtered = opportunities.filter((op) => {
    const matchesTab = activeTab === 'all' || op.type === activeTab
    const matchesSearch =
      searchQuery.trim() === '' ||
      op.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesTab && matchesSearch
  })

  const hackathonCount = opportunities.filter((op) => op.type === 'Hackathon').length
  const internshipCount = opportunities.filter((op) => op.type === 'Internship').length
  const researchCount = opportunities.filter((op) => op.type === 'Research').length
  const incubatorCount = opportunities.filter((op) => op.type === 'Incubator' || op.type === 'Competition').length

  return (
    <AuthGuard>
      <AppShell title="Opportunities" breadcrumb={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Opportunities' }]}>
        <div className="space-y-8">
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

            {/* Quick Metrics Strip */}
            {!loading && (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
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

          {/* Search & Tabs Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: `All Opportunities (${opportunities.length})` },
                { id: 'Hackathon', label: `Hackathons (${hackathonCount})` },
                { id: 'Internship', label: `Internships (${internshipCount})` },
                { id: 'Research', label: `Research & PMRF (${researchCount})` },
                { id: 'Incubator', label: `Business & Incubators (${incubatorCount})` },
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
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No matching opportunities found</h3>
              <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting &quot;All Opportunities&quot;.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((op) => {
                const Icon = typeIcons[op.type] || Trophy
                const style = typeStyles[op.type] || typeStyles.Hackathon

                return (
                  <motion.div
                    key={op.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${style.border}`}
                  >
                    <div>
                      {/* Top Row: Type Badge + Featured + Mode */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border ${style.badge}`}>
                            <Icon className="w-3 h-3" />
                            {op.type}
                          </span>
                          {op.featured && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              ★ Featured
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {op.mode}
                        </span>
                      </div>

                      {/* Title & Organization */}
                      <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                        {op.title}
                      </h3>
                      <p className="text-xs font-semibold text-blue-600 mb-3">{op.organization}</p>

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
