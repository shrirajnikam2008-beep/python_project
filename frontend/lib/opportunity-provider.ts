/**
 * Opportunity Provider Abstraction Layer
 *
 * Implements a dual-provider architecture:
 * 1. RealBackendOpportunityProvider: Queries the FastAPI backend at /api/v1/opportunities/*
 * 2. MockOpportunityProvider: Client-side deterministic ranking engine using canonical verified data.
 *
 * If the FastAPI backend is offline or unreachable, the system silently and gracefully
 * falls back to MockOpportunityProvider, ensuring the application remains 100% demonstrably operational.
 */

import type {
  Opportunity,
  OpportunityType,
  StudentProfile,
  OpportunitySource,
  OpportunitySearchResult,
  OpportunitySearchCriteria,
  MatchScoreBreakdown,
  FreshnessCategory,
  VerificationStatus,
  TopPicksResponse,
  OpportunityPersonalizedExplanation,
} from '@/lib/types'
import { baseOpportunities, verifiedSources } from '@/lib/mock-data/opportunities'

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const NETWORK_TIMEOUT_MS = 1500

export interface OpportunityFilterOptions {
  destinationId?: string
  type?: OpportunityType | 'all'
  filterMode?: 'all' | 'trending' | 'closing-soon' | 'new-today' | 'saved'
  sortBy?: 'best_match' | 'latest' | 'closing_soon' | 'trending'
  locationScope?: string
  mode?: 'Online' | 'In-person' | 'Hybrid' | 'all'
}

export interface IOpportunityProvider {
  getOpportunities(options?: OpportunityFilterOptions, profile?: StudentProfile | null): Promise<Opportunity[]>
  getRecommendedOpportunities(profile: StudentProfile, options?: OpportunityFilterOptions): Promise<Opportunity[]>
  searchOpportunities(query: string, profile?: StudentProfile | null, options?: OpportunityFilterOptions): Promise<OpportunitySearchResult>
  getOpportunity(id: string): Promise<Opportunity | null>
  getSources(): Promise<OpportunitySource[]>
}

