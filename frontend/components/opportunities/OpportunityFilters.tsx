'use client'

import React from 'react'
import { Sparkles, Flame, Clock, Zap, Bookmark, SlidersHorizontal } from 'lucide-react'
import type { OpportunityType } from '@/lib/types'

export type TabFilter = 'all' | OpportunityType
export type DailyFilter = 'all' | 'trending' | 'closing-soon' | 'new-today' | 'saved'
export type SortOption = 'best_match' | 'latest' | 'closing_soon' | 'trending'

interface FiltersProps {
  activeTab: TabFilter
  onTabChange: (tab: TabFilter) => void
  dailyFilter: DailyFilter
  onDailyFilterChange: (daily: DailyFilter) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  savedCount: number
  counts: {
    total: number
    hackathons: number
    internships: number
    research: number
    incubators: number
  }
}

export function OpportunityFilters({
  activeTab,
  onTabChange,
  dailyFilter,
  onDailyFilterChange,
  sortBy,
  onSortChange,
  savedCount,
  counts,
}: FiltersProps) {
  return (
    <div className="space-y-3">
      {/* Daily Status Pulse Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Opportunities', icon: Sparkles },
            { id: 'trending', label: '🔥 Trending', icon: Flame },
            { id: 'closing-soon', label: '⚡ Closing Soon (<7d)', icon: Clock },
            { id: 'new-today', label: '🟢 Just Opened', icon: Zap },
            { id: 'saved', label: `⭐ Saved (${savedCount})`, icon: Bookmark },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onDailyFilterChange(f.id as DailyFilter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                dailyFilter === f.id
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-500">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="best_match">Best Match</option>
            <option value="latest">Latest Posted</option>
            <option value="closing_soon">Closing Soonest</option>
            <option value="trending">Trending Velocity</option>
          </select>
        </div>
      </div>

      {/* Domain Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All Domains (${counts.total})` },
          { id: 'Hackathon', label: `Hackathons (${counts.hackathons})` },
          { id: 'Internship', label: `Internships (${counts.internships})` },
          { id: 'Research', label: `Research & PMRF (${counts.research})` },
          { id: 'Incubator', label: `Startups & Grants (${counts.incubators})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id as TabFilter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
