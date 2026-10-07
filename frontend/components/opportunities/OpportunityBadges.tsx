'use client'

import React from 'react'
import { ShieldCheck, CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react'
import type { SourceTrustLevel, FreshnessCategory, VerificationStatus } from '@/lib/types'

interface MatchBadgeProps {
  score: number
  className?: string
}

export function OpportunityMatchBadge({ score, className }: MatchBadgeProps) {
  let color = 'bg-emerald-50 text-emerald-800 border-emerald-300'
  let dotColor = 'bg-emerald-500'

  if (score < 70) {
    color = 'bg-amber-50 text-amber-800 border-amber-300'
    dotColor = 'bg-amber-500'
  } else if (score < 85) {
    color = 'bg-blue-50 text-blue-800 border-blue-300'
    dotColor = 'bg-blue-500'
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-extrabold border shadow-2xs ${color} ${className ?? ''}`}
      title={`Deterministic Match Score: ${score}/100`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor} animate-pulse`} />
      {score}% Match
    </span>
  )
}

interface SourceBadgeProps {
  trustLevel?: SourceTrustLevel
  sourceName?: string
  isMock?: boolean
}

export function OpportunitySourceBadge({ trustLevel = 'official', sourceName, isMock }: SourceBadgeProps) {
  if (isMock) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200" title="Demonstration data for review testing">
        <AlertCircle className="w-3 h-3 text-amber-600" />
        Demo Record
      </span>
    )
  }

  if (trustLevel === 'official') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200" title="Direct institutional host or government authority">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Official Source
      </span>
    )
  }

  if (trustLevel === 'recognized') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200" title="Established national academic or development platform">
        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
        Recognized Platform
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
      Third-Party Directory
    </span>
  )
}

interface FreshnessBadgeProps {
  freshness?: FreshnessCategory
  daysRemaining?: number
}

export function OpportunityFreshnessBadge({ freshness, daysRemaining }: FreshnessBadgeProps) {
  if (freshness === 'CLOSING_SOON' || (daysRemaining !== undefined && daysRemaining <= 7 && daysRemaining >= 0)) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
        <Clock className="w-3 h-3 text-rose-600" />
        CLOSING SOON ({daysRemaining ?? 3}d left)
      </span>
    )
  }

  if (freshness === 'NEW') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
        <Zap className="w-3 h-3 text-emerald-600" />
        NEW CYCLE
      </span>
    )
  }

  if (freshness === 'EXPIRED') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
        EXPIRED
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
      RECENT
    </span>
  )
}