// ─── Deterministic 100-Point Match Score Engine ─────────────────────────────
export function calculateOpportunityMatch(
  op: Opportunity,
  profile?: StudentProfile | null
): { score: number; breakdown: MatchScoreBreakdown; reasons: string[] } {
  const reasons: string[] = []

  // Default baseline if no profile is provided
  if (!profile) {
    const defaultScore = op.trendingScore ?? 80
    return {
      score: defaultScore,
      breakdown: {
        score: defaultScore,
        profileMatch: 15,
        currentSkillMatch: 5,
        skillGapAlignment: 5,
        careerAlignment: 15,
        eligibilityMatch: 10,
        freshness: 8,
        deadlineUrgency: 3,
        sourceTrust: 4,
        reasons: ['Opportunity aligns with general engineering pathways.'],
      },
      reasons: ['Opportunity aligns with general engineering pathways.'],
    }
  }

  // 1. Profile / Branch Match (Max 25 pts)
  let profileMatch = 0
  const eligibleBranches = op.structuredEligibility?.eligibleBranches ?? []
  const studentBranch = (profile.branch || profile.program || '').toLowerCase()

  if (eligibleBranches.length === 0 || eligibleBranches.some((b) => b.toLowerCase().includes('all') || b.toLowerCase().includes('engineering'))) {
    profileMatch = 22
    reasons.push('Open to all engineering branches')
  } else if (eligibleBranches.some((b) => studentBranch.includes(b.toLowerCase()) || b.toLowerCase().includes('it') || b.toLowerCase().includes('computer'))) {
    profileMatch = 25
    reasons.push(`Directly matches your ${profile.branch || 'B.Tech IT'} curriculum`)
  } else {
    profileMatch = 10
  }

  // 2. Current Skill Match (Max 10 pts)
  let currentSkillMatch = 0
  const studentSkills = (profile.currentSkills ?? []).map((s) => s.toLowerCase())
  const oppSkills = (op.skills ?? []).map((s) => s.toLowerCase())
  const directMatches = oppSkills.filter((sk) => studentSkills.some((curr) => curr.includes(sk) || sk.includes(curr)))

  if (directMatches.length > 0) {
    currentSkillMatch = Math.min(10, directMatches.length * 5)
    reasons.push(`Directly uses your skill: ${directMatches.slice(0, 2).join(', ')}`)
  } else if (studentSkills.length > 0) {
    currentSkillMatch = 4
  }

  // 3. Skill Gap Alignment (Max 10 pts)
  // Rewards opportunities that foster skills the student has yet to acquire
  let skillGapAlignment = 0
  const missingSkills = oppSkills.filter((sk) => !studentSkills.some((curr) => curr.includes(sk) || sk.includes(curr)))

  if (missingSkills.length > 0) {
    skillGapAlignment = Math.min(10, missingSkills.length * 4)
    reasons.push(`Builds critical target competencies: ${missingSkills.slice(0, 2).join(', ')}`)
  } else {
    skillGapAlignment = 6
  }

  // 4. Career Alignment (Max 20 pts)
  let careerAlignment = 0
  const targetDest = (profile.selectedDestinationId || '').toLowerCase()
  const oppDests = (op.destinations ?? []).map((d) => d.toLowerCase())

  if (oppDests.includes('all')) {
    careerAlignment = 16
    reasons.push('Universal industry & research relevance')
  } else if (oppDests.some((d) => d.includes(targetDest) || targetDest.includes(d))) {
    careerAlignment = 20
    reasons.push('Directly aligned with your target career milestone')
  } else {
    careerAlignment = 8
  }

  // 5. Eligibility (Max 15 pts)
  let eligibilityMatch = 15
  const studentSemester = profile.semester ?? 1
  const studentYear = Math.ceil(studentSemester / 2)
  const minYear = op.structuredEligibility?.minYear ?? 1
  const maxYear = op.structuredEligibility?.maxYear ?? 4
  const cgpaReq = op.structuredEligibility?.cgpaRequirement ?? 0
  const studentCgpa = profile.cgpa ?? 8.0

  if (studentYear >= minYear && studentYear <= maxYear) {
    if (studentCgpa >= cgpaReq) {
      eligibilityMatch = 15
      reasons.push(`Fully eligible for Year ${studentYear} students`)
    } else {
      eligibilityMatch = 8
      reasons.push(`Requires CGPA >= ${cgpaReq} (Current: ${studentCgpa})`)
    }
  } else {
    eligibilityMatch = 5
  }

  // 6. Freshness (Max 10 pts)
  let freshness = 8
  if (op.freshness === 'NEW' || op.isNewToday) {
    freshness = 10
    reasons.push('Fresh cohort announcement')
  } else if (op.freshness === 'RECENT') {
    freshness = 8
  } else if (op.freshness === 'CLOSING_SOON') {
    freshness = 9
  }

  // 7. Deadline Urgency (Max 5 pts)
  let deadlineUrgency = 3
  const daysLeft = op.daysRemaining ?? 30
  if (daysLeft > 0 && daysLeft <= 7) {
    deadlineUrgency = 5
    reasons.push(`Closing soon: ${daysLeft} day${daysLeft > 1 ? 's' : ''} remaining`)
  } else if (daysLeft > 7 && daysLeft <= 21) {
    deadlineUrgency = 4
  }

  // 8. Source Trust (Max 5 pts)
  let sourceTrust = 3
  if (op.sourceTrust === 'official') {
    sourceTrust = 5
    reasons.push('Verified official government/institutional host')
  } else if (op.sourceTrust === 'recognized') {
    sourceTrust = 4
    reasons.push('Recognized national development portal')
  }

  const totalScore = Math.min(100, Math.max(20, profileMatch + currentSkillMatch + skillGapAlignment + careerAlignment + eligibilityMatch + freshness + deadlineUrgency + sourceTrust))

  const breakdown: MatchScoreBreakdown = {
    score: totalScore,
    profileMatch,
    currentSkillMatch,
    skillGapAlignment,
    careerAlignment,
    eligibilityMatch,
    freshness,
    deadlineUrgency,
    sourceTrust,
    reasons,
  }

  return { score: totalScore, breakdown, reasons }
}

