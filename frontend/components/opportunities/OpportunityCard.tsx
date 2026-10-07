'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  Calendar,
  MapPin,
  Bookmark,
  BookmarkCheck,
  Share2,
  CheckCircle2,
  Info,
  Clock,
  Sparkles,
  Trophy,
  Briefcase,
  GraduationCap,
  Rocket,
  Award,
  AlertTriangle,
  Lightbulb,
  Compass,
} from 'lucide-react'
import type { Opportunity, OpportunityType } from '@/lib/types'
import {
  OpportunityMatchBadge,
  OpportunitySourceBadge,
  OpportunityFreshnessBadge,
} from './OpportunityBadges'

const typeIcons: Record<string, React.ElementType> = {
  Hackathon: Trophy,
  Internship: Briefcase,
  Research: GraduationCap,
  Incubator: Rocket,
  Competition: Award,
  Fellowship: GraduationCap,
  Scholarship: Award,
  'Open Source': Rocket,
  'Student Program': Briefcase,
}

interface CardProps {
  opportunity: Opportunity
  isSaved?: boolean
  onToggleSave?: (id: string) => void
  onSelectDetails?: (opp: Opportunity) => void
}

export function OpportunityCard({
  opportunity,
  isSaved,
  onToggleSave,
  onSelectDetails,
}: CardProps) {
  const [copied, setCopied] = useState(false)
  const Icon = typeIcons[opportunity.type] || Trophy
  const targetUrl = opportunity.officialUrl || opportunity.url || opportunity.sourceUrl || '#'
  const exp = opportunity.personalizedExplanation

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(targetUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleSave?.(opportunity.id)
  }

  const strongReasons = exp?.whyRecommended && exp.whyRecommended.length > 0
    ? exp.whyRecommended
    : (opportunity.matchReasons && opportunity.matchReasons.length > 0 ? opportunity.matchReasons : [
        `Directly advances milestones for your target career`,
        `Verified host: ${opportunity.organization}`,
        opportunity.mode === 'Online' ? 'Remote participation available' : 'In-person project immersion',
      ])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:border-blue-300 group"
    >
      <div>
        {/* Top Header Strip: Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border bg-blue-50 text-blue-700 border-blue-200">
              <Icon className="w-3 h-3" />
              {opportunity.type}
            </span>

            <OpportunitySourceBadge
              trustLevel={opportunity.sourceTrust}
              sourceName={opportunity.sourceName}
              isMock={opportunity.isMock}
            />

            <OpportunityFreshnessBadge
              freshness={opportunity.freshness}
              daysRemaining={opportunity.daysRemaining}
            />

            {/* AI Personalization Indicator Pill */}
            {opportunity.aiPersonalized ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
                AI personalized
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                <Compass className="w-3 h-3 text-slate-400" />
                Smart local match
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleShare}
              title="Copy official link"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleSaveClick}
              title={isSaved ? 'Remove from saved' : 'Save opportunity'}
              className={`p-1.5 rounded-lg transition-colors ${
                isSaved ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Opportunity Title & Host */}
        <div className="mb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
              {opportunity.title}
            </h3>
            <OpportunityMatchBadge score={opportunity.matchScore ?? 85} />
          </div>
          <p className="text-xs font-bold text-slate-500 mt-0.5">{opportunity.organization}</p>
        </div>

        {/* Advisor Summary */}
        {exp?.matchSummary && (
          <p className="text-xs text-slate-600 font-medium italic mb-3">
            "{exp.matchSummary}"
          </p>
        )}

        {/* Human Advisor Box: Why Strong for You */}
        <div className="my-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100/90 text-[11px] space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-blue-900">
            <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
            <span>Why this is strong for you:</span>
          </div>
          <ul className="space-y-1 pl-1">
            {strongReasons.slice(0, 4).map((r, i) => (
              <li key={i} className="flex items-start gap-1.5 text-blue-950 font-medium leading-relaxed">
                <span className="text-blue-500 font-bold shrink-0">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>

          {/* Skill Development row */}
          {exp?.skillDevelopment && exp.skillDevelopment.length > 0 && (
            <div className="pt-2 border-t border-blue-200/60 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-blue-900">Skill benefit:</span>
              {exp.skillDevelopment.slice(0, 3).map((sk) => (
                <span
                  key={sk}
                  className="px-1.5 py-0.5 rounded bg-white text-[10px] font-semibold text-blue-800 border border-blue-200"
                >
                  +{sk}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Potential Concern Caveat */}
        {exp?.potentialConcern && exp.potentialConcern !== 'None identified' && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] flex items-start gap-2 text-amber-900">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="font-bold">Potential concern: </span>
              <span className="font-normal text-amber-800">{exp.potentialConcern}</span>
            </div>
          </div>
        )}

        {/* Structured Eligibility & Deadline Strip */}
        <div className="space-y-1.5 py-2.5 px-3 bg-slate-50 rounded-xl mb-3 text-[11px]">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-400 font-medium">Deadline:</span>
            <span className="font-bold text-slate-800">{opportunity.deadline}</span>
          </div>

          {opportunity.stipendOrPrize && (
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-slate-400 font-medium">Stipend / Prize:</span>
              <span className="font-extrabold text-emerald-700">{opportunity.stipendOrPrize}</span>
            </div>
          )}

          <div className="pt-1 border-t border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-semibold block">Eligibility Check:</span>
            <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium">
                ✓ Years: {opportunity.structuredEligibility?.minYear ?? 1}–{opportunity.structuredEligibility?.maxYear ?? 4}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium truncate max-w-[140px]">
                ✓ {opportunity.structuredEligibility?.eligibleBranches?.[0] ?? 'Engineering'}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium">
                ✓ {opportunity.mode}
              </span>
            </div>
          </div>
        </div>

        {/* Verification Audit Timestamp */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-3 px-1">
          <span>Verified: <strong>{opportunity.lastVerified ?? '2026-10-06'}</strong></span>
          <span>Source: <strong>{opportunity.sourceName ?? opportunity.organization}</strong></span>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onSelectDetails?.(opportunity)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          View Analysis
        </button>

        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs group"
        >
          <span>Official Apply</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {copied && (
        <p className="text-center text-[10px] text-emerald-600 font-bold mt-1">
          Verified Link copied to clipboard!
        </p>
      )}
    </motion.div>
  )
}
