'use client'

import React, { useState } from 'react'
import { Search, Sparkles, X, ArrowRight, Filter, Compass } from 'lucide-react'
import type { OpportunitySearchCriteria } from '@/lib/types'

interface AISearchProps {
  onSearch: (query: string, isAiMode: boolean) => void
  onClear: () => void
  parsedCriteria?: OpportunitySearchCriteria | null
  isLoading?: boolean
}

const SUGGESTED_QUERIES = [
  'Find AI & ML internships for 1st year students',
  'Remote research fellowships with stipend',
  'National cybersecurity hackathons in India',
  'Open source mentorship programs like GSoC',
]

export function AIOpportunitySearch({ onSearch, onClear, parsedCriteria, isLoading }: AISearchProps) {
  const [query, setQuery] = useState('')
  const [isAiMode, setIsAiMode] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      onClear()
      return
    }
    onSearch(query.trim(), isAiMode)
  }

  const handleChipClick = (suggestion: string) => {
    setQuery(suggestion)
    onSearch(suggestion, true)
  }

  const handleReset = () => {
    setQuery('')
    onClear()
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
      {/* Search Header Strip */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            {isAiMode ? <Sparkles className="w-4 h-4 text-blue-600" /> : <Search className="w-4 h-4 text-slate-600" />}
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              {isAiMode ? 'Opportunity Intelligence Engine' : 'Direct Keyword Filter'}
            </h3>
            <p className="text-[10px] text-slate-400">
              {isAiMode ? 'Translates natural intent into structured eligibility & domain criteria' : 'Fast literal matching on titles, tags, and organizations'}
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setIsAiMode(true)}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              isAiMode ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3 h-3 text-blue-600" />
            AI Search
          </button>
          <button
            type="button"
            onClick={() => setIsAiMode(false)}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              !isAiMode ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Quick Search
          </button>
        </div>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {isAiMode ? <Sparkles className="w-4 h-4 text-blue-500" /> : <Search className="w-4 h-4 text-slate-400" />}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            isAiMode
              ? 'Try: "Find remote AI/ML internships for first-year IT students with stipend..."'
              : 'Search by keyword, tag, or organization (e.g. Amazon, SIH, GSoC)...'
          }
          className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 text-slate-900 placeholder:text-slate-400 transition-all"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-2xs disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Search</span>
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Active Parsed Intent Chips */}
      {parsedCriteria && (parsedCriteria.types || parsedCriteria.domains || parsedCriteria.targetYear || parsedCriteria.mode) && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3 h-3 text-blue-500" />
            Interpreted Criteria:
          </span>
          {parsedCriteria.domains?.map((d) => (
            <span key={d} className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
              Domain: {d}
            </span>
          ))}
          {parsedCriteria.types?.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              Type: {t}
            </span>
          ))}
          {parsedCriteria.targetYear && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              Target: Year {parsedCriteria.targetYear}
            </span>
          )}
          {parsedCriteria.mode?.map((m) => (
            <span key={m} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
              Mode: {m}
            </span>
          ))}
        </div>
      )}

      {/* Suggested Natural Language Queries */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
        <span className="text-[10px] font-semibold text-slate-400">Suggested:</span>
        {SUGGESTED_QUERIES.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleChipClick(suggestion)}
            className="text-[10px] text-slate-600 hover:text-blue-600 bg-slate-100/80 hover:bg-blue-50 px-2 py-0.8 rounded-md transition-colors border border-slate-200/60"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