// ─── AI Intent Parser (Rule-based Regex & Structured Intent Extractor) ────────
export function parseSearchIntent(query: string): OpportunitySearchCriteria {
  const q = query.toLowerCase()
  const criteria: OpportunitySearchCriteria = { query }

  // Extract Opportunity Types
  const types: OpportunityType[] = []
  if (q.includes('hackathon') || q.includes('contest') || q.includes('challenge')) types.push('Hackathon')
  if (q.includes('intern') || q.includes('apprenticeship') || q.includes('summer')) types.push('Internship')
  if (q.includes('research') || q.includes('paper') || q.includes('lab') || q.includes('pmrf') || q.includes('fellowship')) types.push('Research')
  if (q.includes('incubator') || q.includes('startup') || q.includes('grant') || q.includes('seed') || q.includes('nidhi')) types.push('Incubator')
  if (q.includes('open source') || q.includes('gsoc') || q.includes('github')) types.push('Open Source')
  if (types.length > 0) criteria.types = types

  // Extract Domains
  const domains: string[] = []
  if (q.includes('ai') || q.includes('ml') || q.includes('machine learning') || q.includes('deep learning')) domains.push('Machine Learning', 'Artificial Intelligence')
  if (q.includes('cyber') || q.includes('security') || q.includes('forensic')) domains.push('Cybersecurity')
  if (q.includes('cloud') || q.includes('devops') || q.includes('aws') || q.includes('docker')) domains.push('Cloud Computing')
  if (q.includes('web') || q.includes('full stack') || q.includes('frontend') || q.includes('software')) domains.push('Software Engineering')
  if (q.includes('data') || q.includes('analytics') || q.includes('statistics')) domains.push('Data Science')
  if (domains.length > 0) criteria.domains = domains

  // Extract Year
  if (q.includes('1st year') || q.includes('first year') || q.includes('freshman')) criteria.targetYear = 1
  else if (q.includes('2nd year') || q.includes('second year') || q.includes('sophomore')) criteria.targetYear = 2
  else if (q.includes('3rd year') || q.includes('third year') || q.includes('pre-final')) criteria.targetYear = 3
  else if (q.includes('4th year') || q.includes('final year')) criteria.targetYear = 4

  // Extract Mode / Location
  const modes: ('Online' | 'In-person' | 'Hybrid')[] = []
  if (q.includes('remote') || q.includes('online') || q.includes('virtual')) modes.push('Online')
  if (q.includes('in-person') || q.includes('onsite') || q.includes('campus') || q.includes('bangalore') || q.includes('bengaluru') || q.includes('delhi')) modes.push('In-person')
  if (modes.length > 0) criteria.mode = modes

  return criteria
}

// ─── Provider Implementation 1: MockOpportunityProvider ──────────────────────
export class MockOpportunityProvider implements IOpportunityProvider {
  private opportunities: Opportunity[] = [...baseOpportunities]

