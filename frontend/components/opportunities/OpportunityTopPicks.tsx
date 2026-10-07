'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Target,
  Zap,
  GraduationCap,
  Clock,
  ExternalLink,
  ChevronRight,
  Award,
} from 'lucide-react'
import type { Opportunity, TopPicksResponse } from '@/lib/types'
import { OpportunityMatchBadge } from './OpportunityBadges'

interface TopPicksProps {
  topPicks?: TopPicksResponse | null
  onSelectDetails?: (opp: Opportunity) => void
  isAiActive?: boolean
}

export function OpportunityTopPicks({ topPicks, onSelectDetails, isAiActive }: TopPicksProps) {
  if (!topPicks) return null

  const items = [
    {
      category: 'Best Career Match',
      icon: Target,
      color: 'border-blue-200 bg-blue-50/50 text-blue-700',
      tagBg: 'bg-blue-600 text-white',
      opp: topPicks.bestCareerMatch,
      subtitle: 'Highest alignment with your selected career path',
    },
    {
      category: 'Best Skill-Building',
      icon: Zap,
      color: 'border-amber-200 bg-amber-50/50 text-amber-700',
      tagBg: 'bg-amber-600 text-white',
      opp: topPicks.bestSkillBuilding,
      subtitle: 'Accelerates mastery in identified skill gaps',
    },
    {
      category: 'Best Beginner Opportunity',
      icon: Award,
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-700',
      tagBg: 'bg-emerald-600 text-white',
      opp: topPicks.bestBeginner,
      subtitle: 'Introductory friendly for early engineering students',
    },
    {
      category: 'Best Research Opportunity',
      icon: GraduationCap,
      color: 'border-purple-200 bg-purple-50/50 text-purple-700',
      tagBg: 'bg-purple-600 text-white',
      opp: topPicks.bestResearch,
      subtitle: 'Prestigious fellowship and academic exposure',
    },
    {
      category: 'Closing Soon',
      icon: Clock,
      color: 'border-rose-200 bg-rose-50/50 text-rose-700',
      tagBg: 'bg-rose-600 text-white',
      opp: topPicks.bestClosingSoon,
      subtitle: 'Application window closing in upcoming days',
    },
  ].filter((item) => Boolean(item.opp))

  if (items.length === 0) return null

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              Recommended for You
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Curated top picks based on your current skills, branch standing, and target career
            </p>
          </div>
        </div>

        {isAiActive ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            AI personalized
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            Smart local recommendations
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {items.map((item, idx) => {
          const opp = item.opp!
          const Icon = item.icon
          const targetUrl = opp.officialUrl || opp.url || '#'

          return (
            <motion.div
              key={item.category + idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.2 }}
              onClick={() => onSelectDetails?.(opp)}
              className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Category Header Tag */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${item.color}`}>
                    <Icon className="w-3 h-3 shrink-0" />
                    <span>{item.category}</span>
                  </span>
                  <OpportunityMatchBadge score={opp.matchScore ?? 85} />
                </div>

                {/* Title & Organization */}
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight mb-1">
                  {opp.title}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium truncate mb-2">
                  {opp.organization}
                </p>

                {/* Grounded Key Advisor Highlight */}
                {opp.personalizedExplanation?.matchSummary ? (
                  <p className="text-[10px] text-slate-600 font-medium line-clamp-2 mb-2 italic bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    "{opp.personalizedExplanation.matchSummary}"
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 line-clamp-2 mb-2">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {/* Bottom strip */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-semibold truncate max-w-[100px]">
                  {opp.deadline}
                </span>
                <span className="text-blue-600 font-bold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  View <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
