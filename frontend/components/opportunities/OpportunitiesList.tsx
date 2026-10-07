'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'
import type { Opportunity } from '@/lib/types'
import { OpportunityCard } from './OpportunityCard'
import { SkeletonCard } from '@/components/ui/SkeletonLoader'

interface ListProps {
  opportunities: Opportunity[]
  savedIds: string[]
  onToggleSave: (id: string) => void
  onSelectDetails: (opp: Opportunity) => void
  isLoading?: boolean
  onResetFilters?: () => void
}

export function OpportunitiesList({
  opportunities,
  savedIds,
  onToggleSave,
  onSelectDetails,
  isLoading,
  onResetFilters,
}: ListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (opportunities.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No matching opportunities found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          We could not find opportunities matching your current filters. Try relaxing search criteria or switching to &quot;All Opportunities&quot;.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            Reset All Filters
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {opportunities.map((op) => (
        <OpportunityCard
          key={op.id}
          opportunity={op}
          isSaved={savedIds.includes(op.id)}
          onToggleSave={onToggleSave}
          onSelectDetails={onSelectDetails}
        />
      ))}
    </div>
  )
}
export default OpportunitiesList