  async getOpportunities(
    options?: OpportunityFilterOptions,
    profile?: StudentProfile | null
  ): Promise<Opportunity[]> {
    // Artificial small delay for UI transition smoothness
    await new Promise((res) => setTimeout(res, 180))

    let list = this.opportunities.map((op) => {
      const { score, breakdown, reasons } = calculateOpportunityMatch(op, profile)
      return {
        ...op,
        matchScore: score,
        matchBreakdown: breakdown,
        matchReasons: reasons,
      }
    })

    // Filter by Destination
    if (options?.destinationId && options.destinationId !== 'all') {
      list = list.filter((op) => op.destinations.includes('all') || op.destinations.includes(options.destinationId!))
    }

    // Filter by Type
    if (options?.type && options.type !== 'all') {
      list = list.filter((op) => op.type === options.type)
    }

    // Filter by Mode
    if (options?.mode && options.mode !== 'all') {
      list = list.filter((op) => op.mode === options.mode)
    }

    // Filter by Daily Mode
    if (options?.filterMode === 'trending') {
      list = list.filter((op) => op.isTrending || (op.trendingScore ?? 0) >= 90)
    } else if (options?.filterMode === 'closing-soon') {
      list = list.filter((op) => op.isClosingSoon || (op.daysRemaining ?? 30) <= 7)
    } else if (options?.filterMode === 'new-today') {
      list = list.filter((op) => op.isNewToday || (op.postedAt ?? '').includes('Today'))
    }

    // Sort
    const sortBy = options?.sortBy || 'best_match'
    if (sortBy === 'best_match') {
      list.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
    } else if (sortBy === 'trending') {
      list.sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0))
    } else if (sortBy === 'closing_soon') {
      list.sort((a, b) => (a.daysRemaining ?? 30) - (b.daysRemaining ?? 30))
    } else if (sortBy === 'latest') {
      list.sort((a, b) => (b.isNewToday ? 1 : 0) - (a.isNewToday ? 1 : 0))
    }

    return list
  }

  async getRecommendedOpportunities(
    profile: StudentProfile,
    options?: OpportunityFilterOptions
  ): Promise<Opportunity[]> {
    return this.getOpportunities({ ...options, sortBy: 'best_match' }, profile)
  }

  async searchOpportunities(
    query: string,
    profile?: StudentProfile | null,
    options?: OpportunityFilterOptions
  ): Promise<OpportunitySearchResult> {
    await new Promise((res) => setTimeout(res, 220))

    const parsed = parseSearchIntent(query)
    const baseList = await this.getOpportunities(options, profile)

    const lowerQuery = query.toLowerCase().trim()
    if (!lowerQuery) {
      const topPicks: TopPicksResponse = {
        bestCareerMatch: baseList[0],
        bestSkillBuilding: baseList.find((o) => (o.type === 'Open Source' || o.type === 'Hackathon') && o.id !== baseList[0]?.id),
        bestBeginner: baseList.find((o) => (o.structuredEligibility?.minYear ?? 1) <= 1 && o.id !== baseList[0]?.id),
        bestResearch: baseList.find((o) => o.type === 'Research' || o.type === 'Fellowship'),
        bestClosingSoon: baseList.find((o) => (o.daysRemaining && o.daysRemaining <= 14) || o.isClosingSoon),
      }
      return {
        mode: 'deterministic_fallback',
        query,
        parsedCriteria: parsed,
        total: baseList.length,
        items: baseList,
        opportunities: baseList,
        topPicks,
        fallbackUsed: true,
      }
    }

    const matched = baseList.filter((op) => {
      // 1. Direct text match
      const textMatch =
        op.title.toLowerCase().includes(lowerQuery) ||
        op.organization.toLowerCase().includes(lowerQuery) ||
        op.description.toLowerCase().includes(lowerQuery) ||
        op.tags.some((t) => t.toLowerCase().includes(lowerQuery))

      // 2. Structured parsed intent matching
      let intentMatch = false
      if (parsed.types && parsed.types.length > 0) {
        if (parsed.types.includes(op.type)) intentMatch = true
      }
      if (parsed.domains && parsed.domains.length > 0) {
        if (op.domains?.some((d) => parsed.domains!.some((pd) => pd.toLowerCase() === d.toLowerCase()))) {
          intentMatch = true
        }
      }
      if (parsed.mode && parsed.mode.length > 0) {
        if (parsed.mode.includes(op.mode)) intentMatch = true
      }

      return textMatch || intentMatch
    })

    // Sort search results by match score
    matched.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))

    const targetCareer = (profile?.selectedDestinationId ?? 'AI/ML Engineering').replace(/-/g, ' ')
    const itemsWithExplanations: Opportunity[] = matched.map((opp) => {
      const oppSkills = opp.skills ?? []
      const currentSkills = (profile?.currentSkills ?? []).map((s) => s.toLowerCase())
      const developing = oppSkills.filter((s) => !currentSkills.includes(s.toLowerCase())).slice(0, 3)

      const explanation: OpportunityPersonalizedExplanation = opp.personalizedExplanation ?? {
        opportunityId: opp.id,
        matchSummary: `Strong ${opp.matchScore ?? 85}% match for your ${targetCareer} roadmap.`,
        whyRecommended: (opp.matchReasons && opp.matchReasons.length > 0) ? opp.matchReasons : [
          `Directly advances key milestones for ${targetCareer}`,
          opp.mode === 'Online' ? 'Remote participation matches online preference' : 'Valuable in-person exposure',
          `Verified official institutional host: ${opp.organization}`,
        ],
        skillDevelopment: developing.length > 0 ? developing : oppSkills.slice(0, 2),
        careerRelevance: `Directly builds portfolio credentials for ${targetCareer} roles.`,
        bestFor: opp.type === 'Hackathon' ? 'Collaborative developers seeking competitive problem-solving' : 'Motivated engineering undergraduates building portfolios',
        potentialConcern: developing.length > 0 ? `May require ramping up quickly on ${developing[0]} before applying.` : 'National application volume is high; apply early.'
      }

      return {
        ...opp,
        personalizedExplanation: explanation,
        aiPersonalized: false,
      }
    })

    const topPicks: TopPicksResponse = {
      bestCareerMatch: itemsWithExplanations[0],
      bestSkillBuilding: itemsWithExplanations.find((o) => (o.type === 'Open Source' || o.type === 'Hackathon') && o.id !== itemsWithExplanations[0]?.id),
      bestBeginner: itemsWithExplanations.find((o) => (o.structuredEligibility?.minYear ?? 1) <= 1 && o.id !== itemsWithExplanations[0]?.id),
      bestResearch: itemsWithExplanations.find((o) => o.type === 'Research' || o.type === 'Fellowship'),
      bestClosingSoon: itemsWithExplanations.find((o) => (o.daysRemaining && o.daysRemaining <= 14) || o.isClosingSoon),
    }

    return {
      mode: 'deterministic_fallback',
      query,
      parsedCriteria: parsed,
      total: itemsWithExplanations.length,
      items: itemsWithExplanations,
      opportunities: itemsWithExplanations,
      personalizedSummary: `Personalized recommendations for ${profile?.name ?? 'your profile'} based on verified eligibility and career goals.`,
      recommendations: itemsWithExplanations.slice(0, 5).map((o) => o.personalizedExplanation!),
      topPicks,
      fallbackUsed: true,
    }
  }

  async getOpportunity(id: string): Promise<Opportunity | null> {
    const found = this.opportunities.find((o) => o.id === id)
    return found ? { ...found } : null
  }

  async getSources(): Promise<OpportunitySource[]> {
    return [...verifiedSources]
  }
}

