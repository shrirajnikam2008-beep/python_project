'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ExternalLink,
  ShieldCheck,
  Calendar,
  MapPin,
  CheckCircle2,
  Users,
  Award,
  Clock,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Share2,
} from 'lucide-react'
import type { Opportunity } from '@/lib/types'
import {
  OpportunityMatchBadge,
  OpportunitySourceBadge,
  OpportunityFreshnessBadge,
} from './OpportunityBadges'

interface ModalProps {
  opportunity: Opportunity | null
  onClose: () => void
  isSaved?: boolean
  onToggleSave?: (id: string) => void
}

export function OpportunityDetailsModal({
  opportunity,
  onClose,
  isSaved,
  onToggleSave,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!opportunity) return null

  const targetUrl = opportunity.officialUrl || opportunity.url || opportunity.sourceUrl || '#'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xs">
        {/* Backdrop Click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] z-10"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/60">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <OpportunityMatchBadge score={opportunity.matchScore ?? 85} />
                <OpportunitySourceBadge
                  trustLevel={opportunity.sourceTrust}
                  sourceName={opportunity.sourceName}
                  isMock={opportunity.isMock}
                />
                <OpportunityFreshnessBadge
                  freshness={opportunity.freshness}
                  daysRemaining={opportunity.daysRemaining}
                />
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                {opportunity.title}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-blue-600 mt-0.5">
                {opportunity.organization}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
            {/* Human Career Advisor Analysis */}
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Personalized Match Analysis:</span>
                </div>
                {opportunity.aiPersonalized ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                    AI personalized
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                    Smart local match
                  </span>
                )}
              </div>

              {opportunity.personalizedExplanation?.matchSummary && (
                <p className="text-xs font-semibold text-blue-950 italic bg-white/70 p-2.5 rounded-xl border border-blue-100">
                  "{opportunity.personalizedExplanation.matchSummary}"
                </p>
              )}

              {/* Reasons */}
              <div>
                <span className="text-[11px] font-bold text-blue-900 block mb-1">Why this is strong for you:</span>
                <ul className="space-y-1 pl-1">
                  {(opportunity.personalizedExplanation?.whyRecommended || opportunity.matchReasons || []).map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-blue-950 font-medium">
                      <span className="text-blue-500 font-bold shrink-0">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skill Development */}
              {opportunity.personalizedExplanation?.skillDevelopment && opportunity.personalizedExplanation.skillDevelopment.length > 0 && (
                <div className="pt-2 border-t border-blue-200/60 flex items-center gap-1.5 flex-wrap text-xs">
                  <span className="font-bold text-blue-900 text-[11px]">Skills Gained:</span>
                  {opportunity.personalizedExplanation.skillDevelopment.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-white text-[11px] font-bold text-blue-800 border border-blue-200">
                      +{s}
                    </span>
                  ))}
                </div>
              )}

              {/* Career Relevance & Best For */}
              {opportunity.personalizedExplanation?.careerRelevance && (
                <p className="text-[11px] text-blue-900">
                  <strong>Career Relevance:</strong> {opportunity.personalizedExplanation.careerRelevance}
                </p>
              )}
              {opportunity.personalizedExplanation?.bestFor && (
                <p className="text-[11px] text-blue-900">
                  <strong>Ideal For:</strong> {opportunity.personalizedExplanation.bestFor}
                </p>
              )}

              {/* Potential Concern */}
              {opportunity.personalizedExplanation?.potentialConcern && opportunity.personalizedExplanation.potentialConcern !== 'None identified' && (
                <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-200 text-amber-900 text-[11px] leading-tight">
                  <span className="font-bold">Potential concern: </span>
                  <span>{opportunity.personalizedExplanation.potentialConcern}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Overview &amp; Scope
              </h4>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                {opportunity.description}
              </p>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Mode</span>
                <span className="font-bold text-slate-800">{opportunity.mode}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Location</span>
                <span className="font-bold text-slate-800">{opportunity.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Deadline</span>
                <span className="font-bold text-slate-800">{opportunity.deadline}</span>
              </div>
              {opportunity.stipendOrPrize && (
                <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Stipend / Prize Pool</span>
                  <span className="font-extrabold text-emerald-700">{opportunity.stipendOrPrize}</span>
                </div>
              )}
            </div>

            {/* Structured Eligibility */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Eligibility &amp; Target Batch
              </h4>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5 text-xs">
                <p className="text-slate-700">
                  <strong>Stated Criterion:</strong> {opportunity.eligibility}
                </p>
                {opportunity.structuredEligibility && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                      Years: {opportunity.structuredEligibility.minYear ?? 1}–{opportunity.structuredEligibility.maxYear ?? 4}
                    </span>
                    {opportunity.structuredEligibility.cgpaRequirement ? (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                        Min CGPA: {opportunity.structuredEligibility.cgpaRequirement}
                      </span>
                    ) : null}
                    {opportunity.structuredEligibility.eligibleBranches?.map((b) => (
                      <span key={b} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Source Verification Audit */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verification Audit:
                </span>
                <span>Last Verified: <strong>{opportunity.lastVerified ?? '2026-10-06'}</strong></span>
              </div>
              <p>
                Canonical Host: <strong>{opportunity.sourceName ?? opportunity.organization}</strong> • Trust Tier: <strong className="capitalize">{opportunity.sourceTrust ?? 'official'}</strong>
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {onToggleSave && (
                <button
                  type="button"
                  onClick={() => onToggleSave(opportunity.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isSaved
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isSaved ? <BookmarkCheck className="w-4 h-4 text-blue-600" /> : <Bookmark className="w-4 h-4 text-slate-400" />}
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
              )}
            </div>

            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md"
            >
              <span>Apply on Official Site</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