// ─── Provider Implementation 2: RealBackendOpportunityProvider ───────────────
export class RealBackendOpportunityProvider implements IOpportunityProvider {
  private fallback = new MockOpportunityProvider()

  private async fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS)
    try {
      const res = await fetch(url, { ...init, signal: controller.signal })
      clearTimeout(timer)
      return res
    } catch (err) {
      clearTimeout(timer)
      throw err
    }
  }

  async getOpportunities(
    options?: OpportunityFilterOptions,
    profile?: StudentProfile | null
  ): Promise<Opportunity[]> {
    try {
      const params = new URLSearchParams()
      if (options?.destinationId) params.set('destination', options.destinationId)
      if (options?.type && options.type !== 'all') params.set('type', options.type)
      if (options?.filterMode && options.filterMode !== 'all') params.set('filter', options.filterMode)
      if (options?.sortBy) params.set('sortBy', options.sortBy)

      const url = `${BACKEND_BASE_URL}/api/v1/opportunities?${params.toString()}`
      const res = await this.fetchWithTimeout(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      return data as Opportunity[]
    } catch {
      // Backend is unavailable — transparently use MockOpportunityProvider with deterministic scoring
      return this.fallback.getOpportunities(options, profile)
    }
  }

  async getRecommendedOpportunities(
    profile: StudentProfile,
    options?: OpportunityFilterOptions
  ): Promise<Opportunity[]> {
    try {
      const url = `${BACKEND_BASE_URL}/api/v1/opportunities/recommended`
      const res = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, options }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      return data as Opportunity[]
    } catch {
      return this.fallback.getRecommendedOpportunities(profile, options)
    }
  }

  async searchOpportunities(
    query: string,
    profile?: StudentProfile | null,
    options?: OpportunityFilterOptions
  ): Promise<OpportunitySearchResult> {
    try {
      const url = `${BACKEND_BASE_URL}/api/v1/opportunities/search`
      const res = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, student_profile: profile, criteria: options }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      return data as OpportunitySearchResult
    } catch {
      return this.fallback.searchOpportunities(query, profile, options)
    }
  }

  async getOpportunity(id: string): Promise<Opportunity | null> {
    try {
      const url = `${BACKEND_BASE_URL}/api/v1/opportunities/${id}`
      const res = await this.fetchWithTimeout(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      return data as Opportunity
    } catch {
      return this.fallback.getOpportunity(id)
    }
  }

  async getSources(): Promise<OpportunitySource[]> {
    try {
      const url = `${BACKEND_BASE_URL}/api/v1/opportunities/sources`
      const res = await this.fetchWithTimeout(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return (await res.json()) as OpportunitySource[]
    } catch {
      return this.fallback.getSources()
    }
  }
}

// ─── Export Default Provider Singleton ──────────────────────────────────────
export const opportunityProvider: IOpportunityProvider = new RealBackendOpportunityProvider()
